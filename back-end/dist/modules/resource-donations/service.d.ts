import { ResourceDonation } from './entities/resource-donation.entity';
import { CreateResourceDonationDto } from './dto/create-resource-donation.dto';
import { UpdateResourceDonationDto } from './dto/update-resource-donation.dto';
export declare class ResourceDonationsService {
    private donations;
    private counter;
    private generateId;
    findAll(): ResourceDonation[];
    findById(id: string): ResourceDonation;
    findByDonor(email: string): ResourceDonation[];
    findByVolunteer(email: string): ResourceDonation[];
    findByProgram(programId: string): ResourceDonation[];
    findByStatus(status: string): ResourceDonation[];
    getPending(): ResourceDonation[];
    getActivePickups(): ResourceDonation[];
    create(dto: CreateResourceDonationDto): ResourceDonation;
    update(id: string, dto: UpdateResourceDonationDto): ResourceDonation;
    assignVolunteer(id: string, volName: string, volEmail: string): ResourceDonation;
    startPickup(id: string): ResourceDonation;
    markDelivered(id: string): ResourceDonation;
    markCompleted(id: string): ResourceDonation;
    allocateToProgram(id: string, programId: string, programName: string): ResourceDonation;
    delete(id: string): boolean;
}
