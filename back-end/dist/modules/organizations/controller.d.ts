import { OrganizationsService } from './service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
export declare class OrganizationsController {
    private readonly service;
    constructor(service: OrganizationsService);
    findAll(): {
        success: boolean;
        data: import("./entities/organization.entity").Organization[];
        message: string;
    };
    search(q: string): {
        success: boolean;
        data: import("./entities/organization.entity").Organization[];
        message: string;
    };
    findOne(id: string): {
        success: boolean;
        data: import("./entities/organization.entity").Organization;
        message: string;
    };
    create(dto: CreateOrganizationDto): {
        success: boolean;
        data: import("./entities/organization.entity").Organization;
        message: string;
    };
    update(id: string, dto: UpdateOrganizationDto): {
        success: boolean;
        data: import("./entities/organization.entity").Organization;
        message: string;
    };
    remove(id: string): {
        success: boolean;
        data: null;
        message: string;
    };
}
