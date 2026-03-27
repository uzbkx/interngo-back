import { SavedService } from './saved.service';
import { ToggleSaveDto } from './dto/toggle-save.dto';
export declare class SavedController {
    private savedService;
    constructor(savedService: SavedService);
    findAll(userId: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/saved-listing.schema").SavedListing, {}, {}> & import("./schemas/saved-listing.schema").SavedListing & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("./schemas/saved-listing.schema").SavedListing, {}, {}> & import("./schemas/saved-listing.schema").SavedListing & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    toggle(userId: string, dto: ToggleSaveDto): Promise<{
        saved: boolean;
    }>;
    checkSaved(userId: string, listingId: string): Promise<{
        saved: boolean;
    }>;
}
