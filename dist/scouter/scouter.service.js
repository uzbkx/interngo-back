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
exports.ScouterService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const scouted_source_schema_1 = require("./schemas/scouted-source.schema");
const scouted_result_schema_1 = require("./schemas/scouted-result.schema");
const scouter_run_schema_1 = require("./schemas/scouter-run.schema");
const listing_schema_1 = require("../listings/schemas/listing.schema");
const scouter_ai_service_1 = require("./scouter-ai.service");
const scouter_scraper_service_1 = require("./scouter-scraper.service");
const listings_telegram_service_1 = require("../listings/listings-telegram.service");
const AUTO_APPROVE_CONFIDENCE = 75;
let ScouterService = class ScouterService {
    constructor(sourceModel, resultModel, runModel, listingModel, aiService, scraperService, telegramService) {
        this.sourceModel = sourceModel;
        this.resultModel = resultModel;
        this.runModel = runModel;
        this.listingModel = listingModel;
        this.aiService = aiService;
        this.scraperService = scraperService;
        this.telegramService = telegramService;
    }
    async getSources() {
        return this.sourceModel.find().sort({ createdAt: -1 });
    }
    async createSource(data) {
        return this.sourceModel.create(data);
    }
    async getResults(pending) {
        const filter = {};
        if (pending) {
            filter.isApproved = false;
            filter.isRejected = false;
        }
        return this.resultModel.find(filter).populate('sourceId').sort({ createdAt: -1 });
    }
    async approveResult(id, approve) {
        const result = await this.resultModel.findById(id);
        if (!result)
            throw new Error('Result not found');
        if (approve) {
            result.isApproved = true;
            const slug = this.slugify(result.title);
            const existing = await this.listingModel.findOne({ slug });
            const finalSlug = existing ? `${slug}-${Date.now().toString(36)}` : slug;
            const rawData = result.rawData || {};
            const listing = await this.listingModel.create({
                title: result.title,
                slug: finalSlug,
                description: result.description || '',
                type: rawData.type || 'OTHER',
                status: listing_schema_1.ListingStatus.PUBLISHED,
                source: listing_schema_1.ListingSource.AI_SCOUTED,
                country: rawData.country,
                city: rawData.city,
                isRemote: rawData.isRemote || false,
                isPaid: rawData.isPaid || false,
                salary: rawData.salary,
                currency: rawData.currency,
                deadline: rawData.deadline ? new Date(rawData.deadline) : undefined,
                startDate: rawData.startDate ? new Date(rawData.startDate) : undefined,
                endDate: rawData.endDate ? new Date(rawData.endDate) : undefined,
                applyUrl: result.url,
            });
            result.listingId = listing._id;
        }
        else {
            result.isRejected = true;
        }
        await result.save();
        return result;
    }
    async getRuns() {
        return this.runModel.find().sort({ startedAt: -1 }).limit(50);
    }
    async scoutSource(sourceId) {
        const source = await this.sourceModel.findById(sourceId);
        if (!source) {
            return {
                sourceId,
                sourceName: 'Unknown',
                found: 0, added: 0, autoApproved: 0, skippedDuplicates: 0,
                errors: ['Source not found'],
            };
        }
        const result = {
            sourceId: source._id.toString(),
            sourceName: source.name,
            found: 0, added: 0, autoApproved: 0, skippedDuplicates: 0,
            errors: [],
        };
        try {
            console.log(`[Scouter] Scraping: ${source.name} (${source.url})`);
            const content = await this.scraperService.scrapeUrl(source.url);
            if (!content || content.length < 50) {
                result.errors.push('Page content too short or empty');
                return result;
            }
            console.log(`[Scouter] Extracting opportunities from: ${source.name}`);
            const opportunities = await this.aiService.extractOpportunities(content, source.url, source.name);
            result.found = opportunities.length;
            const existingListings = await this.listingModel.find({}, { title: 1 });
            const existingResults = await this.resultModel.find({ sourceId: source._id }, { title: 1 });
            const allExistingTitles = [
                ...existingListings.map((l) => l.title),
                ...existingResults.map((r) => r.title),
            ];
            for (const opp of opportunities) {
                try {
                    if (this.aiService.checkDuplicate(opp.title, allExistingTitles)) {
                        result.skippedDuplicates++;
                        continue;
                    }
                    const { autoApproved } = await this.storeOpportunity(opp, source._id.toString(), source.url);
                    result.added++;
                    if (autoApproved)
                        result.autoApproved++;
                    allExistingTitles.push(opp.title);
                }
                catch (err) {
                    const msg = err instanceof Error ? err.message : 'Unknown error';
                    if (!msg.includes('duplicate key')) {
                        result.errors.push(`Failed to store "${opp.title}": ${msg}`);
                    }
                }
            }
            await this.sourceModel.findByIdAndUpdate(source._id, { lastScraped: new Date() });
            console.log(`[Scouter] ${source.name}: added ${result.added}, auto-approved ${result.autoApproved}`);
        }
        catch (err) {
            const msg = err instanceof Error ? err.message : 'Unknown error';
            result.errors.push(`Scraping failed: ${msg}`);
            console.error(`[Scouter] Error scraping ${source.name}:`, msg);
        }
        return result;
    }
    async scoutAllSources() {
        const run = await this.runModel.create({ type: 'scheduled', status: 'running' });
        const sources = await this.sourceModel.find({ isActive: true });
        const results = [];
        let totalFound = 0, totalAdded = 0, totalAutoApproved = 0;
        const allErrors = [];
        console.log(`[Scouter] Starting run: ${sources.length} sources`);
        for (const source of sources) {
            const result = await this.scoutSource(source._id.toString());
            results.push(result);
            totalFound += result.found;
            totalAdded += result.added;
            totalAutoApproved += result.autoApproved;
            allErrors.push(...result.errors);
            await new Promise((resolve) => setTimeout(resolve, 3000));
        }
        await this.runModel.findByIdAndUpdate(run._id, {
            status: 'completed',
            sourcesCount: sources.length,
            foundCount: totalFound,
            addedCount: totalAdded,
            autoApproved: totalAutoApproved,
            errors: allErrors,
            completedAt: new Date(),
        });
        console.log(`[Scouter] Run complete: ${totalFound} found, ${totalAdded} added`);
        return { results, runId: run._id.toString() };
    }
    async runAutoDiscovery() {
        const run = await this.runModel.create({ type: 'discovery', status: 'running' });
        const topics = [
            'scholarships for Central Asian students',
            'international internships for students from developing countries',
            'youth exchange programs and fellowships',
            'STEM research opportunities for international students',
            'volunteer programs for young people',
        ];
        const topic = topics[Math.floor(Math.random() * topics.length)];
        console.log(`[Scouter] Auto-discovering sources for: "${topic}"`);
        let newSourcesAdded = 0;
        const errors = [];
        try {
            const suggestions = await this.aiService.discoverSources(topic);
            const existingUrls = new Set((await this.sourceModel.find({}, { url: 1 })).map((s) => s.url));
            for (const suggestion of suggestions) {
                if (!existingUrls.has(suggestion.url)) {
                    try {
                        await this.sourceModel.create({
                            name: suggestion.name,
                            url: suggestion.url,
                            description: suggestion.description,
                            isActive: true,
                        });
                        newSourcesAdded++;
                    }
                    catch (err) {
                        const msg = err instanceof Error ? err.message : '';
                        if (!msg.includes('duplicate key')) {
                            errors.push(`Failed to add source ${suggestion.name}: ${msg}`);
                        }
                    }
                }
            }
        }
        catch (err) {
            const msg = err instanceof Error ? err.message : 'Unknown error';
            errors.push(`Discovery failed: ${msg}`);
        }
        await this.runModel.findByIdAndUpdate(run._id, {
            status: 'completed',
            addedCount: newSourcesAdded,
            errors,
            completedAt: new Date(),
        });
        console.log(`[Scouter] Discovery complete: ${newSourcesAdded} new sources`);
        return { newSourcesAdded, runId: run._id.toString() };
    }
    async cleanupExpiredListings() {
        const result = await this.listingModel.updateMany({ deadline: { $lt: new Date() }, status: listing_schema_1.ListingStatus.PUBLISHED }, { status: listing_schema_1.ListingStatus.CLOSED });
        if (result.modifiedCount > 0) {
            console.log(`[Scouter] Closed ${result.modifiedCount} expired listings`);
        }
        return result.modifiedCount;
    }
    async storeOpportunity(opp, sourceId, sourceUrl) {
        const confidence = opp.confidence || 0;
        const shouldAutoApprove = confidence >= AUTO_APPROVE_CONFIDENCE &&
            opp.title.length > 10 &&
            opp.description.length > 30;
        await this.resultModel.create({
            title: opp.title,
            description: opp.description,
            url: opp.applyUrl || sourceUrl,
            rawData: JSON.parse(JSON.stringify(opp)),
            sourceId: new mongoose_2.Types.ObjectId(sourceId),
            isApproved: shouldAutoApprove,
        });
        let slug = this.slugify(opp.title);
        const existing = await this.listingModel.findOne({ slug });
        if (existing)
            slug = `${slug}-${Date.now().toString(36)}`;
        await this.listingModel.create({
            title: opp.title,
            slug,
            description: opp.description,
            type: opp.type || 'OTHER',
            status: shouldAutoApprove ? listing_schema_1.ListingStatus.PUBLISHED : listing_schema_1.ListingStatus.DRAFT,
            source: listing_schema_1.ListingSource.AI_SCOUTED,
            country: opp.country || null,
            city: opp.city || null,
            isRemote: opp.isRemote || false,
            isPaid: opp.isPaid || false,
            salary: opp.salary || null,
            currency: opp.currency || null,
            deadline: opp.deadline ? new Date(opp.deadline) : undefined,
            startDate: opp.startDate ? new Date(opp.startDate) : undefined,
            endDate: opp.endDate ? new Date(opp.endDate) : undefined,
            applyUrl: opp.applyUrl || sourceUrl,
        });
        if (shouldAutoApprove) {
            this.telegramService.postListing({
                title: opp.title,
                slug,
                type: opp.type || 'OTHER',
                description: opp.description,
                country: opp.country,
                deadline: opp.deadline ? new Date(opp.deadline) : undefined,
                isPaid: opp.isPaid,
                isRemote: opp.isRemote,
            }).catch(() => { });
        }
        return { autoApproved: shouldAutoApprove };
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
exports.ScouterService = ScouterService;
exports.ScouterService = ScouterService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(scouted_source_schema_1.ScoutedSource.name)),
    __param(1, (0, mongoose_1.InjectModel)(scouted_result_schema_1.ScoutedResult.name)),
    __param(2, (0, mongoose_1.InjectModel)(scouter_run_schema_1.ScouterRun.name)),
    __param(3, (0, mongoose_1.InjectModel)(listing_schema_1.Listing.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        scouter_ai_service_1.ScouterAiService,
        scouter_scraper_service_1.ScouterScraperService,
        listings_telegram_service_1.ListingsTelegramService])
], ScouterService);
//# sourceMappingURL=scouter.service.js.map