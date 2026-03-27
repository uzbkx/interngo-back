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
exports.ScouterController = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
const scouter_service_1 = require("./scouter.service");
const admin_or_secret_guard_1 = require("../common/guards/admin-or-secret.guard");
const create_source_dto_1 = require("./dto/create-source.dto");
const run_scout_dto_1 = require("./dto/run-scout.dto");
const discover_sources_dto_1 = require("./dto/discover-sources.dto");
const approve_result_dto_1 = require("./dto/approve-result.dto");
const parse_object_id_pipe_1 = require("../common/pipes/parse-object-id.pipe");
let ScouterController = class ScouterController {
    constructor(scouterService, scouterQueue) {
        this.scouterService = scouterService;
        this.scouterQueue = scouterQueue;
    }
    async triggerRun(dto) {
        if (dto.action === 'discover') {
            const job = await this.scouterQueue.add('discover', {});
            return { jobId: job.id, message: 'Discovery job enqueued' };
        }
        if (dto.action === 'cleanup') {
            const job = await this.scouterQueue.add('cleanup', {});
            return { jobId: job.id, message: 'Cleanup job enqueued' };
        }
        if (dto.sourceId) {
            const job = await this.scouterQueue.add('scout-source', { sourceId: dto.sourceId });
            return { jobId: job.id, message: 'Scout source job enqueued' };
        }
        const job = await this.scouterQueue.add('scout-all', {});
        return { jobId: job.id, message: 'Scout all job enqueued' };
    }
    getRuns() {
        return this.scouterService.getRuns();
    }
    async discover(dto) {
        const job = await this.scouterQueue.add('discover', { topic: dto.topic });
        return { jobId: job.id, message: 'Discovery job enqueued' };
    }
    getSources() {
        return this.scouterService.getSources();
    }
    createSource(dto) {
        return this.scouterService.createSource(dto);
    }
    getResults(pending) {
        return this.scouterService.getResults(pending === 'true');
    }
    approveResult(id, dto) {
        return this.scouterService.approveResult(id, dto.approve);
    }
};
exports.ScouterController = ScouterController;
__decorate([
    (0, common_1.Post)('run'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [run_scout_dto_1.RunScoutDto]),
    __metadata("design:returntype", Promise)
], ScouterController.prototype, "triggerRun", null);
__decorate([
    (0, common_1.Get)('runs'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ScouterController.prototype, "getRuns", null);
__decorate([
    (0, common_1.Post)('discover'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [discover_sources_dto_1.DiscoverSourcesDto]),
    __metadata("design:returntype", Promise)
], ScouterController.prototype, "discover", null);
__decorate([
    (0, common_1.Get)('sources'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ScouterController.prototype, "getSources", null);
__decorate([
    (0, common_1.Post)('sources'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_source_dto_1.CreateSourceDto]),
    __metadata("design:returntype", void 0)
], ScouterController.prototype, "createSource", null);
__decorate([
    (0, common_1.Get)('results'),
    __param(0, (0, common_1.Query)('pending')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ScouterController.prototype, "getResults", null);
__decorate([
    (0, common_1.Patch)('results/:id/approve'),
    __param(0, (0, common_1.Param)('id', parse_object_id_pipe_1.ParseObjectIdPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, approve_result_dto_1.ApproveResultDto]),
    __metadata("design:returntype", void 0)
], ScouterController.prototype, "approveResult", null);
exports.ScouterController = ScouterController = __decorate([
    (0, common_1.Controller)('scouter'),
    (0, common_1.UseGuards)(admin_or_secret_guard_1.AdminOrSecretGuard),
    __param(1, (0, bullmq_1.InjectQueue)('scouter')),
    __metadata("design:paramtypes", [scouter_service_1.ScouterService,
        bullmq_2.Queue])
], ScouterController);
//# sourceMappingURL=scouter.controller.js.map