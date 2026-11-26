import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional, IsBoolean, IsInt } from 'class-validator';

export class RespondAssignmentDto {
  @IsOptional() @IsInt() version?:number;
  @IsOptional() @IsBoolean() attendanceConfirmed?:boolean;
  @ApiProperty({ enum: ['accepted', 'declined'] })
  @IsIn(['accepted', 'declined'])
  action!: 'accepted' | 'declined';
}
