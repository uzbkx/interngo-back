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
exports.ScouterRunSchema = exports.ScouterRun = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let ScouterRun = class ScouterRun {
};
exports.ScouterRun = ScouterRun;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ScouterRun.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 'running' }),
    __metadata("design:type", String)
], ScouterRun.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], ScouterRun.prototype, "sourcesCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], ScouterRun.prototype, "foundCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], ScouterRun.prototype, "addedCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], ScouterRun.prototype, "autoApproved", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], ScouterRun.prototype, "errors", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: () => new Date() }),
    __metadata("design:type", Date)
], ScouterRun.prototype, "startedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], ScouterRun.prototype, "completedAt", void 0);
exports.ScouterRun = ScouterRun = __decorate([
    (0, mongoose_1.Schema)({ collection: 'scouter_runs' })
], ScouterRun);
exports.ScouterRunSchema = mongoose_1.SchemaFactory.createForClass(ScouterRun);
//# sourceMappingURL=scouter-run.schema.js.map