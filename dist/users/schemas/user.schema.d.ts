import { HydratedDocument } from 'mongoose';
export type UserDocument = HydratedDocument<User>;
export declare enum Role {
    STUDENT = "STUDENT",
    ORGANIZATION = "ORGANIZATION",
    ADMIN = "ADMIN"
}
export declare class User {
    email: string;
    password: string;
    name: string;
    avatarUrl: string;
    bio: string;
    role: Role;
    refreshToken: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, import("mongoose").Document<unknown, any, User, any, {}> & User & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<User>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<User> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
