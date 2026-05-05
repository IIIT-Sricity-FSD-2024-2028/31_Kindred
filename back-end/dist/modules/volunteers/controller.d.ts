import { VolunteersService } from './service';
import { CreateVolunteerDto } from './dto/create-volunteer.dto';
import { UpdateVolunteerDto } from './dto/update-volunteer.dto';
export declare class VolunteersController {
    private readonly service;
    constructor(service: VolunteersService);
    findAll(): {
        success: boolean;
        data: import("./entities/volunteer.entity").Volunteer[];
        message: string;
    };
    findByEmail(email: string): {
        success: boolean;
        data: null;
        message: string;
    } | {
        success: boolean;
        data: import("./entities/volunteer.entity").Volunteer;
        message: string;
    };
    findByOrg(org: string): {
        success: boolean;
        data: import("./entities/volunteer.entity").Volunteer[];
        message: string;
    };
    findOne(id: string): {
        success: boolean;
        data: import("./entities/volunteer.entity").Volunteer;
        message: string;
    };
    create(dto: CreateVolunteerDto): {
        success: boolean;
        data: import("./entities/volunteer.entity").Volunteer;
        message: string;
    };
    update(id: string, dto: UpdateVolunteerDto): {
        success: boolean;
        data: import("./entities/volunteer.entity").Volunteer;
        message: string;
    };
    remove(id: string): {
        success: boolean;
        data: null;
        message: string;
    };
}
