export interface Subtask {
  id: string;
  programId: string;
  title: string;
  description: string;
  assignedToEmail: string;
  assignedToName: string;
  status: string;
  progress: number;
  createdAt: string;
}
