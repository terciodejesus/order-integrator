import { Order } from '../entities';

export interface OrderIntegrationResult {
  status: 'success' | 'error';
  message?: string;
}

export interface OrderIntegrationPort {
  createOrder(order: Order): Promise<OrderIntegrationResult>;
}
