import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BahnAuthAdapter } from 'src/infra/adapters/bahn/bahn-auth.adapter';
import { BahnOrderAdapter } from 'src/infra/adapters/bahn/bahn-order.adapter';
import bahnConfig from 'src/infra/adapters/bahn/config/bahn.config';
import primeConfig from 'src/infra/adapters/prime/config/prime.config';
import { PrimeAuthAdapter } from 'src/infra/adapters/prime/prime-auth.adapter';
import { PrimeStoreAdapter } from 'src/infra/adapters/prime/prime-store.adapter';
import { OrderIntegrationService } from './services/order-integration.service';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forFeature(bahnConfig),
    ConfigModule.forFeature(primeConfig),
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
  exports: [
    OrderIntegrationService,
    'AuthenticationPort',
    'OrderIntegrationPort',
    'StoreAuthenticationPort',
    'StorePort',
  ],
})
export class ApplicationModule {}
