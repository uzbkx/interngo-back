import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { SavedListing, SavedListingDocument } from './schemas/saved-listing.schema';

@Injectable()
export class SavedService {
  constructor(
    @InjectModel(SavedListing.name) private savedModel: Model<SavedListingDocument>,
  ) {}

  async findByUser(userId: string) {
    return this.savedModel
      .find({ userId: new Types.ObjectId(userId) })
      .populate('listingId')
      .sort({ createdAt: -1 });
  }

  async toggle(userId: string, listingId: string) {
    const existing = await this.savedModel.findOne({
      userId: new Types.ObjectId(userId),
      listingId: new Types.ObjectId(listingId),
    });

    if (existing) {
      await existing.deleteOne();
      return { saved: false };
    }

    await this.savedModel.create({
      userId: new Types.ObjectId(userId),
      listingId: new Types.ObjectId(listingId),
    });
    return { saved: true };
  }

  async checkSaved(userId: string, listingId: string) {
    const existing = await this.savedModel.findOne({
      userId: new Types.ObjectId(userId),
      listingId: new Types.ObjectId(listingId),
    });
    return { saved: !!existing };
  }
}
