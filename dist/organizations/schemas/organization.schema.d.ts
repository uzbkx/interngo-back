import { HydratedDocument, Types } from 'mongoose';
export type OrganizationDocument = HydratedDocument<Organization>;
export declare class Organization {
    name: string;
    slug: string;
    description: string;
    website: string;
    logoUrl: string;
    verified: boolean;
    ownerId: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
export declare const OrganizationSchema: import("mongoose").Schema<Organization, import("mongoose").Model<Organization, any, any, any, import("mongoose").Document<unknown, any, Organization, any, {}> & Organization & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Organization, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Organization>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Organization> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
