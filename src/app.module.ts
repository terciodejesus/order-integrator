import { Module } from '@nestjs/common';
import { OrdersController } from './infra/http/controllers/orders.controller';

@Module({
  imports: [],
  controllers: [OrdersController],
  providers: [],
})
export class AppModule {}
