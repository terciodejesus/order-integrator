import { Inject, Injectable, Logger } from '@nestjs/common';
import { Order } from 'src/domain/entities';
import { OrderIntegrationPort } from 'src/domain/ports';

@Injectable()
export class OrderIntegrationService {
  private readonly logger = new Logger(OrderIntegrationService.name);

  constructor(
    @Inject('OrderIntegrationPort')
    private readonly orderIntegrationPort: OrderIntegrationPort,
  ) {}

  async createOrder(order: Order) {
    const orderIntegrationResult =
      await this.orderIntegrationPort.createOrder(order);

    return orderIntegrationResult;
  }
}
