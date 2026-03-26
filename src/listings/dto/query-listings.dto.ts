import { IsOptional, IsString, IsNumberString, IsEnum } from 'class-validator';
import { ListingType } from '../schemas/listing.schema';

export class QueryListingsDto {
  @IsOptional()
  @IsEnum(ListingType)
  type?: ListingType;

  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;
}
