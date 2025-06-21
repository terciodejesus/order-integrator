import { Body, Controller, Post } from "@nestjs/common";
import { CreateOrderRequestDto } from "../dtos/create-order-request.dto";

@Controller('orders')
export class OrdersController {
  @Post()
  createOrder(@Body() body: CreateOrderRequestDto) {
    console.log(body);
    return body;
  }
}