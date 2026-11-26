import { Transform } from 'class-transformer';
import { IsArray, IsOptional, IsString, MaxLength, MinLength, Matches, ArrayMaxSize } from 'class-validator';

export class UpdateVolunteerProfileDto {
  @IsOptional() @Transform(({value}) => typeof value === 'string' ? value.trim() : value) @IsString() @MinLength(2) @MaxLength(100) name?: string;
  @IsOptional() @IsString() @MaxLength(30) phone?: string;
  @IsOptional() @IsString() @MaxLength(2000) bio?: string;
  @IsOptional() @Transform(({value}) => typeof value === 'string' ? value.trim() : value) @IsString() @MinLength(2) @MaxLength(200) location?: string;
  @IsOptional() @IsString() @Matches(/^\d{4}-\d{2}-\d{2}$/) dateOfBirth?: string;
  @IsOptional() @IsArray() @ArrayMaxSize(50) @IsString({each:true}) @MaxLength(100,{each:true}) skills?: string[];
}
