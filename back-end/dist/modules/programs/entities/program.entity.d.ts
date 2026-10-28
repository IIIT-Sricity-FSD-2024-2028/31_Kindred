export interface Program {
    id: string;
    name: string;
    org: string;
    focus: string | string[];
    status: string;
    startDate: string;
    endDate: string;
    budget: number;
    raised: number;
    taskProgress?: number;
    totalTasks?: number;
    completedTasks?: number;
    beneficiaries: number;
    volunteers: number;
    description: string;
    requiredSkills: string[];
    volunteerGoal: number;
    openForApplications: boolean;
    location: string;
    image?: string;
    listingStatus?: 'unlisted' | 'pending' | 'approved' | 'rejected';
}
