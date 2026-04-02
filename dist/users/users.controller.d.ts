import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    getMyProfile(user: any): Promise<{
        _id: any;
        email: any;
        name: any;
        bio: any;
        avatarUrl: any;
        role: any;
        createdAt: any;
    }>;
    updateProfile(userId: string, dto: UpdateProfileDto): Promise<{
        _id: import("mongoose").Types.ObjectId;
        email: string;
        name: string;
        bio: string;
        avatarUrl: string;
        role: import("./schemas/user.schema").Role;
    }>;
    getMyListings(userId: string): Promise<any>;
    getPublicProfile(id: string): Promise<{
        error: string;
        _id?: undefined;
        name?: undefined;
        bio?: undefined;
        avatarUrl?: undefined;
        role?: undefined;
        createdAt?: undefined;
    } | {
        _id: import("mongoose").Types.ObjectId;
        name: string;
        bio: string;
        avatarUrl: string;
        role: import("./schemas/user.schema").Role;
        createdAt: Date;
        error?: undefined;
    }>;
}
