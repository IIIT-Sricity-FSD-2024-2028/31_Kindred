import { HourLog } from './entities/hour-log.entity';
import { CreateHourLogDto } from './dto/create-hour-log.dto';
import { UpdateHourLogDto } from './dto/update-hour-log.dto';
export declare class HourLogsService {
    private hourLogs;
    private counter;
    private generateId;
    findAll(): HourLog[];
    findById(id: string): HourLog;
    findByVolunteer(email: string): HourLog[];
    getPending(): HourLog[];
    create(dto: CreateHourLogDto): HourLog;
    update(id: string, dto: UpdateHourLogDto): HourLog;
    approve(id: string): HourLog;
    reject(id: string): HourLog;
    delete(id: string): boolean;
}
