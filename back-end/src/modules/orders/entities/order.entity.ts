export interface DeliveryTimestamps {
  assignedAt?: string;
  pickupStartedAt?: string;
  pickedUpAt?: string;
  inTransitAt?: string;
  deliveredAt?: string;
}

export interface ShopOrder {
  id: string;
  productId: string;
  productTitle: string;
  sellerId: string;
  sellerName: string;
  organizationId?: string;
  organizationName?: string;
  price: number;
  quantity: number;
  total: number;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  address: string;
  cardLast4: string;
  cardType: string;
  paymentStatus: string;
  deliveryStatus: string; // awaiting_admin_assignment | assigned | pickup_started | picked_up | in_transit | delivered
  assignedVolunteerEmail?: string;
  assignedVolunteerName?: string;
  deliveryTimestamps?: DeliveryTimestamps;
  deliveryDonationId: string;
  createdAt: string;
}
