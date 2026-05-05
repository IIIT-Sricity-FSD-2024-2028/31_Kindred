export interface HourLog {
  id: string;
  volunteerEmail: string;
  volunteerName?: string;
  hours: number;
  date?: string;
  description?: string;
  programId?: string;
  programName?: string;
  status: string;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}
