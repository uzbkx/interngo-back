import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { ListingsModule } from '../listings/listings.module';

@Module({
  imports: [ListingsModule],
  controllers: [AdminController],
})
export class AdminModule {}
