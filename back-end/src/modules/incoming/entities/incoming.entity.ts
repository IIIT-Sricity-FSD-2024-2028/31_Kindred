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
  photoUrl?: string;
  assignedVolunteerName?: string;
  assignedVolunteerEmail?: string;
  resolvedAt?: string;
}
