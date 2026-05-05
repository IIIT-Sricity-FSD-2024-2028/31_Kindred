import { RequestsService } from './service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
export declare class RequestsController {
    private readonly service;
    constructor(service: RequestsService);
    findAll(): {
        success: boolean;
        data: import("./entities/request.entity").PlatformRequest[];
        message: string;
    };
    getPending(): {
        success: boolean;
        data: import("./entities/request.entity").PlatformRequest[];
        message: string;
    };
    findOne(id: string): {
        success: boolean;
        data: import("./entities/request.entity").PlatformRequest;
        message: string;
    };
    create(dto: CreateRequestDto): {
        success: boolean;
        data: import("./entities/request.entity").PlatformRequest;
        message: string;
    };
    update(id: string, dto: UpdateRequestDto): {
        success: boolean;
        data: import("./entities/request.entity").PlatformRequest;
        message: string;
    };
    approve(id: string): {
        success: boolean;
        data: import("./entities/request.entity").PlatformRequest;
        message: string;
    };
    reject(id: string): {
        success: boolean;
        data: import("./entities/request.entity").PlatformRequest;
        message: string;
    };
    remove(id: string): {
        success: boolean;
        data: null;
        message: string;
    };
}
