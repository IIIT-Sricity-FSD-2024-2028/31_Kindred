import { IncomingService } from './service';
import { CreateIncomingDto } from './dto/create-incoming.dto';
export declare class IncomingController {
    private readonly service;
    constructor(service: IncomingService);
    findAll(): {
        success: boolean;
        data: import("./entities/incoming.entity").IncomingRequest[];
        message: string;
    };
    getPending(): {
        success: boolean;
        data: import("./entities/incoming.entity").IncomingRequest[];
        message: string;
    };
    findOne(id: string): {
        success: boolean;
        data: import("./entities/incoming.entity").IncomingRequest;
        message: string;
    };
    create(dto: CreateIncomingDto): {
        success: boolean;
        data: import("./entities/incoming.entity").IncomingRequest;
        message: string;
    };
    accept(id: string): {
        success: boolean;
        data: import("./entities/incoming.entity").IncomingRequest;
        message: string;
    };
    decline(id: string): {
        success: boolean;
        data: import("./entities/incoming.entity").IncomingRequest;
        message: string;
    };
    remove(id: string): {
        success: boolean;
        data: null;
        message: string;
    };
}
