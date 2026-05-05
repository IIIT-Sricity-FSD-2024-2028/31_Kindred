import { PlatformRequest } from './entities/request.entity';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
export declare class RequestsService {
    private requests;
    private counter;
    findAll(): PlatformRequest[];
    findById(id: string): PlatformRequest;
    getPending(): PlatformRequest[];
    create(dto: CreateRequestDto): PlatformRequest;
    update(id: string, dto: UpdateRequestDto): PlatformRequest;
    approve(id: string): PlatformRequest;
    reject(id: string): PlatformRequest;
    delete(id: string): boolean;
}
