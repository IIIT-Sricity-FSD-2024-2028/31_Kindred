import { FulfillmentService } from '../fulfillment/service';
import { ResourceDonationsService } from './service';
import { CreateResourceDonationDto } from './dto/create-resource-donation.dto';
import { UpdateResourceDonationDto } from './dto/update-resource-donation.dto';
export declare class ResourceDonationsController {
    private readonly service;
    private readonly fulfillment;
    constructor(service: ResourceDonationsService, fulfillment: FulfillmentService);
    uploadImage(file: any): {
        success: boolean;
        data: {
            url: string;
        };
    };
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
    getActivePickups(h: Record<string, string>): {
        success: boolean;
        data: import("./entities/resource-donation.entity").ResourceDonation[];
        message: string;
    };
    findByDonor(email: string): {
        success: boolean;
        data: {
            inventory: {
                received: number;
                reserved: number;
                distributed: number;
                receivedAt: string;
            } | null;
            image?: string;
            id: string;
            donorName: string;
            donorEmail: string;
            donorPhone: string;
            category: string;
            items: import("./entities/resource-donation.entity").ResourceDonationItem[];
            description: string;
            pickupAddress: string;
            pickupDate: string;
            pickupTimeSlot: string;
            programId: string;
            programName: string;
            orgId?: string;
            orgName?: string;
            status: string;
            assignedVolunteerEmail: string;
            assignedVolunteerName: string;
            assignedAt: string | null;
            pickedUpAt: string | null;
            deliveredAt: string | null;
            notes: string;
            createdAt: string;
        }[];
        message: string;
    };
    findByVolunteer(email: string, h: Record<string, string>): {
        success: boolean;
        data: import("./entities/resource-donation.entity").ResourceDonation[];
        message: string;
    };
    findByOrg(orgName: string): {
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
    findOne(id: string, h: Record<string, string>): {
        success: boolean;
        data: import("./entities/resource-donation.entity").ResourceDonation;
        message: string;
    };
    create(dto: CreateResourceDonationDto): {
        success: boolean;
        data: import("./entities/resource-donation.entity").ResourceDonation;
        message: string;
    };
    update(id: string, dto: UpdateResourceDonationDto, h: Record<string, string>): {
        success: boolean;
        data: import("./entities/resource-donation.entity").ResourceDonation;
        message: string;
    };
    assignVolunteer(id: string, body: {
        volunteerName: string;
        volunteerEmail: string;
    }, h: Record<string, string>): {
        success: boolean;
        data: import("../fulfillment/service").Delivery;
        message: string;
    };
    startPickup(id: string, h: Record<string, string>): {
        success: boolean;
        data: import("./entities/resource-donation.entity").ResourceDonation;
        message: string;
    };
    markDelivered(id: string, h: Record<string, string>): {
        success: boolean;
        data: import("./entities/resource-donation.entity").ResourceDonation;
        message: string;
    };
    markCompleted(id: string, h: Record<string, string>): {
        success: boolean;
        data: import("./entities/resource-donation.entity").ResourceDonation;
        message: string;
    };
    allocateToProgram(id: string, body: {
        programId: string;
        programName: string;
    }, h: Record<string, string>): {
        success: boolean;
        data: import("./entities/resource-donation.entity").ResourceDonation;
        message: string;
    };
    remove(id: string, h: Record<string, string>): {
        success: boolean;
        data: null;
        message: string;
    };
}
