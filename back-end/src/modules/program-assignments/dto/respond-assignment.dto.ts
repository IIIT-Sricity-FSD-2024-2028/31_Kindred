import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';

export class RespondAssignmentDto {
  @ApiProperty({ enum: ['accepted', 'declined'] })
  @IsIn(['accepted', 'declined'])
  action!: 'accepted' | 'declined';
}
