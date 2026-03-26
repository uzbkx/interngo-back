import { IsString } from 'class-validator';

export class DiscoverSourcesDto {
  @IsString()
  topic: string;
}
