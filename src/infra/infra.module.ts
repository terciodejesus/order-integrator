import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OrderIntegrationService } from 'src/application/services/order-integration.service';
import { BahnAuthAdapter } from './adapters/bahn/bahn-auth.adapter';
import { BahnOrderAdapter } from './adapters/bahn/bahn-order.adapter';
import bahnConfig from './adapters/bahn/config/bahn.config';
import primeConfig from './adapters/prime/config/prime.config';
import { PrimeAuthAdapter } from './adapters/prime/prime-auth.adapter';
import { PrimeStoreAdapter } from './adapters/prime/prime-store.adapter';
import { OrdersController } from './http/controllers/orders.controller';
import { RabbitMQModule } from './queue/rabbitmq.module';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forFeature(bahnConfig),
    ConfigModule.forFeature(primeConfig),
    RabbitMQModule,
  ],
  providers: [
    OrderIntegrationService,
    {
      provide: 'AuthenticationPort',
      useClass: BahnAuthAdapter,
    },
    {
      provide: 'OrderIntegrationPort',
      useClass: BahnOrderAdapter,
    },
    {
      provide: 'StoreAuthenticationPort',
      useClass: PrimeAuthAdapter,
    },
    {
      provide: 'StorePort',
      useClass: PrimeStoreAdapter,
    },
  ],
  controllers: [OrdersController],
  exports: [
    'AuthenticationPort',
    'OrderIntegrationPort',
    'StoreAuthenticationPort',
    'StorePort',
  ],
})
export class InfraModule {}
