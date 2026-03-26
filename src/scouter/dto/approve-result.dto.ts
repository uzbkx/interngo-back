import { IsBoolean } from 'class-validator';

export class ApproveResultDto {
  @IsBoolean()
  approve: boolean;
}
