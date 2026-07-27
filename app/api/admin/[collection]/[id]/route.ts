import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import {
  COLLECTIONS,
  deleteItem,
  upsertItem,
  type Collection,
} from "@/lib/db"

function isCollection(s: string): s is Collection {
  return (COLLECTIONS as string[]).includes(s)
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ collection: string; id: string }> },
) {
  const { collection, id } = await params
  if (!isCollection(collection)) {
    return NextResponse.json(
      { error: `Colección inválida: ${collection}` },
      { status: 400 },
    )
  }
  try {
    const body = await req.json()
    const item = { ...body, id }
    await upsertItem(collection, item)
    revalidatePath("/")
    revalidatePath(`/${collectionRoute(collection)}`)
    revalidatePath(`/${collectionRoute(collection)}/${id}`)
    return NextResponse.json({ item })
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Error al actualizar" },
      { status: 400 },
    )
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ collection: string; id: string }> },
) {
  const { collection, id } = await params
  if (!isCollection(collection)) {
    return NextResponse.json(
      { error: `Colección inválida: ${collection}` },
      { status: 400 },
    )
  }
  const ok = await deleteItem(collection, id)
  if (!ok) {
    return NextResponse.json(
      { error: "Item no encontrado" },
      { status: 404 },
    )
  }
  revalidatePath("/")
  revalidatePath(`/${collectionRoute(collection)}`)
  return NextResponse.json({ ok: true })
}

function collectionRoute(c: Collection): string {
  switch (c) {
    case "experiences":
      return "que-hacer"
    case "events":
      return "eventos"
    case "accommodations":
      return "donde-alojarse"
    case "restaurants":
      return "donde-comer"
    case "sportActivities":
      return "deportes-eventos"
  }
}
