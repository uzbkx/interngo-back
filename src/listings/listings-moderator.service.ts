import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import Groq from 'groq-sdk';
import { Listing, ListingDocument, ListingStatus } from './schemas/listing.schema';

export interface ModerationResult {
  approved: boolean;
  reason: string;
  confidence: number;
  flags: string[];
}

@Injectable()
export class ListingsModeratorService {
  private groq: Groq;

  constructor(
    @InjectModel(Listing.name) private listingModel: Model<ListingDocument>,
    private configService: ConfigService,
  ) {
    this.groq = new Groq({
      apiKey: this.configService.get<string>('GROQ_API_KEY'),
    });
  }

  async moderateListing(listingId: string): Promise<ModerationResult> {
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

      const result: ModerationResult = JSON.parse(jsonMatch[0]);

      // If flagged, unpublish and notify
      if (!result.approved) {
        await this.listingModel.findByIdAndUpdate(listingId, {
          status: ListingStatus.DRAFT,
        });
        console.log(`[Moderator] Flagged listing "${listing.title}": ${result.reason}`);
        console.log(`[Moderator] Flags: ${result.flags.join(', ')}`);
      } else {
        console.log(`[Moderator] Approved listing "${listing.title}" (confidence: ${result.confidence}%)`);
      }

      return result;
    } catch (error) {
      console.error('[Moderator] AI moderation failed:', error);
      // If AI fails, keep it published — fail open
      return { approved: true, reason: 'AI moderation unavailable', confidence: 0, flags: [] };
    }
  }
}
