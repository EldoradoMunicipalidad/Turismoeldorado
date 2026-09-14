// Protege /admin/* y /api/admin/*: si no hay sesión válida, redirige las
// páginas al login y devuelve 401 JSON para las APIs. Sin secreto devuelve 503.
import { NextResponse, type NextRequest } from "next/server"
import { jwtVerify } from "jose"

const COOKIE_NAME = "admin_session"

function getSecret(): Uint8Array | null {
  const raw = process.env.AUTH_SECRET
  if (!raw || raw.length < 32) {
    return null
  }
  return new TextEncoder().encode(raw)
}

export async function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl
  const isAdminApi = pathname.startsWith("/api/admin/")

  if (!pathname.startsWith("/admin") && !isAdminApi) return NextResponse.next()
  if (pathname === "/admin/login") return NextResponse.next()

  const secret = getSecret()
  if (!secret) {
    if (isAdminApi) {
      return NextResponse.json(
        { error: "El acceso de administración no está configurado" },
        { status: 503 },
      )
    }
    const url = req.nextUrl.clone()
    url.pathname = "/admin/login"
    url.search = `?next=${encodeURIComponent(pathname + search)}`
    return NextResponse.redirect(url)
  }

  const token = req.cookies.get(COOKIE_NAME)?.value
  if (!token) {
    if (isAdminApi) {
      return NextResponse.json({ error: "Sesión de administrador requerida" }, { status: 401 })
    }
    const url = req.nextUrl.clone()
    url.pathname = "/admin/login"
    url.search = `?next=${encodeURIComponent(pathname + search)}`
    return NextResponse.redirect(url)
  }

  try {
    await jwtVerify(token, secret)
    return NextResponse.next()
  } catch {
    if (isAdminApi) {
      return NextResponse.json({ error: "Sesión de administrador inválida" }, { status: 401 })
    }
    const url = req.nextUrl.clone()
    url.pathname = "/admin/login"
    url.search = `?next=${encodeURIComponent(pathname + search)}`
    return NextResponse.redirect(url)
  }
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
}
