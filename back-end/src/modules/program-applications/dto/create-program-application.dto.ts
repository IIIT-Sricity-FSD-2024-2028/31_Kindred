import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateProgramApplicationDto {
  @ApiProperty({ description: 'Program ID to apply for', example: 'prog_002' })
  @IsString()
  programId!: string;

  @ApiProperty({ description: 'Program name', example: 'Rural Literacy Drive 2025' })
  @IsString()
  programName!: string;

  @ApiProperty({ description: 'Applicant volunteer email', example: 'neha.kapoor@gmail.com' })
  @IsString()
  volunteerEmail!: string;

  @ApiProperty({ description: 'Applicant volunteer name', example: 'Neha Kapoor' })
  @IsString()
  volunteerName!: string;

  @ApiPropertyOptional({ description: 'Cover message from volunteer', example: 'I have 3 years of teaching experience in rural schools and would love to contribute to this program.' })
  @IsOptional()
  @IsString()
  message?: string;
}
