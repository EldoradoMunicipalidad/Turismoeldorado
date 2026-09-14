import { NextResponse, type NextRequest } from "next/server"
import { revalidatePath } from "next/cache"
import { getHomeConfig, getHomePageContent, updateHomeConfig, updateHomePageContent } from "@/lib/db"
import { isHomeContentDocument } from "@/lib/home-content"
import initialHomeContent from "../../../../prisma/home-content-seed.json"

export const dynamic = "force-dynamic"

const TRIM_KEYS = [
  "heroAlt",
  "heroTitle",
  "heroSubtitle",
  "heroDescription",
  "heroCtaPrimary",
  "heroCtaPrimaryHref",
  "heroCtaSecondary",
  "heroCtaSecondaryHref",
] as const

const SAFE_URL_PREFIXES = ["/images/", "/api/images/", "https://", "http://"]

export async function GET() {
  const config = await getHomeConfig()
  return NextResponse.json({ config })
}

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 })
  }
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 })
  }

  const raw = body as Record<string, unknown>
  const data: Record<string, string | null> = {}

  for (const key of TRIM_KEYS) {
    const v = raw[key]
    data[key] = typeof v === "string" ? v.trim() || null : null
  }

  const image = raw.heroImageUrl
  if (image === null || image === "") {
    data.heroImageUrl = null
  } else if (typeof image === "string") {
    const trimmed = image.trim()
    if (!SAFE_URL_PREFIXES.some((p) => trimmed.startsWith(p))) {
      return NextResponse.json(
        {
          error:
            "heroImageUrl debe empezar con /images/, /api/images/, http:// o https://",
        },
        { status: 400 },
      )
    }
    data.heroImageUrl = trimmed
  }

  const config = await updateHomeConfig(data)
  const current = await getHomePageContent()
  const base = isHomeContentDocument(current?.content)
    ? current.content
    : initialHomeContent
  await updateHomePageContent({
    ...base,
    hero: {
      imageUrl: config.heroImageUrl ?? "",
      alt: config.heroAlt ?? "",
      title: config.heroTitle ?? "",
      subtitle: config.heroSubtitle ?? "",
      description: config.heroDescription ?? "",
      ctaPrimary: config.heroCtaPrimary ?? "",
      ctaPrimaryHref: config.heroCtaPrimaryHref ?? "",
      ctaSecondary: config.heroCtaSecondary ?? "",
      ctaSecondaryHref: config.heroCtaSecondaryHref ?? "",
    },
  })
  revalidatePath("/")
  return NextResponse.json({ config })
}
