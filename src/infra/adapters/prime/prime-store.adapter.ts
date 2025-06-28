import { HttpService } from '@nestjs/axios';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';
import { Order } from 'src/domain/entities';
import { AuthenticationPort, StorePort } from 'src/domain/ports';
import { WebhookRequestDto } from 'src/infra/http/dtos/webhook-request.dto';
import { PrimeConfig } from './config/prime.config';
import { PrimeStoreException } from './exceptions/prime-store.exception';

@Injectable()
export class PrimeStoreAdapter implements StorePort {
  private readonly logger = new Logger(PrimeStoreAdapter.name);
  private readonly baseUrl: string;
  private cachedApiKey: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @Inject('StoreAuthenticationPort')
    private readonly authentication: AuthenticationPort,
  ) {
    this.baseUrl = this.configService.get<PrimeConfig>('prime')?.baseUrl ?? '';
  }

  /**
   * Notifica o sucesso de um pedido
   * @param order
   */
  async notifyOrderSuccess(order: Order): Promise<void> {
    try {
      const isTokenValid = this.authentication.validateToken(
        this.configService.get<PrimeConfig>('prime')?.apiKey ?? '',
      );

      if (!isTokenValid) {
        this.logger.error('Token inválido, realizando login...');
        const authResult = await this.authentication.authenticate({
          apiKey: this.configService.get<PrimeConfig>('prime')?.apiKey ?? '',
        });

        this.cachedApiKey = authResult.apiKey ?? '';
      }

      const webhookDto = this.mapOrderToWebhookDto(order);

      const response = await firstValueFrom(
        this.httpService.post(
          `https://great-beard-51.webhook.cool`,
          webhookDto,
          {
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': this.formatAuthHeader(this.cachedApiKey),
            },
            timeout: 10000, // 10s para notificações
          },
        ),
      );

      if (response.status !== 200) {
        this.logger.error(
          'Erro ao notificar sucesso de pedido:',
          response.data,
        );
        throw new PrimeStoreException('Erro ao notificar sucesso de pedido');
      }

      this.logger.log('Notificação de sucesso de pedido enviada com sucesso');
    } catch (error) {
      if (error instanceof AxiosError) {
        this.logger.error(
          'Erro ao notificar sucesso de pedido:',
          error.response?.data,
        );
        throw new PrimeStoreException('Erro ao notificar sucesso de pedido');
      }

      this.logger.error('Erro ao notificar sucesso de pedido:', error);
      throw new InternalServerErrorException('Erro interno do servidor');
    }
  }

  /**
   * Formata o header de autorização para o formato x-api-key
   * @param apiKey Api Key
   * @returns String formatada para header x-api-key
   */
  formatAuthHeader(apiKey: string): string {
    return apiKey;
  }

  mapOrderToWebhookDto(order: Order): WebhookRequestDto {
    return {
      data: {
        id: order.externalId,
      },
      timestamp: new Date().toISOString(),
      type: 'order.processed',
    };
  }
}
