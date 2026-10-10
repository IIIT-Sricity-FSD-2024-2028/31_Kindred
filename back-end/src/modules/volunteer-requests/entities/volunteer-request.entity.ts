export interface VolunteerResponse {
  volunteerEmail: string;
  volunteerName: string;
  action: 'accepted' | 'rejected';
  respondedAt: string;
}

export interface VolunteerRequest {
  id: string;
  organizationId: string;
  organizationName: string;
  title: string;
  description: string;
  location: string;
  date: string;
  startTime?: string;
  endTime?: string;
  volunteersRequired: number;
  slotsAvailable: number;
  requiredSkills: string[];
  programId?: string;
  programName?: string;
  status: string; // open | filled | closed | cancelled
  responses: VolunteerResponse[];
  createdAt: string;
}
