import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ListingsService } from './listings.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { QueryListingsDto } from './dto/query-listings.dto';
import { Public } from '../common/decorators/public.decorator';
import { AdminOrSecretGuard } from '../common/guards/admin-or-secret.guard';
import { ParseObjectIdPipe } from '../common/pipes/parse-object-id.pipe';
import { ListingsModeratorService } from './listings-moderator.service';
import { ListingsTelegramService } from './listings-telegram.service';

@Controller('listings')
export class ListingsController {
  constructor(
    private listingsService: ListingsService,
    private moderatorService: ListingsModeratorService,
    private telegramService: ListingsTelegramService,
  ) {}

  @Public()
  @Get()
  async findAll(@Query() query: QueryListingsDto, @Res() res: Response) {
    const data = await this.listingsService.findPublished(query);
    res.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    res.json(data);
  }

  @Public()
  @Get(':slug')
  async findBySlug(@Param('slug') slug: string, @Res() res: Response) {
    const data = await this.listingsService.findBySlug(slug);
    res.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    res.json(data);
  }

  @Public()
  @Get('archive')
  async findArchived(@Query() query: QueryListingsDto, @Res() res: Response) {
    const data = await this.listingsService.findArchived(query);
    res.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    res.json(data);
  }

  @Post()
  async create(@Body() dto: CreateListingDto) {
    const listing = await this.listingsService.create(dto);

    // AI moderation runs in background
    this.moderatorService.moderateListing((listing as any)._id.toString()).catch((err) => {
      console.error('[Moderator] Background moderation failed:', err);
    });

    // Post to Telegram channel
    this.telegramService.postListing(listing as any).catch((err) => {
      console.error('[Telegram] Background post failed:', err);
    });

    return listing;
  }

  @UseGuards(AdminOrSecretGuard)
  @Patch(':id')
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dto: UpdateListingDto,
  ) {
    return this.listingsService.update(id, dto);
  }

  @UseGuards(AdminOrSecretGuard)
  @Patch(':id/approve')
  approve(@Param('id', ParseObjectIdPipe) id: string) {
    return this.listingsService.approve(id);
  }

  @UseGuards(AdminOrSecretGuard)
  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.listingsService.remove(id);
  }
}
