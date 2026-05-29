# ================================
# Stage: base
# ================================
FROM node:20-alpine AS base
RUN npm install -g pnpm
WORKDIR /app

# ================================
# Stage: builder
# — contexto = raiz do monorepo
# ================================
FROM base AS builder
# Copia todo o monorepo para resolver workspace:* deps
COPY . .
RUN pnpm install --frozen-lockfile

# Gera Prisma client e compila
WORKDIR /app/apps/api
RUN pnpm run db:generate && pnpm run build

# Cria deploy standalone sem symlinks de workspace
WORKDIR /app
RUN pnpm --filter=@exame/api deploy --prod /deploy
# Sobrescreve com o dist compilado (pnpm deploy pode não incluir dist/)
RUN cp -r /app/apps/api/dist /deploy/dist && cp -r /app/apps/api/prisma /deploy/prisma

# ================================
# Stage: runner (production)
# ================================
FROM node:20-alpine AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# Deployment auto-contido (node_modules sem symlinks + arquivos do app)
COPY --from=builder /deploy ./

RUN chown -R nestjs:nodejs /app
USER nestjs

EXPOSE 3001
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s \
  CMD wget -qO- http://localhost:3001/api/health || exit 1

CMD ["node", "dist/main"]
