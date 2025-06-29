# Project Brief - Order Integrator

## Visão Geral
Order Integrator é um sistema de integração de pedidos desenvolvido em NestJS que conecta diferentes plataformas de e-commerce com sistemas de gestão de pedidos. O projeto facilita a comunicação entre lojas online e sistemas de backoffice, automatizando o processo de criação e notificação de pedidos.

## Objetivo Principal
Desenvolver uma API robusta que:
- Receba pedidos de diferentes fontes (atualmente Prime Store)
- Integre com sistemas de gestão de pedidos (atualmente Bahn)
- Notifique o sucesso/falha das operações
- Garanta confiabilidade e rastreabilidade das transações

## Escopo do Projeto

### Funcionalidades Core
1. **Recepção de Pedidos**: API REST para receber pedidos via webhook/POST
2. **Integração com Bahn**: Criação de pedidos no sistema Bahn via API
3. **Notificação de Sucesso**: Callback para a Prime Store sobre status dos pedidos
4. **Autenticação**: Gestão de tokens JWT para Bahn e API keys para Prime
5. **Validação**: Validação robusta de dados de entrada usando class-validator
6. **Logging**: Sistema completo de logs para auditoria e debugging

### Integrações Atuais
- **Bahn System**: Sistema de gestão de pedidos (destino)
- **Prime Store**: Loja online (origem dos pedidos)

### Fora do Escopo Inicial
- Interface de usuário
- Gestão de estoque
- Processamento de pagamentos
- Relatórios avançados

## Arquitetura
O projeto segue Clean Architecture com Domain-Driven Design:
- **Domain**: Entidades de negócio e ports (interfaces)
- **Application**: Serviços de aplicação e casos de uso
- **Infrastructure**: Adaptadores, controllers, configurações

## Tecnologias
- **Framework**: NestJS 11.x
- **Linguagem**: TypeScript 5.x
- **HTTP Client**: Axios via @nestjs/axios
- **Validação**: class-validator + class-transformer
- **Autenticação**: JWT (jsonwebtoken)
- **Configuração**: @nestjs/config
- **Testes**: Jest + Supertest

## Critérios de Sucesso
1. ✅ API funcional para criação de pedidos
2. ✅ Integração estável com sistema Bahn
3. ✅ Sistema de notificações para Prime Store
4. ✅ Tratamento robusto de erros
5. ⏳ Cobertura de testes adequada
6. ⏳ Documentação completa da API

## Padrões de Qualidade
- Código em inglês com logs e mensagens em português
- Tipagem forte em TypeScript (evitar `any`)
- Documentação JSDoc para métodos públicos
- Tratamento de exceções específicas
- Princípios SOLID aplicados
- Nomenclatura clara e consistente 