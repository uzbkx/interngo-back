import { Model } from 'mongoose';
import { Listing, ListingDocument } from './schemas/listing.schema';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { QueryListingsDto } from './dto/query-listings.dto';
export declare class ListingsService {
    private listingModel;
    constructor(listingModel: Model<ListingDocument>);
    findPublished(query: QueryListingsDto): Promise<{
        listings: (import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Listing, {}, {}> & Listing & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }, {}, {}> & import("mongoose").Document<unknown, {}, Listing, {}, {}> & Listing & {
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
    findBySlug(slug: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Listing, {}, {}> & Listing & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, Listing, {}, {}> & Listing & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    findById(id: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Listing, {}, {}> & Listing & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, Listing, {}, {}> & Listing & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    findByStatus(status: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Listing, {}, {}> & Listing & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, Listing, {}, {}> & Listing & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    create(dto: CreateListingDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Listing, {}, {}> & Listing & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, Listing, {}, {}> & Listing & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    update(id: string, dto: UpdateListingDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Listing, {}, {}> & Listing & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, Listing, {}, {}> & Listing & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    approve(id: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Listing, {}, {}> & Listing & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, Listing, {}, {}> & Listing & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    remove(id: string): Promise<{
        deleted: boolean;
    }>;
    closeExpired(): Promise<number>;
    private slugify;
}
