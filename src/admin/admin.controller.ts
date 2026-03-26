import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ListingsService } from '../listings/listings.service';
import { AdminOrSecretGuard } from '../common/guards/admin-or-secret.guard';

@Controller('admin')
@UseGuards(AdminOrSecretGuard)
export class AdminController {
  constructor(private listingsService: ListingsService) {}

  @Get('listings')
  findByStatus(@Query('status') status: string) {
    return this.listingsService.findByStatus(status || 'DRAFT');
  }
}
