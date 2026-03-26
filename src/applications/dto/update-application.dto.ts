import { IsOptional, IsEnum, IsString } from 'class-validator';
import { ApplicationStatus } from '../schemas/application.schema';

export class UpdateApplicationDto {
  @IsOptional()
  @IsEnum(ApplicationStatus)
  status?: ApplicationStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}
