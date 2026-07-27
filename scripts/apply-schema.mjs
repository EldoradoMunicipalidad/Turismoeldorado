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

// Parseo de SQL: remueve líneas de comentario (-- ...) y split por ';'.
// Postgres acepta queries de varias líneas, así que split por ';' alcanza
// para el DDL plano que emite Prisma.
const statements = ddl
  .split("\n")
  .filter((line) => !line.trim().startsWith("--"))
  .join("\n")
  .split(";")
  .map((s) => s.trim())
  .filter((s) => s.length > 0)

let applied = 0
let skipped = 0
for (const stmt of statements) {
  try {
    await sql.query(stmt)
    applied++
  } catch (err) {
    // 42P07 = duplicate_table, 42710 = duplicate_object, 42P06 = duplicate_schema
    if (["42P07", "42710", "42P06"].includes(err.code)) {
      skipped++
    } else {
      console.error(`✗ Falló: ${stmt.slice(0, 80)}...`)
      throw err
    }
  }
}

console.log(`✓ Schema: ${applied} aplicadas, ${skipped} ya existían`)
