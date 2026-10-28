export interface Task {
    id: string;
    title?: string;
    description?: string;
    assignedToEmail: string;
    assignedToName?: string;
    status: string;
    priority?: string;
    dueDate?: string;
    programId?: string;
    programName?: string;
    location?: string;
    notes?: string;
    createdAt: string;
    updatedAt?: string;
}
