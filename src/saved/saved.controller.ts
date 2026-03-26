import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { SavedService } from './saved.service';
import { ToggleSaveDto } from './dto/toggle-save.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('saved')
export class SavedController {
  constructor(private savedService: SavedService) {}

  @Get()
  findAll(@CurrentUser('_id') userId: string) {
    return this.savedService.findByUser(userId);
  }

  @Post()
  toggle(
    @CurrentUser('_id') userId: string,
    @Body() dto: ToggleSaveDto,
  ) {
    return this.savedService.toggle(userId, dto.listingId);
  }

  @Get(':listingId')
  checkSaved(
    @CurrentUser('_id') userId: string,
    @Param('listingId') listingId: string,
  ) {
    return this.savedService.checkSaved(userId, listingId);
  }
}
