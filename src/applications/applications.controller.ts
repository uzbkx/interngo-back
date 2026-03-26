import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ParseObjectIdPipe } from '../common/pipes/parse-object-id.pipe';

@Controller('applications')
export class ApplicationsController {
  constructor(private applicationsService: ApplicationsService) {}

  @Get()
  findAll(@CurrentUser('_id') userId: string) {
    return this.applicationsService.findByUser(userId);
  }

  @Post()
  create(
    @CurrentUser('_id') userId: string,
    @Body() dto: CreateApplicationDto,
  ) {
    return this.applicationsService.upsert(userId, dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @CurrentUser('_id') userId: string,
    @Body() dto: UpdateApplicationDto,
  ) {
    return this.applicationsService.update(id, userId, dto);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseObjectIdPipe) id: string,
    @CurrentUser('_id') userId: string,
  ) {
    return this.applicationsService.remove(id, userId);
  }
}
