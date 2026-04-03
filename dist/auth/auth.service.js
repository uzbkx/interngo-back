"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const bcrypt = require("bcrypt");
const users_service_1 = require("../users/users.service");
let AuthService = class AuthService {
    constructor(usersService, jwtService, configService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async signup(dto) {
        const existing = await this.usersService.findByEmail(dto.email);
        if (existing)
            throw new common_1.ConflictException('Email already registered');
        const hashedPassword = await bcrypt.hash(dto.password, 12);
        const user = await this.usersService.create({
            email: dto.email,
            password: hashedPassword,
            name: dto.name || '',
        });
        const tokens = await this.generateTokens(user._id.toString(), user.email, user.role);
        await this.usersService.updateRefreshToken(user._id.toString(), await bcrypt.hash(tokens.refreshToken, 12));
        return {
            user: { _id: user._id, email: user.email, name: user.name, role: user.role },
            ...tokens,
        };
    }
    async login(dto) {
        const user = await this.usersService.findByEmail(dto.email);
        if (!user || !user.password)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const valid = await bcrypt.compare(dto.password, user.password);
        if (!valid)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const tokens = await this.generateTokens(user._id.toString(), user.email, user.role);
        await this.usersService.updateRefreshToken(user._id.toString(), await bcrypt.hash(tokens.refreshToken, 12));
        return {
            user: { _id: user._id, email: user.email, name: user.name, role: user.role, avatarUrl: user.avatarUrl },
            ...tokens,
        };
    }
    async refresh(userId, rt) {
        const user = await this.usersService.findByEmail(userId);
        const userWithRt = await this.usersService.findByEmail(userId);
        if (!userWithRt?.refreshToken)
            throw new common_1.UnauthorizedException();
        const rtValid = await bcrypt.compare(rt, userWithRt.refreshToken);
        if (!rtValid)
            throw new common_1.UnauthorizedException();
        const tokens = await this.generateTokens(userWithRt._id.toString(), userWithRt.email, userWithRt.role);
        await this.usersService.updateRefreshToken(userWithRt._id.toString(), await bcrypt.hash(tokens.refreshToken, 12));
        return tokens;
    }
    async logout(userId) {
        await this.usersService.updateRefreshToken(userId, null);
    }
    async validateGoogleUser(data) {
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
    async requestPasswordReset(email) {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            return { message: 'If an account exists with this email, a reset link has been sent.' };
        }
        const resetToken = await this.jwtService.signAsync({ sub: user._id.toString(), email: user.email, type: 'reset' }, {
            secret: this.configService.get('JWT_SECRET'),
            expiresIn: '1h',
        });
        const frontendUrl = this.configService.get('FRONTEND_URL', 'http://localhost:3000');
        const resetLink = `${frontendUrl}/auth/reset-password?token=${resetToken}`;
        console.log(`[Auth] Password reset link for ${email}: ${resetLink}`);
        return { message: 'If an account exists with this email, a reset link has been sent.' };
    }
    async resetPassword(token, newPassword) {
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get('JWT_SECRET'),
            });
            if (payload.type !== 'reset') {
                throw new common_1.UnauthorizedException('Invalid reset token');
            }
            const hashedPassword = await bcrypt.hash(newPassword, 12);
            await this.usersService.updatePassword(payload.sub, hashedPassword);
            return { message: 'Password updated successfully' };
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid or expired reset token');
        }
    }
    async generateTokens(userId, email, role) {
        const payload = { sub: userId, email, role };
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.configService.get('JWT_SECRET'),
                expiresIn: this.configService.get('JWT_EXPIRES_IN', '15m'),
            }),
            this.jwtService.signAsync(payload, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
                expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN', '7d'),
            }),
        ]);
        return { accessToken, refreshToken };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map