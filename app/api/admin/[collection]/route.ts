import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import {
  COLLECTIONS,
  readCollection,
  upsertItem,
  type Collection,
} from "@/lib/db"

function isCollection(s: string): s is Collection {
  return (COLLECTIONS as string[]).includes(s)
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ collection: string }> },
) {
  const { collection } = await params
  if (!isCollection(collection)) {
    return NextResponse.json(
      { error: `Colección inválida: ${collection}` },
      { status: 400 },
    )
  }
  const items = await readCollection(collection)
  return NextResponse.json({ items })
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ collection: string }> },
) {
  const { collection } = await params
  if (!isCollection(collection)) {
    return NextResponse.json(
      { error: `Colección inválida: ${collection}` },
      { status: 400 },
    )
  }
  try {
    const body = await req.json()
    if (!body || typeof body !== "object" || !body.id) {
      return NextResponse.json(
        { error: "Falta el campo id en el body" },
        { status: 400 },
      )
    }
    const item = await upsertItem(collection, body)
    revalidatePublicPaths()
    return NextResponse.json({ item })
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Error al guardar" },
      { status: 400 },
    )
  }
}

function revalidatePublicPaths() {
  // Refresca home, listados y detalles. Las páginas de detalle usan
  // generateStaticParams; forzar el listado garantiza que se rebuilde el set.
  revalidatePath("/")
  revalidatePath("/que-hacer")
  revalidatePath("/eventos")
  revalidatePath("/donde-alojarse")
  revalidatePath("/donde-comer")
  revalidatePath("/deportes-eventos")
  revalidatePath("/mapa")
}
