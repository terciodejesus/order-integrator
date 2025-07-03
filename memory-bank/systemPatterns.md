# System Patterns - Order Integrator

## Arquitetura Geral
O sistema segue **Clean Architecture** com **Domain-Driven Design (DDD)**, organizando o código em camadas bem definidas com dependências direcionadas do exterior para o centro.

```
Infra (Controllers, Adapters) → Application (Services) → Domain (Entities, Ports)
```

## Estrutura de Diretórios

### Domain Layer (`src/domain/`)
**Responsabilidade**: Regras de negócio puras, independentes de framework
- `entities/`: Tipos e estruturas de dados do domínio
- `ports/`: Interfaces (contratos) para comunicação externa

### Application Layer (`src/application/`)
**Responsabilidade**: Orquestração de casos de uso
- `services/`: Serviços de aplicação que coordenam operações

### Infrastructure Layer (`src/infra/`)
**Responsabilidade**: Detalhes técnicos e integrações externas
- `adapters/`: Implementações dos ports (Bahn, Prime)
- `http/`: Controllers, DTOs, mappers para API REST
- `config/`: Configurações específicas de cada integração

## Padrões Implementados

### 1. Ports and Adapters (Hexagonal Architecture)
**Ports** (Domain): Interfaces que definem contratos
- `OrderIntegrationPort`: Contrato para criação de pedidos
- `StorePort`: Contrato para notificações
- `AuthenticationPort`: Contrato para autenticação

**Adapters** (Infrastructure): Implementações concretas
- `BahnOrderAdapter`: Implementa `OrderIntegrationPort` para Bahn
- `PrimeStoreAdapter`: Implementa `StorePort` para Prime
- `BahnAuthAdapter`: Implementa `AuthenticationPort` para Bahn

### 2. Dependency Injection
NestJS gerencia dependências com decorators:
```typescript
@Inject('OrderIntegrationPort')
private readonly orderIntegration: OrderIntegrationPort
```

### 3. Data Transfer Objects (DTOs)
Validação de entrada com `class-validator`:
- Separação entre dados de entrada e entidades de domínio
- Validação automática via decorators
- Transformação de tipos quando necessário

### 4. Mapper Pattern
Conversão entre diferentes representações:
- `BahnOrderToRequestMapper`: Domain → Bahn API format
- `BahnOrderToDomainMapper`: Bahn response → Domain format
- `OrderMapper`: HTTP DTO → Domain entity

### 5. Exception Handling
Exceções específicas por contexto:
- `BahnOrderException`: Erros específicos da integração Bahn
- `BahnAuthException`: Erros de autenticação Bahn
- `PrimeStoreException`: Erros da integração Prime

### 6. Configuration Pattern
Configuração externa via `@nestjs/config`:
- Tipagem forte para configurações
- Separação por módulo/serviço
- Validação de configurações obrigatórias

## Convenções de Código

### Nomenclatura
- **Classes**: PascalCase (`OrderIntegrationService`)
- **Métodos/Variáveis**: camelCase (`createOrder`)
- **Arquivos**: kebab-case (`order-integration.service.ts`)
- **Constantes**: UPPERCASE (`BAHN_BASE_URL`)

### Estrutura de Métodos
```typescript
async methodName(param: Type): Promise<ReturnType> {
  // Validação de entrada
  // Lógica principal (sem linhas em branco)
  // Tratamento de erros
  // Retorno
}
```

### Error Handling Pattern
```typescript
try {
  // Operação principal
  return successResult;
} catch (error) {
  if (error instanceof AxiosError) {
    // Tratamento específico HTTP
  }
  // Fallback genérico
  throw new InternalServerErrorException();
}
```

## Padrões de Integração

### 1. Token Caching
Tokens JWT são cacheados e validados antes do uso:
```typescript
if (!this.authentication.validateToken(this.cachedToken)) {
  const authResult = await this.authentication.authenticate(credentials);
  this.cachedToken = authResult.accessToken;
}
```

### 2. Timeout Configuration
Timeouts específicos por tipo de operação:
- Criação de pedidos: 30s
- Notificações: 10s
- Autenticação: 5s (padrão)

### 3. Structured Logging
Logs estruturados com contexto:
```typescript
this.logger.log(`Criando pedido no Bahn: ${orderNumber}`);
this.logger.error('Erro na criação:', error.response?.data);
```

### 4. HTTP Status Mapping
Tratamento específico por código HTTP:
- 401: Token inválido → Renovar autenticação
- 400: Dados inválidos → Retornar erro específico
- 422: Validação → Retornar detalhes de validação
- 5xx: Erro do servidor → Retry ou fallback

### 5. Queue-Based Processing (NOVO)
Processamento assíncrono com RabbitMQ:
```typescript
// Producer pattern
await this.client.emit('order.process', {
  ...order,
  enqueuedAt: new Date().toISOString(),
  correlationId: this.generateCorrelationId(order.externalId),
});

// Consumer pattern
@EventPattern('order.process')
async handleOrderProcessing(@Payload() data: Order, @Ctx() context: RmqContext) {
  // Process message and acknowledge
}
```

### 6. Correlation ID Pattern (NOVO)
Rastreamento de mensagens através do sistema:
```typescript
private generateCorrelationId(externalId: string): string {
  const timestamp = Date.now();
  return `${externalId}-${timestamp}`;
}
```

## Module Organization

### Core Module Structure
```typescript
@Module({
  imports: [ConfigModule],
  controllers: [Controller],
  providers: [
    Service,
    { provide: 'Port', useClass: Adapter },
  ],
  exports: [Service],
})
```

### Configuração Global
- `ConfigModule.forRoot({ isGlobal: true })`
- Providers globais para ports comuns
- Exception filters globais para tratamento uniforme

## Padrões de Teste (Para Implementar)
- **Unit Tests**: Cada service e adapter
- **Integration Tests**: Fluxos completos end-to-end
- **Mocking**: Test doubles para dependências externas
- **Coverage**: Mínimo 80% de cobertura de código 