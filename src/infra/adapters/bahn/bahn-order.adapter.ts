import { HttpService } from "@nestjs/axios";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AxiosResponse } from "axios";
import { firstValueFrom } from "rxjs";
import { Order } from "src/domain/entities";
import { AuthenticationPort } from "src/domain/ports/authentication.port";
import { OrderIntegrationPort, OrderIntegrationResult } from "src/domain/ports/order-integration.port";
import { BahnConfig } from "./config/bahn.config";
import { BahnOrderResponseDto } from "./dtos/bahn-order-response.dto";
import { BahnOrderException } from "./exceptions/bahn-order.exception";
import { BahnOrderToRequestMapper } from "./mappers/bahn-order-to-request.mapper";

@Injectable()
export class BahnOrderAdapter implements OrderIntegrationPort {
  private readonly logger = new Logger(BahnOrderAdapter.name);
  private readonly baseUrl: string;
  private cachedToken: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @Inject('AuthenticationPort')
    private readonly authenticationPort: AuthenticationPort
  ) {
    this.baseUrl = this.configService.get<BahnConfig>('bahn')?.baseUrl!;
  }

  async createOrder(order: Order): Promise<OrderIntegrationResult> {
    try {
      const isTokenValid = this.authenticationPort.validateToken(this.cachedToken)

      if (!isTokenValid) {
        this.logger.error('Token inválido, realizando login...');
        const authResult = await this.authenticationPort.authenticate({
          username: this.configService.get<BahnConfig>('bahn')?.username!,
          password: this.configService.get<BahnConfig>('bahn')?.password!
        })

        this.cachedToken = authResult.accessToken;
      }

      const formattedToken = this.formatBearerToken(this.cachedToken);
      const bahnOrder = BahnOrderToRequestMapper.toRequest(order)

      const response: AxiosResponse<BahnOrderResponseDto[]> = await firstValueFrom(
        this.httpService.post(
          `${this.baseUrl}/order`,
          [bahnOrder],
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': formattedToken,
            },
            timeout: 30000, // 30 segundos para criação de pedidos
          }
        )
      );

      if (response.data[0].success) {
        return {
          status: 'success',
          message: 'Pedido criado com sucesso',
        }
      } else {
        const errorMessages = response.data[0].errors?.map(error => error.error).join(', ');
        this.logger.error(`Erro na criação de pedidos: ${errorMessages}`);

        return {
          status: 'error',
          message: errorMessages,
        }
      }

      
    } catch (error) {
      this.logger.error('Erro na criação de pedidos:', error.response?.data || error.message);

      if (error.response?.status === 401) {
        throw new BahnOrderException('Token de autenticação inválido');
      }

      if (error.response?.status === 400) {
        throw new BahnOrderException(
          `Dados do pedido inválidos: ${error.response?.data?.message || 'Verifique os campos obrigatórios'}`
        );
      }

      if (error.response?.status === 422) {
        throw new BahnOrderException(
          `Erro de validação: ${JSON.stringify(error.response?.data?.errors || error.response?.data)}`
        );
      }

      if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
        throw new BahnOrderException('Serviço Bahn indisponível');
      }

      throw new BahnOrderException(
        `Erro inesperado na criação de pedidos: ${error.response?.data?.message || error.message}`
      );
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