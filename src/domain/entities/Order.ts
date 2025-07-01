import { Customer } from './Customer';
import { OrderItem } from './OrderItem';
import { Payment } from './Payment';
import { Shipping } from './Shipping';

export type Order = {
  externalId: string;
  orderNumber: string;
  channel: string;
  items: OrderItem[];
  shipping: Shipping;
  customer: Customer;
  payment: Payment;
  project: string;
  additionalFields?: Record<string, string>;
  customerAdditionalFields?: Record<string, string>;
  createdAt: string;
};
