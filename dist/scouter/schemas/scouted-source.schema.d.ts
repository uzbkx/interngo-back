import { HydratedDocument } from 'mongoose';
export type ScoutedSourceDocument = HydratedDocument<ScoutedSource>;
export declare class ScoutedSource {
    name: string;
    url: string;
    description: string;
    isActive: boolean;
    lastScraped: Date;
    createdAt: Date;
    updatedAt: Date;
}
export declare const ScoutedSourceSchema: import("mongoose").Schema<ScoutedSource, import("mongoose").Model<ScoutedSource, any, any, any, import("mongoose").Document<unknown, any, ScoutedSource, any, {}> & ScoutedSource & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ScoutedSource, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<ScoutedSource>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<ScoutedSource> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
