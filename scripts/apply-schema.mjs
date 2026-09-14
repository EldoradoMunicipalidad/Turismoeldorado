// Aplica prisma/init.sql a la base de Neon, tolerando tablas pre-existentes.
// Usa el cliente Neon HTTP (ya está en el bundle standalone), así no necesitamos
// la CLI de Prisma ni el binario pg en el contenedor.

import { neon } from "@neondatabase/serverless"
import { readFile } from "node:fs/promises"

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  console.error("✗ Falta DATABASE_URL")
  process.exit(1)
}

const sql = neon(connectionString)
const ddl = await readFile(new URL("../prisma/init.sql", import.meta.url), "utf8")

// Prisma genera el esquema completo, pero este despliegue solo está autorizado
// a crear la tabla nueva del CMS. Nunca ejecutamos el resto del DDL generado.
const statements = ddl
  .split("\n")
  .filter((line) => !line.trim().startsWith("--"))
  .join("\n")
  .split(";")
  .map((s) => s.trim())
  .filter((s) => s.length > 0)

const unsafeStatement = statements.find((statement) => !/^CREATE\b/i.test(statement))
if (unsafeStatement) {
  console.error(
    "✗ init.sql contiene una sentencia distinta de CREATE; se cancela el bootstrap para proteger la base.",
  )
  process.exit(1)
}

const homeContentStatements = statements.filter((statement) =>
  /^CREATE TABLE "HomePageContent"\s*\(/i.test(statement),
)
if (homeContentStatements.length !== 1) {
  console.error(
    `✗ Se esperaba exactamente un CREATE TABLE para HomePageContent; se encontraron ${homeContentStatements.length}.`,
  )
  process.exit(1)
}

let applied = 0
let skipped = 0
for (const [index, stmt] of homeContentStatements.entries()) {
  try {
    await sql.query(stmt)
    applied++
  } catch (err) {
    // 42P07 = duplicate_table, 42710 = duplicate_object, 42P06 = duplicate_schema
    if (["42P07", "42710", "42P06"].includes(err.code)) {
      skipped++
    } else {
      console.error(`✗ Falló la sentencia CREATE número ${index + 1}.`)
      throw err
    }
  }
}

console.log(`✓ Schema: ${applied} aplicadas, ${skipped} ya existían`)

// Semilla editorial insert-only: inicializa el CMS del home una sola vez.
// ON CONFLICT DO NOTHING preserva cualquier configuración ya guardada.
const homeSeed = JSON.parse(
  await readFile(new URL("../prisma/home-content-seed.json", import.meta.url), "utf8"),
)

// Copia al CMS nuevo los valores del hero existentes, sin modificar la fila
// histórica de HomeConfig. Si no había personalización, conserva el borrador
// inicial editable del JSON de semilla.
const existingHomeRows = await sql.query(
  'SELECT "heroImageUrl", "heroAlt", "heroTitle", "heroSubtitle", "heroDescription", "heroCtaPrimary", "heroCtaPrimaryHref", "heroCtaSecondary", "heroCtaSecondaryHref" FROM "HomeConfig" WHERE "id" = \'default\' LIMIT 1',
)
const existingHero = existingHomeRows[0]
if (existingHero) {
  const legacyHeroFields = {
    heroImageUrl: "imageUrl",
    heroAlt: "alt",
    heroTitle: "title",
    heroSubtitle: "subtitle",
    heroDescription: "description",
    heroCtaPrimary: "ctaPrimary",
    heroCtaPrimaryHref: "ctaPrimaryHref",
    heroCtaSecondary: "ctaSecondary",
    heroCtaSecondaryHref: "ctaSecondaryHref",
  }
  for (const [legacyField, contentField] of Object.entries(legacyHeroFields)) {
    const value = existingHero[legacyField]
    if (typeof value === "string" && value.trim()) {
      homeSeed.hero[contentField] = value
    }
  }
}

const encodedSeed = JSON.stringify(homeSeed).replaceAll("'", "''")
await sql.query(
  `INSERT INTO "HomePageContent" ("id", "content", "updatedAt") VALUES ('default', '${encodedSeed}'::jsonb, NOW()) ON CONFLICT ("id") DO NOTHING`,
)
console.log("✓ Home CMS: configuración inicial insertada si aún no existía")
