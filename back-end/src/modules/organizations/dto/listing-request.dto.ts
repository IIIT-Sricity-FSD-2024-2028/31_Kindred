import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class ListingRequestDto {
  @ApiProperty() @IsString() @IsNotEmpty() bankAccountName!: string;
  @ApiProperty() @Matches(/^\d{9,18}$/) bankAccountNumber!: string;
  @ApiProperty() @Matches(/^[A-Z]{4}0[A-Z0-9]{6}$/) bankIfsc!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() image?: string;
}
