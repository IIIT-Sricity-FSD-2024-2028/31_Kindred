import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Seller } from './entities/seller.entity';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';

@Injectable()
export class SellersService {
  private sellers: Seller[] = [
    {
      id: 'seller_001', name: 'Ravi Kumar', email: 'seller@kindred.org',
      phone: '+91 99887 11223', businessName: 'Ravi Handicrafts',
      businessDescription: 'Traditional handmade pottery, paintings, and decorative items from Rajasthan.',
      organizationId: 'org_001', organizationName: 'HopeConnect',
      status: 'approved', salesBalance: 0, bankDetails: { account: '1234567890', ifsc: 'HDFC0001234', bankName: 'HDFC Bank' }, createdAt: '2024-03-01T00:00:00Z',
    },
    {
      id: 'seller_002', name: 'Sunita Devi', email: 'sunita.seller@email.com',
      phone: '+91 99887 11224', businessName: 'Sunita Organic Foods',
      businessDescription: 'Farm-fresh organic jams, pickles, and spices from Himachal Pradesh.',
      organizationId: 'org_001', organizationName: 'HopeConnect',
      status: 'approved', salesBalance: 0, bankDetails: { account: '9876543210', ifsc: 'SBIN0005678', bankName: 'State Bank of India' }, createdAt: '2024-04-15T00:00:00Z',
    },
    {
      id: 'seller_003', name: 'Manoj Tiwari', email: 'manoj.seller@email.com',
      phone: '+91 99887 11225', businessName: 'Manoj Textiles',
      businessDescription: 'Handloom sarees and fabrics from Varanasi.',
      status: 'pending', salesBalance: 0, createdAt: '2024-06-10T00:00:00Z',
    },
  ];
  private counter = 100;

  private generateId(): string {
    return `seller_${Date.now()}_${this.counter++}`;
  }

  findAll(): Seller[] {
    return this.sellers.slice();
  }

  findById(id: string): Seller {
    const seller = this.sellers.find((s) => s.id === id);
    if (!seller) throw new NotFoundException(`Seller with id '${id}' not found`);
    return { ...seller };
  }

  findByEmail(email: string): Seller | null {
    return this.sellers.find((s) => s.email.toLowerCase() === email.toLowerCase()) || null;
  }

  findByStatus(status: string): Seller[] {
    return this.sellers.filter((s) => s.status === status);
  }

  findByOrganization(orgId: string): Seller[] {
    return this.sellers.filter((s) => s.organizationId === orgId);
  }

  create(dto: CreateSellerDto): Seller {
    const existing = this.sellers.find((s) => s.email === dto.email);
    if (existing) throw new BadRequestException(`Seller with email '${dto.email}' already exists`);

    const newSeller: Seller = {
      id: this.generateId(),
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      businessName: dto.businessName,
      businessDescription: dto.businessDescription,
      location: dto.location,
      organizationId: dto.organizationId,
      organizationName: dto.organizationName,
      status: 'pending',
      salesBalance: 0,
      createdAt: new Date().toISOString(),
    };

    this.sellers.push(newSeller);
    return { ...newSeller };
  }

  update(id: string, dto: UpdateSellerDto): Seller {
    const idx = this.sellers.findIndex((s) => s.id === id);
    if (idx === -1) throw new NotFoundException(`Seller with id '${id}' not found`);
    this.sellers[idx] = { ...this.sellers[idx], ...Object.fromEntries(Object.entries(dto).filter(([, value]) => value !== undefined)) };
    return { ...this.sellers[idx] };
  }

  creditSale(id: string, amount: number): Seller {
    const idx = this.sellers.findIndex((s) => s.id === id);
    if (idx === -1) throw new NotFoundException(`Seller with id '${id}' not found`);
    this.sellers[idx].salesBalance = (this.sellers[idx].salesBalance || 0) + amount;
    return { ...this.sellers[idx] };
  }

  /** Enforce: seller must have a valid partner organization before approval */
  approve(id: string): Seller {
    const seller = this.findById(id);
    if (!seller.organizationId || !seller.organizationName) {
      throw new BadRequestException('Seller must have a valid partner organization before being approved. Please set organizationId and organizationName first.');
    }
    return this.update(id, { status: 'approved' });
  }

  reject(id: string): Seller {
    return this.update(id, { status: 'rejected' });
  }

  delete(id: string): boolean {
    const idx = this.sellers.findIndex((s) => s.id === id);
    if (idx === -1) throw new NotFoundException(`Seller with id '${id}' not found`);
    this.sellers.splice(idx, 1);
    return true;
  }
}
