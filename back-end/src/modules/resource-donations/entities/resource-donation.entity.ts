export interface ResourceDonationItem {
  unit?:string;
  name: string;
  quantity: number;
  condition: string;
}

export interface ResourceDonation {
  certificate?: {id:string;issuedAt:string;donationId:string;organization:string;donorName:string;donorEmail:string;programName:string;items:{name:string;quantity:number;unit:string;condition:string;offeredQuantity:number}[]};
  image?: string;
  id: string;
  donorName: string;
  donorEmail: string;
  donorPhone: string;
  category: string;
  items: ResourceDonationItem[];
  description: string;
  pickupAddress: string;
  pickupDate: string;
  pickupTimeSlot: string;
  programId: string;
  programName: string;
  orgId?: string;
  orgName?: string;
  status: string;
  assignedVolunteerEmail: string;
  assignedVolunteerName: string;
  assignedAt: string | null;
  pickedUpAt: string | null;
  deliveredAt: string | null;
  notes: string;
  createdAt: string;
}
