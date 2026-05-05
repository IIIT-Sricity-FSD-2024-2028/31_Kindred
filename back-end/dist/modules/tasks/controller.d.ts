import { TasksService } from './service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
export declare class TasksController {
    private readonly service;
    constructor(service: TasksService);
    findAll(): {
        success: boolean;
        data: import("./entities/task.entity").Task[];
        message: string;
    };
    findByVolunteer(email: string): {
        success: boolean;
        data: import("./entities/task.entity").Task[];
        message: string;
    };
    findOne(id: string): {
        success: boolean;
        data: import("./entities/task.entity").Task;
        message: string;
    };
    create(dto: CreateTaskDto): {
        success: boolean;
        data: import("./entities/task.entity").Task;
        message: string;
    };
    update(id: string, dto: UpdateTaskDto): {
        success: boolean;
        data: import("./entities/task.entity").Task;
        message: string;
    };
    remove(id: string): {
        success: boolean;
        data: null;
        message: string;
    };
}
