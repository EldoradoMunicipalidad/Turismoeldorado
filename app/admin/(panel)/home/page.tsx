import { Home } from "lucide-react"
import { HomeConfigForm } from "./home-config-form"
import { getHomeConfig } from "@/lib/db"

export const dynamic = "force-dynamic"

export default async function AdminHomePage() {
  const config = await getHomeConfig()
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
          Personalizá el hero de la portada: imagen, textos y botones. Los
          cambios se reflejan al instante en la home pública.
        </p>
      </div>
      <HomeConfigForm initial={JSON.parse(JSON.stringify(config))} />
    </div>
  )
}
