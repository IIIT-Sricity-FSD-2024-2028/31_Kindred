import { PartialType } from '@nestjs/swagger';
import { CreateHourLogDto } from './create-hour-log.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateHourLogDto extends PartialType(CreateHourLogDto) {
  @ApiPropertyOptional({ example: 'approved' })
  @IsOptional()
  @IsString()
  status?: string;
}
