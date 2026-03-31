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
exports.ScouterScheduler = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const scouter_service_1 = require("./scouter.service");
const listings_service_1 = require("../listings/listings.service");
let ScouterScheduler = class ScouterScheduler {
    constructor(scouterService, listingsService) {
        this.scouterService = scouterService;
        this.listingsService = listingsService;
    }
    async scheduleScoutAll() {
        console.log('[Scheduler] Starting scout-all');
        await this.scouterService.scoutAllSources();
    }
    async scheduleDiscovery() {
        console.log('[Scheduler] Starting discovery');
        await this.scouterService.runAutoDiscovery();
    }
    async scheduleCleanup() {
        console.log('[Scheduler] Starting cleanup');
        const closed = await this.listingsService.closeExpired();
        const archived = await this.listingsService.archiveOld();
        if (closed > 0 || archived > 0) {
            console.log(`[Scheduler] Closed: ${closed}, Archived: ${archived}`);
        }
    }
};
exports.ScouterScheduler = ScouterScheduler;
__decorate([
    (0, schedule_1.Cron)('0 */6 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ScouterScheduler.prototype, "scheduleScoutAll", null);
__decorate([
    (0, schedule_1.Cron)('0 3 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ScouterScheduler.prototype, "scheduleDiscovery", null);
__decorate([
    (0, schedule_1.Cron)('0 * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ScouterScheduler.prototype, "scheduleCleanup", null);
exports.ScouterScheduler = ScouterScheduler = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [scouter_service_1.ScouterService,
        listings_service_1.ListingsService])
], ScouterScheduler);
//# sourceMappingURL=scouter.scheduler.js.map