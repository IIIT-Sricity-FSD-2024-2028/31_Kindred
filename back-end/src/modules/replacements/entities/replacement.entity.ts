export interface ReplacementTimestamps {
  requestedAt: string;
  approvedAt?: string;
  rejectedAt?: string;
  volunteerAssignedAt?: string;
  returnPickupAt?: string;
  replacementInTransitAt?: string;
  replacedAt?: string;
}

export interface Replacement {
  scheduleConflicts?:string[];
  buyerReceivedAt?:string;
  id: string;
  orderId: string;
  productId: string;
  productTitle: string;
  sellerId: string;
  sellerName: string;
  organizationId?: string;
  organizationName?: string;
  buyerEmail: string;
  buyerName: string;
  reason: string;
  description: string;
  imageUrl?: string;
  mode?: 'direct'|'broadcast';
  status: string; // requested | approved | rejected | volunteer_assigned | return_pickup | replacement_in_transit | replaced
  assignedVolunteerEmail?: string;
  assignedVolunteerName?: string;
  destinationArea?:string;requirements?:string;
  quantity?:number;
  stockReserved?:boolean;
  reasonForStatus?:string;
  schedule?:{startDate:string;endDate:string;shiftStart?:string;shiftEnd?:string;location:string;timeZone?:string};
  pickupAddress?:string;
  returnAddress?:string;
  history?:{at:string;action:string;by:string;reason?:string}[];
  timestamps: ReplacementTimestamps;
}
