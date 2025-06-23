import { HttpService } from "@nestjs/axios";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AxiosResponse } from "axios";
import * as jwt from 'jsonwebtoken';
import { firstValueFrom } from "rxjs";
import { AuthenticationPort, AuthenticationResult, UsernamePasswordCredentials } from "src/domain/ports/authentication.port";
import { BahnConfig } from "./bahn.config";
import { BahnLoginResponseDto } from "./dtos/bahn-login-response.dto";
import { BahnAuthException } from "./exceptions/bahn-auth.exception";

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
    try {
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
    } catch (error) {
      this.logger.error(
        `Erro no login para usuário ${credentials.username}:`,
        error.response?.data || error.message
      );

      if (error.response?.status === 401) {
        throw new BahnAuthException('Credenciais inválidas');
      }

      if (error.response?.status === 429) {
        throw new BahnAuthException('Muitas tentativas de login. Tente novamente mais tarde');
      }

      if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
        throw new BahnAuthException('Serviço Bahn indisponível');
      }

      throw new BahnAuthException(
        `Erro inesperado no login: ${error.response?.data?.message || error.message}`
      );
    }
  }

  validateToken(token: string): boolean {
    try {
      if (!token) {
        return false;
      }

      const cleanToken = token.replace('Bearer ', '');
      const decodedToken = jwt.decode(cleanToken) as any;

      if (!decodedToken || !decodedToken.exp) {
        this.logger.error('Token inválido ou expirado');
        return false;
      }

      const currentTime = Math.floor(Date.now() / 1000);
      const isTokenExpired = decodedToken.exp < currentTime;

      if (isTokenExpired) {
        this.logger.error('Token expirado');
        return false;
      }

      return true;
    } catch (error) {
      this.logger.error('Erro ao validar token:', error);
      return false;
    }
  }

  /**
 * Extrai informações do token sem validar assinatura
 * @param token Token JWT
 * @returns Dados decodificados do token ou null se inválido
 */
  decodeToken(token: string): any | null {
    try {
      const cleanToken = token.replace(/^Bearer\s+/i, '');
      return jwt.decode(cleanToken);
    } catch (error) {
      this.logger.error('Erro ao decodificar token:', error.message);
      return null;
    }
  }

  /**
   * Formata token para uso em headers de autorização
   * @param token Token JWT
   * @returns String formatada para header Authorization
   */
  formatBearerToken(token: string): string {
    const cleanToken = token.replace(/^Bearer\s+/i, '');
    return `Bearer ${cleanToken}`;
  }
}