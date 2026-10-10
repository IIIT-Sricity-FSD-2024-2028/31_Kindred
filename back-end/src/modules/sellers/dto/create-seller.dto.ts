import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional } from 'class-validator';

export class CreateSellerDto {
  @ApiProperty({ description: 'Full name of the seller', example: 'Ravi Kumar' })
  @IsString()
  name!: string;

  @ApiProperty({ description: 'Valid email address', example: 'ravi@shop.com' })
  @IsEmail()
  email!: string;

  @ApiPropertyOptional({ description: 'Phone number', example: '+91 98765 43210' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ description: 'Business or shop name', example: 'Ravi Handicrafts' })
  @IsString()
  businessName!: string;

  @ApiPropertyOptional({ description: 'Brief description of the business', example: 'Handmade crafts and traditional art' })
  @IsOptional()
  @IsString()
  businessDescription?: string;

  @ApiPropertyOptional({ description: 'Partner organization ID', example: 'org_001' })
  @IsOptional()
  @IsString()
  organizationId?: string;

  @ApiPropertyOptional({ description: 'Partner organization name', example: 'HopeConnect' })
  @IsOptional()
  @IsString()
  organizationName?: string;
}
