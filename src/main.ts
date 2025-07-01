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
      queue: process.env.RABBITMQ_ORDER_QUEUE || 'order.queue',
      exchange: process.env.RABBITMQ_EXCHANGE || 'order.exchange',
      queueOptions: {
        durable: true,
        arguments: {
          'x-dead-letter-exchange':
            process.env.RABBITMQ_EXCHANGE || 'order.exchange',
          'x-dead-letter-routing-key': 'order.dead-letter',
        },
      },
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
