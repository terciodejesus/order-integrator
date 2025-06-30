import { Injectable, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
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
  @EventPattern('order.process')
  async handleOrderProcessing(
    @Payload() data: Order & { enqueuedAt: string; correlationId: string },
    @Ctx() context: RmqContext,
  ): Promise<void> {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    
    try {
      const { enqueuedAt, correlationId, ...order } = data;
      
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
        await this.handleRetry(order, context, new Error(result.message));
      }
    } catch (error) {
      this.logger.error(
        `Erro no processamento do pedido: ${error.message}`,
        error.stack,
      );
      await this.handleRetry(data, context, error);
    }
  }

  /**
   * Gerencia lógica de retry (implementação básica)
   * @param order Pedido que falhou
   * @param context Contexto RabbitMQ
   * @param error Erro ocorrido
   */
  private async handleRetry(
    order: Order,
    context: RmqContext,
    error: Error,
  ): Promise<void> {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    // Por enquanto, apenas rejeita a mensagem (será melhorado com retry logic)
    this.logger.warn(
      `Rejeitando mensagem do pedido: ${order.orderNumber} - ${error.message}`,
    );
    
    // Reject message and send to dead letter queue
    channel.nack(originalMsg, false, false);
  }
} 