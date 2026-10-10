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
  status: string; // requested | approved | rejected | volunteer_assigned | return_pickup | replacement_in_transit | replaced
  assignedVolunteerEmail?: string;
  assignedVolunteerName?: string;
  timestamps: ReplacementTimestamps;
}
