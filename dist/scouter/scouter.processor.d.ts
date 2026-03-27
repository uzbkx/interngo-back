import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { ScouterService } from './scouter.service';
export declare class ScouterProcessor extends WorkerHost {
    private scouterService;
    constructor(scouterService: ScouterService);
    process(job: Job): Promise<any>;
}
