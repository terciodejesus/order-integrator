import { Address } from './Address';

export type Shipping = {
  method: string;
  price: number;
  quotedPrice: number;
  address: Address;
  quoteId?: string;
  deliveryDate: string;
};
