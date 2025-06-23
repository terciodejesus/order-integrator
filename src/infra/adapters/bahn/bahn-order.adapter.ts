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

      const response: AxiosResponse<BahnOrderResponseDto[]> = await firstValueFrom(
        this.httpService.post(
          `${this.baseUrl}/order`,
          [{
            "ecommerceName": "Integrações API",
            "channel": "",
            "number": `PM-${new Date().getTime()}`,
            "purchaseDate": "2025-05-07T12:15:00.248Z",
            "sellerName": "",
            "brandName": "",
            "status": "Approved",
            "warehouseCode": "04",
            "additionalFields": "",
            "orderAdditionalFields": {
              "U_Tag": "10"
            },
            "customerAdditionalFields": {
              "additionalProp1": "",
              "additionalProp2": "",
              "additionalProp3": ""
            },
            "shipping": {
              "method": "Total Express",
              "price": 0,
              "quotedPrice": 0,
              "dueDate": "2025-05-07T12:15:00.248Z",
              "address": {
                "ibgeCode": "",
                "name": "Tércio Souza de Jesus",
                "street": "Rua Arquimedes Gonçalves",
                "number": "580",
                "complement": "AP 51",
                "district": "Nazaré",
                "city": "Salvador",
                "country": "BR",
                "uf": "BA",
                "zipCode": "40050300",
                "phone": "71993060538",
                "mobile": "",
                "taxIdentification": "05149935530",
                "addressType": ""
              }
            },
            "payment": {
              "method": "Vindi",
              "total": 209.8,
              "discount": 0,
              "additional": 0,
              "installments": 1,
              "dueDate": "2025-05-07T12:15:00.248Z",
              "currency": "",
              "transactionCode": "",
              "address": {
                "ibgeCode": "",
                "name": "Tércio Souza de Jesus",
                "street": "Rua Arquimedes Gonçalves",
                "number": "580",
                "complement": "AP 51",
                "district": "Nazaré",
                "city": "Salvador",
                "country": "BR",
                "uf": "BA",
                "zipCode": "40050300",
                "phone": "71993060538",
                "mobile": "",
                "taxIdentification": "05149935530",
                "addressType": ""
              },
              "tid": "",
              "creditCardBrand": "",
              "nsu": "",
              "couponCode": "",
              "couponDescription": "",
              "giftVoucher": "",
              "subTotal": 209.8
            },
            "customer": {
              "name": "Tércio Souza de Jesus",
              "email": "terciodejesus@gmail.com",
              "taxIdentification": "05149935530",
              "phoneNumber": "71993060538",
              "additionalFields": ""
            },
            "products": [
              {
                "discount": 0,
                "price": 209.8,
                "quantity": 1,
                "sku": "SC3038001",
                "name": "SuperCoffee Choconilla 220g"
              },
              {
                "discount": 0,
                "price": 209.8,
                "quantity": 1,
                "sku": "SC3038001",
                "name": "SuperCoffee Choconilla 220g",
                "UsageType": 6
              }
            ]
          }],
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': formattedToken,
            },
            timeout: 30000, // 30 segundos para criação de pedidos
          }
        )
      );

      this.logger.log(response.data);

      this.logger.log(`Pedido criado com sucesso`);
      
      return {
        status: 'success'
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