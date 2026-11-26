import { IsEmail, IsInt, IsOptional, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';
export class ProgramMessageDto {
  @IsString() @MinLength(1) @MaxLength(2000) message!: string;
  @IsOptional() @IsEmail() recipientEmail?: string;
}
export class ProgramRatingDto {
  @IsEmail() volunteerEmail!: string;
  @IsInt() @Min(1) @Max(5) score!: number;
  @IsOptional() @IsString() @MaxLength(1000) feedback?: string;
}
