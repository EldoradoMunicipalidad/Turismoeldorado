import { NextRequest, NextResponse } from "next/server"
import { saveImage } from "@/lib/db"

const MAX_BYTES = 8 * 1024 * 1024 // 8 MB
const ALLOWED_MIMES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData()
    const file = form.get("file")
    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "Falta el archivo. Enviá un campo 'file' (multipart)." },
        { status: 400 },
      )
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: `El archivo excede el máximo de ${MAX_BYTES / 1024 / 1024}MB` },
        { status: 400 },
      )
    }
    if (!ALLOWED_MIMES.includes(file.type)) {
      return NextResponse.json(
        { error: `Tipo de archivo no permitido: ${file.type}` },
        { status: 400 },
      )
    }

    const arrayBuffer = await file.arrayBuffer()
    const bytes = Buffer.from(arrayBuffer)

    const saved = await saveImage({
      filename: file.name || "imagen",
      mime: file.type,
      bytes,
    })

    return NextResponse.json({
      id: saved.id,
      url: `/api/images/${saved.id}`,
      mime: saved.mime,
      size: saved.size,
    })
  } catch (err: any) {
    console.error("upload error:", err)
    return NextResponse.json(
      { error: err?.message ?? "Error al subir" },
      { status: 500 },
    )
  }
}
