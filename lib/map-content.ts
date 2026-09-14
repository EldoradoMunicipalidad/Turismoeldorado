import initialHomeContent from "../prisma/home-content-seed.json"
import { getHomePageContent } from "@/lib/db"
import { isHomeContentDocument, type HomeContentDocument, type MapPageContent } from "@/lib/home-content"

const defaultMapContent = (initialHomeContent as HomeContentDocument).mapPage as MapPageContent

export async function getMapPageContent(): Promise<MapPageContent> {
  const record = await getHomePageContent()
  if (!isHomeContentDocument(record?.content)) return defaultMapContent
  return record.content.mapPage ?? defaultMapContent
}
