import { ProgramAssignmentsService } from './service';
import { CreateProgramAssignmentDto } from './dto/create-program-assignment.dto';
import { UpdateProgramAssignmentDto } from './dto/update-program-assignment.dto';
export declare class ProgramAssignmentsController {
    private readonly service;
    constructor(service: ProgramAssignmentsService);
    findAll(): {
        success: boolean;
        data: import("./entities/program-assignment.entity").ProgramAssignment[];
        message: string;
    };
    findByProgram(programId: string): {
        success: boolean;
        data: import("./entities/program-assignment.entity").ProgramAssignment[];
        message: string;
    };
    findByVolunteer(email: string): {
        success: boolean;
        data: import("./entities/program-assignment.entity").ProgramAssignment[];
        message: string;
    };
    findOne(id: string): {
        success: boolean;
        data: import("./entities/program-assignment.entity").ProgramAssignment;
        message: string;
    };
    create(dto: CreateProgramAssignmentDto): {
        success: boolean;
        data: import("./entities/program-assignment.entity").ProgramAssignment;
        message: string;
    };
    update(id: string, dto: UpdateProgramAssignmentDto): {
        success: boolean;
        data: import("./entities/program-assignment.entity").ProgramAssignment;
        message: string;
    };
    remove(id: string): {
        success: boolean;
        data: null;
        message: string;
    };
}
