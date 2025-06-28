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
export class CreateOrderAddressDto {
  @IsString()
  name: string;

  @IsString()
  street: string;

  @IsString()
  streetNumber: string;

  @IsOptional()
  @IsString()
  complement?: string;

  @IsString()
  district: string;

  @IsString()
  city: string;

  @IsString()
  uf: string;

  @IsString()
  zipCode: string;

  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  taxIdentification?: string;
}

/**
 * Customer DTO for REST API
 */
export class CreateOrderCustomerDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  taxIdentification: string;

  @IsString()
  phoneNumber: string;
}

/**
 * Order item DTO for REST API
 */
export class CreateOrderItemDto {
  @IsString()
  sku: string;

  @IsString()
  name: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  discount: number;

  @IsOptional()
  @IsBoolean()
  gift?: boolean;
}

/**
 * Payment DTO for REST API
 */
export class CreateOrderPaymentDto {
  @IsString()
  method: string;

  @IsNumber()
  @Min(0)
  total: number;

  @IsNumber()
  @Min(0)
  discount: number;

  @IsNumber()
  @Min(1)
  installments: number;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ValidateNested()
  @Type(() => CreateOrderAddressDto)
  address: CreateOrderAddressDto;

  @IsNumber()
  @Min(0)
  subtotal: number;

  @IsOptional()
  @IsString()
  couponCode?: string;

  @IsOptional()
  @IsString()
  couponDescription?: string;

  @IsOptional()
  @IsString()
  nsu?: string;

  @IsOptional()
  @IsString()
  tid?: string;

  @IsString()
  paymentGatewayId: string;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsString()
  gateway: string;
}

/**
 * Shipping DTO for REST API
 */
export class CreateOrderShippingDto {
  @IsString()
  method: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  quotedPrice: number;

  @ValidateNested()
  @Type(() => CreateOrderAddressDto)
  address: CreateOrderAddressDto;

  @IsOptional()
  @IsString()
  quoteId?: string;

  @IsDateString()
  deliveryDate: string;
}

/**
 * Main create order request DTO
 */
export class CreateOrderRequestDto {
  @IsString()
  externalId: string;

  @IsString()
  orderNumber: string;

  @IsString()
  channel: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderShippingDto)
  shipping: CreateOrderShippingDto;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderCustomerDto)
  customer: CreateOrderCustomerDto;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderPaymentDto)
  payment: CreateOrderPaymentDto;

  @IsString()
  project: string;

  @IsOptional()
  @IsObject()
  additionalFields?: Record<string, string>;

  @IsOptional()
  @IsObject()
  customerAdditionalFields?: Record<string, string>;
}
