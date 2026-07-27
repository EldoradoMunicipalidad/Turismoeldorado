import type { Metadata } from "next"
import { Map as MapIcon } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { MapSection } from "@/components/map-section"

export const metadata: Metadata = {
  title: "Mapa",
  description:
    "Mapa interactivo de Eldorado: experiencias, eventos, alojamientos, restaurantes y deportes. Encontrá todo lo que la ciudad tiene para ofrecer en un solo lugar.",
  alternates: { canonical: "/mapa" },
  openGraph: {
    title: "Mapa interactivo — Eldorado",
    description:
      "Explorá atractivos, alojamientos, gastronomía, deportes y eventos en el mapa de Eldorado.",
    url: "/mapa",
  },
}

export default function MapaPage() {
  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />

      <section className="relative overflow-hidden">
        <div className="relative min-h-[240px] sm:min-h-[280px] bg-brand-green">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-green-dark/85 via-brand-green-dark/50 to-transparent" />
          <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-10 pt-20 sm:px-6">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-yellow text-brand-green-dark">
                <MapIcon className="h-5 w-5" />
              </span>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-yellow">
                Mapa del sitio
              </p>
            </div>
            <h1 className="mt-3 font-heading text-4xl font-bold text-white sm:text-5xl">
              Mapa interactivo
            </h1>
            <p className="mt-2 max-w-2xl text-base text-white/85">
              Encontrá en el mapa todo lo que Eldorado tiene para ofrecer: atractivos, alojamientos, gastronomía, deportes y eventos.
            </p>
          </div>
        </div>
      </section>

      <MapSection />

      <SiteFooter />
    </main>
  )
}
