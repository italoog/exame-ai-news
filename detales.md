# EXAME AI NEWS

## Visão Geral

EXAME AI NEWS é uma plataforma fullstack moderna de notícias com inteligência artificial, inspirada em grandes portais como Exame, Bloomberg e Medium.

O projeto tem como objetivo demonstrar competências avançadas em:

- Frontend Architecture
- Backend Architecture
- Performance
- SEO
- Escalabilidade
- UX/UI
- Inteligência Artificial
- DevOps
- Observabilidade
- Processamento Assíncrono

A aplicação deverá possuir arquitetura enterprise e simular problemas reais enfrentados por empresas de mídia digital.

---

# Objetivo do Projeto

Construir uma plataforma inteligente de distribuição de conteúdo capaz de:

- Publicar notícias
- Personalizar feeds
- Resumir conteúdos com IA
- Recomendar artigos
- Gerenciar analytics
- Possuir CMS administrativo
- Escalar horizontalmente
- Demonstrar boas práticas de engenharia

---

# Stack Tecnológica

# Frontend

- React
- Next.js
- TypeScript
- TailwindCSS
- shadcn/ui
- Zustand
- TanStack Query
- React Hook Form
- Zod
- Framer Motion

---

# Backend

- Node.js
- NestJS
- Prisma ORM
- PostgreSQL
- Redis
- BullMQ
- JWT Authentication

---

# Infraestrutura

- Docker
- Docker Compose
- GitHub Actions
- Vercel (frontend)
- Railway / Render (backend)
- Cloudinary (upload de imagens)

---

# Funcionalidades Principais

# 1. Feed Inteligente

## Objetivo

Exibir notícias personalizadas com base no comportamento do usuário.

## Recursos

- Feed principal
- Notícias em destaque
- Notícias por categoria
- Trending topics
- Infinite scroll
- Recomendação personalizada

---

# 2. Sistema de IA

## Objetivo

Utilizar inteligência artificial para enriquecer a experiência do usuário.

## Recursos

- Resumo automático
- TL;DR
- Extração de tags
- Categorização automática
- Recomendação inteligente

## Possível integração

- OpenAI API

---

# 3. CMS Administrativo

## Objetivo

Permitir gerenciamento completo do conteúdo.

## Funcionalidades

- CRUD de artigos
- Upload de imagens
- Drafts
- Agendamento de publicação
- Edição rich text
- Controle de permissões

---

# 4. Sistema de Usuários

## Funcionalidades

- Registro
- Login
- Refresh token
- Recuperação de senha
- Perfil do usuário
- Favoritos
- Histórico de leitura

---

# 5. Sistema de Comentários

## Funcionalidades

- Comentários aninhados
- Curtidas
- Denúncia
- Moderação

---

# 6. Dashboard Analytics

## Objetivo

Exibir métricas de uso da plataforma.

## Métricas

- Artigos mais lidos
- Tempo médio de leitura
- CTR
- Retenção
- Usuários ativos
- Categorias populares

---

# Arquitetura Frontend

# Estrutura

/apps/web

/src
/modules
/shared
/components
/hooks
/services
/styles
/types
/utils

---

# Organização por Domínio

/modules
/auth
/news
/comments
/admin
/analytics
/profile

---

# Shared

/shared
/ui
/layout
/constants
/helpers

---

# Estratégias Frontend

# Performance

- SSR
- SSG
- Streaming SSR
- Lazy loading
- Dynamic imports
- Memoization
- Image optimization

---

# UX

- Skeleton loading
- Infinite scroll
- Optimistic updates
- Toast notifications
- Dark mode
- Responsividade total

---

# Acessibilidade

- Navegação via teclado
- Contraste adequado
- Labels acessíveis
- Semântica HTML correta

---

# SEO

- Metadata dinâmica
- Open Graph
- Sitemap
- robots.txt
- canonical URLs
- schema.org

---

# Arquitetura Backend

