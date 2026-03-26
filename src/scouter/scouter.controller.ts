import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { ScouterService } from './scouter.service';
import { AdminOrSecretGuard } from '../common/guards/admin-or-secret.guard';
import { CreateSourceDto } from './dto/create-source.dto';
import { RunScoutDto } from './dto/run-scout.dto';
import { DiscoverSourcesDto } from './dto/discover-sources.dto';
import { ApproveResultDto } from './dto/approve-result.dto';
import { ParseObjectIdPipe } from '../common/pipes/parse-object-id.pipe';

@Controller('scouter')
@UseGuards(AdminOrSecretGuard)
export class ScouterController {
  constructor(
    private scouterService: ScouterService,
    @InjectQueue('scouter') private scouterQueue: Queue,
  ) {}

  @Post('run')
  async triggerRun(@Body() dto: RunScoutDto) {
    if (dto.action === 'discover') {
      const job = await this.scouterQueue.add('discover', {});
      return { jobId: job.id, message: 'Discovery job enqueued' };
    }
    if (dto.action === 'cleanup') {
      const job = await this.scouterQueue.add('cleanup', {});
      return { jobId: job.id, message: 'Cleanup job enqueued' };
    }
    if (dto.sourceId) {
      const job = await this.scouterQueue.add('scout-source', { sourceId: dto.sourceId });
      return { jobId: job.id, message: 'Scout source job enqueued' };
    }
    // Default: scout all
    const job = await this.scouterQueue.add('scout-all', {});
    return { jobId: job.id, message: 'Scout all job enqueued' };
  }

  @Get('runs')
  getRuns() {
    return this.scouterService.getRuns();
  }

  @Post('discover')
  async discover(@Body() dto: DiscoverSourcesDto) {
    const job = await this.scouterQueue.add('discover', { topic: dto.topic });
    return { jobId: job.id, message: 'Discovery job enqueued' };
  }

  @Get('sources')
  getSources() {
    return this.scouterService.getSources();
  }

  @Post('sources')
  createSource(@Body() dto: CreateSourceDto) {
    return this.scouterService.createSource(dto);
  }

  @Get('results')
  getResults(@Query('pending') pending: string) {
    return this.scouterService.getResults(pending === 'true');
  }

  @Patch('results/:id/approve')
  approveResult(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dto: ApproveResultDto,
  ) {
    return this.scouterService.approveResult(id, dto.approve);
  }
}
