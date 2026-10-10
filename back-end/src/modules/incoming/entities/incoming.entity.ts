export interface IncomingRequest {
  id: string;
  name: string;
  type: string;
  desc: string;
  urgency: string;
  date: string;
  status: string;
  location: string;
  phone?: string;
  beneficiaryEmail?: string;
  assignedVolunteerName?: string;
  assignedVolunteerEmail?: string;
  resolvedAt?: string;
}
