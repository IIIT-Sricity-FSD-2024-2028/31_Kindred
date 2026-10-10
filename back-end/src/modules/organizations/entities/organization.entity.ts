export interface Organization {
  id: string;
  name: string;
  joined: string;
  focus: string;
  status: string;
  volunteers: number;
  beneficiaries: number;
  rating: number | string;
  color: string;
  email: string;
  phone: string;
  city: string;
  adminEmail?: string;
  image?: string;
  bankAccountName?: string;
  bankAccountNumber?: string;
  bankIfsc?: string;
  upiId?: string;
  neededResources?: string;
}
