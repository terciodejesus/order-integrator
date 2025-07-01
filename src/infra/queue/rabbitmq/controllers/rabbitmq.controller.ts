import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { Order } from 'src/domain/entities';
import { OrdersController } from 'src/infra/http/controllers/orders.controller';
import { DeadLetterConsumer } from '../consumers/dead-letter.consumer';
import { OrderQueueConsumer } from '../consumers/order-queue.consumer';

@Controller()
export class RabbitMQController {
  private readonly logger = new Logger(OrdersController.name);

  constructor(
    private readonly orderQueueConsumer: OrderQueueConsumer,
    private readonly deadLetterConsumer: DeadLetterConsumer,
  ) {}

  @EventPattern('order.exchange')
  async handleOrderQueue(
    @Payload() data: Order & { enqueuedAt: string; correlationId: string },
    @Ctx() context: RmqContext,
  ) {
    this.logger.log('Evento recebido: order.process');
    await this.orderQueueConsumer.handleOrderProcessing(data, context);
  }

  @EventPattern('order.dead-letter')
  handleOrderDeadLetter(
    @Payload() data: Order & { enqueuedAt: string; correlationId: string },
    @Ctx() context: RmqContext,
  ) {
    this.logger.log('Evento recebido: order.dead-letter');
    this.deadLetterConsumer.handleDeadLetter(data, context);
  }
}
