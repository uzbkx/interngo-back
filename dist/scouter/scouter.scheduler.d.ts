import { Queue } from 'bullmq';
export declare class ScouterScheduler {
    private scouterQueue;
    constructor(scouterQueue: Queue);
    scheduleScoutAll(): Promise<void>;
    scheduleDiscovery(): Promise<void>;
    scheduleCleanup(): Promise<void>;
}
