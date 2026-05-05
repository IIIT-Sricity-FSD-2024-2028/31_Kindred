import { HourLogsService } from './service';
import { CreateHourLogDto } from './dto/create-hour-log.dto';
import { UpdateHourLogDto } from './dto/update-hour-log.dto';
export declare class HourLogsController {
    private readonly service;
    constructor(service: HourLogsService);
    findAll(): {
        success: boolean;
        data: import("./entities/hour-log.entity").HourLog[];
        message: string;
    };
    getPending(): {
        success: boolean;
        data: import("./entities/hour-log.entity").HourLog[];
        message: string;
    };
    findByVolunteer(email: string): {
        success: boolean;
        data: import("./entities/hour-log.entity").HourLog[];
        message: string;
    };
    findOne(id: string): {
        success: boolean;
        data: import("./entities/hour-log.entity").HourLog;
        message: string;
    };
    create(dto: CreateHourLogDto): {
        success: boolean;
        data: import("./entities/hour-log.entity").HourLog;
        message: string;
    };
    update(id: string, dto: UpdateHourLogDto): {
        success: boolean;
        data: import("./entities/hour-log.entity").HourLog;
        message: string;
    };
    approve(id: string): {
        success: boolean;
        data: import("./entities/hour-log.entity").HourLog;
        message: string;
    };
    reject(id: string): {
        success: boolean;
        data: import("./entities/hour-log.entity").HourLog;
        message: string;
    };
    remove(id: string): {
        success: boolean;
        data: null;
        message: string;
    };
}
