"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScouterScraperService = void 0;
const common_1 = require("@nestjs/common");
const cheerio = require("cheerio");
let ScouterScraperService = class ScouterScraperService {
    async scrapeUrl(url) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000);
        try {
            const response = await fetch(url, {
                signal: controller.signal,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (compatible; InternGoBot/1.0; +https://interngo.uz)',
                    Accept: 'text/html,application/xhtml+xml',
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            const html = await response.text();
            return this.extractTextContent(html);
        }
        finally {
            clearTimeout(timeout);
        }
    }
    extractTextContent(html) {
        const $ = cheerio.load(html);
        $('script, style, nav, footer, header, iframe, noscript, svg, img, video, audio').remove();
        $('[role="navigation"], [role="banner"], [role="contentinfo"]').remove();
        $('.nav, .navbar, .footer, .sidebar, .menu, .cookie, .popup, .modal').remove();
        const mainContent = $('main').text() ||
            $('[role="main"]').text() ||
            $('article').text() ||
            $('.content, .main, #content, #main').text();
        const text = (mainContent || $('body').text())
            .replace(/\s+/g, ' ')
            .replace(/\n\s*\n/g, '\n')
            .trim();
        return text.slice(0, 15000);
    }
};
exports.ScouterScraperService = ScouterScraperService;
exports.ScouterScraperService = ScouterScraperService = __decorate([
    (0, common_1.Injectable)()
], ScouterScraperService);
//# sourceMappingURL=scouter-scraper.service.js.map