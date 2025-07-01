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
        // Handle retry logic (will be implemented later)
        this.handleRetry(data, context, new Error(result.message));
      }
    } catch (error) {
      this.logger.error(
        `Erro no processamento do pedido: ${(error as Error).message}`,
        (error as Error).stack,
      );
      this.handleRetry(data, context, error as Error);
    }
  }

  /**
   * Gerencia lógica de retry (implementação básica)
   * @param order Pedido que falhou
   * @param context Contexto RabbitMQ
   * @param error Erro ocorrido
   */
  private handleRetry(
    order: Order & { enqueuedAt: string; correlationId: string },
    context: RmqContext,
    error: Error,
  ): void {
    const channel = context.getChannelRef() as Channel;
    const originalMsg = context.getMessage() as Message;

    // Por enquanto, apenas rejeita a mensagem (será melhorado com retry logic)
    this.logger.warn(
      `Rejeitando mensagem do pedido: ${order.orderNumber} (${order.correlationId}) - ${error.message}`,
    );

    // Reject message and send to dead letter queue
    channel.nack(originalMsg, false, false);
  }
}
