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
exports.OrganizationsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const organization_schema_1 = require("./schemas/organization.schema");
let OrganizationsService = class OrganizationsService {
    constructor(orgModel) {
        this.orgModel = orgModel;
    }
    async findByOwner(ownerId) {
        return this.orgModel.findOne({ ownerId: new mongoose_2.Types.ObjectId(ownerId) });
    }
    async findById(id) {
        return this.orgModel.findById(id);
    }
    async create(ownerId, dto) {
        const existing = await this.orgModel.findOne({ ownerId: new mongoose_2.Types.ObjectId(ownerId) });
        if (existing) {
            throw new common_1.ConflictException('You already have an organization');
        }
        const slug = this.slugify(dto.name);
        const slugExists = await this.orgModel.findOne({ slug });
        const finalSlug = slugExists ? `${slug}-${Date.now().toString(36)}` : slug;
        return this.orgModel.create({
            ...dto,
            slug: finalSlug,
            ownerId: new mongoose_2.Types.ObjectId(ownerId),
        });
    }
    async update(ownerId, dto) {
        const org = await this.orgModel.findOne({ ownerId: new mongoose_2.Types.ObjectId(ownerId) });
        if (!org)
            return null;
        Object.assign(org, dto);
        return org.save();
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
exports.OrganizationsService = OrganizationsService;
exports.OrganizationsService = OrganizationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(organization_schema_1.Organization.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], OrganizationsService);
//# sourceMappingURL=organizations.service.js.map