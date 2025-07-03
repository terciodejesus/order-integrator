import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsArray,
    IsBoolean,
    IsDateString,
    IsEmail,
    IsNotEmpty,
    IsNumber,
    IsObject,
    IsOptional,
    IsString,
    Min,
    ValidateNested,
} from 'class-validator';

/**
 * Address DTO for REST API
 */
export class CreateOrderAddressDTO {
  @ApiProperty({ 
    example: 'João Silva',
    description: 'Nome completo da pessoa para entrega/cobrança' 
  })
  @IsString()
  name: string;

  @ApiProperty({ 
    example: 'Rua das Flores',
    description: 'Nome da rua ou logradouro' 
  })
  @IsString()
  street: string;

  @ApiProperty({ 
    example: '123',
    description: 'Número do endereço' 
  })
  @IsString()
  streetNumber: string;

  @ApiProperty({ 
    example: 'Apt 45, Bloco B',
    description: 'Complemento do endereço (apartamento, bloco, etc.)',
    required: false 
  })
  @IsOptional()
  @IsString()
  complement?: string;

  @ApiProperty({ 
    example: 'Centro',
    description: 'Bairro ou distrito' 
  })
  @IsString()
  district: string;

  @ApiProperty({ 
    example: 'São Paulo',
    description: 'Nome da cidade' 
  })
  @IsString()
  city: string;

  @ApiProperty({ 
    example: 'SP',
    description: 'Sigla do estado (UF)' 
  })
  @IsString()
  uf: string;

  @ApiProperty({ 
    example: '01234567',
    description: 'Código postal (CEP) apenas números' 
  })
  @IsString()
  zipCode: string;

  @ApiProperty({ 
    example: '11999999999',
    description: 'Telefone para contato' 
  })
  @IsString()
  phone: string;

  @ApiProperty({ 
    example: '12345678901',
    description: 'CPF ou CNPJ para identificação fiscal',
    required: false 
  })
  @IsOptional()
  @IsString()
  taxIdentification?: string;
}

/**
 * Customer DTO for REST API
 */
export class CreateOrderCustomerDTO {
  @ApiProperty({ 
    example: 'João Silva',
    description: 'Nome completo do cliente' 
  })
  @IsString()
  name: string;

  @ApiProperty({ 
    example: 'joao.silva@email.com',
    description: 'Email válido do cliente' 
  })
  @IsEmail()
  email: string;

  @ApiProperty({ 
    example: '12345678901',
    description: 'CPF ou CNPJ do cliente' 
  })
  @IsString()
  taxIdentification: string;

  @ApiProperty({ 
    example: '11999999999',
    description: 'Telefone do cliente' 
  })
  @IsString()
  phoneNumber: string;
}

/**
 * Order item DTO for REST API
 */
export class CreateOrderItemDTO {
  @ApiProperty({ 
    example: 'CAFE-001',
    description: 'Código SKU único do produto' 
  })
  @IsString()
  sku: string;

  @ApiProperty({ 
    example: 'Café Premium Gourmet 250g',
    description: 'Nome descritivo do produto' 
  })
  @IsString()
  name: string;

  @ApiProperty({ 
    example: 2,
    description: 'Quantidade do item',
    minimum: 1 
  })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({ 
    example: 25.90,
    description: 'Preço unitário do item',
    minimum: 0 
  })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ 
    example: 0,
    description: 'Desconto aplicado no item',
    minimum: 0 
  })
  @IsNumber()
  @Min(0)
  discount: number;

  @ApiProperty({ 
    example: false,
    description: 'Indica se o item é um presente',
    required: false 
  })
  @IsOptional()
  @IsBoolean()
  gift?: boolean;
}

/**
 * Payment DTO for REST API
 */
export class CreateOrderPaymentDTO {
  @ApiProperty({ 
    example: 'pix',
    description: 'Método de pagamento utilizado',
    enum: ['pix', 'credit_card', 'debit_card', 'boleto', 'transfer']
  })
  @IsString()
  method: string;

  @ApiProperty({ 
    example: 66.80,
    description: 'Valor total do pagamento',
    minimum: 0 
  })
  @IsNumber()
  @Min(0)
  total: number;

  @ApiProperty({ 
    example: 0,
    description: 'Desconto aplicado no pagamento',
    minimum: 0 
  })
  @IsNumber()
  @Min(0)
  discount: number;

  @ApiProperty({ 
    example: 1,
    description: 'Número de parcelas',
    minimum: 1 
  })
  @IsNumber()
  @Min(1)
  installments: number;

  @ApiProperty({ 
    example: '2025-01-15T00:00:00Z',
    description: 'Data de vencimento (para boleto ou similar)',
    required: false 
  })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiProperty({ 
    type: () => CreateOrderAddressDTO,
    description: 'Endereço de cobrança' 
  })
  @ValidateNested()
  @Type(() => CreateOrderAddressDTO)
  address: CreateOrderAddressDTO;

