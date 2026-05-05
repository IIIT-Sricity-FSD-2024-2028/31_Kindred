import { CreateProgramDto } from './create-program.dto';
declare const UpdateProgramDto_base: import("@nestjs/common").Type<Partial<CreateProgramDto>>;
export declare class UpdateProgramDto extends UpdateProgramDto_base {
    status?: string;
    raised?: number;
    beneficiaries?: number;
    volunteers?: number;
}
export {};
