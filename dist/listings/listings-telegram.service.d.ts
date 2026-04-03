import { ConfigService } from '@nestjs/config';
export declare class ListingsTelegramService {
    private configService;
    private botToken;
    private channelId;
    private frontendUrl;
    constructor(configService: ConfigService);
    postListing(listing: {
        title: string;
        slug: string;
        type: string;
        description: string;
        country?: string;
        deadline?: Date;
        isPaid?: boolean;
        isRemote?: boolean;
    }): Promise<void>;
}