  @ApiProperty({ 
    example: 51.80,
    description: 'Subtotal antes de taxas e descontos',
    minimum: 0 
  })
  @IsNumber()
  @Min(0)
  subtotal: number;

  @ApiProperty({ 
    example: 'DESCONTO10',
    description: 'Código do cupom de desconto',
    required: false 
  })
  @IsOptional()
  @IsString()
  couponCode?: string;

  @ApiProperty({ 
    example: 'Desconto de 10% para novos clientes',
    description: 'Descrição do cupom aplicado',
    required: false 
  })
  @IsOptional()
  @IsString()
  couponDescription?: string;

  @ApiProperty({ 
    example: 'NSU123456',
    description: 'Número sequencial único da transação',
    required: false 
  })
  @IsOptional()
  @IsString()
  nsu?: string;

  @ApiProperty({ 
    example: 'TID789012',
    description: 'Transaction ID do gateway',
    required: false 
  })
  @IsOptional()
  @IsString()
  tid?: string;

  @ApiProperty({ 
    example: 'pix-123456789',
    description: 'ID único do gateway de pagamento' 
  })
  @IsString()
  paymentGatewayId: string;

  @ApiProperty({ 
    example: 'visa',
    description: 'Bandeira do cartão (se aplicável)',
    required: false 
  })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiProperty({ 
    example: 'pix',
    description: 'Gateway de pagamento utilizado' 
  })
  @IsString()
  gateway: string;
}

/**
 * Shipping DTO for REST API
 */
export class CreateOrderShippingDTO {
  @ApiProperty({ 
    example: 'sedex',
    description: 'Método de entrega utilizado',
    enum: ['sedex', 'pac', 'express', 'same_day', 'pickup']
  })
  @IsString()
  method: string;

  @ApiProperty({ 
    example: 15.00,
    description: 'Preço cobrado pelo frete',
    minimum: 0 
  })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ 
    example: 15.00,
    description: 'Preço cotado original do frete',
    minimum: 0 
  })
  @IsNumber()
  @Min(0)
  quotedPrice: number;

  @ApiProperty({ 
    type: () => CreateOrderAddressDTO,
    description: 'Endereço de entrega' 
  })
  @ValidateNested()
  @Type(() => CreateOrderAddressDTO)
  address: CreateOrderAddressDTO;

  @ApiProperty({ 
    example: 'QUOTE123456',
    description: 'ID da cotação de frete',
    required: false 
  })
  @IsOptional()
  @IsString()
  quoteId?: string;

  @ApiProperty({ 
    example: '2025-01-15T00:00:00Z',
    description: 'Data prevista para entrega' 
  })
  @IsDateString()
  deliveryDate: string;
}

/**
 * Main create order request DTO
 */
export class CreateOrderRequestDTO {
  @ApiProperty({ 
    example: 'prime-12345',
    description: 'ID único do pedido no sistema externo (Prime Store)' 
  })
  @IsString()
  externalId: string;

  @ApiProperty({ 
    example: 'PED-001',
    description: 'Número do pedido para identificação' 
  })
  @IsString()
  orderNumber: string;

  @ApiProperty({ 
    example: 'ecommerce',
    description: 'Canal de venda do pedido',
    enum: ['ecommerce', 'marketplace', 'phone', 'store']
  })
  @IsString()
  channel: string;

  @ApiProperty({ 
    type: [CreateOrderItemDTO],
    description: 'Lista de itens do pedido' 
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDTO)
  items: CreateOrderItemDTO[];

  @ApiProperty({ 
    type: () => CreateOrderShippingDTO,
    description: 'Informações de entrega e frete' 
  })
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderShippingDTO)
  shipping: CreateOrderShippingDTO;

  @ApiProperty({ 
    type: () => CreateOrderCustomerDTO,
    description: 'Dados do cliente' 
  })
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderCustomerDTO)
  customer: CreateOrderCustomerDTO;

  @ApiProperty({ 
    type: () => CreateOrderPaymentDTO,
    description: 'Informações de pagamento' 
  })
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderPaymentDTO)
  payment: CreateOrderPaymentDTO;

  @ApiProperty({ 
    example: 'prime-store',
    description: 'Identificação do projeto/loja' 
  })
  @IsString()
  project: string;

  @ApiProperty({ 
    example: { utm_source: 'google', utm_campaign: 'black_friday' },
    description: 'Campos adicionais personalizados',
    required: false 
  })
  @IsOptional()
  @IsObject()
  additionalFields?: Record<string, string>;

  @ApiProperty({ 
    example: { preferences: 'sem_açucar', 'newsletter': 'true' },
    description: 'Campos adicionais específicos do cliente',
    required: false 
  })
  @IsOptional()
  @IsObject()
  customerAdditionalFields?: Record<string, string>;

  @ApiProperty({ 
    example: '2025-01-07T10:00:00Z',
    description: 'Data de criação do pedido' 
  })
  @IsDateString()
  createdAt: string;
}
