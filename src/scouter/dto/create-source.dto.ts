import { IsString, IsUrl, IsOptional } from 'class-validator';

export class CreateSourceDto {
  @IsString()
  name: string;

  @IsUrl()
  url: string;

  @IsOptional()
  @IsString()
  description?: string;
}
