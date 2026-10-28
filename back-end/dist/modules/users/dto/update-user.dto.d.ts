import { CreateUserDto } from './create-user.dto';
declare const UpdateUserDto_base: import("@nestjs/common").Type<Partial<Omit<CreateUserDto, "verificationToken" | "verificationReference" | "securityQuestion1" | "securityAnswer1" | "securityQuestion2" | "securityAnswer2">>>;
export declare class UpdateUserDto extends UpdateUserDto_base {
}
export {};
