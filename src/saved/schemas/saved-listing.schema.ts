import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type SavedListingDocument = HydratedDocument<SavedListing>;

@Schema({ timestamps: { createdAt: true, updatedAt: false }, collection: 'saved_listings' })
export class SavedListing {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Listing', required: true })
  listingId: Types.ObjectId;
}

export const SavedListingSchema = SchemaFactory.createForClass(SavedListing);

SavedListingSchema.index({ userId: 1, listingId: 1 }, { unique: true });
