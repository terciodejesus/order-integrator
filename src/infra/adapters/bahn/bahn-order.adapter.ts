import { HttpService } from '@nestjs/axios';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError, AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';
import { Order } from 'src/domain/entities';
import { AuthenticationPort } from 'src/domain/ports/authentication.port';
import {
  OrderIntegrationPort,
  OrderIntegrationResult,
} from 'src/domain/ports/order-integration.port';
import { BahnConfig } from './config/bahn.config';
import { BahnOrderErrorResponseDTO, BahnOrderResponseDTO } from './dtos';
import { BahnOrderException } from './exceptions/bahn-order.exception';
import { BahnOrderToRequestMapper } from './mappers/bahn-order-to-request.mapper';

@Injectable()
export class BahnOrderAdapter implements OrderIntegrationPort {
  private readonly logger = new Logger(BahnOrderAdapter.name);
  private readonly baseUrl: string;
  private cachedToken: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @Inject('AuthenticationPort')
    private readonly authentication: AuthenticationPort,
  ) {
    this.baseUrl = this.configService.get<BahnConfig>('bahn')?.baseUrl ?? '';
  }

  async createOrder(order: Order): Promise<OrderIntegrationResult> {
    try {
      const isTokenValid = this.authentication.validateToken(this.cachedToken);

      if (!isTokenValid) {
        const authResult = await this.authentication.authenticate({
          username: this.configService.get<BahnConfig>('bahn')?.username ?? '',
          password: this.configService.get<BahnConfig>('bahn')?.password ?? '',
        });

        this.cachedToken = authResult.accessToken ?? '';
      }

      const formattedToken = this.formatBearerToken(this.cachedToken);
      const bahnOrder = BahnOrderToRequestMapper.toRequest(order);

      this.logger.log(`Criando pedido no Bahn: ${bahnOrder.number}`);
      const response: AxiosResponse<BahnOrderResponseDTO[]> =
        await firstValueFrom(
          this.httpService.post(`${this.baseUrl}/order`, [bahnOrder], {
            headers: {
              'Content-Type': 'application/json',
              Authorization: formattedToken,
            },
            timeout: 30000, // 30 segundos para criação de pedidos
          }),
        );

      if (response.data[0].success) {
        this.logger.log(
          `Pedido criado com sucesso: ${response.data[0].orderNumber}`,
        );
        return {
          status: 'success',
          message: 'Pedido criado com sucesso',
        };
      } else {
        const errorMessages = (
          response.data[0] as BahnOrderErrorResponseDTO
        ).errors
          ?.map((error) => error.error)
          .join(', ');
        this.logger.error(`Erro na criação de pedidos: ${errorMessages}`);

        return {
          status: 'error',
          message: errorMessages,
        };
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        this.logger.error(
          'Erro na criação de pedidos:',
          error.response?.data || error.message,
        );

        if (error.response?.status === 401) {
          throw new BahnOrderException('Token de autenticação inválido');
        }

        if (error.response?.status === 400) {
          throw new BahnOrderException(
            `Dados do pedido inválidos: ${error.response?.data || 'Verifique os campos obrigatórios'}`,
          );
        }

        if (error.response?.status === 422) {
          throw new BahnOrderException(
            `Erro de validação: ${JSON.stringify(error.response?.data || error.response?.data)}`,
          );
        }

        if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
          throw new BahnOrderException('Serviço Bahn indisponível');
        }

        throw new BahnOrderException(
          `Erro inesperado na criação de pedidos: ${error.response?.data || error.message}`,
        );
      }

      throw new InternalServerErrorException('Erro interno do servidor');
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
