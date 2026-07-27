#!/bin/bash
# =============================================================
#  Entrypoint del contenedor
#  1) Aplica el schema a Neon (SQL idempotente, sin CLI Prisma)
#  2) Arranca el servidor Next.js standalone
# =============================================================
set -e

# Tomar los primeros 40 chars de la URL para no loggear la contraseña
DB_PREVIEW="${DATABASE_URL:0:40}"
echo "▶ [entrypoint] DATABASE_URL=${DB_PREVIEW}..."

if [ -z "$DATABASE_URL" ]; then
  echo "✗ [entrypoint] Falta DATABASE_URL. Abortando."
  exit 1
fi

# 1) Aplicar schema con SQL puro.
#    `CREATE TABLE IF NOT EXISTS` no existe en Postgres, pero todas las
#    sentencias están envueltas en un try/catch tolerante a tablas
#    pre-existentes (error 42P07).
if [ -f /app/prisma/init.sql ]; then
  echo "▶ [entrypoint] Aplicando schema a la base de datos..."
  node /app/scripts/apply-schema.mjs || {
    echo "✗ [entrypoint] Falló al aplicar el schema."
    exit 1
  }
  echo "✓ [entrypoint] Schema listo."
fi

# 2) Arranque del servidor Next.js (standalone genera server.js)
echo "▶ [entrypoint] Iniciando Next.js en puerto ${PORT:-3000}..."
exec node server.js
