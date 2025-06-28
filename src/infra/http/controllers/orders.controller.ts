import { Body, Controller, Post } from '@nestjs/common';
import { OrderIntegrationService } from 'src/application/services/order-integration.service';
import { CreateOrderRequestDto } from '../dtos/create-order-request.dto';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly orderIntegrationService: OrderIntegrationService,
  ) {}

  @Post()
  async createOrder(@Body() body: CreateOrderRequestDto) {
    return await this.orderIntegrationService.createOrder(body);
  }
}
