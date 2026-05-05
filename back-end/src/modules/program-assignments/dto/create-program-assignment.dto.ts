import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateProgramAssignmentDto {
  @ApiProperty({ description: 'Program ID', example: 'prog_001' })
  @IsString()
  programId!: string;

  @ApiProperty({ description: 'Program name', example: 'Cyclone Relief Fund' })
  @IsString()
  programName!: string;

  @ApiProperty({ description: 'Volunteer email', example: 'neha.kapoor@gmail.com' })
  @IsString()
  volunteerEmail!: string;

  @ApiProperty({ description: 'Volunteer name', example: 'Neha Kapoor' })
  @IsString()
  volunteerName!: string;

  @ApiPropertyOptional({ description: 'Role in the program', example: 'Field Coordinator' })
  @IsOptional()
  @IsString()
  role?: string;
}
