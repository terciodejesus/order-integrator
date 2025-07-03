import { Module } from '@nestjs/common';
import { OrdersController } from './http/controllers/orders.controller';
import { RabbitMQModule } from './queue/rabbitmq/rabbitmq.module';

@Module({
  imports: [RabbitMQModule],
  providers: [],
  controllers: [OrdersController],
  exports: [],
})
export class InfraModule {}
