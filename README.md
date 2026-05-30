# EXAME AI NEWS

> Plataforma enterprise fullstack de notícias com inteligência artificial — inspirada em EXAME, Bloomberg e Medium.  
> Demonstra arquitetura escalável, boas práticas de engenharia de software e integrações com IA generativa.

**🌐 Demo ao vivo:** [exame-ai-web.fzsuah.easypanel.host](https://exame-ai-web.fzsuah.easypanel.host)  
**🔌 API pública:** [exame-ai-api.fzsuah.easypanel.host/api/docs](https://exame-ai-api.fzsuah.easypanel.host/api/docs)

---

## Visão Geral

O EXAME AI NEWS é uma plataforma de jornalismo digital de nível enterprise com pipeline editorial completo, sistema de autenticação com múltiplos papéis, processamento assíncrono via filas, analytics em tempo real e resumos automáticos gerados por IA.

O projeto foi construído como monorepo com **Next.js 15** no frontend e **NestJS** no backend, compartilhando configurações de TypeScript, ESLint e componentes UI entre as aplicações.

---

## Stack Tecnológica

### Frontend — `apps/web`

| Tecnologia                  | Uso                                                   |
| --------------------------- | ----------------------------------------------------- |
| **Next.js 15** (App Router) | Framework React com SSR, SSG, ISR e Server Components |
| **TypeScript** (strict)     | Tipagem estática em todo o frontend                   |
| **TailwindCSS + shadcn/ui** | Design system e componentes                           |
| **TanStack Query v5**       | Cache de servidor, sincronização e mutações           |
| **Zustand**                 | Estado global (auth, tema)                            |
| **React Hook Form + Zod**   | Formulários com validação tipada                      |
| **TipTap**                  | Editor de texto rico para artigos                     |
| **Axios**                   | HTTP client com interceptors de auth                  |
| **next-themes**             | Dark/light mode persistente                           |
| **Framer Motion**           | Animações e transições                                |

### Backend — `apps/api`

| Tecnologia                              | Uso                                                |
| --------------------------------------- | -------------------------------------------------- |
| **NestJS**                              | Framework Node.js modular com DI e decorators      |
| **Prisma ORM**                          | Acesso ao banco, migrações e type-safety           |
| **PostgreSQL 16**                       | Banco de dados relacional principal                |
| **Redis 7**                             | Cache, sessões e filas                             |
| **BullMQ**                              | Processamento assíncrono (IA, analytics, trending) |
| **JWT + Refresh Tokens**                | Autenticação stateless com rotação de tokens       |
| **Passport.js**                         | Estratégias de autenticação (local, jwt)           |
| **class-validator + class-transformer** | Validação de DTOs                                  |
| **Swagger/OpenAPI**                     | Documentação automática da API                     |
| **Helmet + throttler**                  | Segurança e rate limiting                          |
| **bcrypt**                              | Hash de senhas                                     |
| **Winston**                             | Logs estruturados                                  |

### Infraestrutura

| Tecnologia                  | Uso                                                              |
| --------------------------- | ---------------------------------------------------------------- |
| **Docker + Docker Compose** | Containerização multi-stage                                      |
| **Turborepo**               | Orchestração do monorepo com builds incrementais                 |
| **GitHub Actions**          | CI (lint, typecheck, test, build) + CD automático                |
| **Easypanel**               | Hosting em produção (Docker Swarm)                               |
| **pnpm workspaces**         | Gerenciamento de dependências do monorepo                        |
| **Husky + lint-staged**     | Git hooks: pre-commit (ESLint + Prettier) e pre-push (typecheck) |

---

## Arquitetura

```
exame-ai-news/                   ← Monorepo raiz (Turborepo + pnpm)
├── apps/
│   ├── web/                     ← Next.js 15 (App Router, standalone)
│   │   ├── src/app/             ← Páginas e layouts (Server + Client Components)
│   │   ├── src/shared/          ← Hooks, stores, lib, UI, layout
│   │   └── src/modules/         ← Feature modules
│   └── api/                     ← NestJS (Clean Architecture)
│       ├── src/modules/         ← 12 módulos de domínio
│       ├── src/common/          ← Guards, interceptors, decorators, filters
│       ├── src/config/          ← Configurações por ambiente
│       └── prisma/              ← Schema, migrações e seed
├── packages/
│   ├── ui/                      ← Componentes React compartilhados
│   ├── eslint-config/           ← Configs ESLint (base, nestjs, nextjs)
│   ├── typescript-config/       ← tsconfig (base, nestjs, nextjs)
│   └── prettier-config/         ← Regras de formatação compartilhadas
└── .github/
    ├── workflows/               ← CI (ci.yml) + CD (deploy.yml)
    └── instructions/            ← Guias para agentes IA
```

### Diagrama de Componentes

```
┌─────────────────────────────────────────────────────────────────┐
│                          USUÁRIO                                │
└──────────────────────────────┬──────────────────────────────────┘
                               │ HTTPS
┌──────────────────────────────▼──────────────────────────────────┐
│                    Next.js 15 (Easypanel)                       │
│  ┌─────────────────┐  ┌──────────────────┐  ┌────────────────┐  │
│  │ Server Components│  │ Client Components│  │   API Routes   │ │
│  │  (SSR/no-cache)  │  │  (React Query)   │  │  (revalidate)  │ │
│  └────────┬─────────┘  └────────┬─────────┘  └───────┬────────┘ │
└───────────│─────────────────────│────────────────────│──────────┘
            │                     │                    │
            └──────────────┬──────┘                    │
                           │ HTTP interno                │
┌──────────────────────────▼──────────────────────────────────────┐
│                    NestJS API (Easypanel)                       │
│  ┌──────────┐  ┌───────────┐  ┌──────────┐  ┌───────────────┐   │
│  │   Auth   │  │  Articles │  │Analytics │  │  AI / BullMQ  │   │
│  │ JWT+Bcrypt│  │ CRUD+Roles│  │  Events  │  │ Summarize/Tag │  │
│  └──────────┘  └───────────┘  └──────────┘  └───────────────┘   │
└──────────────────┬────────────────────────────┬─────────────────┘
                   │                            │
        ┌──────────▼──────────┐      ┌──────────▼──────────┐
        │    PostgreSQL 16    │      │       Redis 7       │
        │  (dados principais) │      │   (cache + filas)   │
        └─────────────────────┘      └─────────────────────┘
```

---

## Funcionalidades

### Portal de Notícias

- **Homepage editorial** com artigo destaque, trending, últimas notícias e barra de categorias
- **Feed infinito** de artigos com scroll infinito e filtros dinâmicos
- **Página de artigo** com rich text, imagem de capa, tags, tempo de leitura, contador de views e comentários
- **Busca em tempo real** com debounce por título, conteúdo e tags
- **Filtro por categoria** (Tecnologia, Economia, Mercados, Startups, Negócios, Internacional)
- **Artigos relacionados** e recomendações personalizadas
- **Dark mode** persistente via next-themes + Zustand

### Autenticação & Usuários

- **Registro e login** com validação Zod
- **JWT com Refresh Token rotation** — access token curto (1h), refresh token longo (7d); `refreshToken` persistido no localStorage; renovação automática via interceptor Axios (envia token no body, atualiza Zustand store e localStorage)
- **Logout completo** — invalida refresh token no banco, limpa localStorage e estado Zustand
- **Recuperação de senha** via e-mail (token único, TTL configurável)
- **Perfil do usuário** com edição de nome, bio e avatar

### Pipeline Editorial

| Role        | Criar rascunho | Editar artigo  | Publicar | Gerenciar usuários |
| ----------- | :------------: | :------------: | :------: | :----------------: |
| **USER**    |       ❌       |       ❌       |    ❌    |         ❌         |
| **REDATOR** |       ✅       | só os próprios |    ❌    |         ❌         |
| **EDITOR**  |       ✅       |  qualquer um   |    ✅    |         ❌         |
| **ADMIN**   |       ✅       |  qualquer um   |    ✅    |         ✅         |

- **Editor rico** TipTap com formatação, listas, headings, links, negrito/itálico
- **Fluxo de status**: `DRAFT` → `PUBLISHED` → `ARCHIVED` (ou `SCHEDULED`)
- **Após publicar**, redirecionamento automático para o artigo publicado
- **Dashboard do editor** com lista de artigos próprios e ações rápidas

### Inteligência Artificial

- **AI Summary** — BullMQ job enfileira geração de resumo automático após publicação. Provedor primário: Gemini; fallback: Groq (llama-3.3-70b); exibido nos cards via `aiSummary` quando `summary` está vazio
- **Auto-tagging** — análise de conteúdo para sugestão de tags relevantes
- **Trending algorithm** — job periódico que calcula artigos em alta com base em views e tempo
- **Recomendações** — engine baseada em histórico de leitura e preferências do usuário

### Analytics

- **Rastreamento de eventos**: `view`, `read_complete`, `click`, `share`
- **Dashboard admin** com top artigos, total de views, engajamento
- **Read history** por usuário com tempo gasto e percentual lido
- **Processamento assíncrono** via BullMQ para não impactar latência da API

### Favoritos & Interações

- **Favoritar artigos** com toggle (add/remove) e verificação de estado
- **Comentários aninhados** — seção completa na página do artigo: formulário para novos comentários, respostas inline por comentário, curtidas e exclusão (próprio ou admin)
- **Contadores em tempo real** de comentários e favoritos

### Admin Dashboard

- **Gestão de artigos** (listar, filtrar por status, publicar, arquivar, deletar)
- **Gestão de usuários** (listar, buscar, alterar role)
- **Analytics** (`/admin/analytics`) — top 10 artigos por views, comentários e favoritos com data de publicação e categoria

### Newsletter

- **Inscrição de e-mail** com validação e rate limit (5 requisições/minuto)
- Armazenamento de subscribers no banco

---

## Banco de Dados

### Modelos Principais

```prisma
enum Role          { USER REDATOR EDITOR ADMIN }
enum ArticleStatus { DRAFT PUBLISHED ARCHIVED SCHEDULED }
enum CommentStatus { ACTIVE HIDDEN DELETED }

model User {
  id, name, email, password, role, avatar,
  bio, isActive, emailVerified, createdAt
  → articles, comments, favorites, readHistory, analyticsEvents
}

model Article {
  id, title, slug (unique), content, summary, aiSummary,
  coverImage, status, featured, publishedAt, scheduledAt,
  readTime, viewCount, createdAt
  → author (User), category, tags[], comments[], favorites[]
}

model Category { id, name, slug, description, color }
model Tag      { id, name, slug }

model Comment     { id, content, status, likeCount → user, article, parent?, replies[] }
model Favorite    { userId + articleId (PK composta) }
model ReadHistory { userId, articleId, readTimeSpent, completed }
model AnalyticsEvent { eventType, userId?, articleId?, metadata (Json), ip }
model RefreshToken    { token (unique), userId, expiresAt }
model PasswordResetToken { token (unique), userId, expiresAt, usedAt }
model NewsletterSubscriber { email (unique) }
```

### Índices de Performance

- Articles: `(status, publishedAt DESC)`, `(categoryId, status)`, `(featured, status)`
- Analytics: `(articleId, createdAt)`, `(eventType, createdAt)`
- ReadHistory: `(userId, articleId UNIQUE)`

---

## API — Endpoints

### Auth `/api/auth`

| Método | Rota               | Descrição                  |
| ------ | ------------------ | -------------------------- |
| POST   | `/register`        | Registro de usuário        |
| POST   | `/login`           | Login (rate-limit: 10/min) |
| POST   | `/refresh`         | Renovar access token       |
| POST   | `/logout`          | Invalidar refresh token    |
| POST   | `/forgot-password` | Solicitar reset de senha   |
| POST   | `/reset-password`  | Confirmar novo password    |

### Articles `/api/articles`

| Método | Rota             | Descrição                                                       | Auth     |
| ------ | ---------------- | --------------------------------------------------------------- | -------- |
| GET    | `/`              | Listar com filtros (page, limit, category, tag, search, status) | Opcional |
| GET    | `/trending`      | Top artigos por views                                           | —        |
| GET    | `/featured`      | Artigos em destaque                                             | —        |
| GET    | `/:slug`         | Artigo completo por slug                                        | Opcional |
| POST   | `/`              | Criar artigo                                                    | REDATOR+ |
| PATCH  | `/:id`           | Atualizar artigo                                                | REDATOR+ |
| PATCH  | `/:id/publish`   | Publicar                                                        | EDITOR+  |
| PATCH  | `/:id/unpublish` | Despublicar                                                     | EDITOR+  |
| PATCH  | `/:id/archive`   | Arquivar                                                        | EDITOR+  |
| DELETE | `/:id`           | Deletar                                                         | ADMIN    |

### Outros módulos

| Módulo          | Rota base                    | Destaques                        |
| --------------- | ---------------------------- | -------------------------------- |
| Users           | `/api/users`                 | CRUD, troca de role              |
| Categories      | `/api/categories`            | CRUD, busca por slug             |
| Tags            | `/api/tags`                  | Listagem, populares              |
| Comments        | `/api/articles/:id/comments` | CRUD, likes, aninhados           |
| Favorites       | `/api/favorites`             | Toggle, verificação de estado    |
| Analytics       | `/api/analytics`             | Eventos, dashboard, top articles |
| Recommendations | `/api/recommendations`       | For-you, popular, similar        |
| Newsletter      | `/api/newsletter`            | Subscribe (rate-limit: 5/min)    |
| Health          | `/api/health`                | Status dos serviços              |

> **Documentação interativa (Swagger):** [`/api/docs`](https://exame-ai-api.fzsuah.easypanel.host/api/docs)

---

## Setup Local

### Pré-requisitos

- Node.js 20+
- pnpm 9+
- Docker + Docker Compose

### Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/italoog/exame-ai-news.git
cd exame-ai-news

# 2. Configure variáveis de ambiente
cp .env.example .env
# Edite .env com suas credenciais (veja seção abaixo)

# 3. Setup completo (instala deps + sobe infra + migra + seed)
make setup

# 4. Inicia todos os serviços em modo desenvolvimento
make dev
```

### Variáveis de Ambiente (`.env`)

```env
# Banco de dados
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/exame_news

# JWT
JWT_SECRET=seu-segredo-jwt-muito-longo-e-seguro
JWT_REFRESH_SECRET=outro-segredo-refresh-muito-longo
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# IA (pelo menos uma)
OPENAI_API_KEY=sk-...
GROQ_API_KEY=gsk_...
GEMINI_API_KEY=...

# App
APP_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3000

# E-mail (opcional)
RESEND_API_KEY=re_...
EMAIL_FROM=noreply@exame-ai.com
```

### Acessos Locais

| Serviço       | URL                            |
| ------------- | ------------------------------ |
| Frontend      | http://localhost:3000          |
| API           | http://localhost:3001/api      |
| Swagger       | http://localhost:3001/api/docs |
| Prisma Studio | http://localhost:5555          |

---

## Comandos Disponíveis

```bash
make dev          # Inicia ambiente de desenvolvimento (todos os containers)
make stop         # Para todos os containers
make clean        # Remove containers, volumes e orphans
make logs         # Logs de todos os serviços
make logs-api     # Logs apenas da API
make db-migrate   # Executa migrações pendentes
make db-seed      # Popula banco com dados de teste
make db-reset     # Reseta e recria o banco do zero
make db-studio    # Abre Prisma Studio (GUI do banco)
make test         # Roda suíte de testes
make lint         # Lint em todos os pacotes
make build        # Build de produção
make help         # Lista todos os comandos disponíveis
```

---

## Credenciais de Teste (produção e local)

| Usuário   | E-mail             | Senha     | Role    |
| --------- | ------------------ | --------- | ------- |
| Admin     | admin@exame.com    | Senha123! | ADMIN   |
| Editor 1  | editor1@exame.com  | Senha123! | EDITOR  |
| Editor 2  | editor2@exame.com  | Senha123! | EDITOR  |
| Redator 1 | redator1@exame.com | Senha123! | REDATOR |
| Redator 2 | redator2@exame.com | Senha123! | REDATOR |
| Leitor    | joao@email.com     | Senha123! | USER    |

---

## Deploy em Produção

### Infraestrutura (Easypanel + Docker Swarm)

```
Oracle Cloud VPS — Ubuntu 24.04 LTS (163.176.191.113)
└── Easypanel v2 (Docker Swarm)
    ├── exame-ai_web      → Next.js standalone  (porta 3000)
    ├── exame-ai_api      → NestJS              (porta 3001)
    ├── exame-ai_postgres → PostgreSQL 16       (porta 5432)
    └── exame-ai_redis    → Redis 7             (porta 6379)
```

### Git Hooks (Husky)

| Hook         | Trigger      | Validação                                                           |
| ------------ | ------------ | ------------------------------------------------------------------- |
| `pre-commit` | `git commit` | `lint-staged` — ESLint + Prettier nos arquivos staged (`.ts/.tsx`)  |
| `pre-push`   | `git push`   | `tsc --noEmit` em api e web — bloqueia push com erros de TypeScript |

### CI/CD (GitHub Actions)

**`.github/workflows/ci.yml`** — Roda em todo push/PR:

1. `lint` — ESLint em todos os pacotes
2. `type-check` — TypeScript strict em api e web
3. `test` — Sobe PostgreSQL, migra e roda testes unitários
4. `build` — Build de produção dos dois apps

**`.github/workflows/deploy.yml`** — Roda no push para `main`:

1. Dispara webhook de rebuild da API no Easypanel
2. Dispara webhook de rebuild do Web no Easypanel

### Variáveis de Deploy (GitHub Secrets)

```
EASYPANEL_DEPLOY_API_URL  → webhook de rebuild da API
EASYPANEL_DEPLOY_WEB_URL  → webhook de rebuild do Web
```

---

## Decisões Técnicas

| Decisão                           | Motivação                                                                                                                                                                                                           |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Monorepo com Turborepo**        | Builds incrementais, cache remoto e compartilhamento de configs/tipos                                                                                                                                               |
| **App Router (Next.js 15)**       | Server Components por padrão para SEO e performance; Client Components só onde necessário                                                                                                                           |
| **ISR com `revalidate`**          | Homepage e artigos usam ISR (60s); trending usa 5min — equilibra performance e frescor dos dados                                                                                                                    |
| **`NEXT_PUBLIC_*` em build-time** | `ARG/ENV` no Dockerfile garante que o bundle do cliente tenha a URL correta                                                                                                                                         |
| **BullMQ para IA**                | Jobs pesados de IA não bloqueiam a request HTTP; processados em background                                                                                                                                          |
| **JWT + Refresh Rotation**        | Access token curto (1h, via `JWT_EXPIRES_IN`) reduz janela de ataque; refresh token (7d) armazenado no cliente e enviado no body — interceptor Axios renova automaticamente e limpa estado Zustand em caso de falha |
| **Repository Pattern (Prisma)**   | Isola acesso a dados; facilita testes unitários com mocks                                                                                                                                                           |
| **Índices compostos**             | `(status, publishedAt)` e `(featured, status)` cobrem as queries mais frequentes                                                                                                                                    |
| **Docker multi-stage**            | Imagem final sem devDependencies e sem código-fonte exposto                                                                                                                                                         |
| **Internal Docker URL**           | Comunicação server-side usa `http://exame-ai_api:3001` (DNS interno do Swarm)                                                                                                                                       |

---

## Estrutura de Módulos da API

```
src/modules/
├── auth/           ← JWT, Bcrypt, Refresh Tokens, Reset de Senha
├── users/          ← CRUD, Perfil, Roles
├── articles/       ← CRUD, Filtros, Status, Permissões por Role
├── categories/     ← CRUD, Slug
├── tags/           ← Listagem, Populares
├── comments/       ← Aninhados, Likes, Moderação
├── favorites/      ← Toggle, Check
├── analytics/      ← Eventos, Dashboard, Top Articles
├── recommendations/← For-You, Popular, Similar
├── ai/             ← OpenAI/Groq/Gemini + BullMQ Processors
├── notifications/  ← Serviço de notificações
├── newsletter/     ← Subscribers com rate-limit
└── queue/          ← Setup BullMQ
```
