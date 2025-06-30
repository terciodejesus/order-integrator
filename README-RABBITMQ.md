# 🐰 RabbitMQ Integration - Order Integrator

## 📋 Visão Geral

Esta implementação adiciona processamento assíncrono de pedidos usando RabbitMQ, transformando o fluxo síncrono em assíncrono com filas de mensagens.

## 🏗️ Arquitetura

```
Prime Store → OrdersController → RabbitMQ Queue → Consumer → OrderIntegrationService → Bahn/Prime
```

### Componentes Implementados

1. **OrderQueueProducer**: Envia pedidos para a fila
2. **OrderQueueConsumer**: Processa pedidos da fila
3. **DeadLetterConsumer**: Trata pedidos que falharam definitivamente
4. **RabbitMQModule**: Configuração dos componentes

## 🚀 Setup Local

### 1. Iniciar RabbitMQ

```bash
# Via Docker Compose
docker-compose up -d rabbitmq

# Ou manualmente
docker run -d --name rabbitmq-server \
  -p 5672:5672 \
  -p 15672:15672 \
  -e RABBITMQ_DEFAULT_USER=admin \
  -e RABBITMQ_DEFAULT_PASS=admin123 \
  rabbitmq:3.11-management
```

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# RabbitMQ Configuration
RABBITMQ_URL=amqp://admin:admin123@localhost:5672
RABBITMQ_EXCHANGE=order.exchange
RABBITMQ_ORDER_QUEUE=order.queue
RABBITMQ_DEAD_LETTER_QUEUE=order.dead-letter.queue
RABBITMQ_MAX_RETRIES=3
RABBITMQ_RETRY_DELAY=1000

# Outras configurações existentes...
BAHN_BASE_URL=https://api.bahn.example.com
BAHN_USERNAME=your_username
BAHN_PASSWORD=your_password
PRIME_BASE_URL=https://api.prime.example.com
PRIME_API_KEY=your_api_key
PORT=3000
```

### 3. Instalar Dependências

```bash
npm install @nestjs/microservices amqplib amqp-connection-manager
npm install --save-dev @types/amqplib
```

### 4. Iniciar Aplicação

```bash
npm run start:dev
```

## 🔄 Fluxo de Funcionamento

### 1. Recepção de Pedido (Síncrono)
```
POST /orders
├── Validação do DTO
├── Enfileiramento no RabbitMQ
└── Resposta imediata: "queued"
```

### 2. Processamento (Assíncrono)
```
Consumer → OrderIntegrationService → Bahn API → Prime Notification
```

### 3. Tratamento de Falhas
```
3 tentativas → Dead Letter Queue → Log de erro
```

## 🖥️ Management UI

Acesse o painel do RabbitMQ:
- **URL**: http://localhost:15672
- **User**: admin
- **Password**: admin123

### Filas Criadas
- `order.queue`: Fila principal de pedidos
- `order.dead-letter.queue`: Pedidos que falharam

## 📊 Monitoramento

### Logs Importantes
```
[OrderQueueProducer] Enfileirando pedido: ORDER-123
[OrderQueueConsumer] Processando pedido da fila: ORDER-123
[OrderQueueConsumer] Pedido processado com sucesso: ORDER-123
[DeadLetterConsumer] Pedido falhou definitivamente: ORDER-123
```

### Métricas no RabbitMQ UI
- Messages Ready: Pedidos aguardando processamento
- Message Rates: Taxa de mensagens/segundo
- Consumers: Número de consumers ativos

## 🧪 Testando a Implementação

### 1. Teste de Pedido Válido
```bash
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -d '{
    "externalId": "test-123",
    "orderNumber": "ORDER-123",
    "channel": "web",
    "items": [/* seus items */],
    "customer": {/* dados do cliente */},
    "shipping": {/* dados de entrega */},
    "payment": {/* dados de pagamento */},
    "project": "test"
  }'
```

**Resposta Esperada:**
```json
{
  "status": "queued",
  "message": "Pedido enfileirado para processamento",
  "orderId": "test-123",
  "orderNumber": "ORDER-123"
}
```

### 2. Verificar Processamento
- Acompanhe os logs da aplicação
- Verifique o RabbitMQ Management UI
- Confirme se o pedido foi processado no Bahn

## ⚠️ Troubleshooting

### RabbitMQ não inicia
```bash
# Verificar se a porta está ocupada
lsof -i :5672

# Limpar containers anteriores
docker rm -f rabbitmq-server
```

### Consumer não processa mensagens
- Verificar se `startAllMicroservices()` está sendo chamado
- Confirmar configuração de filas no Management UI
- Verificar logs de erro do consumer

### Dead Letter Queue com muitas mensagens
- Revisar configuração do Bahn/Prime
- Verificar conectividade com APIs externas
- Analisar logs de erro específicos

## 🔄 Próximos Passos

1. **Retry Logic Avançado**: Implementar backoff exponencial
2. **Circuit Breaker**: Proteção contra cascata de falhas
3. **Monitoring**: Métricas customizadas
4. **Scaling**: Múltiplos consumers
5. **Dead Letter Processing**: Notificação automática de falhas

## 📝 Configuração de Produção

Para produção, considere:
- RabbitMQ clusterizado
- SSL/TLS encryption
- Persistent volumes
- Backup strategies
- Load balancing
- Monitoring com Prometheus/Grafana 