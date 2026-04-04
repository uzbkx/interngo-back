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

  @Cron('0 */4 * * *') // Every 4 hours — scout all sources
  async scheduleScoutAll() {
    console.log('[Scheduler] Starting scout-all');
    await this.scouterService.scoutAllSources();
  }

  @Cron('0 3 * * *') // Daily at 3 AM — discover new sources
  async scheduleDiscovery() {
    console.log('[Scheduler] Starting discovery');
    await this.scouterService.runAutoDiscovery();
  }

  @Cron('30 * * * *') // Every hour at :30 — cleanup only (no AI)
  async scheduleCleanup() {
    const closed = await this.listingsService.closeExpired();
    const archived = await this.listingsService.archiveOld();
    if (closed > 0 || archived > 0) {
      console.log(`[Scheduler] Closed: ${closed}, Archived: ${archived}`);
    }
  }
}
