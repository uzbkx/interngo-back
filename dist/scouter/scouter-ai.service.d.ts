import { ConfigService } from '@nestjs/config';
export interface ExtractedOpportunity {
    title: string;
    type: 'INTERNSHIP' | 'SCHOLARSHIP' | 'PROGRAM' | 'VOLUNTEER' | 'JOB' | 'OTHER';
    description: string;
    country?: string;
    city?: string;
    isRemote?: boolean;
    isPaid?: boolean;
    salary?: string;
    currency?: string;
    deadline?: string;
    startDate?: string;
    endDate?: string;
    applyUrl?: string;
    confidence?: number;
}
export declare class ScouterAiService {
    private configService;
    private groq;
    constructor(configService: ConfigService);
    private callWithRetry;
    extractOpportunities(pageContent: string, sourceUrl: string, sourceName: string): Promise<ExtractedOpportunity[]>;
    discoverSources(topic: string): Promise<{
        name: string;
        url: string;
        description: string;
    }[]>;
    checkDuplicate(newTitle: string, existingTitles: string[]): boolean;
}
