import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Listing, ListingSchema } from './schemas/listing.schema';
import { Category, CategorySchema } from './schemas/category.schema';
import { ListingsService } from './listings.service';
import { ListingsController } from './listings.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Listing.name, schema: ListingSchema },
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
  providers: [ListingsService],
  controllers: [ListingsController],
  exports: [ListingsService, MongooseModule],
})
export class ListingsModule {}
