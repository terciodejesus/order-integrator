# Tech Context - Order Integrator

## Stack Tecnológico

### Core Framework
- **NestJS 11.0.1**: Framework Node.js para APIs escaláveis
- **TypeScript 5.7.3**: Linguagem principal com tipagem estática
- **Node.js**: Runtime JavaScript

### Dependências Principais
- **@nestjs/axios 4.0.0**: HTTP client integrado com RxJS
- **axios 1.10.0**: Cliente HTTP para APIs externas
- **@nestjs/config 4.0.2**: Gerenciamento de configurações
- **class-validator 0.14.2**: Validação declarativa de DTOs
- **class-transformer 0.5.1**: Transformação de objetos
- **jsonwebtoken 9.0.2**: Manipulação de tokens JWT
- **rxjs 7.8.1**: Programação reativa

### Ferramentas de Desenvolvimento
- **Jest 29.7.0**: Framework de testes
- **ESLint 9.18.0**: Linting de código
- **Prettier 3.4.2**: Formatação de código
- **TypeScript ESLint**: Regras específicas para TS

## Configuração do Ambiente

### Scripts Disponíveis
```bash
npm run start:dev    # Desenvolvimento com watch mode
npm run build        # Build para produção
npm run test         # Testes unitários
npm run test:e2e     # Testes end-to-end
npm run lint         # Verificação de código
```

### Estrutura de Configuração
- **Variáveis de Ambiente**: Via @nestjs/config
- **Configurações Tipadas**: `BahnConfig` interface
- **Global Config**: Disponível em toda aplicação

## Arquitetura de Comunicação

### HTTP Client Setup
- **Timeout**: 30 segundos para operações externas
- **Headers**: Content-Type application/json + Authorization
- **Error Handling**: Try/catch com status codes específicos

### Autenticação
- **JWT Tokens**: Para APIs externas
- **Token Caching**: Em memória para performance
- **Auto Refresh**: Quando token expira

## Validação e Serialização

### Class Validator Decorators
- `@IsString()`, `@IsNumber()`, `@IsBoolean()`
- `@IsNotEmpty()`, `@IsOptional()`
- `@ValidateNested()` para objetos aninhados
- `@Type()` para transformação automática

### DTO Pattern
- Request DTOs: Validação de entrada
- Response DTOs: Tipagem de retorno APIs
- Separação entre domain entities e DTOs

## Logging e Monitoramento

### NestJS Logger
- Logger integrado por classe
- Níveis: LOG, ERROR, WARN, DEBUG
- Contexto específico por adapter/service

### Error Tracking
- Exceptions customizadas por domínio
- Stack traces completos
- Mensagens estruturadas

## Testes

### Jest Configuration
- Test environment: Node.js
- Coverage directory: ../coverage
- Root directory: src/
- Transform: ts-jest

### Test Structure
- Unit tests: `*.spec.ts`
- E2E tests: `test/` directory
- Coverage reports disponíveis

## Build e Deploy

### TypeScript Compilation
- `tsconfig.json`: Configuração principal
- `tsconfig.build.json`: Build otimizado
- **Target**: ES2021
- **Module**: CommonJS

### Production Build
- Compilação via `nest build`
- Output: `dist/` directory
- Start: `node dist/main`

## Constraints e Limitações

### Performance
- Timeout máximo: 30 segundos
- Cache de token em memória (não persistente)
- Single instance (sem clustering)

### Segurança
- Tokens em variáveis de ambiente
- Sem rate limiting implementado
- Headers CORS não configurados

### Escalabilidade
- Stateful token cache
- Sem load balancing
- Sem circuit breaker pattern 