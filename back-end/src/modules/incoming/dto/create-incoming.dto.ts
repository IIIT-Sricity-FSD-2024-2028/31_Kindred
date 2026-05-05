import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateIncomingDto {
  @ApiProperty({ description: 'Name of the person submitting', example: 'Sunita Devi' })
  @IsString()
  name!: string;

  @ApiProperty({ description: 'Type of request (e.g. Medical Assistance, Emergency: Flood, Contact: General Enquiry)', example: 'Emergency: Flood Rescue' })
  @IsString()
  type!: string;

  @ApiProperty({ description: 'Detailed description of the request', example: 'Family of 5 stranded due to rising water levels in Patna east district. Need immediate rescue and temporary shelter.' })
  @IsString()
  desc!: string;

  @ApiPropertyOptional({ description: 'Urgency level (low, medium, high)', example: 'high' })
  @IsOptional()
  @IsString()
  urgency?: string;

  @ApiPropertyOptional({ description: 'Location or address', example: 'Kankarbagh, Patna, Bihar' })
  @IsOptional()
  @IsString()
  location?: string;
}
