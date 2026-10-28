export interface ResourceDonationItem {
    name: string;
    quantity: number;
    condition: string;
}
export interface ResourceDonation {
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
