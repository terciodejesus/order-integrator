export interface RabbitMQConfig {
  url: string;
  exchange: string;
  orderQueue: string;
  deadLetterQueue: string;
  retryDelay: number;
  maxRetries: number;
}

export const rabbitmqConfig = () => ({
  rabbitmq: {
    url: process.env.RABBITMQ_URL || 'amqp://admin:admin123@localhost:5672',
    exchange: process.env.RABBITMQ_EXCHANGE || 'order.exchange',
    orderQueue: process.env.RABBITMQ_ORDER_QUEUE || 'order.queue',
    deadLetterQueue: process.env.RABBITMQ_DEAD_LETTER_QUEUE || 'order.dead-letter.queue',
    retryDelay: parseInt(process.env.RABBITMQ_RETRY_DELAY || '1000', 10),
    maxRetries: parseInt(process.env.RABBITMQ_MAX_RETRIES || '3', 10),
  },
}); 