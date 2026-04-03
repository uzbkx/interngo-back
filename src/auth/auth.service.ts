import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signup(dto: SignupDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) throw new ConflictException('Email already registered');

    const hashedPassword = await bcrypt.hash(dto.password, 12);
    const user = await this.usersService.create({
      email: dto.email,
      password: hashedPassword,
      name: dto.name || '',
    });

    const tokens = await this.generateTokens(user._id.toString(), user.email, user.role);
    await this.usersService.updateRefreshToken(
      user._id.toString(),
      await bcrypt.hash(tokens.refreshToken, 12),
    );

    return {
      user: { _id: user._id, email: user.email, name: user.name, role: user.role },
      ...tokens,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user || !user.password) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const tokens = await this.generateTokens(user._id.toString(), user.email, user.role);
    await this.usersService.updateRefreshToken(
      user._id.toString(),
      await bcrypt.hash(tokens.refreshToken, 12),
    );

    return {
      user: { _id: user._id, email: user.email, name: user.name, role: user.role, avatarUrl: user.avatarUrl },
      ...tokens,
    };
  }

  async refresh(userId: string, rt: string) {
    const user = await this.usersService.findByEmail(userId);
    // Find by ID with refresh token
    const userWithRt = await this.usersService.findByEmail(userId);
    if (!userWithRt?.refreshToken) throw new UnauthorizedException();

    const rtValid = await bcrypt.compare(rt, userWithRt.refreshToken);
    if (!rtValid) throw new UnauthorizedException();

    const tokens = await this.generateTokens(
      userWithRt._id.toString(),
      userWithRt.email,
      userWithRt.role,
    );
    await this.usersService.updateRefreshToken(
      userWithRt._id.toString(),
      await bcrypt.hash(tokens.refreshToken, 12),
    );

    return tokens;
  }

  async logout(userId: string) {
    await this.usersService.updateRefreshToken(userId, null);
  }

  async validateGoogleUser(data: { email: string; name: string; avatarUrl?: string }) {
    let user = await this.usersService.findByEmail(data.email);
    if (!user) {
      user = await this.usersService.create({
        email: data.email,
        name: data.name,
        avatarUrl: data.avatarUrl,
      });
    }
    return user;
  }

  async requestPasswordReset(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      // Don't reveal if email exists
      return { message: 'If an account exists with this email, a reset link has been sent.' };
    }

    const resetToken = await this.jwtService.signAsync(
      { sub: user._id.toString(), email: user.email, type: 'reset' },
      {
        secret: this.configService.get<string>('JWT_SECRET')!,
        expiresIn: '1h',
      },
    );

    const frontendUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:3000');
    const resetLink = `${frontendUrl}/auth/reset-password?token=${resetToken}`;

    // TODO: Send email with resetLink
    console.log(`[Auth] Password reset link for ${email}: ${resetLink}`);

    return { message: 'If an account exists with this email, a reset link has been sent.' };
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET')!,
      });

      if (payload.type !== 'reset') {
        throw new UnauthorizedException('Invalid reset token');
      }

      const hashedPassword = await bcrypt.hash(newPassword, 12);
      await this.usersService.updatePassword(payload.sub, hashedPassword);

      return { message: 'Password updated successfully' };
    } catch {
      throw new UnauthorizedException('Invalid or expired reset token');
    }
  }

  async generateTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET')!,
        expiresIn: this.configService.get<string>('JWT_EXPIRES_IN', '15m') as any,
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET')!,
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d') as any,
      }),
    ]);

    return { accessToken, refreshToken };
  }
}
