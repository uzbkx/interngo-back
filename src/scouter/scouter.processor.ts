import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { ScouterService } from './scouter.service';

@Processor('scouter')
export class ScouterProcessor extends WorkerHost {
  constructor(private scouterService: ScouterService) {
    super();
  }

  async process(job: Job): Promise<any> {
    console.log(`[BullMQ] Processing job: ${job.name} (${job.id})`);

    switch (job.name) {
      case 'scout-source':
        return this.scouterService.scoutSource(job.data.sourceId);

      case 'scout-all':
        return this.scouterService.scoutAllSources();

      case 'discover':
        return this.scouterService.runAutoDiscovery();

      case 'cleanup':
        return this.scouterService.cleanupExpiredListings();

      default:
        console.warn(`[BullMQ] Unknown job type: ${job.name}`);
    }
  }
}
