import initialHomeContent from "../prisma/home-content-seed.json"
import { getHomePageContent } from "@/lib/db"
import { isHomeContentDocument, type GuidePageContent, type HomeContentDocument } from "@/lib/home-content"

const defaultGuideContent = (initialHomeContent as HomeContentDocument).guide as GuidePageContent

export async function getGuidePageContent(): Promise<GuidePageContent> {
  const record = await getHomePageContent()
  if (!isHomeContentDocument(record?.content)) return defaultGuideContent
  return record.content.guide ?? defaultGuideContent
}
