export interface Program {
    id: string;
    name: string;
    org: string;
    focus: string;
    status: string;
    startDate: string;
    endDate: string;
    budget: number;
    raised: number;
    beneficiaries: number;
    volunteers: number;
    description: string;
    requiredSkills: string[];
    volunteerGoal: number;
    openForApplications: boolean;
    location: string;
}
