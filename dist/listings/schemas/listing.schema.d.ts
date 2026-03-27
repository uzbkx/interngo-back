import { HydratedDocument, Types } from 'mongoose';
export type ListingDocument = HydratedDocument<Listing>;
export declare enum ListingType {
    INTERNSHIP = "INTERNSHIP",
    SCHOLARSHIP = "SCHOLARSHIP",
    PROGRAM = "PROGRAM",
    VOLUNTEER = "VOLUNTEER",
    JOB = "JOB",
    OTHER = "OTHER"
}
export declare enum ListingStatus {
    DRAFT = "DRAFT",
    PUBLISHED = "PUBLISHED",
    CLOSED = "CLOSED",
    ARCHIVED = "ARCHIVED"
}
export declare enum ListingSource {
    USER_SUBMITTED = "USER_SUBMITTED",
    AI_SCOUTED = "AI_SCOUTED"
}
export declare class Listing {
    title: string;
    slug: string;
    description: string;
    type: ListingType;
    status: ListingStatus;
    source: ListingSource;
    location: string;
    isRemote: boolean;
    isPaid: boolean;
    salary: string;
    currency: string;
    applyUrl: string;
    applyEmail: string;
    deadline: Date;
    startDate: Date;
    endDate: Date;
    country: string;
    city: string;
    organizationName: string;
    organizationId: Types.ObjectId;
    categories: Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}
export declare const ListingSchema: import("mongoose").Schema<Listing, import("mongoose").Model<Listing, any, any, any, import("mongoose").Document<unknown, any, Listing, any, {}> & Listing & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Listing, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Listing>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Listing> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
