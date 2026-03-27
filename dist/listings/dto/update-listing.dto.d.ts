import { CreateListingDto } from './create-listing.dto';
import { ListingStatus } from '../schemas/listing.schema';
declare const UpdateListingDto_base: import("@nestjs/common").Type<Partial<CreateListingDto>>;
export declare class UpdateListingDto extends UpdateListingDto_base {
    status?: ListingStatus;
}
export {};
