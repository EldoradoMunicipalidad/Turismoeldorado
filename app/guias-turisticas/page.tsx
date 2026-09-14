import type { Metadata } from "next"
import { GuidePage } from "@/components/guide-page"
import { getGuidePageContent } from "@/lib/guide-content"

export const dynamic = "force-dynamic"

export async function generateMetadata(): Promise<Metadata> {
  const content = await getGuidePageContent()
  return {
    title: content.metadata.title,
    description: content.metadata.description,
    alternates: { canonical: "/guias-turisticas" },
    openGraph: {
      title: content.metadata.openGraphTitle,
      description: content.metadata.openGraphDescription,
      url: "/guias-turisticas",
      images: content.hero.imageUrl ? [content.hero.imageUrl] : [],
    },
  }
}

export default async function GuiasTuristicasPage() {
  const content = await getGuidePageContent()
  return <GuidePage content={content} />
}
