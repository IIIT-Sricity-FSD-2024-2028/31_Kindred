import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersService } from './service';

@ApiTags('Shop Orders')
@ApiHeader({ name: 'role', required: false })
@Controller('orders')
@UseGuards(RolesGuard)
export class OrdersController {
  constructor(private readonly service: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Complete a shop payment/order; updates stock, seller balance, and creates delivery allocation' })
  create(@Body() dto: CreateOrderDto) {
    return { success: true, data: this.service.create(dto), message: 'Payment successful. Order created and queued for delivery assignment.' };
  }

  @Get()
  @Roles('admin', 'superuser', 'seller')
  @ApiQuery({ name: 'sellerId', required: false })
  findAll(@Query('sellerId') sellerId?: string) {
    const data = sellerId ? this.service.findBySeller(sellerId) : this.service.findAll();
    return { success: true, data, message: 'Orders retrieved successfully' };
  }

  @Get('by-org/:orgId')
  @Roles('admin', 'superuser')
  @ApiOperation({ summary: 'Get orders linked to a specific organization' })
  findByOrg(@Param('orgId') orgId: string) {
    return { success: true, data: this.service.findByOrg(orgId), message: 'Organization orders retrieved' };
  }

  @Get('by-buyer/:email')
  @ApiOperation({ summary: 'Get order history for a buyer' })
  findByBuyer(@Param('email') email: string) {
    return { success: true, data: this.service.findByBuyer(email), message: 'Buyer orders retrieved' };
  }

  @Get('by-volunteer/:email')
  @Roles('admin', 'superuser', 'volunteer')
  @ApiOperation({ summary: 'Get delivery orders assigned to a volunteer' })
  findByVolunteer(@Param('email') email: string) {
    return { success: true, data: this.service.findByVolunteer(email), message: 'Volunteer delivery orders retrieved' };
  }

  @Get(':id')
  @Roles('admin', 'superuser', 'seller')
  findOne(@Param('id') id: string) {
    return { success: true, data: this.service.findById(id), message: 'Order retrieved successfully' };
  }

  @Patch(':id/assign-volunteer')
  @Roles('admin', 'superuser')
  @ApiOperation({ summary: 'Assign a volunteer to deliver an order' })
  assignVolunteer(@Param('id') id: string, @Body() body: { volunteerEmail: string; volunteerName: string }) {
    return { success: true, data: this.service.assignVolunteer(id, body.volunteerEmail, body.volunteerName), message: 'Volunteer assigned for delivery' };
  }

  @Patch(':id/delivery-status')
  @Roles('admin', 'superuser', 'volunteer')
  @ApiOperation({ summary: 'Update delivery status of an order. Valid transitions are enforced.' })
  updateDeliveryStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return { success: true, data: this.service.updateDeliveryStatus(id, body.status), message: 'Delivery status updated' };
  }
}
