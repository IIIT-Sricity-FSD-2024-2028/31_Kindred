export interface MonetaryDonation {
  id: string;
  org: string;
  amount: number;
  frequency: string;
  donor: string;
  email: string;
  cardLast4: string;
  cardType: string;
  status: string;
  date: string;
  panMasked?: string;
  taxReceiptEligible: boolean;
  receiptNumber?: string;
  paymentMode: 'card_demo';
  orgId: string;
  programId?: string;
  bankAccountName: string;
  bankAccountNumber: string;
  bankIfsc: string;
  transferReference: string;
  proofUrl: string;
  verifiedAt?: string;
  certificateNumber?: string;
  certificateIssuedAt?: string;
}
