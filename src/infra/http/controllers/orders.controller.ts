import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { OrderIntegrationService } from 'src/application/services/order-integration.service';
import { CreateOrderRequestDTO } from '../dtos/create-order-request.dto';
import {
  CreateOrderErrorResponseDTO,
  CreateOrderSuccessResponseDTO,
  ValidationErrorResponseDTO
} from '../dtos/create-order-response.dto';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(
    private readonly orderIntegrationService: OrderIntegrationService,
  ) {}

  @Post()
  @ApiOperation({ 
    summary: 'Criar novo pedido',
    description: 
      'Cria um novo pedido e o processa de forma assíncrona. ' +
      'O pedido será integrado com o sistema Bahn para criação e ' +
      'notificações de sucesso serão enviadas para a Prime Store. ' +
      'A resposta é imediata, indicando que o pedido foi aceito para processamento.'
  })
  @ApiBody({ 
    type: CreateOrderRequestDTO,
    description: 'Dados completos do pedido a ser criado',
    examples: {
      'pedido-simples': {
        summary: 'Pedido simples com PIX',
        description: 'Exemplo de um pedido básico com pagamento PIX',
        value: {
          externalId: 'prime-12345',
          orderNumber: 'PED-001',
          channel: 'ecommerce',
          items: [{
            sku: 'CAFE-001',
            name: 'Café Premium Gourmet',
            quantity: 2,
            price: 25.90,
            discount: 0,
            gift: false
          }],
          customer: {
            name: 'João Silva',
            email: 'joao.silva@email.com',
            taxIdentification: '12345678901',
            phoneNumber: '11999999999'
          },
          shipping: {
            method: 'sedex',
            price: 15.00,
            quotedPrice: 15.00,
            deliveryDate: '2025-01-15T00:00:00Z',
            address: {
              name: 'João Silva',
              street: 'Rua das Flores',
              streetNumber: '123',
              district: 'Centro',
              city: 'São Paulo',
              uf: 'SP',
              zipCode: '01234567',
              phone: '11999999999'
            }
          },
          payment: {
            method: 'pix',
            total: 66.80,
            discount: 0,
            installments: 1,
            subtotal: 51.80,
            paymentGatewayId: 'pix-123456',
            gateway: 'pix',
            address: {
              name: 'João Silva',
              street: 'Rua das Flores',
              streetNumber: '123',
              district: 'Centro',
              city: 'São Paulo',
              uf: 'SP',
              zipCode: '01234567',
              phone: '11999999999'
            }
          },
          project: 'prime-store',
          createdAt: '2025-01-07T10:00:00Z'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Pedido criado com sucesso',
    type: CreateOrderSuccessResponseDTO,
    example: {
      status: 'success',
      message: 'Pedido criado com sucesso'
    }
  })
  @ApiBadRequestResponse({ 
    description: 'Dados inválidos ou erro de validação',
    type: ValidationErrorResponseDTO,
    example: {
      statusCode: 400,
      message: ['orderNumber should not be empty', 'email must be an email'],
      error: 'Bad Request'
    }
  })
  @ApiInternalServerErrorResponse({ 
    description: 'Erro interno do servidor ou falha na integração',
    type: CreateOrderErrorResponseDTO,
    example: {
      statusCode: 500,
      message: 'Erro interno do servidor',
      error: 'Internal Server Error'
    }
  })
  async createOrder(@Body() body: CreateOrderRequestDTO) {
    const result = await this.orderIntegrationService.createOrder(body);

    if (result.status === 'success') {
      return {
        status: 'success',
        message: result.message,
      };
    } else {
      throw new BadRequestException(result.message);
    }
  }
}
