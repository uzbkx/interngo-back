import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ListingsTelegramService {
  private botToken: string;
  private channelId: string;
  private frontendUrl: string;

  constructor(private configService: ConfigService) {
    this.botToken = this.configService.get<string>('TELEGRAM_BOT_TOKEN', '');
    this.channelId = this.configService.get<string>('TELEGRAM_CHANNEL_ID', '');
    this.frontendUrl = this.configService.get<string>('FRONTEND_URL', 'https://interngo.uz');
  }

  async postListing(listing: {
    title: string;
    slug: string;
    type: string;
    description: string;
    country?: string;
    deadline?: Date;
    isPaid?: boolean;
    isRemote?: boolean;
  }) {
    if (!this.botToken || !this.channelId) return;

    const typeEmoji: Record<string, string> = {
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

    const tags: string[] = [];
    if (listing.country) tags.push(`📍 ${listing.country}`);
    if (listing.deadline) {
      const d = new Date(listing.deadline);
      tags.push(`⏰ Deadline: ${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`);
    }
    if (listing.isPaid) tags.push('💰 Paid');
    if (listing.isRemote) tags.push('🏠 Remote');

    if (tags.length > 0) message += tags.join(' | ') + '\n\n';

    message += `👉 <a href="${url}">View & Apply on InternGo</a>`;

    try {
      await fetch(
        `https://api.telegram.org/bot${this.botToken}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: this.channelId,
            text: message,
            parse_mode: 'HTML',
            disable_web_page_preview: false,
          }),
        },
      );
      console.log(`[Telegram] Posted: ${listing.title}`);
    } catch (err) {
      console.error('[Telegram] Failed to post:', err);
    }
  }
}
