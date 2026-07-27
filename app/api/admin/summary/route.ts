import { NextResponse } from "next/server"
import { getCounts } from "@/lib/db"

export async function GET() {
  const counts = await getCounts()
  return NextResponse.json({ counts })
}
