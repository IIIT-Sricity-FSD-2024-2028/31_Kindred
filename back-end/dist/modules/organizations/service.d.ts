import { Organization } from './entities/organization.entity';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
export declare class OrganizationsService {
    private organizations;
    private counter;
    private generateId;
    findAll(): Organization[];
    findById(id: string): Organization;
    search(q: string): Organization[];
    create(dto: CreateOrganizationDto): Organization;
    update(id: string, dto: UpdateOrganizationDto): Organization;
    delete(id: string): boolean;
}
