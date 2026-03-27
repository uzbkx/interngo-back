import { Model, Types } from 'mongoose';
import { ScoutedSource, ScoutedSourceDocument } from './schemas/scouted-source.schema';
import { ScoutedResult, ScoutedResultDocument } from './schemas/scouted-result.schema';
import { ScouterRun, ScouterRunDocument } from './schemas/scouter-run.schema';
import { ListingDocument } from '../listings/schemas/listing.schema';
import { ScouterAiService } from './scouter-ai.service';
import { ScouterScraperService } from './scouter-scraper.service';
export interface ScoutResult {
    sourceId: string;
    sourceName: string;
    found: number;
    added: number;
    autoApproved: number;
    skippedDuplicates: number;
    errors: string[];
}
export declare class ScouterService {
    private sourceModel;
    private resultModel;
    private runModel;
    private listingModel;
    private aiService;
    private scraperService;
    constructor(sourceModel: Model<ScoutedSourceDocument>, resultModel: Model<ScoutedResultDocument>, runModel: Model<ScouterRunDocument>, listingModel: Model<ListingDocument>, aiService: ScouterAiService, scraperService: ScouterScraperService);
    getSources(): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, ScoutedSource, {}, {}> & ScoutedSource & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, ScoutedSource, {}, {}> & ScoutedSource & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: Types.ObjectId;
    }>)[]>;
    createSource(data: {
        name: string;
        url: string;
        description?: string;
    }): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, ScoutedSource, {}, {}> & ScoutedSource & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, ScoutedSource, {}, {}> & ScoutedSource & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: Types.ObjectId;
    }>>;
    getResults(pending?: boolean): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, ScoutedResult, {}, {}> & ScoutedResult & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, ScoutedResult, {}, {}> & ScoutedResult & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: Types.ObjectId;
    }>)[]>;
    approveResult(id: string, approve: boolean): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, ScoutedResult, {}, {}> & ScoutedResult & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, ScoutedResult, {}, {}> & ScoutedResult & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: Types.ObjectId;
    }>>;
    getRuns(): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, ScouterRun, {}, {}> & ScouterRun & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, ScouterRun, {}, {}> & ScouterRun & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: Types.ObjectId;
    }>)[]>;
    scoutSource(sourceId: string): Promise<ScoutResult>;
    scoutAllSources(): Promise<{
        results: ScoutResult[];
        runId: string;
    }>;
    runAutoDiscovery(): Promise<{
        newSourcesAdded: number;
        runId: string;
    }>;
    cleanupExpiredListings(): Promise<number>;
    private storeOpportunity;
    private slugify;
}
