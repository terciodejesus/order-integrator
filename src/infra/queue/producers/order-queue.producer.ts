import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { Order } from 'src/domain/entities';
import { RabbitMQConfig } from '../config/rabbitmq.config';

@Injectable()
export class OrderQueueProducer {
  private readonly logger = new Logger(OrderQueueProducer.name);

  constructor(
    @Inject('RABBITMQ_SERVICE')
    private readonly client: ClientProxy,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Publica um pedido na fila para processamento assíncrono
   * @param order Pedido a ser processado
   * @returns Promise<void>
   */
  async publishOrder(order: Order): Promise<void> {
    try {
      const rabbitmqConfig = this.configService.get<RabbitMQConfig>('rabbitmq');
      
      this.logger.log(`Enfileirando pedido: ${order.orderNumber}`);
      
      await this.client.emit('order.process', {
        ...order,
        enqueuedAt: new Date().toISOString(),
        correlationId: this.generateCorrelationId(order.externalId),
      });

      this.logger.log(`Pedido enfileirado com sucesso: ${order.orderNumber}`);
    } catch (error) {
      this.logger.error(`Erro ao enfileirar pedido ${order.orderNumber}:`, error);
      throw new Error(`Falha ao enfileirar pedido: ${error.message}`);
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