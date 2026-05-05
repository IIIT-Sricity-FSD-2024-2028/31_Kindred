import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray } from 'class-validator';

export class CreateVolunteerDto {
  @ApiProperty({ description: 'Full name of the volunteer', example: 'Neha Kapoor' })
  @IsString()
  name!: string;

  @ApiProperty({ description: 'Email address', example: 'neha.kapoor@gmail.com' })
  @IsString()
  email!: string;

  @ApiProperty({ description: 'Phone number', example: '+91 87654 32109' })
  @IsString()
  phone!: string;

  @ApiProperty({ description: 'Role within the organization', example: 'Field Coordinator' })
  @IsString()
  role!: string;

  @ApiProperty({ description: 'Assigned organization', example: 'HopeConnect' })
  @IsString()
  org!: string;

  @ApiPropertyOptional({ description: 'List of skills', example: ['Medical Aid', 'Community Outreach', 'Data Entry'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];
}
