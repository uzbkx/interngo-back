import { ListingsService } from '../listings/listings.service';
export declare class AdminController {
    private listingsService;
    constructor(listingsService: ListingsService);
    findByStatus(status: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../listings/schemas/listing.schema").Listing, {}, {}> & import("../listings/schemas/listing.schema").Listing & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("../listings/schemas/listing.schema").Listing, {}, {}> & import("../listings/schemas/listing.schema").Listing & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
}
