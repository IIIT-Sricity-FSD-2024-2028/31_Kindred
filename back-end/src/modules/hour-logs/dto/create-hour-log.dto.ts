import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateHourLogDto {
  @ApiProperty({ description: 'Email of the volunteer', example: 'neha.kapoor@gmail.com' })
  @IsString()
  volunteerEmail!: string;

  @ApiPropertyOptional({ description: 'Name of the volunteer', example: 'Neha Kapoor' })
  @IsOptional()
  @IsString()
  volunteerName?: string;

  @ApiProperty({ description: 'Number of hours worked', example: 6 })
  @IsNumber()
  hours!: number;

  @ApiPropertyOptional({ description: 'Date of the work (YYYY-MM-DD)', example: '2025-05-01' })
  @IsOptional()
  @IsString()
  date?: string;

  @ApiPropertyOptional({ description: 'Description of work performed', example: 'Conducted health checkup camp for 120 beneficiaries in Zone C' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Associated program ID', example: 'prog_002' })
  @IsOptional()
  @IsString()
  programId?: string;

  @ApiPropertyOptional({ description: 'Associated program name', example: 'Rural Literacy Drive 2025' })
  @IsOptional()
  @IsString()
  programName?: string;
}
