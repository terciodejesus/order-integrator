import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { rabbitmqConfig } from './config/rabbitmq.config';
import { DeadLetterConsumer } from './consumers/dead-letter.consumer';
import { OrderQueueConsumer } from './consumers/order-queue.consumer';
import { OrderQueueProducer } from './producers/order-queue.producer';

@Module({
  imports: [
    ConfigModule.forFeature(rabbitmqConfig),
    ClientsModule.register([
      {
        name: 'RABBITMQ_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://admin:admin123@localhost:5672'],
          queue: process.env.RABBITMQ_ORDER_QUEUE || 'order.queue',
          queueOptions: {
            durable: true,
            arguments: {
              'x-dead-letter-exchange': process.env.RABBITMQ_EXCHANGE || 'order.exchange',
              'x-dead-letter-routing-key': 'order.dead-letter',
            },
          },
        },
      },
    ]),
  ],
  providers: [
    OrderQueueProducer,
    OrderQueueConsumer,
    DeadLetterConsumer,
  ],
  exports: [
    OrderQueueProducer,
    OrderQueueConsumer,
    DeadLetterConsumer,
  ],
})
export class RabbitMQModule {} 