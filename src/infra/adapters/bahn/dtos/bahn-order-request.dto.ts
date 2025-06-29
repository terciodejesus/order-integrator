import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';

// DTO for address information (used in both shipping and payment)
export class BahnOrderRequestAddressDTO {
  @IsString()
  @IsNotEmpty()
  ibgeCode: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  street: string;

  @IsString()
  @IsNotEmpty()
  number: string;

  @IsString()
  @IsNotEmpty()
  complement: string;

  @IsString()
  @IsNotEmpty()
  district: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  uf: string;

  @IsString()
  @IsNotEmpty()
  zipCode: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  mobile: string;

  @IsString()
  @IsNotEmpty()
  taxIdentification: string;

  @IsString()
  @IsNotEmpty()
  addressType: string;
}

// DTO for shipping information
export class BahnOrderRequestShippingDTO {
  @IsString()
  @IsNotEmpty()
  method: string;

  @IsNumber()
  price: number;

  @IsNumber()
  quotedPrice: number;

  @IsDateString()
  dueDate: string;

  @ValidateNested()
  @Type(() => BahnOrderRequestAddressDTO)
  address: BahnOrderRequestAddressDTO;
}

// DTO for payment information
export class BahnOrderRequestPaymentDTO {
  @IsString()
  @IsNotEmpty()
  method: string;

  @IsNumber()
  total: number;

  @IsNumber()
  discount: number;

  @IsNumber()
  additional: number;

  @IsNumber()
  installments: number;

  @IsDateString()
  dueDate: string;

  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsString()
  @IsNotEmpty()
  transactionCode: string;

  @ValidateNested()
  @Type(() => BahnOrderRequestAddressDTO)
  address: BahnOrderRequestAddressDTO;

  @IsString()
  @IsNotEmpty()
  tid: string;

  @IsString()
  @IsNotEmpty()
  creditCardBrand: string;

  @IsString()
  @IsNotEmpty()
  nsu: string;

  @IsString()
  @IsNotEmpty()
  couponCode: string;

  @IsString()
  @IsNotEmpty()
  couponDescription: string;

  @IsString()
  @IsNotEmpty()
  giftVoucher: string;

  @IsNumber()
  subTotal: number;
}

// DTO for customer information
export class BahnOrderRequestCustomerDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  taxIdentification: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  additionalFields: string;
}

// DTO for product information
export class BahnOrderRequestProductDTO {
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

  @IsNumber()
  usageType: number;
}

// Main DTO for Bahn Order request
export class BahnOrderRequestDTO {
  /** E-commerce name */
  @IsString()
  @IsNotEmpty()
  ecommerceName: string;

  /** Sales channel */
  @IsString()
  @IsNotEmpty()
  channel: string;

  /** Order number */
  @IsString()
  @IsNotEmpty()
  number: string;

  /** Purchase date in ISO format */
  @IsDateString()
  purchaseDate: string;

  /** Seller name */
  @IsString()
  @IsNotEmpty()
  sellerName: string;

  /** Brand name */
  @IsString()
  @IsNotEmpty()
  brandName: string;

  /** Warehouse code */
  @IsString()
  @IsNotEmpty()
  warehouseCode: string;

  /** Additional fields as string */
  @IsString()
  @IsNotEmpty()
  additionalFields: string;

  /** Order additional fields */
  @IsObject()
  orderAdditionalFields: Record<string, string>;

  /** Customer additional fields */
  @IsObject()
  customerAdditionalFields: Record<string, string>;

  /** Shipping information */
  @ValidateNested()
  @Type(() => BahnOrderRequestShippingDTO)
  shipping: BahnOrderRequestShippingDTO;

  /** Payment information */
  @ValidateNested()
  @Type(() => BahnOrderRequestPaymentDTO)
  payment: BahnOrderRequestPaymentDTO;

  /** Customer information */
  @ValidateNested()
  @Type(() => BahnOrderRequestCustomerDTO)
  customer: BahnOrderRequestCustomerDTO;

  /** Order products */
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BahnOrderRequestProductDTO)
  products: BahnOrderRequestProductDTO[];
}
