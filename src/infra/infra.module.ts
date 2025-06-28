import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OrderIntegrationService } from 'src/application/services/order-integration.service';
import { BahnAuthAdapter } from './adapters/bahn/bahn-auth.adapter';
import { BahnOrderAdapter } from './adapters/bahn/bahn-order.adapter';
import bahnConfig from './adapters/bahn/config/bahn.config';
import { OrdersController } from './http/controllers/orders.controller';

@Module({
  imports: [HttpModule, ConfigModule.forFeature(bahnConfig)],
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
  ],
  controllers: [OrdersController],
  exports: ['AuthenticationPort', 'OrderIntegrationPort'],
})
export class InfraModule {}
