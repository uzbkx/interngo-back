import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Listing, ListingSchema } from './schemas/listing.schema';
import { Category, CategorySchema } from './schemas/category.schema';
import { ListingsService } from './listings.service';
import { ListingsModeratorService } from './listings-moderator.service';
import { ListingsController } from './listings.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Listing.name, schema: ListingSchema },
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
  providers: [ListingsService, ListingsModeratorService],
  controllers: [ListingsController],
  exports: [ListingsService, MongooseModule],
})
export class ListingsModule {}
