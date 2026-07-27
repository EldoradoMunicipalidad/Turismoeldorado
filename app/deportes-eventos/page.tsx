import type { Metadata } from "next"
import { Trophy } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { DeportesEventosSection } from "@/components/deportes-eventos-section"
import { SiteFooter } from "@/components/site-footer"
import { readCollection } from "@/lib/db"
import type { SportActivity } from "@/components/deportes-eventos-data"
import type { EventItem } from "@/components/eventos-data"

export const metadata: Metadata = {
  title: "Deportes y eventos",
  description:
    "Clubes, escuelas y academias deportivas en Eldorado, Misiones. Fútbol, rugby, hockey, ciclismo, kayak y más. Próximas competencias y eventos deportivos.",
  alternates: { canonical: "/deportes-eventos" },
  openGraph: {
    title: "Deportes y eventos en Eldorado",
    description:
      "Clubes, academias y competencias deportivas en Eldorado, Misiones.",
    url: "/deportes-eventos",
    images: ["/images/act-ciclismo.png"],
  },
}

export const dynamic = "force-dynamic"

export default async function DeportesEventosPage() {
  const [sportActivities, allEvents] = await Promise.all([
    readCollection("sportActivities"),
    readCollection("events"),
  ])

  const upcomingSportEvents: SportActivity[] = (allEvents as EventItem[])
    .filter((e) => e.type === "deportivo")
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((e) => ({
      id: e.id,
      title: e.title,
      description: e.description,
      image: e.image,
      disciplines: [],
      category: "equipo",
      level: "todos",
      schedule: `${e.time} hs`,
      location: e.location,
      contact: undefined,
    }))

  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />

      <section className="relative overflow-hidden">
        <div className="relative min-h-[260px] sm:min-h-[300px]">
          <img
            src="/images/act-ciclismo.png"
            alt="Deportes y eventos en Eldorado"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-green-dark/85 via-brand-green-dark/50 to-transparent" />
          <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-10 pt-20 sm:px-6">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-yellow text-brand-green-dark">
                <Trophy className="h-5 w-5" />
              </span>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-yellow">
                Deportes y eventos
              </p>
            </div>
            <h1 className="mt-3 font-heading text-4xl font-bold text-white sm:text-5xl">
              Deportes y eventos
            </h1>
            <p className="mt-2 max-w-lg text-base text-white/85">
              Clubes, academias y competencias para todos los niveles en Eldorado.
            </p>
          </div>
        </div>
      </section>

      <DeportesEventosSection
        sportActivities={sportActivities}
        upcomingSportEvents={upcomingSportEvents}
      />

      <SiteFooter />
    </main>
  )
}
