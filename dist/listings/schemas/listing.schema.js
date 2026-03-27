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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListingSchema = exports.Listing = exports.ListingSource = exports.ListingStatus = exports.ListingType = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var ListingType;
(function (ListingType) {
    ListingType["INTERNSHIP"] = "INTERNSHIP";
    ListingType["SCHOLARSHIP"] = "SCHOLARSHIP";
    ListingType["PROGRAM"] = "PROGRAM";
    ListingType["VOLUNTEER"] = "VOLUNTEER";
    ListingType["JOB"] = "JOB";
    ListingType["OTHER"] = "OTHER";
})(ListingType || (exports.ListingType = ListingType = {}));
var ListingStatus;
(function (ListingStatus) {
    ListingStatus["DRAFT"] = "DRAFT";
    ListingStatus["PUBLISHED"] = "PUBLISHED";
    ListingStatus["CLOSED"] = "CLOSED";
    ListingStatus["ARCHIVED"] = "ARCHIVED";
})(ListingStatus || (exports.ListingStatus = ListingStatus = {}));
var ListingSource;
(function (ListingSource) {
    ListingSource["USER_SUBMITTED"] = "USER_SUBMITTED";
    ListingSource["AI_SCOUTED"] = "AI_SCOUTED";
})(ListingSource || (exports.ListingSource = ListingSource = {}));
let Listing = class Listing {
};
exports.Listing = Listing;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Listing.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], Listing.prototype, "slug", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Listing.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: ListingType, required: true }),
    __metadata("design:type", String)
], Listing.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: ListingStatus, default: ListingStatus.DRAFT }),
    __metadata("design:type", String)
], Listing.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: ListingSource, default: ListingSource.USER_SUBMITTED }),
    __metadata("design:type", String)
], Listing.prototype, "source", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Listing.prototype, "location", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Listing.prototype, "isRemote", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Listing.prototype, "isPaid", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Listing.prototype, "salary", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Listing.prototype, "currency", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Listing.prototype, "applyUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Listing.prototype, "applyEmail", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Listing.prototype, "deadline", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Listing.prototype, "startDate", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Listing.prototype, "endDate", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Listing.prototype, "country", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Listing.prototype, "city", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Listing.prototype, "organizationName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Organization' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Listing.prototype, "organizationId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose_2.Types.ObjectId, ref: 'Category' }] }),
    __metadata("design:type", Array)
], Listing.prototype, "categories", void 0);
exports.Listing = Listing = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'listings' })
], Listing);
exports.ListingSchema = mongoose_1.SchemaFactory.createForClass(Listing);
exports.ListingSchema.index({ type: 1, status: 1 });
exports.ListingSchema.index({ country: 1 });
exports.ListingSchema.index({ deadline: 1 });
exports.ListingSchema.index({ title: 'text', description: 'text' });
//# sourceMappingURL=listing.schema.js.map