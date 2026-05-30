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

# ================================
# Stage: runner (production)
# ================================
FROM node:20-alpine AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# Copia o dist compilado e arquivos de runtime
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/prisma ./prisma
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/package.json ./package.json
# Docker COPY resolve symlinks relativos do pnpm automaticamente
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules

USER nestjs

EXPOSE 3001
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s \
  CMD wget -qO- http://localhost:3001/api/health || exit 1

CMD ["node", "dist/main"]
