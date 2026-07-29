// Crea (o actualiza) el admin inicial leyendo ADMIN_USERNAME y ADMIN_PASSWORD
// del entorno. Pensado para correr una vez apuntando a la Neon de producción:
//
//   DATABASE_URL=postgresql://... ADMIN_USERNAME=admin \
//     ADMIN_PASSWORD=tu-clave-fuerte pnpm tsx prisma/seed-admin.ts
//
// Si ya existe un admin con ese username, actualiza el hash (útil para
// rotar la contraseña sin tocar la DB).

import "dotenv/config"
import { prisma } from "../lib/db"
import { hashPassword } from "../lib/password"

async function main() {
  const username = process.env.ADMIN_USERNAME?.trim()
  const password = process.env.ADMIN_PASSWORD

  if (!username || !password) {
    console.error(
      "✗ Faltan ADMIN_USERNAME o ADMIN_PASSWORD en el entorno. Ejemplo:",
    )
    console.error(
      '  ADMIN_USERNAME=admin ADMIN_PASSWORD="clave-segura" pnpm tsx prisma/seed-admin.ts',
    )
    process.exit(1)
  }

  if (password.length < 8) {
    console.error("✗ ADMIN_PASSWORD debe tener al menos 8 caracteres.")
    process.exit(1)
  }

  const passwordHash = await hashPassword(password)
  const admin = await prisma.admin.upsert({
    where: { username },
    create: { username, passwordHash },
    update: { passwordHash },
  })

  console.log(`✓ Admin listo: ${admin.username} (id: ${admin.id})`)
  console.log("  Próximo paso: hacé login en /admin/login con esas credenciales.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
