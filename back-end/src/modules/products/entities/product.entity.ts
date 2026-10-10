export interface Product {
  id: string;
  sellerId: string;
  sellerName: string;
  title: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  photos: string[]; // base64 or URLs
  status: string; // pending_approval | approved | rejected
  createdAt: string;
}
