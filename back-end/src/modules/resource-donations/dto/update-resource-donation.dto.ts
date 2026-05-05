import { PartialType } from '@nestjs/swagger';
import { CreateResourceDonationDto } from './create-resource-donation.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateResourceDonationDto extends PartialType(CreateResourceDonationDto) {
  @ApiPropertyOptional({ example: 'pending_pickup' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ example: 'volunteer@kindred.org' })
  @IsOptional()
  @IsString()
  assignedVolunteerEmail?: string;

  @ApiPropertyOptional({ example: 'Priya Singh' })
  @IsOptional()
  @IsString()
  assignedVolunteerName?: string;

  @ApiPropertyOptional({ example: 'Notes about delivery' })
  @IsOptional()
  @IsString()
  notes?: string;
}
