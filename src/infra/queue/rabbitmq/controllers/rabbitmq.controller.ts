import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { Order } from 'src/domain/entities';
import { DeadLetterConsumer } from '../consumers/dead-letter.consumer';
import { OrderQueueConsumer } from '../consumers/order-queue.consumer';

@Controller()
export class RabbitMQController {
  private readonly logger = new Logger(RabbitMQController.name);

  constructor(
    private readonly orderQueueConsumer: OrderQueueConsumer,
    private readonly deadLetterConsumer: DeadLetterConsumer,
  ) {}

  @EventPattern('order.process')
  async handleOrderQueue(
    @Payload() data: Order & { enqueuedAt: string; correlationId: string },
    @Ctx() context: RmqContext,
  ) {
    const message = context.getMessage() as { fields: { routingKey: string } };

    if (message.fields.routingKey === 'order.dead-letter') {
      this.logger.log('🔥 Dead Letter recebida!');
      this.deadLetterConsumer.handleDeadLetter(data, context);
    } else {
      this.logger.log('🔥 Order recebida!');
      await this.orderQueueConsumer.handleOrderProcessing(data, context);
    }
  }

  @EventPattern('order.dead-letter')
  handleOrderDeadLetter(
    @Payload() data: Order & { enqueuedAt: string; correlationId: string },
    @Ctx() context: RmqContext,
  ) {
    this.logger.log('🔥 Dead Letter recebida!');
    this.deadLetterConsumer.handleDeadLetter(data, context);
  }
}
