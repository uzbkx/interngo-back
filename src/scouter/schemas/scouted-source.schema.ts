import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ScoutedSourceDocument = HydratedDocument<ScoutedSource>;

@Schema({ timestamps: true, collection: 'scouted_sources' })
export class ScoutedSource {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  url: string;

  @Prop()
  description: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  lastScraped: Date;

  createdAt: Date;
  updatedAt: Date;
}

export const ScoutedSourceSchema = SchemaFactory.createForClass(ScoutedSource);
