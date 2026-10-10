import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsArray, IsInt, Min, IsOptional } from 'class-validator';

export class CreateVolunteerRequestDto {
  @ApiProperty({ description: 'Title of the request' })
  @IsString()
  title!: string;

  @ApiProperty({ description: 'Description of the request' })
  @IsString()
  description!: string;

  @ApiProperty({ description: 'Location' })
  @IsString()
  location!: string;

  @ApiProperty({ description: 'Date of the event' })
  @IsString()
  date!: string;

  @ApiPropertyOptional({ description: 'Start time' })
  @IsOptional()
  @IsString()
  startTime?: string;

  @ApiPropertyOptional({ description: 'End time' })
  @IsOptional()
  @IsString()
  endTime?: string;

  @ApiProperty({ description: 'Number of volunteers needed' })
  @IsInt()
  @Min(1)
  volunteersRequired!: number;

  @ApiProperty({ description: 'Required skills' })
  @IsArray()
  @IsString({ each: true })
  requiredSkills!: string[];

  @ApiPropertyOptional({ description: 'Program ID if linked' })
  @IsOptional()
  @IsString()
  programId?: string;

  @ApiPropertyOptional({ description: 'Program Name if linked' })
  @IsOptional()
  @IsString()
  programName?: string;

  @ApiProperty({ description: 'Organization ID creating the request' })
  @IsString()
  organizationId!: string;

  @ApiProperty({ description: 'Organization Name creating the request' })
  @IsString()
  organizationName!: string;
}
