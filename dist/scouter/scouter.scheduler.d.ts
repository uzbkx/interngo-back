import { ScouterService } from './scouter.service';
export declare class ScouterScheduler {
    private scouterService;
    constructor(scouterService: ScouterService);
    scheduleScoutAll(): Promise<void>;
    scheduleDiscovery(): Promise<void>;
    scheduleCleanup(): Promise<void>;
}
