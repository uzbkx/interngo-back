import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class UsersService {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    findById(id: string): Promise<UserDocument | null>;
    findByEmail(email: string): Promise<UserDocument | null>;
    create(data: Partial<User>): Promise<UserDocument>;
    updateRefreshToken(id: string, refreshToken: string | null): Promise<void>;
    findByIdPublic(id: string): Promise<UserDocument | null>;
    updateProfile(id: string, dto: UpdateProfileDto): Promise<UserDocument>;
}
