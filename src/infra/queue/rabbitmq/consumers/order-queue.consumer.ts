import { Injectable, Logger } from '@nestjs/common';
import { Ctx, Payload, RmqContext } from '@nestjs/microservices';
import { Channel, Message } from 'amqplib';
import { OrderIntegrationService } from 'src/application/services/order-integration.service';
import { Order } from 'src/domain/entities';

@Injectable()
export class OrderQueueConsumer {
  private readonly logger = new Logger(OrderQueueConsumer.name);

  constructor(
    private readonly orderIntegrationService: OrderIntegrationService,
  ) {}

  /**
   * Processa pedidos da fila RabbitMQ
   * @param data Dados do pedido com metadados
   * @param context Contexto RabbitMQ
   */
  async handleOrderProcessing(
    @Payload() data: Order & { enqueuedAt: string; correlationId: string },
    @Ctx() context: RmqContext,
  ): Promise<void> {
    const channel = context.getChannelRef() as Channel;
    const originalMsg = context.getMessage() as Message;
    const { correlationId, ...order } = data;

    try {
      this.logger.log(
        `Processando pedido da fila: ${order.orderNumber} (${correlationId})`,
      );

      const result = await this.orderIntegrationService.createOrder(order);

      if (result.status === 'success') {
        this.logger.log(
          `Pedido processado com sucesso: ${order.orderNumber} (${correlationId})`,
        );
        // Acknowledge successful processing
        channel.ack(originalMsg);
      } else {
        this.logger.error(
          `Falha no processamento do pedido: ${order.orderNumber} (${correlationId}) - ${result.message}`,
        );

        channel.nack(originalMsg, false, false);
      }
    } catch (error) {
      this.logger.error(
        `Erro no processamento do pedido: ${(error as Error).message}`,
        (error as Error).stack,
      );
    }
  }
}
