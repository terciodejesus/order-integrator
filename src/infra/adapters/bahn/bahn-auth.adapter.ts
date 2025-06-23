import { HttpService } from "@nestjs/axios";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AxiosResponse } from "axios";
import { firstValueFrom } from "rxjs";
import { AuthenticationPort, AuthenticationResult, UsernamePasswordCredentials } from "src/domain/ports/authentication.port";
import { BahnConfig } from "./bahn.config";
import { BahnLoginResponseDto } from "./dtos/bahn-login-response.dto";

@Injectable()
export class BahnAuthAdapter implements AuthenticationPort {
  private readonly logger = new Logger(BahnAuthAdapter.name);
  private readonly bahnConfig: BahnConfig;

  constructor(
    private httpService: HttpService,
    private configService: ConfigService
  ) {
    this.bahnConfig = this.configService.get<BahnConfig>('bahn')!;
  }

  async authenticate(credentials: UsernamePasswordCredentials): Promise<AuthenticationResult> {
    const response: AxiosResponse<BahnLoginResponseDto> = await firstValueFrom(
      this.httpService.post(`${this.bahnConfig.baseUrl}/login`, {
        userName: credentials.username,
        password: credentials.password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000
      })
    );

    this.logger.log(`Login realizado com sucesso para usuário: ${credentials.username}`);

    return {
      accessToken: response.data.token,
    }
  }

  validateToken(token: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}