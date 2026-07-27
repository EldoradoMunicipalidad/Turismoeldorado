# syntax=docker/dockerfile:1.7
# =============================================================
#  Turismo Eldorado — Dockerfile para Dokploy
#  Stages: deps → builder → runner
# =============================================================

# ---------- 1) DEPS: instalar dependencias con caché ----------
FROM node:22-bookworm-slim AS deps
RUN corepack enable && corepack prepare pnpm@10.23.0 --activate
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN apt-get update -qq && apt-get install -y --no-install-recommends \
    openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*
RUN pnpm install --frozen-lockfile

# ---------- 2) BUILDER: compilar Next.js + Prisma client ----------
FROM node:22-bookworm-slim AS builder
RUN corepack enable && corepack prepare pnpm@10.23.0 --activate
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# DATABASE_URL placeholder solo para que Next.js pueda pre-renderizar
# páginas server-rendered (admin, listings). El valor real se inyecta
# en runtime desde Dokploy Environment. La URL no se usa en queries
# durante el build — el bundle solo necesita que la variable exista.
ENV DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder?sslmode=disable"

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generar cliente Prisma desde el schema (necesario para el bundle)
RUN pnpm prisma generate

# Build de Next.js (modo standalone — ver next.config.mjs)
RUN pnpm run build

# ---------- 3) RUNNER: imagen final mínima ----------
FROM node:22-bookworm-slim AS runner
RUN apt-get update -qq && apt-get install -y --no-install-recommends \
    openssl ca-certificates wget \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Usuario no-root por seguridad
RUN groupadd --system --gid 1001 nodejs \
 && useradd --system --uid 1001 --gid nodejs nextjs

# Copiar el output standalone (incluye solo lo necesario)
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# SQL de init y script apply-schema
COPY --from=builder --chown=nextjs:nodejs /app/prisma/init.sql ./prisma/init.sql
COPY --from=builder --chown=nextjs:nodejs /app/scripts/apply-schema.mjs ./scripts/apply-schema.mjs
COPY --from=builder --chown=nextjs:nodejs /app/scripts/entrypoint.sh ./scripts/entrypoint.sh
# Prisma config + prisma client generado
COPY --from=builder --chown=nextjs:nodejs /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
# El standalone de Next no incluye @neondatabase/serverless (solo @prisma/client).
# Lo copiamos manualmente porque apply-schema.mjs lo necesita. Con pnpm los
# paquetes están en node_modules/.pnpm con symlinks; copiamos el directorio
# .pnpm entero para que los symlinks apunten a paquetes que sí existen.
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@neondatabase ./node_modules/@neondatabase
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.pnpm ./node_modules/.pnpm

USER nextjs

EXPOSE 3000

# Healthcheck simple contra el endpoint raíz
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/ > /dev/null || exit 1

# El entrypoint aplica el schema a Neon y arranca Next.
CMD ["./scripts/entrypoint.sh"]
