import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateOrganizationDto {
  @ApiProperty({ description: 'Organization name', example: 'GreenFuture Foundation' })
  @IsString()
  name!: string;

  @ApiProperty({ description: 'Primary focus area', example: 'Rural Education' })
  @IsString()
  focus!: string;

  @ApiProperty({ description: 'Contact email', example: 'info@greenfuture.org' })
  @IsString()
  email!: string;

  @ApiProperty({ description: 'Contact phone', example: '+91 98123 45678' })
  @IsString()
  phone!: string;

  @ApiProperty({ description: 'City of operation', example: 'Bengaluru' })
  @IsString()
  city!: string;

  @ApiPropertyOptional({ description: 'Organization status', example: 'active' })
  @IsOptional()
  @IsString()
  status?: string;
}
