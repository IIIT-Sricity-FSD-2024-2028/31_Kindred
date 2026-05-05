import { PartialType } from '@nestjs/swagger';
import { CreateVolunteerDto } from './create-volunteer.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateVolunteerDto extends PartialType(CreateVolunteerDto) {
  @ApiPropertyOptional({ example: 'active' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ example: 120 })
  @IsOptional()
  @IsNumber()
  hours?: number;
}
