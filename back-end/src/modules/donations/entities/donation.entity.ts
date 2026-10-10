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
}
