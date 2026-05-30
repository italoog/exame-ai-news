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

# Build do Next.js
WORKDIR /app/apps/web
ENV NEXT_TELEMETRY_DISABLED=1
# NEXT_PUBLIC_* vars são embutidas no bundle do cliente no momento do build
ARG NEXT_PUBLIC_API_URL=https://exame-ai-api.fzsuah.easypanel.host/api
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
RUN pnpm run build

# ================================
# Stage: runner (production)
# ================================
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Next.js standalone output já contém node_modules necessários
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "apps/web/server.js"]
