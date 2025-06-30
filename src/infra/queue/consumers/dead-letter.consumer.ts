import { Injectable, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { Order } from 'src/domain/entities';

@Injectable()
export class DeadLetterConsumer {
  private readonly logger = new Logger(DeadLetterConsumer.name);

  /**
   * Processa mensagens que falharam definitivamente
   * @param data Pedido que falhou
   * @param context Contexto RabbitMQ
   */
  @EventPattern('order.dead-letter')
  async handleDeadLetter(
    @Payload() data: Order & { enqueuedAt: string; correlationId: string },
    @Ctx() context: RmqContext,
  ): Promise<void> {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      const { correlationId, ...order } = data;
      
      this.logger.error(
        `Pedido falhou definitivamente: ${order.orderNumber} (${correlationId})`,
      );

      // Aqui poderia:
      // 1. Enviar notificação de falha para Prime Store
      // 2. Salvar em banco de dados para auditoria
      // 3. Enviar alerta para equipe de suporte
      // 4. Integrar com sistema de monitoramento

      // Por enquanto, apenas logamos o erro
      this.logger.error(
        `Pedido enviado para dead letter queue: ${JSON.stringify(order)}`,
      );

      // Acknowledge para remover da dead letter queue
      channel.ack(originalMsg);
    } catch (error) {
      this.logger.error(
        `Erro ao processar dead letter: ${error.message}`,
        error.stack,
      );
      
      // Acknowledge mesmo com erro para evitar loop infinito
      channel.ack(originalMsg);
    }
  }
} 