import { HydratedDocument, Types } from 'mongoose';
export type ApplicationDocument = HydratedDocument<Application>;
export declare enum ApplicationStatus {
    INTERESTED = "INTERESTED",
    APPLIED = "APPLIED",
    INTERVIEW = "INTERVIEW",
    ACCEPTED = "ACCEPTED",
    REJECTED = "REJECTED",
    WITHDRAWN = "WITHDRAWN"
}
export declare class Application {
    userId: Types.ObjectId;
    listingId: Types.ObjectId;
    status: ApplicationStatus;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const ApplicationSchema: import("mongoose").Schema<Application, import("mongoose").Model<Application, any, any, any, import("mongoose").Document<unknown, any, Application, any, {}> & Application & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Application, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Application>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Application> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
