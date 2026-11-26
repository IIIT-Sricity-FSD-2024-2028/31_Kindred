export interface ProgramAssignment {
  id: string;
  programId: string;
  programName: string;
  volunteerEmail: string;
  volunteerName: string;
  role: string;
  assignedAt: string;
  status: string;
  acceptedVersion?: number;
  acceptedBrief?: unknown;
  needsReconfirmation?: boolean;
  withdrawalReason?: string;
  handoverNote?: string;
  history?: {at:string;action:string;by:string;note?:string}[];
}
