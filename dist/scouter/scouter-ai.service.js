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
exports.ScouterAiService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const groq_sdk_1 = require("groq-sdk");
let ScouterAiService = class ScouterAiService {
    constructor(configService) {
        this.configService = configService;
        this.groq = new groq_sdk_1.default({
            apiKey: this.configService.get('GROQ_API_KEY'),
        });
    }
    async callWithRetry(prompt, maxRetries = 3) {
        for (let attempt = 0; attempt < maxRetries; attempt++) {
            try {
                const response = await this.groq.chat.completions.create({
                    model: 'llama-3.3-70b-versatile',
                    messages: [{ role: 'user', content: prompt }],
                    max_tokens: 4096,
                    temperature: 0.1,
                });
                return response.choices[0]?.message?.content || '';
            }
            catch (error) {
                if (error?.status === 429 && attempt < maxRetries - 1) {
                    const waitTime = (attempt + 1) * 10000;
                    console.log(`[AI] Rate limited, waiting ${waitTime / 1000}s...`);
                    await new Promise((resolve) => setTimeout(resolve, waitTime));
                    continue;
                }
                throw error;
            }
        }
        return '';
    }
    async extractOpportunities(pageContent, sourceUrl, sourceName) {
        const currentDate = new Date().toISOString().split('T')[0];
        const prompt = `You are an AI scouter for InternGo, a platform that helps students in Uzbekistan find internships, scholarships, and international programs.

Today's date: ${currentDate}

Analyze the following webpage content from "${sourceName}" (${sourceUrl}) and extract ALL current/upcoming opportunities (internships, scholarships, programs, volunteering, jobs).

IMPORTANT RULES:
- Only extract opportunities that are CURRENTLY OPEN for applications
- Skip any opportunities whose deadline is before ${currentDate}
- Each opportunity must have a clear, specific title
- Descriptions should be 2-4 sentences summarizing the opportunity
- Use ISO date format YYYY-MM-DD

For each opportunity, extract:
- title: Clear, descriptive title
- type: One of INTERNSHIP, SCHOLARSHIP, PROGRAM, VOLUNTEER, JOB, OTHER
- description: 2-4 sentence summary
- country: Country where it takes place
- city: City (if mentioned)
- isRemote: true/false
- isPaid: true/false
- salary: Compensation amount (if mentioned)
- currency: Currency code
- deadline: YYYY-MM-DD (if mentioned)
- startDate: YYYY-MM-DD (if mentioned)
- endDate: YYYY-MM-DD (if mentioned)
- applyUrl: Direct application URL
- confidence: 0-100

Return ONLY a JSON array. No other text.

PAGE CONTENT:
${pageContent.slice(0, 10000)}`;
        try {
            const text = await this.callWithRetry(prompt);
            const jsonMatch = text.match(/\[[\s\S]*\]/);
            if (!jsonMatch)
                return [];
            return JSON.parse(jsonMatch[0]);
        }
        catch (error) {
            console.error('Failed to extract opportunities:', error);
            return [];
        }
    }
    async discoverSources(topic) {
        const prompt = `You are an AI scouter for InternGo, helping students in Uzbekistan find international opportunities.

Suggest 10 websites that regularly post ${topic} for international students. Focus on:
- Scholarship databases and aggregators
- International organization program pages
- Government-funded exchange programs
- Programs open to Central Asian / Uzbek students

For each, provide:
- name: Website name
- url: Specific page URL that lists opportunities
- description: What opportunities they post

Return ONLY a JSON array. No other text.`;
        try {
            const text = await this.callWithRetry(prompt);
            const jsonMatch = text.match(/\[[\s\S]*\]/);
            if (!jsonMatch)
                return [];
            return JSON.parse(jsonMatch[0]);
        }
        catch (error) {
            console.error('Failed to discover sources:', error);
            return [];
        }
    }
    checkDuplicate(newTitle, existingTitles) {
        if (existingTitles.length === 0)
            return false;
        const normalizedNew = newTitle.toLowerCase().replace(/[^a-z0-9\s]/g, '');
        for (const existing of existingTitles) {
            const normalizedExisting = existing.toLowerCase().replace(/[^a-z0-9\s]/g, '');
            if (normalizedNew === normalizedExisting)
                return true;
            if (normalizedNew.includes(normalizedExisting) || normalizedExisting.includes(normalizedNew))
                return true;
            const newWords = new Set(normalizedNew.split(/\s+/));
            const existingWords = new Set(normalizedExisting.split(/\s+/));
            const overlap = [...newWords].filter((w) => existingWords.has(w)).length;
            const maxLen = Math.max(newWords.size, existingWords.size);
            if (maxLen > 0 && overlap / maxLen > 0.8)
                return true;
        }
        return false;
    }
};
exports.ScouterAiService = ScouterAiService;
exports.ScouterAiService = ScouterAiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], ScouterAiService);
//# sourceMappingURL=scouter-ai.service.js.map