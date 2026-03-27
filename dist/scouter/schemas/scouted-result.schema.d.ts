import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
export type ScoutedResultDocument = HydratedDocument<ScoutedResult>;
export declare class ScoutedResult {
    title: string;
    description: string;
    url: string;
    rawData: any;
    isApproved: boolean;
    isRejected: boolean;
    sourceId: Types.ObjectId;
    listingId: Types.ObjectId;
    createdAt: Date;
}
export declare const ScoutedResultSchema: MongooseSchema<ScoutedResult, import("mongoose").Model<ScoutedResult, any, any, any, import("mongoose").Document<unknown, any, ScoutedResult, any, {}> & ScoutedResult & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ScoutedResult, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<ScoutedResult>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<ScoutedResult> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
