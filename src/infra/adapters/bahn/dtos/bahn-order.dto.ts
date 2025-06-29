import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

// DTO for ecommerce order additional fields
export class BahnEcommerceOrderDTO {
  @IsOptional()
  @IsObject()
  orderAdditionalFields: Record<string, string>;

  @IsOptional()
  @IsObject()
  customerAdditionalFields: Record<string, string>;
}

// DTO for shipping information
export class BahnOrderShippingDTO {
  @IsNumber()
  id: number;

  @IsString()
  @IsNotEmpty()
  method: string;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsNumber()
  quotedPrice: number;

  @IsOptional()
  @IsDateString()
  dueDate: string;
}

// DTO for payment information
export class BahnOrderPaymentDTO {
  @IsNumber()
  id: number;

  @IsString()
  @IsNotEmpty()
  PaymentMethod: string;

  @IsNumber()
  total: number;

  @IsOptional()
  @IsNumber()
  discount: number;

  @IsOptional()
  @IsNumber()
  additional: number;

  @IsNumber()
  installments: number;

  @IsDateString()
  dueDate: string;

  @IsString()
  currency: string;

  @IsString()
  transactionCode: string;

  @IsString()
  tid: string;

  @IsOptional()
  @IsString()
  creditCardBrand: string;

  @IsOptional()
  @IsString()
  nsu: string;

  @IsOptional()
  @IsString()
  couponCode: string;

  @IsOptional()
  @IsString()
  couponDescription: string;

  @IsString()
  giftVoucher: string;

  @IsOptional()
  @IsNumber()
  subTotal: number;
}

// DTO for address information
export class BahnOrderAddressDTO {
  @IsNumber()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  street: string;

  @IsString()
  @IsNotEmpty()
  number: string;

  @IsOptional()
  @IsString()
  complement: string;

  @IsString()
  @IsNotEmpty()
  Neighborhood: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  Region: string;

  @IsString()
  @IsNotEmpty()
  zipCode: string;

  @IsOptional()
  @IsString()
  phone: string;

  @IsString()
  mobile: string;

  @IsString()
  @IsNotEmpty()
  taxIdentification: string;

  @IsNumber()
  addressType: number;
}

// DTO for customer information
export class BahnOrderCustomerDTO {
  @IsNumber()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  taxIdentification: string;

  @IsOptional()
  @IsString()
  phoneNumber: string;
}

// DTO for product information
export class BahnOrderProductDTO {
  @IsNumber()
  id: number;

  @IsOptional()
  @IsNumber()
  discount: number;

  @IsNumber()
  price: number;

  @IsNumber()
  quantity: number;

  @IsString()
  @IsNotEmpty()
  sku: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsNumber()
  usageType: number;
}

// Main DTO for Bahn Order response
export class BahnOrderDTO {
  /** Order ID from Bahn */
  @IsNumber()
  id: number;

  /** E-commerce name */
  @IsString()
  @IsNotEmpty()
  ecommerceName: string;

  /** Sales channel */
  @IsOptional()
  @IsString()
  channel: string;

  /** Order number */
  @IsString()
  @IsNotEmpty()
  number: string;

  /** E-commerce order ID */
  @IsOptional()
  @IsNumber()
  orderEcommerceID: number;

  /** Purchase date in ISO format */
  @IsOptional()
  @IsDateString()
  purchaseDate: string;

  /** Import date in ISO format */
  @IsOptional()
  @IsDateString()
  importedDate: string;

  /** Seller name */
  @IsString()
  sellerName: string;

  /** Brand name */
  @IsString()
  @IsNotEmpty()
  brandName: string;

  /** Warehouse code */
  @IsString()
  @IsNotEmpty()
  warehouseCode: string;

  /** Indicates if order is imported */
  @IsBoolean()
  isImported: boolean;

  /** E-commerce order additional fields */
  @IsOptional()
  @ValidateNested()
  @Type(() => BahnEcommerceOrderDTO)
  ecommerceOrder: BahnEcommerceOrderDTO;

  /** Shipping information */
  @ValidateNested()
  @Type(() => BahnOrderShippingDTO)
  shipping: BahnOrderShippingDTO;

  /** Order payments */
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BahnOrderPaymentDTO)
  orderPayments: BahnOrderPaymentDTO[];

  /** Order addresses */
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BahnOrderAddressDTO)
  orderAddress: BahnOrderAddressDTO[];

  /** Customer information */
  @ValidateNested()
  @Type(() => BahnOrderCustomerDTO)
  customer: BahnOrderCustomerDTO;

  /** Order products */
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BahnOrderProductDTO)
  products: BahnOrderProductDTO[];

  /** Tenant ID */
  @IsOptional()
  @IsNumber()
  tenantId: number;
}
