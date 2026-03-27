import { HydratedDocument } from 'mongoose';
export type ScouterRunDocument = HydratedDocument<ScouterRun>;
export declare class ScouterRun {
    type: string;
    status: string;
    sourcesCount: number;
    foundCount: number;
    addedCount: number;
    autoApproved: number;
    errors: string[];
    startedAt: Date;
    completedAt: Date;
}
export declare const ScouterRunSchema: import("mongoose").Schema<ScouterRun, import("mongoose").Model<ScouterRun, any, any, any, import("mongoose").Document<unknown, any, ScouterRun, any, {}> & ScouterRun & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ScouterRun, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<ScouterRun>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<ScouterRun> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
