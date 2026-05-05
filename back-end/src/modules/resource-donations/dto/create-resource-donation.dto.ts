import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class DonationItemDto {
  @ApiProperty({ description: 'Item name', example: 'Rice Bags (25kg)' })
  @IsString()
  name!: string;

  @ApiProperty({ description: 'Quantity', example: 10 })
  quantity!: number;

  @ApiProperty({ description: 'Condition of items', example: 'New' })
  @IsString()
  condition!: string;
}

export class CreateResourceDonationDto {
  @ApiProperty({ description: 'Donor full name', example: 'Vikram Malhotra' })
  @IsString()
  donorName!: string;

  @ApiProperty({ description: 'Donor email', example: 'vikram.malhotra@gmail.com' })
  @IsString()
  donorEmail!: string;

  @ApiProperty({ description: 'Donor phone', example: '9812345678' })
  @IsString()
  donorPhone!: string;

  @ApiProperty({ description: 'Category of donation', example: 'Food & Essentials' })
  @IsString()
  category!: string;

  @ApiProperty({ description: 'List of donated items', type: [DonationItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DonationItemDto)
  items!: DonationItemDto[];

  @ApiProperty({ description: 'Brief description', example: 'Bulk food supplies for flood relief camps in Bihar' })
  @IsString()
  description!: string;

  @ApiProperty({ description: 'Pickup address', example: '42, MG Road, Sector 18, Noida, UP' })
  @IsString()
  pickupAddress!: string;

  @ApiProperty({ description: 'Pickup date (YYYY-MM-DD)', example: '2025-05-10' })
  @IsString()
  pickupDate!: string;

  @ApiProperty({ description: 'Preferred time slot', example: 'Morning (9AM-12PM)' })
  @IsString()
  pickupTimeSlot!: string;

  @ApiPropertyOptional({ description: 'Target program ID', example: 'prog_001' })
  @IsOptional()
  @IsString()
  programId?: string;

  @ApiPropertyOptional({ description: 'Target program name', example: 'Cyclone Relief Fund' })
  @IsOptional()
  @IsString()
  programName?: string;
}
