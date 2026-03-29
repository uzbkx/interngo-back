import { ListingsService } from './listings.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { QueryListingsDto } from './dto/query-listings.dto';
export declare class ListingsController {
    private listingsService;
    constructor(listingsService: ListingsService);
    findAll(query: QueryListingsDto): Promise<{
        listings: (import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/listing.schema").Listing, {}, {}> & import("./schemas/listing.schema").Listing & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }, {}, {}> & import("mongoose").Document<unknown, {}, import("./schemas/listing.schema").Listing, {}, {}> & import("./schemas/listing.schema").Listing & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>)[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findBySlug(slug: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/listing.schema").Listing, {}, {}> & import("./schemas/listing.schema").Listing & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("./schemas/listing.schema").Listing, {}, {}> & import("./schemas/listing.schema").Listing & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    create(dto: CreateListingDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/listing.schema").Listing, {}, {}> & import("./schemas/listing.schema").Listing & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("./schemas/listing.schema").Listing, {}, {}> & import("./schemas/listing.schema").Listing & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    update(id: string, dto: UpdateListingDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/listing.schema").Listing, {}, {}> & import("./schemas/listing.schema").Listing & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("./schemas/listing.schema").Listing, {}, {}> & import("./schemas/listing.schema").Listing & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    approve(id: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/listing.schema").Listing, {}, {}> & import("./schemas/listing.schema").Listing & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("./schemas/listing.schema").Listing, {}, {}> & import("./schemas/listing.schema").Listing & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    remove(id: string): Promise<{
        deleted: boolean;
    }>;
}
