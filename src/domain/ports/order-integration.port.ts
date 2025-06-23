import { Order } from "../entities";

export interface OrderIntegrationResult {
  status: 'success' | 'error';
}

export interface OrderIntegrationPort {
  createOrder(order: Order): Promise<OrderIntegrationResult>;
}