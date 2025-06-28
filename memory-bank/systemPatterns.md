# System Patterns - Order Integrator

## Arquitetura Geral
O sistema segue uma **Arquitetura Hexagonal** (Ports & Adapters) com clara separação entre domínio, aplicação e infraestrutura.

```
Domain Layer (Core Business Logic)
├── Entities: Order, Customer, OrderItem, Payment, Shipping, Address
├── Ports: OrderIntegrationPort, AuthenticationPort
└── Business Rules: Validação de domínio

Application Layer (Use Cases)
└── Services: OrderIntegrationService

Infrastructure Layer (External Concerns)
├── HTTP Controllers: OrdersController
├── Adapters: BahnOrderAdapter, BahnAuthAdapter
├── DTOs: Request/Response validation
├── Mappers: Data transformation
└── Configuration: BahnConfig
```

## Padrões de Design Implementados

### 1. Ports & Adapters (Hexagonal Architecture)
- **Ports**: Interfaces de domínio (`OrderIntegrationPort`, `AuthenticationPort`)
- **Adapters**: Implementações de infraestrutura (`BahnOrderAdapter`, `BahnAuthAdapter`)
- **Benefício**: Permite trocar implementações sem afetar o domínio

### 2. Dependency Injection
- Uso do container DI do NestJS
- Injeção de dependências via constructor
- Providers configurados em módulos

### 3. Mapper Pattern
- `BahnOrderToRequestMapper`: Domain → API Request
- `BahnOrderToDomainMapper`: API Response → Domain
- **Benefício**: Isolamento de transformações de dados

### 4. DTO Pattern
- Validação de entrada: `CreateOrderRequestDto`
- Validação de resposta: `BahnOrderResponseDto`
- **Benefício**: Type safety e validação automática

### 5. Exception Handling
- Exceptions específicas: `BahnOrderException`, `BahnAuthException`
- Tratamento centralizado de erros
- Status codes apropriados

### 6. Token Caching
- Cache em memória do token de autenticação
- Validação antes de uso
- Refresh automático quando expirado

## Estrutura de Módulos

### InfraModule
- Importa HttpModule para comunicação externa
- Registra adapters como providers
- Configuração de injeção de dependências

### Separação de Responsabilidades
- **Controllers**: Apenas recepção/resposta HTTP
- **Services**: Orquestração de use cases
- **Adapters**: Comunicação com sistemas externos
- **Mappers**: Transformação de dados
- **DTOs**: Validação e tipagem

## Princípios SOLID Aplicados

### Single Responsibility
- Cada classe tem uma única responsabilidade
- Adapters separados para autenticação e pedidos
- Mappers específicos para cada transformação

### Open/Closed
- Fácil adição de novos adapters via interface
- Extensível para novos sistemas de integração

### Liskov Substitution
- Adapters podem ser substituídos via interface
- Testes podem usar mocks facilmente

### Interface Segregation
- Interfaces pequenas e específicas
- `AuthenticationPort` vs `OrderIntegrationPort`

### Dependency Inversion
- Dependência de abstrações, não implementações
- Core business logic independente de infraestrutura 