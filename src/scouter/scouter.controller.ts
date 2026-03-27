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
  constructor(private scouterService: ScouterService) {}

  @Post('run')
  async triggerRun(@Body() dto: RunScoutDto) {
    if (dto.action === 'discover') {
      const result = await this.scouterService.runAutoDiscovery();
      return result;
    }
    if (dto.action === 'cleanup') {
      const closed = await this.scouterService.cleanupExpiredListings();
      return { closedListings: closed };
    }
    if (dto.sourceId) {
      const result = await this.scouterService.scoutSource(dto.sourceId);
      return { results: [result] };
    }
    const result = await this.scouterService.scoutAllSources();
    return result;
  }

  @Get('runs')
  getRuns() {
    return this.scouterService.getRuns();
  }

  @Post('discover')
  async discover(@Body() dto: DiscoverSourcesDto) {
    return this.scouterService.runAutoDiscovery();
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
