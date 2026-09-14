import { NextResponse, type NextRequest } from "next/server"
import { revalidatePath } from "next/cache"
import { getHomePageContent, updateHomePageContent } from "@/lib/db"
import { isHomeContentDocument, isSafeHomeHref } from "@/lib/home-content"

export const dynamic = "force-dynamic"

function validateUrls(value: unknown, key = ""): string | null {
  if (typeof value === "string") {
    if ((key === "href" || key.endsWith("Href") || key.endsWith("Action")) && value && !isSafeHomeHref(value)) {
      return `Enlace no permitido en ${key}`
    }
    if ((key === "image" || key === "imageUrl" || key === "logoUrl") && value && !/^((\/images\/)|(\/api\/images\/)|(https?:\/\/))/i.test(value)) {
      return `La imagen de ${key} debe usar una ruta /images/, /api/images/ o una URL http(s)`
    }
    return null
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      const error = validateUrls(item)
      if (error) return error
    }
    return null
  }
  if (typeof value === "object" && value !== null) {
    for (const [childKey, childValue] of Object.entries(value)) {
      const error = validateUrls(childValue, childKey)
      if (error) return error
    }
  }
  return null
}

export async function GET() {
  const record = await getHomePageContent()
  return NextResponse.json({ content: record?.content ?? null })
}

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 })
  }

  if (!isHomeContentDocument(body)) {
    return NextResponse.json({ error: "La configuración del home tiene un formato inválido" }, { status: 400 })
  }

  const urlError = validateUrls(body)
  if (urlError) return NextResponse.json({ error: urlError }, { status: 400 })

  const record = await updateHomePageContent(body)
  revalidatePath("/")
  revalidatePath("/guias-turisticas")
  revalidatePath("/mapa")
  return NextResponse.json({ content: record.content })
}
