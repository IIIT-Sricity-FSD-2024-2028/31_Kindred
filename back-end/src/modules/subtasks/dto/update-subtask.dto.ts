import { PartialType } from '@nestjs/swagger';
import { CreateSubtaskDto } from './create-subtask.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateSubtaskDto extends PartialType(CreateSubtaskDto) {
  @ApiPropertyOptional({ example: 'in-progress' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ example: 65 })
  @IsOptional()
  @IsNumber()
  progress?: number;
}
