import { CreateTaskDto } from './create-task.dto';
declare const UpdateTaskDto_base: import("@nestjs/common").Type<Partial<CreateTaskDto>>;
export declare class UpdateTaskDto extends UpdateTaskDto_base {
    status?: string;
}
export {};
