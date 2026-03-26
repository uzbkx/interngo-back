import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bullmq';
import { ScoutedSource, ScoutedSourceSchema } from './schemas/scouted-source.schema';
import { ScoutedResult, ScoutedResultSchema } from './schemas/scouted-result.schema';
import { ScouterRun, ScouterRunSchema } from './schemas/scouter-run.schema';
import { ScouterService } from './scouter.service';
import { ScouterAiService } from './scouter-ai.service';
import { ScouterScraperService } from './scouter-scraper.service';
import { ScouterProcessor } from './scouter.processor';
import { ScouterScheduler } from './scouter.scheduler';
import { ScouterController } from './scouter.controller';
import { ListingsModule } from '../listings/listings.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ScoutedSource.name, schema: ScoutedSourceSchema },
      { name: ScoutedResult.name, schema: ScoutedResultSchema },
      { name: ScouterRun.name, schema: ScouterRunSchema },
    ]),
    BullModule.registerQueue({ name: 'scouter' }),
    ListingsModule,
  ],
  providers: [
    ScouterService,
    ScouterAiService,
    ScouterScraperService,
    ScouterProcessor,
    ScouterScheduler,
  ],
  controllers: [ScouterController],
})
export class ScouterModule {}
