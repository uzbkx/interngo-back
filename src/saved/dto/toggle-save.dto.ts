import { IsString } from 'class-validator';

export class ToggleSaveDto {
  @IsString()
  listingId: string;
}
