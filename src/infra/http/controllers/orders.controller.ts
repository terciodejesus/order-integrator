import { Body, Controller, Logger, Post } from '@nestjs/common';
import { OrderQueueProducer } from 'src/infra/queue/rabbitmq/producers/order-queue.producer';
import { CreateOrderRequestDTO } from '../dtos/create-order-request.dto';

@Controller('orders')
export class OrdersController {
  private readonly logger = new Logger(OrdersController.name);

  constructor(private readonly orderQueueProducer: OrderQueueProducer) {}

  @Post()
  createOrder(@Body() body: CreateOrderRequestDTO) {
    try {
      this.orderQueueProducer.publishOrder(body);

      this.logger.log(`Pedido enfileirado: ${body.orderNumber}`);

      return {
        status: 'queued',
        message: 'Pedido enfileirado para processamento',
        orderId: body.externalId,
        orderNumber: body.orderNumber,
      };
    } catch (error) {
      this.logger.error(
        `Erro ao enfileirar pedido ${body.orderNumber}:`,
        error,
      );

      return {
        status: 'error',
        message: 'Falha ao enfileirar pedido',
        error: (error as Error).message,
      };
    }
  }
}
