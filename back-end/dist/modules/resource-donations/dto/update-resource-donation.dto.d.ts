import { CreateResourceDonationDto } from './create-resource-donation.dto';
declare const UpdateResourceDonationDto_base: import("@nestjs/common").Type<Partial<CreateResourceDonationDto>>;
export declare class UpdateResourceDonationDto extends UpdateResourceDonationDto_base {
    status?: string;
    assignedVolunteerEmail?: string;
    assignedVolunteerName?: string;
    notes?: string;
}
export {};
