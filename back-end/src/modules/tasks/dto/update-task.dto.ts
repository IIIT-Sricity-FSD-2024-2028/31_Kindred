import { PartialType } from '@nestjs/swagger';
import { CreateTaskDto } from './create-task.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @ApiPropertyOptional({ example: 'in-progress', description: 'Task status: pending | in-progress | pending_review | completed | cancelled' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ example: 'Completed 50% of distribution', description: 'Progress notes from volunteer' })
  @IsOptional()
  @IsString()
  notes?: string;
}
