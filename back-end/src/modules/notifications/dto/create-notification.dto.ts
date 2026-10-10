import { IsBoolean, IsOptional, IsString } from 'class-validator';
export class CreateNotificationDto {
 @IsOptional() @IsString() targetEmail?: string;
 @IsOptional() @IsString() targetRole?: string;
 @IsOptional() @IsString() targetOrg?: string;
 @IsString() title!: string;
 @IsString() message!: string;
 @IsOptional() @IsString() type?: string;
 @IsOptional() @IsString() link?: string;
 @IsOptional() @IsBoolean() read?: boolean;
}
