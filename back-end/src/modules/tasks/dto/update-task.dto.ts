import { PartialType } from '@nestjs/swagger';
import { CreateTaskDto } from './create-task.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @ApiPropertyOptional({ example: 'in-progress' })
  @IsOptional()
  @IsString()
  status?: string;
}
