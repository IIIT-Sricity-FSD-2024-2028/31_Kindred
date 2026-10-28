import { IncomingRequest } from './entities/incoming.entity';
import { CreateIncomingDto } from './dto/create-incoming.dto';
export declare class IncomingService {
    private readonly proofs;
    private requests;
    private counter;
    findAll(): IncomingRequest[];
    findById(id: string): IncomingRequest;
    getPending(): IncomingRequest[];
    findByBeneficiaryEmail(email: string): IncomingRequest[];
    create(dto: CreateIncomingDto): IncomingRequest;
    accept(id: string): IncomingRequest;
    assign(id: string, volunteerName: string, volunteerEmail: string): IncomingRequest;
    resolve(id: string): IncomingRequest;
    decline(id: string): IncomingRequest;
    delete(id: string): boolean;
}
