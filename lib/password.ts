// Hashing de contraseñas con bcryptjs (pure JS, sin deps nativas).
// Separado de lib/auth.ts para poder reutilizarlo en scripts de seed
// que corren con `tsx` (no deben importar `next/headers`).

import bcrypt from "bcryptjs"

const ROUNDS = 10

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, ROUNDS)
}

export async function verifyPassword(
  plain: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(plain, hash)
}
