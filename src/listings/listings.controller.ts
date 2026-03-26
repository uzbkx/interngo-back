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
} from '@nestjs/common';
import { ListingsService } from './listings.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { QueryListingsDto } from './dto/query-listings.dto';
import { Public } from '../common/decorators/public.decorator';
import { AdminOrSecretGuard } from '../common/guards/admin-or-secret.guard';
import { ParseObjectIdPipe } from '../common/pipes/parse-object-id.pipe';

@Controller('listings')
export class ListingsController {
  constructor(private listingsService: ListingsService) {}

  @Public()
  @Get()
  findAll(@Query() query: QueryListingsDto) {
    return this.listingsService.findPublished(query);
  }

  @Public()
  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.listingsService.findBySlug(slug);
  }

  @Post()
  create(@Body() dto: CreateListingDto) {
    return this.listingsService.create(dto);
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
