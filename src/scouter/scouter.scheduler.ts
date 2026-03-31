import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ScouterService } from './scouter.service';
import { ListingsService } from '../listings/listings.service';

@Injectable()
export class ScouterScheduler {
  constructor(
    private scouterService: ScouterService,
    private listingsService: ListingsService,
  ) {}

  @Cron('0 */6 * * *') // Every 6 hours
  async scheduleScoutAll() {
    console.log('[Scheduler] Starting scout-all');
    await this.scouterService.scoutAllSources();
  }

  @Cron('0 3 * * *') // Daily at 3 AM
  async scheduleDiscovery() {
    console.log('[Scheduler] Starting discovery');
    await this.scouterService.runAutoDiscovery();
  }

  @Cron('0 * * * *') // Every hour
  async scheduleCleanup() {
    console.log('[Scheduler] Starting cleanup');
    const closed = await this.listingsService.closeExpired();
    const archived = await this.listingsService.archiveOld();
    if (closed > 0 || archived > 0) {
      console.log(`[Scheduler] Closed: ${closed}, Archived: ${archived}`);
    }
  }
}
