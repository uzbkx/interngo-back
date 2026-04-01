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
exports.ListingsModeratorService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const config_1 = require("@nestjs/config");
const groq_sdk_1 = require("groq-sdk");
const listing_schema_1 = require("./schemas/listing.schema");
let ListingsModeratorService = class ListingsModeratorService {
    constructor(listingModel, configService) {
        this.listingModel = listingModel;
        this.configService = configService;
        this.groq = new groq_sdk_1.default({
            apiKey: this.configService.get('GROQ_API_KEY'),
        });
    }
    async moderateListing(listingId) {
        const listing = await this.listingModel.findById(listingId);
        if (!listing) {
            return { approved: false, reason: 'Listing not found', confidence: 100, flags: [] };
        }
        try {
            const response = await this.groq.chat.completions.create({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    {
                        role: 'user',
                        content: `You are a content moderator for InternGo, a platform listing internships, scholarships, and programs for students.

Review this listing and determine if it should stay published or be flagged for manual review.

LISTING:
Title: ${listing.title}
Type: ${listing.type}
Description: ${listing.description}
Country: ${listing.country || 'Not specified'}
Apply URL: ${listing.applyUrl || 'Not provided'}
Is Paid: ${listing.isPaid}
Organization: ${listing.organizationName || 'Not specified'}

CHECK FOR:
1. Is this a real opportunity? (not spam, not an ad, not a joke)
2. Is the description adequate? (at least 2 sentences of real info)
3. Is it appropriate? (no scams, MLM, pyramid schemes, adult content)
4. Does it target students/youth? (relevant to the platform)
5. Is the apply URL suspicious? (phishing, shortened links to unknown sites)

RESPOND WITH ONLY a JSON object:
{
  "approved": true/false,
  "reason": "brief explanation",
  "confidence": 0-100,
  "flags": ["list", "of", "issues"]
}

If everything looks fine, approved should be true with empty flags.
Only flag genuinely problematic listings — err on the side of approving.`,
                    },
                ],
                max_tokens: 300,
                temperature: 0.1,
            });
            const text = response.choices[0]?.message?.content || '';
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                return { approved: true, reason: 'Could not parse AI response', confidence: 0, flags: [] };
            }
            const result = JSON.parse(jsonMatch[0]);
            if (!result.approved) {
                await this.listingModel.findByIdAndUpdate(listingId, {
                    status: listing_schema_1.ListingStatus.DRAFT,
                });
                console.log(`[Moderator] Flagged listing "${listing.title}": ${result.reason}`);
                console.log(`[Moderator] Flags: ${result.flags.join(', ')}`);
            }
            else {
                console.log(`[Moderator] Approved listing "${listing.title}" (confidence: ${result.confidence}%)`);
            }
            return result;
        }
        catch (error) {
            console.error('[Moderator] AI moderation failed:', error);
            return { approved: true, reason: 'AI moderation unavailable', confidence: 0, flags: [] };
        }
    }
};
exports.ListingsModeratorService = ListingsModeratorService;
exports.ListingsModeratorService = ListingsModeratorService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(listing_schema_1.Listing.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        config_1.ConfigService])
], ListingsModeratorService);
//# sourceMappingURL=listings-moderator.service.js.map