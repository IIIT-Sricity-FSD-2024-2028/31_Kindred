import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, Min, Max } from 'class-validator';

export class CreateSubtaskDto {
  @ApiPropertyOptional({ description: 'Client-provided ID for synchronized dashboard records' })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({ description: 'Parent program ID', example: 'prog_001' })
  @IsString()
  programId!: string;

  @ApiProperty({ description: 'Subtask title', example: 'Set up emergency medical camp' })
  @IsString()
  title!: string;

  @ApiPropertyOptional({ description: 'Detailed description', example: 'Coordinate with local hospitals to set up a 3-day medical camp for 200 beneficiaries' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Email of assigned volunteer', example: 'neha.kapoor@gmail.com' })
  @IsString()
  assignedToEmail!: string;

  @ApiPropertyOptional({ description: 'Initial status', example: 'pending' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ description: 'Initial progress 0-100', example: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  progress?: number;

  @ApiPropertyOptional({ description: 'Name of assigned volunteer', example: 'Neha Kapoor' })
  @IsOptional()
  @IsString()
  assignedToName?: string;
}
