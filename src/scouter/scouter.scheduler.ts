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

  @Cron('0 * * * *') // Every hour — scout all sources
  async scheduleScoutAll() {
    console.log('[Scheduler] Starting scout-all');
    await this.scouterService.scoutAllSources();
  }

  @Cron('0 */12 * * *') // Every 12 hours — discover new sources
  async scheduleDiscovery() {
    console.log('[Scheduler] Starting discovery');
    await this.scouterService.runAutoDiscovery();
  }

  @Cron('30 * * * *') // Every hour at :30 — cleanup
  async scheduleCleanup() {
    console.log('[Scheduler] Starting cleanup');
    const closed = await this.listingsService.closeExpired();
    const archived = await this.listingsService.archiveOld();
    if (closed > 0 || archived > 0) {
      console.log(`[Scheduler] Closed: ${closed}, Archived: ${archived}`);
    }
  }
}
