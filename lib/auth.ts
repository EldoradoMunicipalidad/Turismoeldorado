// Sesión de admin: JWT firmado con HS256 + cookie httpOnly.
// El secret se lee de AUTH_SECRET (mínimo 32 chars, configurar en Dokploy).
// Si no está, se cae el endpoint /api/auth/login explícitamente.

import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import { verifyPassword } from "./password"

export const AUTH_COOKIE_NAME = "admin_session"
const SESSION_SECONDS = 60 * 60 * 24 * 7 // 7 días

function getSecret(): Uint8Array {
  const raw = process.env.AUTH_SECRET
  if (!raw || raw.length < 32) {
    throw new Error(
      "AUTH_SECRET no está definida o es muy corta (mínimo 32 caracteres). " +
        "Configurala en Dokploy → Environment antes de iniciar sesión.",
    )
  }
  return new TextEncoder().encode(raw)
}

export async function signSession(adminId: string): Promise<string> {
  return new SignJWT({ adminId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_SECONDS}s`)
    .sign(getSecret())
}

export async function verifySessionToken(
  token: string,
): Promise<{ adminId: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret())
    if (typeof payload.adminId !== "string") return null
    return { adminId: payload.adminId }
  } catch {
    return null
  }
}

export async function setSessionCookie(token: string): Promise<void> {
  const jar = await cookies()
  jar.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_SECONDS,
  })
}

export async function clearSessionCookie(): Promise<void> {
  const jar = await cookies()
  jar.delete(AUTH_COOKIE_NAME)
}

export async function getSession(): Promise<{ adminId: string } | null> {
  const jar = await cookies()
  const token = jar.get(AUTH_COOKIE_NAME)?.value
  if (!token) return null
  return verifySessionToken(token)
}

export { verifyPassword }
