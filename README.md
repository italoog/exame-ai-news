# EXAME AI NEWS

Plataforma fullstack enterprise de notícias com inteligência artificial, inspirada em EXAME, Bloomberg e Medium.

## Stack

**Frontend**: Next.js 14 · TypeScript · TailwindCSS · shadcn/ui · Zustand · TanStack Query  
**Backend**: NestJS · Prisma · PostgreSQL · Redis · BullMQ · JWT  
**Infra**: Docker · GitHub Actions · Vercel · Railway

## Início Rápido

### Pré-requisitos
- Node.js 20+
- pnpm 9+
- Docker + Docker Compose

### Setup Local

```bash
# 1. Clone o repositório
git clone https://github.com/seu-user/exame-ai-news.git
cd exame-ai-news

# 2. Configure variáveis de ambiente
cp .env.example .env
# Edite .env com suas credenciais

# 3. Setup completo (instala deps + sobe infra + migra + seed)
make setup

# 4. Inicia todos os serviços
make dev
```

### Acessos

| Serviço | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| API | http://localhost:3001/api |
| Swagger | http://localhost:3001/api/docs |
| Prisma Studio | http://localhost:5555 |

### Credenciais de Teste

| Usuário | Email | Senha | Role |
|---------|-------|-------|------|
| Admin | admin@exame.com | Senha123! | ADMIN |
| Editor | editor1@exame.com | Senha123! | EDITOR |
| Usuário | joao@email.com | Senha123! | USER |

## Comandos

```bash
make dev          # Inicia ambiente de desenvolvimento
make stop         # Para todos os containers
make clean        # Remove containers e volumes
make db-migrate   # Executa migrações pendentes
make db-seed      # Popula banco com dados de teste
make db-reset     # Reseta e recria o banco
make test         # Roda todos os testes
make logs         # Mostra logs dos containers
```

## Arquitetura

```
/
├── apps/
│   ├── web/          ← Next.js 14 (App Router)
│   └── api/          ← NestJS + Prisma
├── packages/
│   ├── ui/           ← Componentes compartilhados
│   ├── eslint-config/
│   └── typescript-config/
└── .github/
    ├── agents/       ← Agentes IA para desenvolvimento autônomo
    ├── instructions/
    └── workflows/    ← CI/CD
```

## Módulos da API

`/auth` · `/users` · `/articles` · `/categories` · `/tags` · `/comments` · `/favorites` · `/analytics` · `/admin`

## Decisões Técnicas

- **Monorepo com Turborepo**: builds incrementais e compartilhamento de tipos/configs
- **Cursor-based pagination**: performance superior para feeds com grande volume
- **Redis cache**: feeds e trending em cache com TTL configurável
- **BullMQ**: processamento assíncrono para IA e analytics sem impacto na latência da API
- **JWT + Refresh Token rotation**: segurança e UX balanceados
- **Server Components por padrão**: SSR/SSG para SEO e performance no Next.js
