import { Address } from './Address';

export type Payment = {
  method: string;
  total: number;
  discount: number;
  installments: number;
  dueDate?: string;
  address: Address;
  subtotal: number;
  couponCode?: string;
  couponDescription?: string;
  nsu?: string;
  tid?: string;
  paymentGatewayId: string;
  brand?: string;
  gateway: string;
};
