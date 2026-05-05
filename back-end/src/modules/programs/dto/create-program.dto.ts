import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsBoolean, IsArray } from 'class-validator';

export class CreateProgramDto {
  @ApiProperty({ description: 'Program name', example: 'Rural Literacy Drive 2025' })
  @IsString()
  name!: string;

  @ApiProperty({ description: 'Organizing NGO', example: 'GreenFuture Foundation' })
  @IsString()
  org!: string;

  @ApiProperty({ description: 'Focus area', example: 'Education' })
  @IsString()
  focus!: string;

  @ApiProperty({ description: 'Start date (YYYY-MM-DD)', example: '2025-02-01' })
  @IsString()
  startDate!: string;

  @ApiProperty({ description: 'End date (YYYY-MM-DD)', example: '2025-08-31' })
  @IsString()
  endDate!: string;

  @ApiProperty({ description: 'Total budget in INR', example: 850000 })
  @IsNumber()
  budget!: number;

  @ApiProperty({ description: 'Detailed description of the program', example: 'Providing free education materials and tutoring to 500 children in remote villages of Jharkhand' })
  @IsString()
  description!: string;

  @ApiPropertyOptional({ description: 'Skills needed from volunteers', example: ['Teaching', 'Hindi Translation', 'Logistics'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  requiredSkills?: string[];

  @ApiPropertyOptional({ description: 'Target number of volunteers', example: 80 })
  @IsOptional()
  @IsNumber()
  volunteerGoal?: number;

  @ApiPropertyOptional({ description: 'Whether volunteers can apply', example: true })
  @IsOptional()
  @IsBoolean()
  openForApplications?: boolean;

  @ApiPropertyOptional({ description: 'Geographic location', example: 'Ranchi, Jharkhand' })
  @IsOptional()
  @IsString()
  location?: string;
}
