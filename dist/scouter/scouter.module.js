"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScouterModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const bullmq_1 = require("@nestjs/bullmq");
const scouted_source_schema_1 = require("./schemas/scouted-source.schema");
const scouted_result_schema_1 = require("./schemas/scouted-result.schema");
const scouter_run_schema_1 = require("./schemas/scouter-run.schema");
const scouter_service_1 = require("./scouter.service");
const scouter_ai_service_1 = require("./scouter-ai.service");
const scouter_scraper_service_1 = require("./scouter-scraper.service");
const scouter_processor_1 = require("./scouter.processor");
const scouter_scheduler_1 = require("./scouter.scheduler");
const scouter_controller_1 = require("./scouter.controller");
const listings_module_1 = require("../listings/listings.module");
let ScouterModule = class ScouterModule {
};
exports.ScouterModule = ScouterModule;
exports.ScouterModule = ScouterModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: scouted_source_schema_1.ScoutedSource.name, schema: scouted_source_schema_1.ScoutedSourceSchema },
                { name: scouted_result_schema_1.ScoutedResult.name, schema: scouted_result_schema_1.ScoutedResultSchema },
                { name: scouter_run_schema_1.ScouterRun.name, schema: scouter_run_schema_1.ScouterRunSchema },
            ]),
            bullmq_1.BullModule.registerQueue({ name: 'scouter' }),
            listings_module_1.ListingsModule,
        ],
        providers: [
            scouter_service_1.ScouterService,
            scouter_ai_service_1.ScouterAiService,
            scouter_scraper_service_1.ScouterScraperService,
            scouter_processor_1.ScouterProcessor,
            scouter_scheduler_1.ScouterScheduler,
        ],
        controllers: [scouter_controller_1.ScouterController],
    })
], ScouterModule);
//# sourceMappingURL=scouter.module.js.map