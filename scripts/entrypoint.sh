#!/bin/bash
# =============================================================
#  Entrypoint del contenedor
#  1) Crea únicamente la nueva tabla del CMS en Neon
#  2) Arranca el servidor Next.js standalone
# =============================================================
set -e

echo "▶ [entrypoint] shell=$(basename "$0") bash=$(bash --version | head -1 | tr -d '\r')"

if [ -z "$DATABASE_URL" ]; then
  echo "✗ [entrypoint] Falta DATABASE_URL. Abortando."
  exit 1
fi
echo "✓ [entrypoint] DATABASE_URL configurada."

if [ -z "$AUTH_SECRET" ] || [ "${#AUTH_SECRET}" -lt 32 ]; then
  echo "✗ [entrypoint] AUTH_SECRET debe estar configurada y tener al menos 32 caracteres. Abortando."
  exit 1
fi
echo "✓ [entrypoint] AUTH_SECRET configurada."

# 1) Aplicar solo la creación de HomePageContent con SQL puro. Si esa tabla
#    ya existe, el bootstrap continúa sin alterar su estructura.
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
