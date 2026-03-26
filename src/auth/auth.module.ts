import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../users/users.module';

// Conditionally load Google strategy only if credentials exist
const optionalProviders: any[] = [];
try {
  if (process.env.GOOGLE_CLIENT_ID) {
    const { GoogleStrategy } = require('./strategies/google.strategy');
    optionalProviders.push(GoogleStrategy);
  }
} catch {}

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET')!,
        signOptions: { expiresIn: config.get<string>('JWT_EXPIRES_IN', '15m') as any },
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy, ...optionalProviders],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
