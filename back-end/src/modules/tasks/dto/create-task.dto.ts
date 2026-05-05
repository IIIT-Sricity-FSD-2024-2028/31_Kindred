import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({ description: 'Task title', example: 'Distribute relief kits at Zone B' })
  @IsString()
  title!: string;

  @ApiPropertyOptional({ description: 'Detailed description', example: 'Deliver 100 food and hygiene kits to families in the flood-affected Zone B area' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Email of the assigned volunteer', example: 'neha.kapoor@gmail.com' })
  @IsString()
  assignedToEmail!: string;

  @ApiPropertyOptional({ description: 'Name of the assigned volunteer', example: 'Neha Kapoor' })
  @IsOptional()
  @IsString()
  assignedToName?: string;

  @ApiPropertyOptional({ description: 'Priority level (low, medium, high)', example: 'high' })
  @IsOptional()
  @IsString()
  priority?: string;

  @ApiPropertyOptional({ description: 'Due date (YYYY-MM-DD)', example: '2025-06-15' })
  @IsOptional()
  @IsString()
  dueDate?: string;

  @ApiPropertyOptional({ description: 'Associated program ID', example: 'prog_001' })
  @IsOptional()
  @IsString()
  programId?: string;

  @ApiPropertyOptional({ description: 'Associated program name', example: 'Cyclone Relief Fund' })
  @IsOptional()
  @IsString()
  programName?: string;
}
