# Tech Context - Order Integrator

## Stack Tecnológica

### Framework Principal
- **NestJS 11.0.1**: Framework Node.js para aplicações escaláveis
- **TypeScript 5.7.3**: Linguagem principal com tipagem estática
- **Node.js**: Runtime JavaScript (versão LTS recomendada)

### Dependências Core

#### HTTP e Comunicação
- **@nestjs/axios 4.0.0**: Client HTTP baseado em Axios
- **axios 1.10.0**: Cliente HTTP para integrações externas
- **rxjs 7.8.1**: Programação reativa para observables

#### Validação e Transformação
- **class-validator 0.14.2**: Validação declarativa via decorators
- **class-transformer 0.5.1**: Transformação de objetos e tipos

#### Configuração e Autenticação
- **@nestjs/config 4.0.2**: Gestão de configuração e variáveis ambiente
- **jsonwebtoken 9.0.2**: Manipulação de tokens JWT
- **@types/jsonwebtoken 9.0.10**: Tipos TypeScript para JWT

#### Reflection e Metadados
- **reflect-metadata 0.2.2**: Necessário para decorators do NestJS

### Ferramentas de Desenvolvimento

#### Linting e Formatação
- **ESLint 9.18.0**: Linter JavaScript/TypeScript
- **Prettier 3.4.2**: Formatador de código
- **typescript-eslint 8.20.0**: Parser ESLint para TypeScript

#### Build e Transpilação
- **@swc/core 1.10.7**: Compilador rápido Rust-based
- **@swc/cli 0.6.0**: CLI para SWC
- **ts-node 10.9.2**: Execução direta de arquivos TypeScript
- **ts-loader 9.5.2**: Webpack loader para TypeScript

#### Testes
- **Jest 29.7.0**: Framework de testes
- **ts-jest 29.2.5**: Preset Jest para TypeScript
- **Supertest 7.0.0**: Testes HTTP end-to-end
- **@nestjs/testing 11.0.1**: Utilitários de teste para NestJS

## Configuração do Ambiente

### Variáveis de Ambiente Necessárias

#### Configuração Bahn
```env
BAHN_BASE_URL=https://api.bahn.example.com
BAHN_USERNAME=username
BAHN_PASSWORD=password
```

#### Configuração Prime
```env
PRIME_BASE_URL=https://api.prime.example.com
PRIME_API_KEY=api_key_here
```

#### Configuração da Aplicação
```env
NODE_ENV=development|production
PORT=3000
```

### Scripts Disponíveis

#### Desenvolvimento
```bash
npm run start:dev    # Modo desenvolvimento com watch
npm run start:debug  # Modo debug com watch
npm run start        # Modo produção
```

#### Build e Deploy
```bash
npm run build        # Compilação para produção
npm run start:prod   # Execução da versão compilada
```

#### Qualidade de Código
```bash
npm run lint         # Executa ESLint com correções
npm run format       # Formata código com Prettier
```

#### Testes
```bash
npm run test         # Testes unitários
npm run test:watch   # Testes com watch mode
npm run test:cov     # Testes com coverage
npm run test:e2e     # Testes end-to-end
```

## Arquitetura de Deploy

### Estrutura de Build
```
dist/
├── main.js           # Entry point da aplicação
├── app.module.js     # Módulo principal
├── domain/           # Entidades e ports compilados
├── application/      # Serviços compilados
└── infra/           # Infraestrutura compilada
```

### Performance e Otimizações
- **SWC**: Compilador Rust mais rápido que tsc
- **Tree shaking**: Eliminação de código não utilizado
- **Minificação**: Código compactado para produção

## Configurações do Projeto

### TypeScript Configuration
```json
{
  "compilerOptions": {
    "module": "commonjs",
    "target": "ES2020",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

### Jest Configuration
- **Root**: `src/` directory
- **Test pattern**: `*.spec.ts`
- **Transform**: `ts-jest` para TypeScript
- **Coverage**: Incluído na configuração

### ESLint Configuration
- **Parser**: `@typescript-eslint/parser`
- **Extends**: Prettier integration
- **Rules**: Padrões de código TypeScript/NestJS

## Integrações Externas

### APIs Integradas

#### Bahn System API
- **Protocol**: HTTPS REST
- **Authentication**: JWT Bearer Token
- **Content-Type**: application/json
- **Timeout**: 30s para operações de pedido
- **Rate Limiting**: Não documentado

#### Prime Store API
- **Protocol**: HTTPS REST  
- **Authentication**: API Key via x-api-key header
- **Content-Type**: application/json
- **Timeout**: 10s para notificações
- **Webhook URL**: Configurável via environment

### Monitoramento e Logs

#### Logging
- **Provider**: NestJS Logger nativo
- **Levels**: log, error, warn, debug
- **Context**: Nome da classe como contexto
- **Format**: Timestamp + Level + Context + Message

#### Health Checks (Pendente)
- Endpoint `/health` para verificação de saúde
- Validação de conectividade com APIs externas
- Status de autenticação dos sistemas

## Restrições e Limitações

### Performance
- Timeout máximo: 30s por operação
- Memory limit: Não configurado (padrão Node.js)
- Concurrent requests: Limitado pelo event loop

### Segurança
- Tokens não são persistidos (apenas cache em memória)
- API Keys expostas via environment variables
- HTTPS obrigatório para integrações externas

### Escalabilidade
- Single instance (não clustered)
- Cache de token em memória local
- Sem persistência de estado entre restarts

## Roadmap Técnico

### Melhorias Planejadas
1. **Health Checks**: Endpoints de monitoramento
2. **Metrics**: Prometheus/Grafana integration
3. **Rate Limiting**: Proteção contra abuso
4. **Redis Cache**: Cache distribuído para tokens
5. **Database**: Persistência para auditoria
6. **Queue System**: Processamento assíncrono
7. **Docker**: Containerização da aplicação 