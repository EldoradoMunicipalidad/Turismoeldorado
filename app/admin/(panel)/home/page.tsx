import { Home } from "lucide-react"
import { HomeContentForm } from "@/components/home-content-form"
import { getHomePageContent } from "@/lib/db"
import { isHomeContentDocument, type HomeContentDocument } from "@/lib/home-content"
import initialHomeContent from "../../../../prisma/home-content-seed.json"

export const dynamic = "force-dynamic"

export default async function AdminHomePage() {
  const pageContent = await getHomePageContent()
  const storedContent = isHomeContentDocument(pageContent?.content)
    ? pageContent.content
    : initialHomeContent as HomeContentDocument
  // Old production rows do not yet contain guide content. Add its defaults in
  // memory so simply opening the admin never writes to or changes the database.
  const homeContent: HomeContentDocument = {
    ...storedContent,
    guide: storedContent.guide ?? (initialHomeContent as HomeContentDocument).guide,
  }
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-green/15 text-brand-green">
            <Home className="h-4 w-4" />
          </span>
          <h1 className="font-heading text-2xl font-bold text-brand-green-dark sm:text-3xl">
            Home
          </h1>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
            Administrá el contenido de la portada y de la guía turística. Guardá los cambios para publicarlos.
        </p>
      </div>
      <HomeContentForm initial={JSON.parse(JSON.stringify(homeContent))} />
    </div>
  )
}
