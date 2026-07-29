import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import {
  signSession,
  setSessionCookie,
  verifyPassword,
} from "@/lib/auth"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 })
  }

  const username =
    typeof body === "object" && body && "username" in body
      ? String((body as { username: unknown }).username ?? "").trim()
      : ""
  const password =
    typeof body === "object" && body && "password" in body
      ? String((body as { password: unknown }).password ?? "")
      : ""

  if (!username || !password) {
    return NextResponse.json(
      { error: "Usuario y contraseña son obligatorios" },
      { status: 400 },
    )
  }

  let admin
  try {
    admin = await prisma.admin.findUnique({ where: { username } })
  } catch (err) {
    console.error("[auth] DB error during login:", err)
    return NextResponse.json(
      { error: "Error interno. Probá de nuevo." },
      { status: 500 },
    )
  }

  if (!admin) {
    return NextResponse.json(
      { error: "Credenciales inválidas" },
      { status: 401 },
    )
  }

  const ok = await verifyPassword(password, admin.passwordHash)
  if (!ok) {
    return NextResponse.json(
      { error: "Credenciales inválidas" },
      { status: 401 },
    )
  }

  try {
    const token = await signSession(admin.id)
    await setSessionCookie(token)
    await prisma.admin.update({
      where: { id: admin.id },
      data: { lastLoginAt: new Date() },
    })
  } catch (err) {
    console.error("[auth] session error:", err)
    return NextResponse.json(
      { error: "No se pudo iniciar la sesión" },
      { status: 500 },
    )
  }

  return NextResponse.json({ ok: true })
}
