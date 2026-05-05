import { CreateVolunteerDto } from './create-volunteer.dto';
declare const UpdateVolunteerDto_base: import("@nestjs/common").Type<Partial<CreateVolunteerDto>>;
export declare class UpdateVolunteerDto extends UpdateVolunteerDto_base {
    status?: string;
    hours?: number;
}
export {};
