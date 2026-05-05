import { SubtasksService } from './service';
import { CreateSubtaskDto } from './dto/create-subtask.dto';
import { UpdateSubtaskDto } from './dto/update-subtask.dto';
export declare class SubtasksController {
    private readonly service;
    constructor(service: SubtasksService);
    findAll(): {
        success: boolean;
        data: import("./entities/subtask.entity").Subtask[];
        message: string;
    };
    findByProgram(programId: string): {
        success: boolean;
        data: import("./entities/subtask.entity").Subtask[];
        message: string;
    };
    findByVolunteer(email: string): {
        success: boolean;
        data: import("./entities/subtask.entity").Subtask[];
        message: string;
    };
    findByProgramAndVolunteer(programId: string, email: string): {
        success: boolean;
        data: import("./entities/subtask.entity").Subtask[];
        message: string;
    };
    getProgramProgress(programId: string): {
        success: boolean;
        data: number;
        message: string;
    };
    findOne(id: string): {
        success: boolean;
        data: import("./entities/subtask.entity").Subtask;
        message: string;
    };
    create(dto: CreateSubtaskDto): {
        success: boolean;
        data: import("./entities/subtask.entity").Subtask;
        message: string;
    };
    update(id: string, dto: UpdateSubtaskDto): {
        success: boolean;
        data: import("./entities/subtask.entity").Subtask;
        message: string;
    };
    remove(id: string): {
        success: boolean;
        data: null;
        message: string;
    };
}
