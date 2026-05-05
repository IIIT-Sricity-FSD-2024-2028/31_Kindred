import { Volunteer } from './entities/volunteer.entity';
import { CreateVolunteerDto } from './dto/create-volunteer.dto';
import { UpdateVolunteerDto } from './dto/update-volunteer.dto';
export declare class VolunteersService {
    private volunteers;
    private counter;
    private generateId;
    findAll(): Volunteer[];
    findById(id: string): Volunteer;
    findByEmail(email: string): Volunteer | null;
    findByOrg(org: string): Volunteer[];
    create(dto: CreateVolunteerDto): Volunteer;
    update(id: string, dto: UpdateVolunteerDto): Volunteer;
    delete(id: string): boolean;
}
