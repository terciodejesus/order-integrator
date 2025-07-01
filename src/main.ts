import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      noAck: false,
      urls: [
        process.env.RABBITMQ_URL || 'amqp://admin:admin123@localhost:5672',
      ],
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
      prefetchCount: 1,
    },
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      noAck: false,
      urls: ['amqp://admin:admin123@localhost:5672'],
      exchange: 'order.dlx.exchange',
      queue: 'order.dead-letter.queue',
      exchangeType: 'topic',
      queueOptions: { durable: true },
      routingKey: 'order.dead-letter',
      prefetchCount: 1,
    },
  });

  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3000);

  console.log(`🚀 Application is running on: ${await app.getUrl()}`);
  console.log(
    `🐰 RabbitMQ microservice is listening on queue: ${process.env.RABBITMQ_ORDER_QUEUE || 'order.queue'}`,
  );
}
bootstrap().catch((error) => {
  console.error('Error during application bootstrap:', error);
  process.exit(1);
});
