# EXAME AI NEWS — Copilot Instructions

## Visão Geral do Projeto

EXAME AI NEWS é uma plataforma fullstack enterprise de notícias com inteligência artificial, inspirada em Exame, Bloomberg e Medium. O objetivo é demonstrar arquitetura escalável, boas práticas de engenharia e integrações com IA.

## Stack Tecnológica

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Linguagem**: TypeScript (strict mode)
- **Estilização**: TailwindCSS + shadcn/ui
- **Estado global**: Zustand
- **Servidor de estado**: TanStack Query v5
- **Formulários**: React Hook Form + Zod
- **Animações**: Framer Motion

### Backend
- **Framework**: NestJS
- **ORM**: Prisma
- **Banco de dados**: PostgreSQL
- **Cache**: Redis
- **Filas**: BullMQ
- **Auth**: JWT + Refresh Tokens

### Infraestrutura
- Docker + Docker Compose
- GitHub Actions (CI/CD)
- Vercel (frontend)
- Railway / Render (backend)
- Cloudinary (imagens)

## Estrutura do Monorepo

```
/apps/web       ← Next.js frontend
/apps/api       ← NestJS backend
/packages/ui    ← Shared UI components
/packages/eslint-config
/packages/typescript-config
```

## Padrões Obrigatórios

### TypeScript
- Sempre usar `strict: true`
- Nunca usar `any` — preferir `unknown` com type guards
- Exportar tipos/interfaces de arquivos `*.types.ts`

### Backend (NestJS)
- Arquitetura modular com Clean Architecture
- Repository Pattern para acesso a dados
- DTOs com validação via `class-validator`
- Guards para autenticação e autorização
- Interceptors para logging e transformação de resposta

### Frontend (Next.js)
- App Router com Server Components por padrão
- Client Components apenas quando necessário (interatividade, hooks)
- SSR/SSG para SEO e performance
- Metadata dinâmica com `generateMetadata()`

### Design System (EXAME)
- Paleta primária: vermelho `#E10600`
- Fundo neutro: branco `#FFFFFF` / superfície `#FAFAFA`
- Fonte: Inter
- Grid de 8pt
- Shadows sutis, bordas suaves
- Visual editorial premium (ver `.github/instructions/design-system.instructions.md`)

## Roles e Permissões

| Role   | Permissões |
|--------|-----------|
| USER   | Leitura, comentários, favoritos |
| EDITOR | + Criar/editar artigos |
| ADMIN  | + Gestão de usuários, analytics |

## Módulos do Backend

`auth`, `users`, `articles`, `comments`, `categories`, `tags`, `analytics`, `recommendations`, `ai`, `admin`

## Entidades Principais

- `users`: id, name, email, password, role, avatar, createdAt
- `articles`: id, title, slug, content, summary, coverImage, publishedAt, authorId, categoryId
- `comments`: id, content, articleId, userId, parentId
- `categories`: id, name, slug
- `tags`: id, name
- `analytics`: id, articleId, views, readTime
- `favorites`: id, userId, articleId

## Jobs BullMQ

- `generate-ai-summary` — resumo automático de artigos
- `process-analytics` — agregação de métricas
- `send-email` — notificações
- `calculate-trending` — trending topics
- `generate-recommendations` — recomendações personalizadas

## Segurança

- JWT com expiração curta + Refresh Token de longa duração
- Bcrypt para hashing de senhas
- Helmet para headers de segurança
- Rate limiting com Redis
- Sanitização de inputs
- CORS configurado por ambiente

## Regras Gerais

- Sempre criar testes unitários para services e helpers
- Sempre documentar APIs com decorators do Swagger (`@ApiTags`, `@ApiOperation`)
- Usar variáveis de ambiente via `@nestjs/config` / `process.env` com validação Zod
- Logs estruturados com Winston
- Nunca commitar secrets ou `.env` real
