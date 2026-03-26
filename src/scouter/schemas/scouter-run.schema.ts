import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ScouterRunDocument = HydratedDocument<ScouterRun>;

@Schema({ collection: 'scouter_runs' })
export class ScouterRun {
  @Prop({ required: true })
  type: string; // 'scheduled' | 'manual' | 'discovery'

  @Prop({ required: true, default: 'running' })
  status: string; // 'running' | 'completed' | 'failed'

  @Prop({ default: 0 })
  sourcesCount: number;

  @Prop({ default: 0 })
  foundCount: number;

  @Prop({ default: 0 })
  addedCount: number;

  @Prop({ default: 0 })
  autoApproved: number;

  @Prop({ type: [String], default: [] })
  errors: string[];

  @Prop({ default: () => new Date() })
  startedAt: Date;

  @Prop()
  completedAt: Date;
}

export const ScouterRunSchema = SchemaFactory.createForClass(ScouterRun);
