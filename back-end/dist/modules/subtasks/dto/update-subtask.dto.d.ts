import { CreateSubtaskDto } from './create-subtask.dto';
declare const UpdateSubtaskDto_base: import("@nestjs/common").Type<Partial<CreateSubtaskDto>>;
export declare class UpdateSubtaskDto extends UpdateSubtaskDto_base {
    status?: string;
    progress?: number;
}
export {};
