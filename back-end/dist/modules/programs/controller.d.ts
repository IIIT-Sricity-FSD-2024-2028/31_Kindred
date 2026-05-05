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
    create(dto: CreateProgramDto): {
        success: boolean;
        data: import("./entities/program.entity").Program;
        message: string;
    };
    update(id: string, dto: UpdateProgramDto): {
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
