import { Inject, Injectable, Logger } from "@nestjs/common";
import { AuthenticationPort, UsernamePasswordCredentials } from "src/domain/ports/authentication.port";

@Injectable()
export class OrderIntegrationService {
  private readonly logger = new Logger(OrderIntegrationService.name);

  constructor(
    @Inject('AuthenticationPort')
    private readonly authenticationPort: AuthenticationPort
  ) {}

  async login(credentials: UsernamePasswordCredentials) {
    const authenticationResult = await this.authenticationPort.authenticate(credentials);

    this.logger.log(`Login realizado com sucesso para usuário: ${credentials.username}`);

    return authenticationResult;
  }
}