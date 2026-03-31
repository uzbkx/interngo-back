import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Listing, ListingDocument, ListingStatus } from './schemas/listing.schema';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { QueryListingsDto } from './dto/query-listings.dto';

@Injectable()
export class ListingsService {
  constructor(
    @InjectModel(Listing.name) private listingModel: Model<ListingDocument>,
  ) {}

  async findPublished(query: QueryListingsDto) {
    const page = parseInt(query.page || '1', 10);
    const limit = parseInt(query.limit || '20', 10);
    const skip = (page - 1) * limit;

    const filter: any = { status: ListingStatus.PUBLISHED };
    if (query.type) filter.type = query.type;
    if (query.q) {
      filter.$or = [
        { title: { $regex: query.q, $options: 'i' } },
        { description: { $regex: query.q, $options: 'i' } },
      ];
    }

    const [listings, total] = await Promise.all([
      this.listingModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('organizationId'),
      this.listingModel.countDocuments(filter),
    ]);

    return { listings, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findBySlug(slug: string) {
    const listing = await this.listingModel
      .findOne({ slug })
      .populate('organizationId');
    if (!listing) throw new NotFoundException('Listing not found');
    return listing;
  }

  async findById(id: string) {
    const listing = await this.listingModel.findById(id);
    if (!listing) throw new NotFoundException('Listing not found');
    return listing;
  }

  async findByStatus(status: string) {
    return this.listingModel
      .find({ status })
      .sort({ createdAt: -1 })
      .populate('organizationId');
  }

  async create(dto: CreateListingDto) {
    const slug = this.slugify(dto.title);
    const existing = await this.listingModel.findOne({ slug });
    const finalSlug = existing ? `${slug}-${Date.now().toString(36)}` : slug;

    return this.listingModel.create({
      ...dto,
      slug: finalSlug,
      deadline: dto.deadline ? new Date(dto.deadline) : undefined,
      startDate: dto.startDate ? new Date(dto.startDate) : undefined,
      endDate: dto.endDate ? new Date(dto.endDate) : undefined,
    });
  }

  async update(id: string, dto: UpdateListingDto) {
    const listing = await this.listingModel.findByIdAndUpdate(id, dto, { new: true });
    if (!listing) throw new NotFoundException('Listing not found');
    return listing;
  }

  async approve(id: string) {
    const listing = await this.listingModel.findByIdAndUpdate(
      id,
      { status: ListingStatus.PUBLISHED },
      { new: true },
    );
    if (!listing) throw new NotFoundException('Listing not found');
    return listing;
  }

  async remove(id: string) {
    const listing = await this.listingModel.findByIdAndDelete(id);
    if (!listing) throw new NotFoundException('Listing not found');
    return { deleted: true };
  }

  async closeExpired(): Promise<number> {
    const result = await this.listingModel.updateMany(
      { deadline: { $lt: new Date() }, status: ListingStatus.PUBLISHED },
      { status: ListingStatus.CLOSED },
    );
    return result.modifiedCount;
  }

  async archiveOld(): Promise<number> {
    // Archive listings that have been CLOSED for more than 15 days
    const fifteenDaysAgo = new Date();
    fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);

    const result = await this.listingModel.updateMany(
      {
        status: ListingStatus.CLOSED,
        deadline: { $lt: fifteenDaysAgo },
      },
      { status: ListingStatus.ARCHIVED },
    );
    if (result.modifiedCount > 0) {
      console.log(`[Listings] Archived ${result.modifiedCount} old listings`);
    }
    return result.modifiedCount;
  }

  async findArchived(query: QueryListingsDto) {
    const page = parseInt(query.page || '1', 10);
    const limit = parseInt(query.limit || '20', 10);
    const skip = (page - 1) * limit;

    const filter: any = { status: { $in: [ListingStatus.CLOSED, ListingStatus.ARCHIVED] } };
    if (query.type) filter.type = query.type;
    if (query.q) {
      filter.$or = [
        { title: { $regex: query.q, $options: 'i' } },
        { description: { $regex: query.q, $options: 'i' } },
      ];
    }

    const [listings, total] = await Promise.all([
      this.listingModel
        .find(filter)
        .sort({ deadline: -1 })
        .skip(skip)
        .limit(limit)
        .populate('organizationId'),
      this.listingModel.countDocuments(filter),
    ]);

    return { listings, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
}
