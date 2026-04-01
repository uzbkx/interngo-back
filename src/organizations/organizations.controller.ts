import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
} from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('organizations')
export class OrganizationsController {
  constructor(private orgsService: OrganizationsService) {}

  @Get('mine')
  async getMyOrg(@CurrentUser('_id') userId: string) {
    const org = await this.orgsService.findByOwner(userId);
    return { organization: org || null };
  }

  @Post()
  async create(
    @CurrentUser('_id') userId: string,
    @Body() dto: CreateOrganizationDto,
  ) {
    const org = await this.orgsService.create(userId, dto);
    return { organization: org };
  }

  @Patch('mine')
  async update(
    @CurrentUser('_id') userId: string,
    @Body() dto: Partial<CreateOrganizationDto>,
  ) {
    const org = await this.orgsService.update(userId, dto);
    return { organization: org };
  }
}
