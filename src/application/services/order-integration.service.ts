import { Inject, Injectable, Logger } from '@nestjs/common';
import { Order } from 'src/domain/entities';
import { OrderIntegrationPort, StorePort } from 'src/domain/ports';

@Injectable()
export class OrderIntegrationService {
  private readonly logger = new Logger(OrderIntegrationService.name);

  constructor(
    @Inject('OrderIntegrationPort')
    private readonly orderIntegration: OrderIntegrationPort,
    @Inject('StorePort')
    private readonly store: StorePort,
  ) {}

  async createOrder(order: Order) {
    this.logger.log(`Recebendo pedido: ${order.orderNumber}`);
    const result = await this.orderIntegration.createOrder(order);

    try {
      if (result.status === 'success') {
        await this.store.notifyOrderSuccess(order);
      }
    } catch (error) {
      this.logger.warn('Falha na notificação da loja:', error);
    }

    return result;
  }
}
