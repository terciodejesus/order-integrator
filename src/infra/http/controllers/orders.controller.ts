import { Body, Controller, Post } from "@nestjs/common";
import { OrderIntegrationService } from "src/application/services/order-integration.service";

@Controller('orders')
export class OrdersController {
  constructor(private readonly orderIntegrationService: OrderIntegrationService) {}
  
  @Post()
  async createOrder(@Body() body: any) {
    const result = await this.orderIntegrationService.login({password: '$C@ffein&', username: 'caffeinearmyapi'})
    console.log(result)
    // const order = OrderMapper.toDomain(body)
    // return body;
  }
}