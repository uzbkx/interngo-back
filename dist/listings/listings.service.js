"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListingsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const listing_schema_1 = require("./schemas/listing.schema");
let ListingsService = class ListingsService {
    constructor(listingModel) {
        this.listingModel = listingModel;
    }
    async findPublished(query) {
        const page = parseInt(query.page || '1', 10);
        const limit = parseInt(query.limit || '20', 10);
        const skip = (page - 1) * limit;
        const filter = { status: listing_schema_1.ListingStatus.PUBLISHED };
        if (query.type)
            filter.type = query.type;
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
    async findBySlug(slug) {
        const listing = await this.listingModel
            .findOne({ slug })
            .populate('organizationId');
        if (!listing)
            throw new common_1.NotFoundException('Listing not found');
        return listing;
    }
    async findById(id) {
        const listing = await this.listingModel.findById(id);
        if (!listing)
            throw new common_1.NotFoundException('Listing not found');
        return listing;
    }
    async findByStatus(status) {
        return this.listingModel
            .find({ status })
            .sort({ createdAt: -1 })
            .populate('organizationId');
    }
    async create(dto) {
        const slug = this.slugify(dto.title);
        const existing = await this.listingModel.findOne({ slug });
        const finalSlug = existing ? `${slug}-${Date.now().toString(36)}` : slug;
        const listing = await this.listingModel.create({
            ...dto,
            slug: finalSlug,
            status: listing_schema_1.ListingStatus.PUBLISHED,
            source: 'USER_SUBMITTED',
            deadline: dto.deadline ? new Date(dto.deadline) : undefined,
            startDate: dto.startDate ? new Date(dto.startDate) : undefined,
            endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        });
        return listing;
    }
    async update(id, dto) {
        const listing = await this.listingModel.findByIdAndUpdate(id, dto, { new: true });
        if (!listing)
            throw new common_1.NotFoundException('Listing not found');
        return listing;
    }
    async approve(id) {
        const listing = await this.listingModel.findByIdAndUpdate(id, { status: listing_schema_1.ListingStatus.PUBLISHED }, { new: true });
        if (!listing)
            throw new common_1.NotFoundException('Listing not found');
        return listing;
    }
    async remove(id) {
        const listing = await this.listingModel.findByIdAndDelete(id);
        if (!listing)
            throw new common_1.NotFoundException('Listing not found');
        return { deleted: true };
    }
    async closeExpired() {
        const result = await this.listingModel.updateMany({ deadline: { $lt: new Date() }, status: listing_schema_1.ListingStatus.PUBLISHED }, { status: listing_schema_1.ListingStatus.CLOSED });
        return result.modifiedCount;
    }
    async archiveOld() {
        const fifteenDaysAgo = new Date();
        fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);
        const result = await this.listingModel.updateMany({
            status: listing_schema_1.ListingStatus.CLOSED,
            deadline: { $lt: fifteenDaysAgo },
        }, { status: listing_schema_1.ListingStatus.ARCHIVED });
        if (result.modifiedCount > 0) {
            console.log(`[Listings] Archived ${result.modifiedCount} old listings`);
        }
        return result.modifiedCount;
    }
    async findArchived(query) {
        const page = parseInt(query.page || '1', 10);
        const limit = parseInt(query.limit || '20', 10);
        const skip = (page - 1) * limit;
        const filter = { status: { $in: [listing_schema_1.ListingStatus.CLOSED, listing_schema_1.ListingStatus.ARCHIVED] } };
        if (query.type)
            filter.type = query.type;
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
    slugify(text) {
        return text
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    }
};
exports.ListingsService = ListingsService;
exports.ListingsService = ListingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(listing_schema_1.Listing.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ListingsService);
//# sourceMappingURL=listings.service.js.map