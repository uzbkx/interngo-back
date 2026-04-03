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
exports.ListingsTelegramService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let ListingsTelegramService = class ListingsTelegramService {
    constructor(configService) {
        this.configService = configService;
        this.botToken = this.configService.get('TELEGRAM_BOT_TOKEN', '');
        this.channelId = this.configService.get('TELEGRAM_CHANNEL_ID', '');
        this.frontendUrl = this.configService.get('FRONTEND_URL', 'https://interngo.uz');
    }
    async postListing(listing) {
        if (!this.botToken || !this.channelId)
            return;
        const typeEmoji = {
            INTERNSHIP: '💼',
            SCHOLARSHIP: '🎓',
            PROGRAM: '🌍',
            VOLUNTEER: '🤝',
            JOB: '👔',
            OTHER: '📌',
        };
        const emoji = typeEmoji[listing.type] || '📌';
        const url = `${this.frontendUrl}/listings/${listing.slug}`;
        let message = `${emoji} <b>${listing.title}</b>\n\n`;
        message += `${listing.description.slice(0, 200)}${listing.description.length > 200 ? '...' : ''}\n\n`;
        const tags = [];
        if (listing.country)
            tags.push(`📍 ${listing.country}`);
        if (listing.deadline) {
            const d = new Date(listing.deadline);
            tags.push(`⏰ Deadline: ${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`);
        }
        if (listing.isPaid)
            tags.push('💰 Paid');
        if (listing.isRemote)
            tags.push('🏠 Remote');
        if (tags.length > 0)
            message += tags.join(' | ') + '\n\n';
        message += `👉 <a href="${url}">View & Apply on InternGo</a>`;
        try {
            await fetch(`https://api.telegram.org/bot${this.botToken}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: this.channelId,
                    text: message,
                    parse_mode: 'HTML',
                    disable_web_page_preview: false,
                }),
            });
            console.log(`[Telegram] Posted: ${listing.title}`);
        }
        catch (err) {
            console.error('[Telegram] Failed to post:', err);
        }
    }
};
exports.ListingsTelegramService = ListingsTelegramService;
exports.ListingsTelegramService = ListingsTelegramService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], ListingsTelegramService);
//# sourceMappingURL=listings-telegram.service.js.map