import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

/**
 * Address DTO for Bahn API
 */
export class BahnAddressDto {
  @IsString()
  street: string;

  @IsString()
  number: string;

  @IsString()
  neighborhood: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  zipCode: string;

  @IsString()
  country: string;

  @IsOptional()
  @IsString()
  complement?: string;
}

/**
 * Customer DTO for Bahn API
 */
export class BahnCustomerDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  document: string;

  @IsString()
  phone: string;

  @ValidateNested()
  @Type(() => BahnAddressDto)
  address: BahnAddressDto;
}

/**
 * Order item DTO for Bahn API
 */
export class BahnOrderItemDto {
  @IsString()
  sku: string;

  @IsString()
  name: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNumber()
  @Min(0)
  unitPrice: number;

  @IsNumber()
  @Min(0)
  totalPrice: number;

  @IsOptional()
  @IsString()
  description?: string;
}

/**
 * Payment DTO for Bahn API
 */
export class BahnPaymentDto {
  @IsString()
  method: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsNumber()
  @Min(1)
  installments: number;

  @IsOptional()
  @IsString()
  transactionId?: string;

  @IsOptional()
  @IsString()
  gateway?: string;

  @ValidateNested()
  @Type(() => BahnAddressDto)
  billingAddress: BahnAddressDto;
}

/**
 * Shipping DTO for Bahn API
 */
export class BahnShippingDto {
  @IsString()
  carrier: string;

  @IsNumber()
  @Min(0)
  cost: number;

  @IsDateString()
  estimatedDelivery: string;

  @ValidateNested()
  @Type(() => BahnAddressDto)
  address: BahnAddressDto;

  @IsOptional()
  @IsString()
  trackingCode?: string;
}

/**
 * Main order request DTO for Bahn API
 */
export class BahnOrderRequestDto {
  @IsString()
  orderNumber: string;

  @IsString()
  externalId: string;

  @IsString()
  channel: string;

  @IsString()
  project: string;

  @ValidateNested()
  @Type(() => BahnCustomerDto)
  customer: BahnCustomerDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BahnOrderItemDto)
  items: BahnOrderItemDto[];

  @ValidateNested()
  @Type(() => BahnPaymentDto)
  payment: BahnPaymentDto;

  @ValidateNested()
  @Type(() => BahnShippingDto)
  shipping: BahnShippingDto;

  @IsOptional()
  @IsString()
  notes?: string;
}
