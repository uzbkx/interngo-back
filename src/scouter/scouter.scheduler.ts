import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class ScouterScheduler {
  constructor(@InjectQueue('scouter') private scouterQueue: Queue) {}

  @Cron('0 */6 * * *') // Every 6 hours
  async scheduleScoutAll() {
    console.log('[Scheduler] Enqueuing scout-all job');
    await this.scouterQueue.add('scout-all', {});
  }

  @Cron('0 3 * * *') // Daily at 3 AM
  async scheduleDiscovery() {
    console.log('[Scheduler] Enqueuing discover job');
    await this.scouterQueue.add('discover', {});
  }

  @Cron('0 * * * *') // Every hour
  async scheduleCleanup() {
    console.log('[Scheduler] Enqueuing cleanup job');
    await this.scouterQueue.add('cleanup', {});
  }
}
