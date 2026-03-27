import { ScouterService } from './scouter.service';
import { CreateSourceDto } from './dto/create-source.dto';
import { RunScoutDto } from './dto/run-scout.dto';
import { DiscoverSourcesDto } from './dto/discover-sources.dto';
import { ApproveResultDto } from './dto/approve-result.dto';
export declare class ScouterController {
    private scouterService;
    constructor(scouterService: ScouterService);
    triggerRun(dto: RunScoutDto): Promise<{
        results: import("./scouter.service").ScoutResult[];
        runId: string;
    } | {
        newSourcesAdded: number;
        runId: string;
    } | {
        closedListings: number;
        results?: undefined;
    } | {
        results: import("./scouter.service").ScoutResult[];
        closedListings?: undefined;
    }>;
    getRuns(): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/scouter-run.schema").ScouterRun, {}, {}> & import("./schemas/scouter-run.schema").ScouterRun & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("./schemas/scouter-run.schema").ScouterRun, {}, {}> & import("./schemas/scouter-run.schema").ScouterRun & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    discover(dto: DiscoverSourcesDto): Promise<{
        newSourcesAdded: number;
        runId: string;
    }>;
    getSources(): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/scouted-source.schema").ScoutedSource, {}, {}> & import("./schemas/scouted-source.schema").ScoutedSource & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("./schemas/scouted-source.schema").ScoutedSource, {}, {}> & import("./schemas/scouted-source.schema").ScoutedSource & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    createSource(dto: CreateSourceDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/scouted-source.schema").ScoutedSource, {}, {}> & import("./schemas/scouted-source.schema").ScoutedSource & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("./schemas/scouted-source.schema").ScoutedSource, {}, {}> & import("./schemas/scouted-source.schema").ScoutedSource & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    getResults(pending: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/scouted-result.schema").ScoutedResult, {}, {}> & import("./schemas/scouted-result.schema").ScoutedResult & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("./schemas/scouted-result.schema").ScoutedResult, {}, {}> & import("./schemas/scouted-result.schema").ScoutedResult & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    approveResult(id: string, dto: ApproveResultDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/scouted-result.schema").ScoutedResult, {}, {}> & import("./schemas/scouted-result.schema").ScoutedResult & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("./schemas/scouted-result.schema").ScoutedResult, {}, {}> & import("./schemas/scouted-result.schema").ScoutedResult & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
}
