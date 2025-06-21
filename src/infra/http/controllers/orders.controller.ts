import { Body, Controller, Post } from "@nestjs/common";
import { CreateOrderRequestDto } from "../dtos/create-order-request.dto";
import { OrderMapper } from "../mappers/order.mapper";

@Controller('orders')
export class OrdersController {
  @Post()
  createOrder(@Body() body: CreateOrderRequestDto) {
    const order = OrderMapper.toDomain(body)
    return body;
  }
}