# Estrutura

/apps/api

/src
/modules
/common
/config
/database
/jobs
/providers

---

# Módulos

/auth
/users
/articles
/comments
/categories
/tags
/analytics
/recommendations
/ai
/admin

---

# Padrões Arquiteturais

- Modular Architecture
- Clean Architecture
- SOLID
- Repository Pattern
- DTO Pattern
- Validation Pipes

---

# Banco de Dados

# PostgreSQL

## Entidades

# users

- id
- name
- email
- password
- role
- avatar
- createdAt

# articles

- id
- title
- slug
- content
- summary
- coverImage
- publishedAt
- authorId
- categoryId

# comments

- id
- content
- articleId
- userId
- parentId

# categories

- id
- name
- slug

# tags

- id
- name

# analytics

- id
- articleId
- views
- readTime

# favorites

- id
- userId
- articleId

---

# Redis

## Objetivos

- Cache de feed
- Cache de artigos
- Sessões
- Trending topics
- Rate limiting

---

# BullMQ

## Jobs Assíncronos

- Geração de resumo IA
- Processamento analytics
- Emails
- Trending calculation
- Recomendação de conteúdo

---

# Sistema de IA

# Fluxo

1. Artigo é criado
2. Job é enviado para fila
3. IA processa conteúdo
4. Resumo é gerado
5. Tags são extraídas
6. Sugestões relacionadas são calculadas

---

# Sistema de Permissões

# Roles

- USER
- EDITOR
- ADMIN

---

# Segurança

- JWT
- Refresh token
- Password hashing
- Helmet
- Rate limiting
- Validation
- Sanitização
- CORS

---

# Realtime

## Possível uso de WebSocket

Funcionalidades:

- Breaking news
- Notificações
- Atualizações ao vivo

---

# DevOps

# Docker

## Containers

- frontend
- backend
- postgres
- redis

---

# CI/CD

## Pipeline

- Lint
- Testes
- Build
- Deploy automático

---

# Observabilidade

## Ferramentas sugeridas

- Sentry
- Winston
- OpenTelemetry

---

# Estratégia de Desenvolvimento

# MVP Inicial

## Funcionalidades obrigatórias

- Login
- CRUD de artigos
- Feed
- Página de artigo
- Comentários
- Favoritos
- IA resumo
- Dashboard básico

---

# Funcionalidades Avançadas

## Fase 2

- Recomendação inteligente
- Trending algorithm
- Websocket
- Analytics avançado
- Editor colaborativo

---

# Design System

## Objetivo

Criar componentes reutilizáveis e padronizados.

## Componentes

- Button
- Input
- Card
- Modal
- Tabs
- Dropdown
- Table
- Charts

---

# Diferenciais Técnicos

# O projeto deve demonstrar:

- Arquitetura escalável
- Organização enterprise
- Boas práticas
- Performance
- Escalabilidade
- UX moderna
- Integração com IA
- Processamento assíncrono
- Pensamento de produto

---

# README do Projeto

## Deve conter

- Visão do projeto
- Arquitetura
- Stack utilizada
- Como rodar localmente
- Decisões técnicas
- Tradeoffs
- Roadmap
- Screenshots
- Diagramas
- Estratégia de escalabilidade

---

# Estrutura de Monorepo (Opcional)

/apps
/web
/api

/packages
/ui
/eslint-config
/typescript-config

---

# Diferencial Extra

## Possíveis features premium

- Multi-language
- A/B testing
- Feature flags
- Microfrontends
- Event-driven architecture
- Recommendation engine avançado
- Vector database para IA

---

# Objetivo Final

O projeto deve transmitir sensação de:

- Produto real
- Sistema enterprise
- Aplicação escalável
- Engenharia madura
- Qualidade profissional

O foco principal não é apenas "funcionar", mas demonstrar:

- pensamento arquitetural
- capacidade de escalar sistemas
- organização
- visão de produto
- senioridade técnica

---
