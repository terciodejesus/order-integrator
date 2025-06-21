export type OrderItem = {
  sku: string;
  name: string;
  price: number;
  quantity: number;
  discount: number;
  gift?: boolean;
};
