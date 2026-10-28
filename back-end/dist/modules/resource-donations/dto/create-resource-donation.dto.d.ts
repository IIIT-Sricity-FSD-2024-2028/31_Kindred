declare class DonationItemDto {
    name: string;
    quantity: number;
    condition: string;
}
export declare class CreateResourceDonationDto {
    image?: string;
    id?: string;
    donorName: string;
    donorEmail: string;
    donorPhone: string;
    category: string;
    items: DonationItemDto[];
    description: string;
    pickupAddress: string;
    pickupDate: string;
    pickupTimeSlot: string;
    programId?: string;
    programName?: string;
    orgId?: string;
    orgName?: string;
    notes?: string;
}
export {};
