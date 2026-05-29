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
EXPOSE 3000
CMD ["pnpm", "dev"]

# ================================
# Stage: builder
# ================================
FROM base AS builder
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
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

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s \
  CMD wget -qO- http://localhost:3000 || exit 1

CMD ["node", "server.js"]
