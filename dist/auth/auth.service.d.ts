import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private usersService;
    private jwtService;
    private configService;
    constructor(usersService: UsersService, jwtService: JwtService, configService: ConfigService);
    signup(dto: SignupDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            _id: import("mongoose").Types.ObjectId;
            email: string;
            name: string;
            role: import("../users/schemas/user.schema").Role;
        };
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            _id: import("mongoose").Types.ObjectId;
            email: string;
            name: string;
            role: import("../users/schemas/user.schema").Role;
            avatarUrl: string;
        };
    }>;
    refresh(userId: string, rt: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(userId: string): Promise<void>;
    validateGoogleUser(data: {
        email: string;
        name: string;
        avatarUrl?: string;
    }): Promise<import("mongoose").Document<unknown, {}, import("../users/schemas/user.schema").User, {}, {}> & import("../users/schemas/user.schema").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    requestPasswordReset(email: string): Promise<{
        message: string;
    }>;
    resetPassword(token: string, newPassword: string): Promise<{
        message: string;
    }>;
    generateTokens(userId: string, email: string, role: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
}
