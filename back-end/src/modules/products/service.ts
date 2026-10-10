import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  private products: Product[] = [
    {
      id: 'prod_001', sellerId: 'seller_001', sellerName: 'Ravi Kumar',
      title: 'Hand-Painted Ceramic Vase', description: 'Beautiful blue pottery vase with traditional Rajasthani motifs. Perfect for home décor.',
      price: 1800, quantity: 15, category: 'Handicrafts', photos: [], status: 'approved', createdAt: '2024-03-15T00:00:00Z',
    },
    {
      id: 'prod_002', sellerId: 'seller_001', sellerName: 'Ravi Kumar',
      title: 'Wooden Carved Elephant Set', description: 'Set of 3 hand-carved wooden elephants in ascending sizes. Made from sheesham wood.',
      price: 2500, quantity: 8, category: 'Handicrafts', photos: [], status: 'approved', createdAt: '2024-03-20T00:00:00Z',
    },
    {
      id: 'prod_003', sellerId: 'seller_002', sellerName: 'Sunita Devi',
      title: 'Organic Mango Pickle (500g)', description: 'Homemade organic mango pickle using traditional Himachali recipe. No preservatives.',
      price: 350, quantity: 25, category: 'Food & Organic', photos: [], status: 'approved', createdAt: '2024-04-20T00:00:00Z',
    },
    {
      id: 'prod_004', sellerId: 'seller_002', sellerName: 'Sunita Devi',
      title: 'Mixed Spice Gift Box', description: 'Curated gift box with 6 organic spices — turmeric, cumin, coriander, red chili, garam masala, and black pepper.',
      price: 900, quantity: 12, category: 'Food & Organic', photos: [], status: 'approved', createdAt: '2024-05-01T00:00:00Z',
    },
    {
      id: 'prod_005', sellerId: 'seller_001', sellerName: 'Ravi Kumar',
      title: 'Terracotta Wall Hanging', description: 'Handmade terracotta wall art depicting rural Indian village scene.',
      price: 1200, quantity: 6, category: 'Handicrafts', photos: [], status: 'pending_approval', createdAt: '2024-06-01T00:00:00Z',
    },
  ];
  private counter = 100;

  private generateId(): string {
    return `prod_${Date.now()}_${this.counter++}`;
  }

  findAll(): Product[] {
    return this.products.slice();
  }

  findById(id: string): Product {
    const product = this.products.find((p) => p.id === id);
    if (!product) throw new NotFoundException(`Product with id '${id}' not found`);
    return { ...product };
  }

  findByStatus(status: string): Product[] {
    return this.products.filter((p) => p.status === status);
  }

  findBySeller(sellerId: string): Product[] {
    return this.products.filter((p) => p.sellerId === sellerId);
  }

  create(dto: CreateProductDto): Product {
    const newProduct: Product = {
      id: dto.id || this.generateId(),
      sellerId: dto.sellerId,
      sellerName: dto.sellerName || '',
      title: dto.title,
      description: dto.description,
      price: dto.price,
      quantity: dto.quantity,
      category: dto.category,
      photos: dto.photos || [],
      status: 'pending_approval',
      createdAt: new Date().toISOString(),
    };
    this.products.push(newProduct);
    return { ...newProduct };
  }

  update(id: string, dto: UpdateProductDto): Product {
    const idx = this.products.findIndex((p) => p.id === id);
    if (idx === -1) throw new NotFoundException(`Product with id '${id}' not found`);
    this.products[idx] = { ...this.products[idx], ...Object.fromEntries(Object.entries(dto).filter(([, value]) => value !== undefined)) };
    return { ...this.products[idx] };
  }


  decreaseStock(id: string, quantity: number): Product {
    const idx = this.products.findIndex((p) => p.id === id);
    if (idx === -1) throw new NotFoundException(`Product with id '${id}' not found`);
    if (quantity <= 0) return { ...this.products[idx] };
    if (this.products[idx].quantity < quantity) {
      throw new NotFoundException(`Insufficient stock for product '${id}'`);
    }
    this.products[idx].quantity -= quantity;
    return { ...this.products[idx] };
  }

  approve(id: string): Product {
    return this.update(id, { status: 'approved' });
  }

  reject(id: string): Product {
    return this.update(id, { status: 'rejected' });
  }

  delete(id: string): boolean {
    const idx = this.products.findIndex((p) => p.id === id);
    if (idx === -1) throw new NotFoundException(`Product with id '${id}' not found`);
    this.products.splice(idx, 1);
    return true;
  }
}
