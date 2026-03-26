import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ListingDocument = HydratedDocument<Listing>;

export enum ListingType {
  INTERNSHIP = 'INTERNSHIP',
  SCHOLARSHIP = 'SCHOLARSHIP',
  PROGRAM = 'PROGRAM',
  VOLUNTEER = 'VOLUNTEER',
  JOB = 'JOB',
  OTHER = 'OTHER',
}

export enum ListingStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  CLOSED = 'CLOSED',
  ARCHIVED = 'ARCHIVED',
}

export enum ListingSource {
  USER_SUBMITTED = 'USER_SUBMITTED',
  AI_SCOUTED = 'AI_SCOUTED',
}

@Schema({ timestamps: true, collection: 'listings' })
export class Listing {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ required: true })
  description: string;

  @Prop({ enum: ListingType, required: true })
  type: ListingType;

  @Prop({ enum: ListingStatus, default: ListingStatus.DRAFT })
  status: ListingStatus;

  @Prop({ enum: ListingSource, default: ListingSource.USER_SUBMITTED })
  source: ListingSource;

  @Prop()
  location: string;

  @Prop({ default: false })
  isRemote: boolean;

  @Prop({ default: false })
  isPaid: boolean;

  @Prop()
  salary: string;

  @Prop()
  currency: string;

  @Prop()
  applyUrl: string;

  @Prop()
  applyEmail: string;

  @Prop()
  deadline: Date;

  @Prop()
  startDate: Date;

  @Prop()
  endDate: Date;

  @Prop()
  country: string;

  @Prop()
  city: string;

  @Prop()
  organizationName: string;

  @Prop({ type: Types.ObjectId, ref: 'Organization' })
  organizationId: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Category' }] })
  categories: Types.ObjectId[];

  createdAt: Date;
  updatedAt: Date;
}

export const ListingSchema = SchemaFactory.createForClass(Listing);

ListingSchema.index({ type: 1, status: 1 });
ListingSchema.index({ country: 1 });
ListingSchema.index({ deadline: 1 });
ListingSchema.index({ title: 'text', description: 'text' });
