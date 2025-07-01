import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Order } from 'src/domain/entities';

@Injectable()
export class OrderQueueProducer {
  private readonly logger = new Logger(OrderQueueProducer.name);

  constructor(
    @Inject('RABBITMQ_SERVICE')
    private readonly client: ClientProxy,
  ) {}

  /**
   * Publica um pedido na fila para processamento assíncrono
   * @param order Pedido a ser processado
   * @returns Promise<void>
   */
  publishOrder(order: Order): void {
    try {
      this.logger.log(`Enfileirando pedido: ${order.orderNumber}`);

      this.client.emit('order.exchange', {
        ...order,
        enqueuedAt: new Date().toISOString(),
        correlationId: this.generateCorrelationId(order.externalId),
      });

      this.logger.log(`Pedido enfileirado com sucesso: ${order.orderNumber}`);
    } catch (error) {
      this.logger.error(
        `Erro ao enfileirar pedido ${order.orderNumber}:`,
        error,
      );
      throw new Error(
        `Falha ao enfileirar pedido: ${(error as Error).message}`,
      );
    }
  }

  /**
   * Gera um ID de correlação único para rastreamento
   * @param externalId ID externo do pedido
   * @returns string de correlação
   */
  private generateCorrelationId(externalId: string): string {
    const timestamp = Date.now();
    return `${externalId}-${timestamp}`;
  }
}
