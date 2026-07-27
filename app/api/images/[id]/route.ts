import { NextRequest, NextResponse } from "next/server"
import { getImage } from "@/lib/db"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const img = await getImage(id)
  if (!img) {
    return NextResponse.json({ error: "No existe" }, { status: 404 })
  }
  return new NextResponse(new Uint8Array(img.bytes), {
    status: 200,
    headers: {
      "Content-Type": img.mime,
      "Content-Length": String(img.size),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  })
}
