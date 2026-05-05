import { ResourceDonationsService } from './service';
import { CreateResourceDonationDto } from './dto/create-resource-donation.dto';
import { UpdateResourceDonationDto } from './dto/update-resource-donation.dto';
export declare class ResourceDonationsController {
    private readonly service;
    constructor(service: ResourceDonationsService);
    findAll(): {
        success: boolean;
        data: import("./entities/resource-donation.entity").ResourceDonation[];
        message: string;
    };
    getPending(): {
        success: boolean;
        data: import("./entities/resource-donation.entity").ResourceDonation[];
        message: string;
    };
    getActivePickups(): {
        success: boolean;
        data: import("./entities/resource-donation.entity").ResourceDonation[];
        message: string;
    };
    findByDonor(email: string): {
        success: boolean;
        data: import("./entities/resource-donation.entity").ResourceDonation[];
        message: string;
    };
    findByVolunteer(email: string): {
        success: boolean;
        data: import("./entities/resource-donation.entity").ResourceDonation[];
        message: string;
    };
    findByProgram(programId: string): {
        success: boolean;
        data: import("./entities/resource-donation.entity").ResourceDonation[];
        message: string;
    };
    findByStatus(status: string): {
        success: boolean;
        data: import("./entities/resource-donation.entity").ResourceDonation[];
        message: string;
    };
    findOne(id: string): {
        success: boolean;
        data: import("./entities/resource-donation.entity").ResourceDonation;
        message: string;
    };
    create(dto: CreateResourceDonationDto): {
        success: boolean;
        data: import("./entities/resource-donation.entity").ResourceDonation;
        message: string;
    };
    update(id: string, dto: UpdateResourceDonationDto): {
        success: boolean;
        data: import("./entities/resource-donation.entity").ResourceDonation;
        message: string;
    };
    assignVolunteer(id: string, body: {
        volunteerName: string;
        volunteerEmail: string;
    }): {
        success: boolean;
        data: import("./entities/resource-donation.entity").ResourceDonation;
        message: string;
    };
    startPickup(id: string): {
        success: boolean;
        data: import("./entities/resource-donation.entity").ResourceDonation;
        message: string;
    };
    markDelivered(id: string): {
        success: boolean;
        data: import("./entities/resource-donation.entity").ResourceDonation;
        message: string;
    };
    markCompleted(id: string): {
        success: boolean;
        data: import("./entities/resource-donation.entity").ResourceDonation;
        message: string;
    };
    allocateToProgram(id: string, body: {
        programId: string;
        programName: string;
    }): {
        success: boolean;
        data: import("./entities/resource-donation.entity").ResourceDonation;
        message: string;
    };
    remove(id: string): {
        success: boolean;
        data: null;
        message: string;
    };
}
