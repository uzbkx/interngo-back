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
exports.SavedService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const saved_listing_schema_1 = require("./schemas/saved-listing.schema");
let SavedService = class SavedService {
    constructor(savedModel) {
        this.savedModel = savedModel;
    }
    async findByUser(userId) {
        return this.savedModel
            .find({ userId: new mongoose_2.Types.ObjectId(userId) })
            .populate('listingId')
            .sort({ createdAt: -1 });
    }
    async toggle(userId, listingId) {
        const existing = await this.savedModel.findOne({
            userId: new mongoose_2.Types.ObjectId(userId),
            listingId: new mongoose_2.Types.ObjectId(listingId),
        });
        if (existing) {
            await existing.deleteOne();
            return { saved: false };
        }
        await this.savedModel.create({
            userId: new mongoose_2.Types.ObjectId(userId),
            listingId: new mongoose_2.Types.ObjectId(listingId),
        });
        return { saved: true };
    }
    async checkSaved(userId, listingId) {
        const existing = await this.savedModel.findOne({
            userId: new mongoose_2.Types.ObjectId(userId),
            listingId: new mongoose_2.Types.ObjectId(listingId),
        });
        return { saved: !!existing };
    }
};
exports.SavedService = SavedService;
exports.SavedService = SavedService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(saved_listing_schema_1.SavedListing.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], SavedService);
//# sourceMappingURL=saved.service.js.map