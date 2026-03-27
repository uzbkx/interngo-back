import { ListingType } from '../schemas/listing.schema';
export declare class QueryListingsDto {
    type?: ListingType;
    q?: string;
    page?: string;
    limit?: string;
}
