import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { HeroSection } from "@/components/hero-section"
import { FeaturesBar } from "@/components/features-bar"
import { ImperdiblesSection } from "@/components/imperdibles-section"
import { EventsBanner } from "@/components/events-banner"
import { PlanificaSection } from "@/components/planifica-section"
import { ViviEldoradoSection } from "@/components/vivi-eldorado-section"
import { SiteFooter } from "@/components/site-footer"
import { getHomeConfig, readCollection } from "@/lib/db"

export const dynamic = "force-dynamic"

const SITE_URL = "https://turismoeldorado.gob.ar"

export async function generateMetadata(): Promise<Metadata> {
  const home = await getHomeConfig()
  const ogImage = home.heroImageUrl?.trim() || "/images/hero-eldorado.png"
  return {
    title: { absolute: "Eldorado Misiones | Naturaleza, aventura y descanso" },
    description:
      "Naturaleza, aventura y descanso en Eldorado, Misiones. Descubrí los Saltos del Moconá, la Reserva Delicia, kayak en el Paraná, cabañas, gastronomía regional y eventos durante todo el año.",
    alternates: { canonical: "/" },
    openGraph: {
      title: "Eldorado Misiones | Naturaleza que enamora",
      description:
        "Descubrí la magia de la selva misionera: Saltos del Moconá, Reserva Delicia, kayak en el Paraná, cabañas, gastronomía regional y eventos todo el año.",
      url: "/",
      images: [ogImage],
    },
  }
}

export default async function Page() {
  const [experiences, events, sportActivities, home] = await Promise.all([
    readCollection("experiences"),
    readCollection("events"),
    readCollection("sportActivities"),
    getHomeConfig(),
  ])

  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />
      <HeroSection config={home} />
      <FeaturesBar />
      <ImperdiblesSection experiences={experiences} />
      <EventsBanner />
      <PlanificaSection />
      <ViviEldoradoSection experiences={experiences} sportActivities={sportActivities} />
      <SiteFooter />
    </main>
  )
}
