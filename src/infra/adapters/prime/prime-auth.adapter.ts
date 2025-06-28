import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ApiKeyCredentials, AuthenticationPort } from "src/domain/ports";
import { StoreAuthenticationResult } from "src/domain/ports/store-authentication.port";
import { PrimeConfig } from "./config/prime.config";
import { PrimeAuthException } from "./exceptions/prime-auth.exception";

@Injectable()
export class PrimeAuthAdapter implements AuthenticationPort {
  private readonly logger = new Logger(PrimeAuthAdapter.name);
  private readonly primeConfig: PrimeConfig;
  
  constructor(
    private readonly configService: ConfigService,
  ) {
    this.primeConfig = this.configService.get<PrimeConfig>('prime')!;
  }

  /**
   * Autentica o usuário na API do Prime
   * @param credentials Credenciais de autenticação
   * @returns Resultado da autenticação
   */
 async authenticate(credentials: ApiKeyCredentials): Promise<StoreAuthenticationResult> {
    if (!credentials.apiKey) {
      this.logger.error('API Key não informado');
      throw new PrimeAuthException('API Key é obrigatória');
    }

    this.logger.log(
      `Login realizado com sucesso para Prime API`,
    );
    
    return {
      apiKey: credentials.apiKey,
    }
  }
  
  /**
   * Valida se a apiKey é válida
   * @param apiKey Api Key
   * @returns Boolean se a apiKey é válida
   */
  validateToken(apiKey: string): boolean {
    return this.primeConfig.apiKey === apiKey;
  }

  /**
   * Formata o header de autorização para o formato x-api-key
   * @param apiKey Api Key
   * @returns String formatada para header x-api-key
   */
  formatAuthHeader(apiKey: string): string {
    return apiKey
  }
}