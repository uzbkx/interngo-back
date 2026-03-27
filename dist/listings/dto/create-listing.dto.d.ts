import { ListingType } from '../schemas/listing.schema';
export declare class CreateListingDto {
    title: string;
    description: string;
    type: ListingType;
    location?: string;
    isRemote?: boolean;
    isPaid?: boolean;
    salary?: string;
    currency?: string;
    applyUrl?: string;
    applyEmail?: string;
    deadline?: string;
    startDate?: string;
    endDate?: string;
    country?: string;
    city?: string;
    organizationName?: string;
    categories?: string[];
}
