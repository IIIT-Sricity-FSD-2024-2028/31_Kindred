import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString, MaxLength, IsArray, IsIn } from 'class-validator';

export class UpdatePresenceDto {
  @IsOptional() @IsString() availableFrom?: string;
  @IsOptional() @IsString() availableUntil?: string;
  @IsOptional() @IsArray() @IsIn(['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],{each:true}) availabilityDays?: string[];
  @IsOptional() @Transform(({obj}) => obj.willingToTravel) @IsBoolean() willingToTravel?: boolean;
  @IsOptional() @IsString() @MaxLength(200) serviceAreas?: string;
  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ obj }) => obj.availableNow)
  @IsBoolean()
  availableNow?: boolean;

  @ApiPropertyOptional({ example: 'Andheri East, Mumbai' })
  @IsOptional()
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  @IsString()
  @MaxLength(200)
  currentLocation?: string;
}
