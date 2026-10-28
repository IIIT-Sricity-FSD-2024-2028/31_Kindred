import { OrganizationsService } from '../organizations/service';
import { Program } from './entities/program.entity';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';
export declare class ProgramsService {
    private readonly organizations;
    private programs;
    constructor(organizations: OrganizationsService);
    findPublic(): Program[];
    setVolunteerCount(id: string, count: number): void;
    creditDonation(id: string, amount: number): void;
    setTaskProgress(id: string, totalTasks: number, completedTasks: number): void;
    reviewListing(id: string, approved: boolean): Program;
    private counter;
    private generateId;
    findAll(): Program[];
    findById(id: string): Program;
    findByOrg(org: string): Program[];
    create(dto: CreateProgramDto): Program;
    update(id: string, dto: UpdateProgramDto): Program;
    delete(id: string): boolean;
}
