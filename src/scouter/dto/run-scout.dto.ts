import { IsOptional, IsString } from 'class-validator';

export class RunScoutDto {
  @IsOptional()
  @IsString()
  sourceId?: string;

  @IsOptional()
  @IsString()
  action?: string; // 'discover' | 'cleanup'
}
