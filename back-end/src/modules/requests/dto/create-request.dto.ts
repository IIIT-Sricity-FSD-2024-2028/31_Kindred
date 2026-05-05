import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateRequestDto {
  @ApiProperty({ description: 'Organization name', example: 'PathFinders NGO' })
  @IsString()
  org!: string;

  @ApiProperty({ description: 'Type of request', example: 'Organization Registration' })
  @IsString()
  type!: string;

  @ApiProperty({ description: 'Detailed description', example: 'New NGO registration for youth empowerment programs in rural Tamil Nadu' })
  @IsString()
  description!: string;

  @ApiPropertyOptional({ description: 'Priority level', example: 'high' })
  @IsOptional()
  @IsString()
  priority?: string;

  @ApiPropertyOptional({ description: 'Contact email', example: 'admin@pathfinders.org' })
  @IsOptional()
  @IsString()
  contact?: string;

  @ApiPropertyOptional({ description: 'Contact phone', example: '9876543210' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: 'City', example: 'Chennai' })
  @IsOptional()
  @IsString()
  city?: string;
}
