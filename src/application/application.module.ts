import { Module } from "@nestjs/common";
import { InfraModule } from "src/infra/infra.module";
import { OrderIntegrationService } from "./services/order-integration.service";

@Module({
  imports: [InfraModule],
  providers: [OrderIntegrationService],
  exports: [OrderIntegrationService]
})
export class ApplicationModule {}