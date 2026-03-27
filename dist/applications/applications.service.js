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
exports.ApplicationsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const application_schema_1 = require("./schemas/application.schema");
let ApplicationsService = class ApplicationsService {
    constructor(applicationModel) {
        this.applicationModel = applicationModel;
    }
    async findByUser(userId) {
        return this.applicationModel
            .find({ userId: new mongoose_2.Types.ObjectId(userId) })
            .populate('listingId')
            .sort({ updatedAt: -1 });
    }
    async upsert(userId, dto) {
        const filter = {
            userId: new mongoose_2.Types.ObjectId(userId),
            listingId: new mongoose_2.Types.ObjectId(dto.listingId),
        };
        const update = {
            ...filter,
            ...(dto.status && { status: dto.status }),
            ...(dto.notes !== undefined && { notes: dto.notes }),
        };
        return this.applicationModel.findOneAndUpdate(filter, update, {
            upsert: true,
            new: true,
        }).populate('listingId');
    }
    async update(id, userId, dto) {
        const app = await this.applicationModel.findById(id);
        if (!app)
            throw new common_1.NotFoundException('Application not found');
        if (app.userId.toString() !== userId)
            throw new common_1.ForbiddenException();
        Object.assign(app, dto);
        await app.save();
        return app.populate('listingId');
    }
    async remove(id, userId) {
        const app = await this.applicationModel.findById(id);
        if (!app)
            throw new common_1.NotFoundException('Application not found');
        if (app.userId.toString() !== userId)
            throw new common_1.ForbiddenException();
        await app.deleteOne();
        return { deleted: true };
    }
};
exports.ApplicationsService = ApplicationsService;
exports.ApplicationsService = ApplicationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(application_schema_1.Application.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ApplicationsService);
//# sourceMappingURL=applications.service.js.map