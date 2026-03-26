import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApplicationStatus } from '../schemas/application.schema';

export class CreateApplicationDto {
  @IsString()
  listingId: string;

  @IsOptional()
  @IsEnum(ApplicationStatus)
  status?: ApplicationStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}
