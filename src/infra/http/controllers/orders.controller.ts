import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import {
  ApiTags
} from '@nestjs/swagger';
import { OrderIntegrationService } from 'src/application/services/order-integration.service';
import { CreateOrderRequestDTO } from '../dtos/create-order-request.dto';
import { ApiOrdersPost } from 'src/swagger/orders.swagger';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(
    private readonly orderIntegrationService: OrderIntegrationService,
  ) {}

  @Post()
  @ApiOrdersPost()
  async createOrder(@Body() body: CreateOrderRequestDTO) {
    const result = await this.orderIntegrationService.createOrder(body);

    if (result.status === 'success') {
      return {
        status: 'success',
        message: result.message,
      };
    } else {
      throw new BadRequestException(result.message);
    }
  }
}
