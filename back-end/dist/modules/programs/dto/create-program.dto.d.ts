export declare class CreateProgramDto {
    requestListing?: boolean;
    image?: string;
    id?: string;
    name: string;
    org: string;
    focus: string | string[];
    startDate: string;
    endDate?: string;
    status?: string;
    volunteers?: number;
    budget: number;
    description: string;
    requiredSkills?: string[];
    volunteerGoal?: number;
    openForApplications?: boolean;
    location?: string;
}
