# Turismo Eldorado — Deploy en Dokploy

## Archivos relevantes

- `Dockerfile` — Imagen multi-stage (deps → build → runner)
- `dokploy.json` — Configuración reconocida por Dokploy
- `scripts/entrypoint.sh` — Aplica schema a Neon y arranca Next.js
- `middleware.ts` — Protege `/admin/*` con sesión JWT
- `lib/auth.ts` — Helpers de sesión (sign/verify JWT, cookie httpOnly)
- `lib/password.ts` — Hashing de contraseñas con bcryptjs
- `prisma/seed-admin.ts` — Crea el primer admin (corre local, no en el contenedor)
- `.env.example` — Template de variables de entorno (no subir el `.env` real)

## Deploy paso a paso

### 1. Subir el código al repo

Conectá este repo a Dokploy (GitHub / GitLab / Bitbucket) o subilo por SSH.

### 2. Crear el servicio en Dokploy

- Tipo: **Dockerfile** (no Docker Image)
- Build context: raíz del repo
- Dockerfile path: `Dockerfile` (default)
- Puerto: **3000**

### 3. Variables de entorno (CRÍTICO)

En Dokploy → tu service → **Environment**, agregá:

| Variable | Valor | Notas |
|----------|-------|-------|
| `DATABASE_URL` | `postgresql://USER:PASS@ep-xxxxx-pooler.c-REGION.aws.neon.tech/neondb?sslmode=require` | **Sin `channel_binding=require`** — la quité en `prisma.config.ts` por compatibilidad |
| `AUTH_SECRET` | string random de 32+ chars | Firma los JWT de sesión. Generala con: `openssl rand -hex 32`. **No la commitees nunca.** |
| `ADMIN_USERNAME` | `admin` (o el que quieras) | Solo se usa la primera vez, en el seed. |
| `ADMIN_PASSWORD` | clave fuerte (≥ 8 chars) | Solo se usa la primera vez, en el seed. |

Sacá la `DATABASE_URL` de **Neon Console → tu proyecto → Connect → Pooled connection**.

⚠️ Si más adelante cambiás el plan de Neon o rotás credenciales, regenerá esa URL.
⚠️ Si rotás `AUTH_SECRET`, todas las sesiones quedan inválidas (los usuarios tienen que volver a loguearse).

### 4. Build y deploy

- Dokploy hace `docker build` automáticamente al primer push
- El entrypoint aplica `prisma db push` (idempotente) antes de arrancar Next.js
- Si ya había tablas en Neon del dev local, **no se borran ni se duplican datos** — `db push` solo aplica diffs

### 5. Datos iniciales (seed)

⚠️ **Importante**: el contenedor NO corre el seed automáticamente (porque standalone no incluye el CLI de Prisma). Tenés dos opciones:

**a) Seedear una sola vez desde tu máquina local** apuntando a la misma Neon:

```bash
DATABASE_URL="<misma-URL-que-Dokploy>" pnpm tsx prisma/seed.ts
```

**b) Agregar el seed al entrypoint** (solo para el primer deploy; después comentá la línea).

Editá `scripts/entrypoint.sh` y agregá después de la sección de apply-schema:

```sh
# Solo la primera vez — comentar después
node --env-file=.env scripts/seed.mjs || echo "seed falló"
```

(Para que funcione, hay que convertir `prisma/seed.ts` a `.mjs` o agregar el CLI de Prisma al bundle — más complejo).

### 5b. Crear el primer admin (autenticación)

El panel `/admin` está protegido con login. Antes de entrar, creá el usuario admin apuntando a la **misma Neon que Dokploy**:

```bash
DATABASE_URL="<misma-URL-que-Dokploy>" \
  ADMIN_USERNAME=admin \
  ADMIN_PASSWORD="una-clave-fuerte" \
  pnpm tsx prisma/seed-admin.ts
```

El script es idempotente: si el usuario ya existe, actualiza el hash de la contraseña. Útil también para rotar la clave.

Después andá a `https://tu-dominio/admin/login` y entrá con esas credenciales. La sesión expira a los 7 días (cookie httpOnly firmada con JWT).

### 6. Verificar

- `https://tu-dominio/` → home
- `https://tu-dominio/admin` → panel interno
- `https://tu-dominio/api/admin/summary` → JSON con contadores

## Cómo funcionan las imágenes

Las imágenes del admin se suben a la tabla `ImageAsset` de Neon (bytes + mime) y se sirven desde `GET /api/images/[id]`. **No se necesita storage externo**.

## Reiniciar después de cambios

Dokploy redeploy automático al hacer push a la branch configurada. Si solo querés re-correr el entrypoint (sin rebuild):

```bash
dokploy service restart <nombre>
```

## Troubleshooting

### Error `P1000: Authentication failed`

- La `DATABASE_URL` no es la pooled, o las credenciales cambiaron.
- Sacá la URL fresca de Neon Console.

### Error `Cannot find module '.prisma/client'`

- El `prisma generate` no se ejecutó antes del `next build`. Ya está en el Dockerfile (`RUN pnpm prisma generate`) pero si lo modificás, dejá esa línea.

### El sitio carga pero el admin dice "no se puede conectar a la base"

- Verificá que la variable `DATABASE_URL` esté en Dokploy **sin comillas** alrededor del valor.
- Logs del contenedor en Dokploy → "Logs" — buscá el output del entrypoint.

### Build falla por memoria

Next.js 16 con Turbopack puede pedir 2-3 GB de RAM. Si Dokploy tiene menos, agregá `BUILD_MEMORY_LIMIT=2048` o similar en la config de Dokploy.
