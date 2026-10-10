export interface Seller {
  id: string;
  name: string;
  email: string;
  phone?: string;
  businessName: string;
  businessDescription?: string;
  organizationId?: string;
  organizationName?: string;
  status: string; // pending | approved | rejected
  bankDetails?: { account: string; ifsc: string; bankName: string };
  salesBalance: number;
  createdAt: string;
}
