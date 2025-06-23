import { Inject, Injectable, Logger } from "@nestjs/common";
import { Order } from "src/domain/entities";
import { AuthenticationPort } from "src/domain/ports/authentication.port";
import { OrderIntegrationPort } from "src/domain/ports/order-integration.port";

@Injectable()
export class OrderIntegrationService {
  private readonly logger = new Logger(OrderIntegrationService.name);

  constructor(
    @Inject('AuthenticationPort')
    private readonly authenticationPort: AuthenticationPort,
    @Inject('OrderIntegrationPort')
    private readonly orderIntegrationPort: OrderIntegrationPort
  ) {}

  // async login(credentials: UsernamePasswordCredentials) {
  //   const authenticationResult = await this.authenticationPort.authenticate(credentials);

  //   this.logger.log(`Login realizado com sucesso para usuário: ${credentials.username}`);

  //   return authenticationResult;
  // }

  async createOrder(order: Order) {
    const orderIntegrationResult = await this.orderIntegrationPort.createOrder(order);
  }
}