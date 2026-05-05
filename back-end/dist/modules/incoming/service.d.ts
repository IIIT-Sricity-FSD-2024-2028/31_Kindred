import { IncomingRequest } from './entities/incoming.entity';
import { CreateIncomingDto } from './dto/create-incoming.dto';
export declare class IncomingService {
    private requests;
    private counter;
    findAll(): IncomingRequest[];
    findById(id: string): IncomingRequest;
    getPending(): IncomingRequest[];
    create(dto: CreateIncomingDto): IncomingRequest;
    accept(id: string): IncomingRequest;
    decline(id: string): IncomingRequest;
    delete(id: string): boolean;
}
