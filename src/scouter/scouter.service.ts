import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ScoutedSource, ScoutedSourceDocument } from './schemas/scouted-source.schema';
import { ScoutedResult, ScoutedResultDocument } from './schemas/scouted-result.schema';
import { ScouterRun, ScouterRunDocument } from './schemas/scouter-run.schema';
import { Listing, ListingDocument, ListingStatus, ListingSource } from '../listings/schemas/listing.schema';
import { ScouterAiService, ExtractedOpportunity } from './scouter-ai.service';
import { ScouterScraperService } from './scouter-scraper.service';

const AUTO_APPROVE_CONFIDENCE = 75;

export interface ScoutResult {
  sourceId: string;
  sourceName: string;
  found: number;
  added: number;
  autoApproved: number;
  skippedDuplicates: number;
  errors: string[];
}

@Injectable()
export class ScouterService {
  constructor(
    @InjectModel(ScoutedSource.name) private sourceModel: Model<ScoutedSourceDocument>,
    @InjectModel(ScoutedResult.name) private resultModel: Model<ScoutedResultDocument>,
    @InjectModel(ScouterRun.name) private runModel: Model<ScouterRunDocument>,
    @InjectModel(Listing.name) private listingModel: Model<ListingDocument>,
    private aiService: ScouterAiService,
    private scraperService: ScouterScraperService,
  ) {}

  // --- Sources CRUD ---
  async getSources() {
    return this.sourceModel.find().sort({ createdAt: -1 });
  }

  async createSource(data: { name: string; url: string; description?: string }) {
    return this.sourceModel.create(data);
  }

  // --- Results ---
  async getResults(pending?: boolean) {
    const filter: any = {};
    if (pending) {
      filter.isApproved = false;
      filter.isRejected = false;
    }
    return this.resultModel.find(filter).populate('sourceId').sort({ createdAt: -1 });
  }

  async approveResult(id: string, approve: boolean) {
    const result = await this.resultModel.findById(id);
    if (!result) throw new Error('Result not found');

    if (approve) {
      result.isApproved = true;
      // Create a listing from this result
      const slug = this.slugify(result.title);
      const existing = await this.listingModel.findOne({ slug });
      const finalSlug = existing ? `${slug}-${Date.now().toString(36)}` : slug;

      const rawData = result.rawData || {};
      const listing = await this.listingModel.create({
        title: result.title,
        slug: finalSlug,
        description: result.description || '',
        type: rawData.type || 'OTHER',
        status: ListingStatus.PUBLISHED,
        source: ListingSource.AI_SCOUTED,
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
      result.listingId = listing._id as Types.ObjectId;
    } else {
      result.isRejected = true;
    }

    await result.save();
    return result;
  }

  // --- Runs ---
  async getRuns() {
    return this.runModel.find().sort({ startedAt: -1 }).limit(50);
  }

  // --- Scouting Logic ---
  async scoutSource(sourceId: string): Promise<ScoutResult> {
    const source = await this.sourceModel.findById(sourceId);
    if (!source) {
      return {
        sourceId,
        sourceName: 'Unknown',
        found: 0, added: 0, autoApproved: 0, skippedDuplicates: 0,
        errors: ['Source not found'],
      };
    }

    const result: ScoutResult = {
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
      const opportunities = await this.aiService.extractOpportunities(
        content, source.url, source.name,
      );
      result.found = opportunities.length;

      // Get existing titles for dedup
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
          if (autoApproved) result.autoApproved++;
          allExistingTitles.push(opp.title);
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'Unknown error';
          if (!msg.includes('duplicate key')) {
            result.errors.push(`Failed to store "${opp.title}": ${msg}`);
          }
        }
      }

      await this.sourceModel.findByIdAndUpdate(source._id, { lastScraped: new Date() });
      console.log(`[Scouter] ${source.name}: added ${result.added}, auto-approved ${result.autoApproved}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      result.errors.push(`Scraping failed: ${msg}`);
      console.error(`[Scouter] Error scraping ${source.name}:`, msg);
    }

    return result;
  }

  async scoutAllSources(): Promise<{ results: ScoutResult[]; runId: string }> {
    const run = await this.runModel.create({ type: 'scheduled', status: 'running' });
    const sources = await this.sourceModel.find({ isActive: true });

    const results: ScoutResult[] = [];
    let totalFound = 0, totalAdded = 0, totalAutoApproved = 0;
    const allErrors: string[] = [];

    console.log(`[Scouter] Starting run: ${sources.length} sources`);

    for (const source of sources) {
      const result = await this.scoutSource(source._id.toString());
      results.push(result);
      totalFound += result.found;
      totalAdded += result.added;
      totalAutoApproved += result.autoApproved;
      allErrors.push(...result.errors);

      // Delay between sources
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

  async runAutoDiscovery(): Promise<{ newSourcesAdded: number; runId: string }> {
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
    const errors: string[] = [];

    try {
      const suggestions = await this.aiService.discoverSources(topic);
      const existingUrls = new Set(
        (await this.sourceModel.find({}, { url: 1 })).map((s) => s.url),
      );

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
          } catch (err) {
            const msg = err instanceof Error ? err.message : '';
            if (!msg.includes('duplicate key')) {
              errors.push(`Failed to add source ${suggestion.name}: ${msg}`);
            }
          }
        }
      }
    } catch (err) {
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

  async cleanupExpiredListings(): Promise<number> {
    const result = await this.listingModel.updateMany(
      { deadline: { $lt: new Date() }, status: ListingStatus.PUBLISHED },
      { status: ListingStatus.CLOSED },
    );
    if (result.modifiedCount > 0) {
      console.log(`[Scouter] Closed ${result.modifiedCount} expired listings`);
    }
    return result.modifiedCount;
  }

  private async storeOpportunity(
    opp: ExtractedOpportunity,
    sourceId: string,
    sourceUrl: string,
  ): Promise<{ autoApproved: boolean }> {
    const confidence = opp.confidence || 0;
    const shouldAutoApprove =
      confidence >= AUTO_APPROVE_CONFIDENCE &&
      opp.title.length > 10 &&
      opp.description.length > 30;

    await this.resultModel.create({
      title: opp.title,
      description: opp.description,
      url: opp.applyUrl || sourceUrl,
      rawData: JSON.parse(JSON.stringify(opp)),
      sourceId: new Types.ObjectId(sourceId),
      isApproved: shouldAutoApprove,
    });

    let slug = this.slugify(opp.title);
    const existing = await this.listingModel.findOne({ slug });
    if (existing) slug = `${slug}-${Date.now().toString(36)}`;

    await this.listingModel.create({
      title: opp.title,
      slug,
      description: opp.description,
      type: opp.type || 'OTHER',
      status: shouldAutoApprove ? ListingStatus.PUBLISHED : ListingStatus.DRAFT,
      source: ListingSource.AI_SCOUTED,
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

    return { autoApproved: shouldAutoApprove };
  }

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
}
