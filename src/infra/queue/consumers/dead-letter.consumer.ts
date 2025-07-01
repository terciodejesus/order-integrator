import { Injectable, Logger } from '@nestjs/common';
import { Ctx, Payload, RmqContext } from '@nestjs/microservices';
import { Channel, Message } from 'amqplib';
import { Order } from 'src/domain/entities';

@Injectable()
export class DeadLetterConsumer {
  private readonly logger = new Logger(DeadLetterConsumer.name);

  /**
   * Processa mensagens que falharam definitivamente
   * @param data Pedido que falhou
   * @param context Contexto RabbitMQ
   */
  handleDeadLetter(
    @Payload() data: Order & { enqueuedAt: string; correlationId: string },
    @Ctx() context: RmqContext,
  ): void {
    const channel = context.getChannelRef() as Channel;
    const originalMsg = context.getMessage() as Message;

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
        `Erro ao processar dead letter: ${(error as Error).message}`,
        (error as Error).stack,
      );

      // Acknowledge mesmo com erro para evitar loop infinito
      channel.ack(originalMsg);
    }
  }
}
