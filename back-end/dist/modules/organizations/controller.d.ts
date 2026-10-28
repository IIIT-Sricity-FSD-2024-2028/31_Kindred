import { OrganizationsService } from './service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { ListingRequestDto } from './dto/listing-request.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
export declare class OrganizationsController {
    private readonly service;
    constructor(service: OrganizationsService);
    findAll(): {
        success: boolean;
        data: import("./entities/organization.entity").Organization[];
        message: string;
    };
    manage(role: string, org: string): {
        success: boolean;
        data: import("./entities/organization.entity").Organization[];
    };
    requestListing(id: string, dto: ListingRequestDto, org: string): {
        success: boolean;
        data: import("./entities/organization.entity").Organization;
        message: string;
    };
    approveListing(id: string): {
        success: boolean;
        data: import("./entities/organization.entity").Organization;
        message: string;
    };
    rejectListing(id: string): {
        success: boolean;
        data: import("./entities/organization.entity").Organization;
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
    register(dto: CreateOrganizationDto): {
        success: boolean;
        data: import("./entities/organization.entity").Organization;
        message: string;
    };
    uploadCertificate(file: any): {
        success: boolean;
        data: {
            url: string;
            filename: string;
            originalName: any;
        };
        message: string;
    };
    approve(id: string): {
        success: boolean;
        data: import("./entities/organization.entity").Organization;
        message: string;
    };
    reject(id: string): {
        success: boolean;
        data: import("./entities/organization.entity").Organization;
        message: string;
    };
    uploadImage(file: any): {
        success: boolean;
        data: {
            url: string;
            filename: string;
        };
        message: string;
    };
    create(dto: CreateOrganizationDto, role: string): {
        success: boolean;
        data: import("./entities/organization.entity").Organization;
        message: string;
    };
    update(id: string, dto: UpdateOrganizationDto, role: string, org: string): {
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
