import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

export type ScoutedResultDocument = HydratedDocument<ScoutedResult>;

@Schema({ timestamps: { createdAt: true, updatedAt: false }, collection: 'scouted_results' })
export class ScoutedResult {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop()
  url: string;

  @Prop({ type: MongooseSchema.Types.Mixed })
  rawData: any;

  @Prop({ default: false })
  isApproved: boolean;

  @Prop({ default: false })
  isRejected: boolean;

  @Prop({ type: Types.ObjectId, ref: 'ScoutedSource', required: true })
  sourceId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Listing' })
  listingId: Types.ObjectId;

  createdAt: Date;
}

export const ScoutedResultSchema = SchemaFactory.createForClass(ScoutedResult);
