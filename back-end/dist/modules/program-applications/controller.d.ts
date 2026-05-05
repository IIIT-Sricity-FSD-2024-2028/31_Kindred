import { ProgramApplicationsService } from './service';
import { CreateProgramApplicationDto } from './dto/create-program-application.dto';
export declare class ProgramApplicationsController {
    private readonly service;
    constructor(service: ProgramApplicationsService);
    findAll(): {
        success: boolean;
        data: import("./entities/program-application.entity").ProgramApplication[];
        message: string;
    };
    getPending(): {
        success: boolean;
        data: import("./entities/program-application.entity").ProgramApplication[];
        message: string;
    };
    findByProgram(programId: string): {
        success: boolean;
        data: import("./entities/program-application.entity").ProgramApplication[];
        message: string;
    };
    findByVolunteer(email: string): {
        success: boolean;
        data: import("./entities/program-application.entity").ProgramApplication[];
        message: string;
    };
    hasApplied(programId: string, email: string): {
        success: boolean;
        data: boolean;
        message: string;
    };
    findOne(id: string): {
        success: boolean;
        data: import("./entities/program-application.entity").ProgramApplication;
        message: string;
    };
    create(dto: CreateProgramApplicationDto): {
        success: boolean;
        data: import("./entities/program-application.entity").ProgramApplication;
        message: string;
    };
    approve(id: string): {
        success: boolean;
        data: import("./entities/program-application.entity").ProgramApplication;
        message: string;
    };
    reject(id: string): {
        success: boolean;
        data: import("./entities/program-application.entity").ProgramApplication;
        message: string;
    };
    remove(id: string): {
        success: boolean;
        data: null;
        message: string;
    };
}
