import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Listing, ListingDocument, ListingStatus } from './schemas/listing.schema';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { QueryListingsDto } from './dto/query-listings.dto';

@Injectable()
export class ListingsService {
  constructor(
    @InjectModel(Listing.name) private listingModel: Model<ListingDocument>,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {}

  async findPublished(query: QueryListingsDto) {
    const page = parseInt(query.page || '1', 10);
    const limit = parseInt(query.limit || '20', 10);
    const skip = (page - 1) * limit;

    const cacheKey = `listings:${query.type || 'all'}:${query.q || ''}:${page}:${limit}`;
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

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

    const result = { listings, total, page, limit, totalPages: Math.ceil(total / limit) };
    await this.cache.set(cacheKey, result, 60000); // 60s TTL
    return result;
  }

  async findBySlug(slug: string) {
    const cacheKey = `listing:slug:${slug}`;
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    const listing = await this.listingModel
      .findOne({ slug })
      .populate('organizationId');
    if (!listing) throw new NotFoundException('Listing not found');

    await this.cache.set(cacheKey, listing, 300000); // 5min TTL
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

    const listing = await this.listingModel.create({
      ...dto,
      slug: finalSlug,
      deadline: dto.deadline ? new Date(dto.deadline) : undefined,
      startDate: dto.startDate ? new Date(dto.startDate) : undefined,
      endDate: dto.endDate ? new Date(dto.endDate) : undefined,
    });

    await this.invalidateCache();
    return listing;
  }

  async update(id: string, dto: UpdateListingDto) {
    const listing = await this.listingModel.findByIdAndUpdate(id, dto, { new: true });
    if (!listing) throw new NotFoundException('Listing not found');
    await this.invalidateCache();
    return listing;
  }

  async approve(id: string) {
    const listing = await this.listingModel.findByIdAndUpdate(
      id,
      { status: ListingStatus.PUBLISHED },
      { new: true },
    );
    if (!listing) throw new NotFoundException('Listing not found');
    await this.invalidateCache();
    return listing;
  }

  async remove(id: string) {
    const listing = await this.listingModel.findByIdAndDelete(id);
    if (!listing) throw new NotFoundException('Listing not found');
    await this.invalidateCache();
    return { deleted: true };
  }

  async closeExpired(): Promise<number> {
    const result = await this.listingModel.updateMany(
      { deadline: { $lt: new Date() }, status: ListingStatus.PUBLISHED },
      { status: ListingStatus.CLOSED },
    );
    if (result.modifiedCount > 0) await this.invalidateCache();
    return result.modifiedCount;
  }

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  private async invalidateCache() {
    // Reset cache by deleting known patterns
    // cache-manager v6 doesn't have a native pattern delete,
    // so we reset the store for listing-related keys
    await (this.cache as any).reset?.() || this.cache.del('listings:*');
  }
}
