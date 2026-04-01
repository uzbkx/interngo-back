import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { ListingDocument } from './schemas/listing.schema';
export interface ModerationResult {
    approved: boolean;
    reason: string;
    confidence: number;
    flags: string[];
}
export declare class ListingsModeratorService {
    private listingModel;
    private configService;
    private groq;
    constructor(listingModel: Model<ListingDocument>, configService: ConfigService);
    moderateListing(listingId: string): Promise<ModerationResult>;
}
