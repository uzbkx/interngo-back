import { Model, Types } from 'mongoose';
import { SavedListing, SavedListingDocument } from './schemas/saved-listing.schema';
export declare class SavedService {
    private savedModel;
    constructor(savedModel: Model<SavedListingDocument>);
    findByUser(userId: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, SavedListing, {}, {}> & SavedListing & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, SavedListing, {}, {}> & SavedListing & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: Types.ObjectId;
    }>)[]>;
    toggle(userId: string, listingId: string): Promise<{
        saved: boolean;
    }>;
    checkSaved(userId: string, listingId: string): Promise<{
        saved: boolean;
    }>;
}
