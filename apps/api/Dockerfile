# ================================
# Stage: base
# ================================
FROM node:20-alpine AS base
RUN npm install -g pnpm
WORKDIR /app

# ================================
# Stage: development
# ================================
FROM base AS development
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install
COPY . .
RUN pnpm run db:generate
EXPOSE 3001
CMD ["pnpm", "dev"]

# ================================
# Stage: builder
# ================================
FROM base AS builder
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --no-frozen-lockfile
COPY . .
RUN pnpm run db:generate
RUN pnpm run build

# ================================
# Stage: runner (production)
# ================================
FROM node:20-alpine AS runner
RUN npm install -g pnpm
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./

RUN chown -R nestjs:nodejs /app
USER nestjs

EXPOSE 3001
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s \
  CMD wget -qO- http://localhost:3001/api/health || exit 1

CMD ["node", "dist/main"]
