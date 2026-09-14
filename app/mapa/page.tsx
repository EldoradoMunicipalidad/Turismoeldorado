import type { Metadata } from "next"
import { Map as MapIcon } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { MapSection, type MapItems } from "@/components/map-section"
import { formatDate } from "@/components/deportes-eventos-helpers"
import { readAll } from "@/lib/db"
import { getMapPageContent } from "@/lib/map-content"

export const dynamic = "force-dynamic"

export async function generateMetadata(): Promise<Metadata> {
  const content = await getMapPageContent()
  return {
    title: content.metadata.title,
    description: content.metadata.description,
    alternates: { canonical: "/mapa" },
    openGraph: {
      title: content.metadata.openGraphTitle,
      description: content.metadata.openGraphDescription,
      url: "/mapa",
    },
  }
}

export default async function MapaPage() {
  const [content, collections] = await Promise.all([getMapPageContent(), readAll()])
  const items: MapItems = {
    experiences: collections.experiences.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      detail: item.description,
      href: `/que-hacer/${encodeURIComponent(item.id)}`,
    })),
    events: collections.events.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      detail: `${formatDate(item.date).full} · ${item.time} hs · ${item.location}`,
      href: `/eventos/${encodeURIComponent(item.id)}`,
    })),
    accommodations: collections.accommodations.map((item) => ({
      id: item.id,
      title: item.name,
      description: item.description,
      detail: item.location,
      href: `/donde-alojarse/${encodeURIComponent(item.id)}`,
    })),
    restaurants: collections.restaurants.map((item) => ({
      id: item.id,
      title: item.name,
      description: item.description,
      detail: item.schedule,
      href: `/donde-comer/${encodeURIComponent(item.id)}`,
    })),
    sportActivities: collections.sportActivities.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      detail: item.location,
      href: `/deportes-eventos/${encodeURIComponent(item.id)}`,
    })),
  }

  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />

      <section className="relative overflow-hidden">
        <div className="relative min-h-[240px] bg-brand-green sm:min-h-[280px]">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-green-dark/85 via-brand-green-dark/50 to-transparent" />
          <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-10 pt-20 sm:px-6">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-yellow text-brand-green-dark">
                <MapIcon className="h-5 w-5" />
              </span>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-yellow">
                {content.hero.eyebrow}
              </p>
            </div>
            <h1 className="mt-3 font-heading text-4xl font-bold text-white sm:text-5xl">
              {content.hero.title}
            </h1>
            <p className="mt-2 max-w-2xl text-base text-white/85">
              {content.hero.description}
            </p>
          </div>
        </div>
      </section>

      <MapSection content={content} items={items} />

      <SiteFooter />
    </main>
  )
}
