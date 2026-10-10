import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ProductsService } from '../products/service';
import { SellersService } from '../sellers/service';
import { ResourceDonationsService } from '../resource-donations/service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ShopOrder, DeliveryTimestamps } from './entities/order.entity';

const VALID_DELIVERY_STATUSES = ['awaiting_admin_assignment', 'assigned', 'pickup_started', 'picked_up', 'in_transit', 'delivered'];
const VALID_DELIVERY_TRANSITIONS: Record<string, string[]> = {
  'awaiting_admin_assignment': ['assigned'],
  'assigned': ['pickup_started'],
  'pickup_started': ['picked_up'],
  'picked_up': ['in_transit'],
  'in_transit': ['delivered'],
  'delivered': [],
};

@Injectable()
export class OrdersService {
  private orders: ShopOrder[] = [];
  private counter = 100;

  constructor(
    private readonly products: ProductsService,
    private readonly sellers: SellersService,
    private readonly resources: ResourceDonationsService,
  ) {}

  findAll(): ShopOrder[] { return this.orders.slice(); }

  findBySeller(sellerId: string): ShopOrder[] {
    return this.orders.filter((o) => o.sellerId === sellerId);
  }

  findByOrg(orgId: string): ShopOrder[] {
    return this.orders.filter((o) => o.organizationId === orgId);
  }

  findByBuyer(email: string): ShopOrder[] {
    return this.orders.filter((o) => o.buyerEmail.toLowerCase() === email.toLowerCase());
  }

  findByVolunteer(email: string): ShopOrder[] {
    return this.orders.filter((o) => o.assignedVolunteerEmail && o.assignedVolunteerEmail.toLowerCase() === email.toLowerCase());
  }

  findById(id: string): ShopOrder {
    const order = this.orders.find((o) => o.id === id);
    if (!order) throw new NotFoundException(`Order with id '${id}' not found`);
    return { ...order };
  }

  create(dto: CreateOrderDto): ShopOrder {
    const product = this.products.findById(dto.productId);
    if (product.status !== 'approved') throw new BadRequestException('Product is not approved for sale');
    if (product.quantity < dto.quantity) throw new BadRequestException(`Only ${product.quantity} item(s) left in stock`);

    const seller = this.sellers.findById(product.sellerId);
    const total = product.price * dto.quantity;
    this.products.decreaseStock(product.id, dto.quantity);
    this.sellers.creditSale(product.sellerId, total);

    const id = `KND-ORD-${Date.now().toString().slice(-8)}-${this.counter++}`;
    const delivery = this.resources.create({
      donorName: `Shop Order ${id}`,
      donorEmail: dto.buyerEmail,
      donorPhone: dto.buyerPhone,
      category: 'Shop Delivery',
      items: [{ name: product.title, quantity: dto.quantity, condition: 'New Artisan Product' }],
      description: `Pick up from seller ${seller.businessName} and deliver order ${id} to ${dto.buyerName}. Delivery address: ${dto.address}`,
      pickupAddress: seller.businessName,
      pickupDate: new Date().toISOString().slice(0, 10),
      pickupTimeSlot: 'Admin to schedule',
      programId: '',
      programName: '',
    });

    const order: ShopOrder = {
      id,
      productId: product.id,
      productTitle: product.title,
      sellerId: product.sellerId,
      sellerName: seller.name,
      organizationId: seller.organizationId || '',
      organizationName: seller.organizationName || '',
      price: product.price,
      quantity: dto.quantity,
      total,
      buyerName: dto.buyerName,
      buyerEmail: dto.buyerEmail,
      buyerPhone: dto.buyerPhone,
      address: dto.address,
      cardLast4: dto.cardLast4 || '',
      cardType: dto.cardType || 'Card',
      paymentStatus: 'paid',
      deliveryStatus: 'awaiting_admin_assignment',
      deliveryTimestamps: {},
      deliveryDonationId: delivery.id,
      createdAt: new Date().toISOString(),
    };
    this.orders.unshift(order);
    return { ...order };
  }

  /** Assign a volunteer to deliver an order. Status transitions from awaiting_admin_assignment → assigned. */
  assignVolunteer(id: string, volunteerEmail: string, volunteerName: string): ShopOrder {
    const idx = this.orders.findIndex((o) => o.id === id);
    if (idx === -1) throw new NotFoundException(`Order with id '${id}' not found`);
    const order = this.orders[idx];
    if (order.deliveryStatus !== 'awaiting_admin_assignment') {
      throw new BadRequestException(`Cannot assign volunteer when delivery status is '${order.deliveryStatus}'. Must be 'awaiting_admin_assignment'.`);
    }
    this.orders[idx].assignedVolunteerEmail = volunteerEmail;
    this.orders[idx].assignedVolunteerName = volunteerName;
    this.orders[idx].deliveryStatus = 'assigned';
    this.orders[idx].deliveryTimestamps = { ...this.orders[idx].deliveryTimestamps, assignedAt: new Date().toISOString() };
    return { ...this.orders[idx] };
  }

  /** Update delivery status with enforced valid transitions */
  updateDeliveryStatus(id: string, newStatus: string): ShopOrder {
    const idx = this.orders.findIndex((o) => o.id === id);
    if (idx === -1) throw new NotFoundException(`Order with id '${id}' not found`);
    const order = this.orders[idx];

    if (!VALID_DELIVERY_STATUSES.includes(newStatus)) {
      throw new BadRequestException(`Invalid delivery status '${newStatus}'. Valid: ${VALID_DELIVERY_STATUSES.join(', ')}`);
    }
    const allowed = VALID_DELIVERY_TRANSITIONS[order.deliveryStatus] || [];
    if (!allowed.includes(newStatus)) {
      throw new BadRequestException(`Cannot transition from '${order.deliveryStatus}' to '${newStatus}'. Allowed: ${allowed.join(', ') || 'none'}`);
    }

    this.orders[idx].deliveryStatus = newStatus;

    // Track timestamps (keep delivery status only in Order — single source of truth)
    const ts: DeliveryTimestamps = { ...this.orders[idx].deliveryTimestamps };
    const now = new Date().toISOString();
    if (newStatus === 'assigned') ts.assignedAt = now;
    else if (newStatus === 'pickup_started') ts.pickupStartedAt = now;
    else if (newStatus === 'picked_up') ts.pickedUpAt = now;
    else if (newStatus === 'in_transit') ts.inTransitAt = now;
    else if (newStatus === 'delivered') ts.deliveredAt = now;
    this.orders[idx].deliveryTimestamps = ts;

    return { ...this.orders[idx] };
  }
}
