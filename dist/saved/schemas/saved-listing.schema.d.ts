import { HydratedDocument, Types } from 'mongoose';
export type SavedListingDocument = HydratedDocument<SavedListing>;
export declare class SavedListing {
    userId: Types.ObjectId;
    listingId: Types.ObjectId;
}
export declare const SavedListingSchema: import("mongoose").Schema<SavedListing, import("mongoose").Model<SavedListing, any, any, any, import("mongoose").Document<unknown, any, SavedListing, any, {}> & SavedListing & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, SavedListing, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<SavedListing>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<SavedListing> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
