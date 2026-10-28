import { ProgramAssignmentsService } from '../program-assignments/service';
import { ProgramsService } from '../programs/service';
import { ProgramApplication } from './entities/program-application.entity';
import { CreateProgramApplicationDto } from './dto/create-program-application.dto';
import { NotificationsService } from '../notifications/service';
export declare class ProgramApplicationsService {
    private readonly assignments;
    private readonly programs;
    private readonly notifications;
    constructor(assignments: ProgramAssignmentsService, programs: ProgramsService, notifications: NotificationsService);
    private applications;
    private counter;
    private generateId;
    private ensureApprovedMembership;
    findAll(): ProgramApplication[];
    findById(id: string): ProgramApplication;
    findByProgram(programId: string): ProgramApplication[];
    findByOrg(org: string): ProgramApplication[];
    findByVolunteer(email: string): ProgramApplication[];
    getPending(): ProgramApplication[];
    hasApplied(programId: string, email: string): boolean;
    create(dto: CreateProgramApplicationDto): ProgramApplication;
    approve(id: string): ProgramApplication;
    reject(id: string): ProgramApplication;
    delete(id: string): boolean;
}
