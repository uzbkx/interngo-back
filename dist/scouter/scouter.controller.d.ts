import { Queue } from 'bullmq';
import { ScouterService } from './scouter.service';
import { CreateSourceDto } from './dto/create-source.dto';
import { RunScoutDto } from './dto/run-scout.dto';
import { DiscoverSourcesDto } from './dto/discover-sources.dto';
import { ApproveResultDto } from './dto/approve-result.dto';
export declare class ScouterController {
    private scouterService;
    private scouterQueue;
    constructor(scouterService: ScouterService, scouterQueue: Queue);
    triggerRun(dto: RunScoutDto): Promise<{
        jobId: string | undefined;
        message: string;
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
        jobId: string | undefined;
        message: string;
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
