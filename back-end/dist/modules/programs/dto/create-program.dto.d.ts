export declare class CreateProgramDto {
    name: string;
    org: string;
    focus: string;
    startDate: string;
    endDate: string;
    budget: number;
    description: string;
    requiredSkills?: string[];
    volunteerGoal?: number;
    openForApplications?: boolean;
    location?: string;
}
