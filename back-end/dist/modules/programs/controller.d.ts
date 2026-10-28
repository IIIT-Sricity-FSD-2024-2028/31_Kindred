import { ProgramsService } from './service';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';
export declare class ProgramsController {
    private readonly service;
    constructor(service: ProgramsService);
    findAll(): {
        success: boolean;
        data: import("./entities/program.entity").Program[];
        message: string;
    };
    manage(role: string, org: string): {
        success: boolean;
        data: import("./entities/program.entity").Program[];
    };
    uploadImage(file: any): {
        success: boolean;
        data: {
            url: string;
        };
    };
    approveListing(id: string): {
        success: boolean;
        data: import("./entities/program.entity").Program;
    };
    rejectListing(id: string): {
        success: boolean;
        data: import("./entities/program.entity").Program;
    };
    findByOrg(org: string): {
        success: boolean;
        data: import("./entities/program.entity").Program[];
        message: string;
    };
    findOne(id: string): {
        success: boolean;
        data: import("./entities/program.entity").Program;
        message: string;
    };
    create(dto: CreateProgramDto, role: string, org: string): {
        success: boolean;
        data: import("./entities/program.entity").Program;
        message: string;
    };
    update(id: string, dto: UpdateProgramDto, role: string, org: string): {
        success: boolean;
        data: import("./entities/program.entity").Program;
        message: string;
    };
    remove(id: string): {
        success: boolean;
        data: null;
        message: string;
    };
}
