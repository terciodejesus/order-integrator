# Project Brief - Order Integrator

## Visão Geral
Sistema de integração de pedidos desenvolvido em NestJS que permite o processamento e sincronização de pedidos entre diferentes plataformas de e-commerce e sistemas de gestão externos.

## Objetivo Principal
Criar uma camada de integração robusta e escalável que permita:
- Receber pedidos de diferentes canais de venda
- Processar e validar dados de pedidos
- Integrar com APIs externas para criação/sincronização de pedidos
- Garantir rastreabilidade e auditoria de todas as operações

## Requisitos Funcionais
1. **Recepção de Pedidos**: API REST para receber pedidos via POST /orders
2. **Validação de Dados**: Validação completa de estrutura e campos obrigatórios
3. **Integração Externa**: Comunicação com APIs externas (ex: Bahn)
4. **Autenticação**: Gerenciamento de tokens de autenticação para APIs externas
5. **Mapeamento de Dados**: Transformação entre formatos internos e externos
6. **Tratamento de Erros**: Gestão robusta de erros e fallbacks
7. **Logging**: Rastreamento completo de operações e erros

## Requisitos Não Funcionais
1. **Performance**: Timeout de 30s para operações externas
2. **Confiabilidade**: Retry automático para falhas de autenticação
3. **Manutenibilidade**: Arquitetura limpa com separação clara de responsabilidades
4. **Escalabilidade**: Design modular para adição de novos integradores
5. **Monitoramento**: Logs estruturados para debugging e análise

## Escopo Atual
- Integração com API Bahn para criação de pedidos
- Suporte a estrutura completa de pedidos (cliente, itens, pagamento, envio)
- Gestão de autenticação JWT com cache de token
- Mapeamento bidirecional de dados entre domínio e API externa

## Tecnologias Core
- **Framework**: NestJS
- **Linguagem**: TypeScript
- **Validação**: class-validator
- **HTTP Client**: Axios via @nestjs/axios
- **Configuração**: @nestjs/config 