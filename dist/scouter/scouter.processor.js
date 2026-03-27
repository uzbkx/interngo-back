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
exports.ScouterProcessor = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const scouter_service_1 = require("./scouter.service");
let ScouterProcessor = class ScouterProcessor extends bullmq_1.WorkerHost {
    constructor(scouterService) {
        super();
        this.scouterService = scouterService;
    }
    async process(job) {
        console.log(`[BullMQ] Processing job: ${job.name} (${job.id})`);
        switch (job.name) {
            case 'scout-source':
                return this.scouterService.scoutSource(job.data.sourceId);
            case 'scout-all':
                return this.scouterService.scoutAllSources();
            case 'discover':
                return this.scouterService.runAutoDiscovery();
            case 'cleanup':
                return this.scouterService.cleanupExpiredListings();
            default:
                console.warn(`[BullMQ] Unknown job type: ${job.name}`);
        }
    }
};
exports.ScouterProcessor = ScouterProcessor;
exports.ScouterProcessor = ScouterProcessor = __decorate([
    (0, bullmq_1.Processor)('scouter'),
    __metadata("design:paramtypes", [scouter_service_1.ScouterService])
], ScouterProcessor);
//# sourceMappingURL=scouter.processor.js.map