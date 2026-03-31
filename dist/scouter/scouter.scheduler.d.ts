import { ScouterService } from './scouter.service';
import { ListingsService } from '../listings/listings.service';
export declare class ScouterScheduler {
    private scouterService;
    private listingsService;
    constructor(scouterService: ScouterService, listingsService: ListingsService);
    scheduleScoutAll(): Promise<void>;
    scheduleDiscovery(): Promise<void>;
    scheduleCleanup(): Promise<void>;
}
