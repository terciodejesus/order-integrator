# Active Context - Order Integrator

## Status Atual (Dezembro 2024)
Sistema em desenvolvimento ativo com integração Bahn funcional e questões de refinamento de DTOs e status codes HTTP.

## Trabalho Atual em Andamento

### Problemas Identificados
1. **DTO Mismatch**: `BahnOrderResponseDto` não corresponde ao retorno real da API
   - API retorna: `{"orderIndex": 0, "orderNumber": "TESTE2105012", "success": true}`
   - API erro: `{"orderIndex":0,"success":false,"errors":[...]}`
   - DTO atual tinha campos incorretos

2. **Status Code Management**: Necessidade de retornar status HTTP apropriados
   - Sucesso: 201 Created
   - Erro de duplicação: 409 Conflict  
   - Erro de validação: 400 Bad Request
   - Erro de autenticação: 401 Unauthorized

3. **Error Response Structure**: API Bahn retorna diferentes estruturas para sucesso/erro

### Decisões Técnicas Recentes
1. **DTO Unificado**: Criar um DTO que suporte tanto sucesso quanto erro
2. **Status Code Dinâmico**: Implementar retorno de status baseado no tipo de erro
3. **Optional Fields**: Campos como `orderNumber` e `errors` são opcionais baseados no contexto

## Contexto de Integração Bahn

### API Behavior Observado
- **Endpoint**: POST /order
- **Request**: Array de pedidos `[bahnOrder]`
- **Response**: Array de resultados com mesmo índice
- **Success**: `{"orderIndex": 0, "orderNumber": "XXX", "success": true}`
- **Error**: `{"orderIndex": 0, "success": false, "errors": [...]}`

### Error Patterns Identificados
- **Duplicate Order**: "Order XXX from ecommerce Integrações API already exists"
- **Authentication**: Token inválido/expirado
- **Validation**: Dados obrigatórios ausentes

## Próximas Decisões Necessárias

### 1. Error Handling Strategy
**Opções em análise:**
- A) Retornar sempre 200 com status interno (atual)
- B) Usar status HTTP apropriados baseados no erro
- C) Híbrido: Success 201, errors com status específicos

### 2. DTO Structure
**Decisão tomada:** DTO unificado com campos opcionais
```typescript
{
  orderIndex: number;
  orderNumber?: string;  // só no sucesso
  success: boolean;
  errors?: BahnOrderErrorDto[];  // só no erro
}
```

### 3. Logging Improvement
**Considerações:**
- Adicionar correlation IDs
- Estruturar logs para melhor debugging
- Implementar métricas de performance

## Padrões Emergentes

### 1. Adapter Response Processing
```typescript
// Pattern estabelecido
const bahnResponse = response.data[0]; // Array response
if (bahnResponse.success) {
  // Success path
} else {
  // Error path com processamento de errors array
}
```

### 2. Token Management
- Cache em memória funcionando
- Refresh automático em 401
- Validação antes de cada request

### 3. Mapper Patterns
- Domain → Request: Funcional
- Response → Domain: Em desenvolvimento
- Error handling: Implementado

## Questões em Aberto
1. Como tratar timeouts da API Bahn?
2. Implementar retry strategy para falhas temporárias?
3. Adicionar circuit breaker pattern?
4. Como fazer rollback de pedidos criados parcialmente?

## Métricas e Monitoring
- **Logs estruturados**: Implementados
- **Error tracking**: Funcional  
- **Performance metrics**: Não implementado
- **Health checks**: Não implementado 