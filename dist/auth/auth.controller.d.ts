import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private authService;
    private configService;
    constructor(authService: AuthService, configService: ConfigService);
    signup(dto: SignupDto, res: Response): Promise<{
        user: {
            _id: import("mongoose").Types.ObjectId;
            email: string;
            name: string;
            role: import("../users/schemas/user.schema").Role;
        };
        accessToken: string;
    }>;
    login(dto: LoginDto, res: Response): Promise<{
        user: {
            _id: import("mongoose").Types.ObjectId;
            email: string;
            name: string;
            role: import("../users/schemas/user.schema").Role;
            avatarUrl: string;
        };
        accessToken: string;
    }>;
    logout(userId: string, res: Response): Promise<{
        message: string;
    }>;
    me(user: any): Promise<{
        user: any;
    }>;
    refresh(req: Request, res: Response): Promise<{
        error: string;
        accessToken?: undefined;
    } | {
        accessToken: string;
        error?: undefined;
    }>;
    googleAuth(): void;
    googleCallback(req: any, res: Response): Promise<void>;
    private setRefreshCookie;
}
