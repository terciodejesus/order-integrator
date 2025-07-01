import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ApplicationModule } from 'src/application/application.module';
import { DeadLetterConsumer } from './consumers/dead-letter.consumer';
import { OrderQueueConsumer } from './consumers/order-queue.consumer';
import { RabbitMQController } from './controllers/rabbitmq.controller';
import { OrderQueueProducer } from './producers/order-queue.producer';

@Module({
  imports: [
    ApplicationModule,
    ClientsModule.register([
      {
        name: 'RABBITMQ_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://admin:admin123@localhost:5672'],
          queue: 'order.queue',
          exchange: 'order.exchange',
          exchangeType: 'topic',
          routingKey: 'order.process',
          queueOptions: {
            durable: true,
            arguments: {
              'x-dead-letter-exchange': 'order.dlx.exchange',
              'x-dead-letter-routing-key': 'order.dead-letter',
            },
          },
        },
      },
    ]),
  ],
  providers: [OrderQueueProducer, OrderQueueConsumer, DeadLetterConsumer],
  exports: [OrderQueueProducer, OrderQueueConsumer, DeadLetterConsumer],
  controllers: [RabbitMQController],
})
export class RabbitMQModule {}
