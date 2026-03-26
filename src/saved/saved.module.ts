import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SavedListing, SavedListingSchema } from './schemas/saved-listing.schema';
import { SavedService } from './saved.service';
import { SavedController } from './saved.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: SavedListing.name, schema: SavedListingSchema }]),
  ],
  providers: [SavedService],
  controllers: [SavedController],
})
export class SavedModule {}
