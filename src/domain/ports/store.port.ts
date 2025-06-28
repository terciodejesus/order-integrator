import { Order } from '../entities';

export interface StorePort {
  notifyOrderSuccess(order: Order): Promise<void>;
}
