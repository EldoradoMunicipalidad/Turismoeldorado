import type { Metadata } from "next"
import { CalendarDays } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { EventosSection } from "@/components/eventos-section"
import { SiteFooter } from "@/components/site-footer"

export const metadata: Metadata = {
  title: "Eventos en Eldorado | Turismo Misiones",
  description:
    "Calendario de eventos culturales y deportivos en Eldorado. Festivales, ferias, competencias y más durante todo el año.",
}

export default function EventosPage() {
  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />

      {/* Page banner */}
      <section className="relative overflow-hidden">
        <div className="relative min-h-[260px] sm:min-h-[300px]">
          <img
            src="/images/eventos-concert.png"
            alt="Eventos en Eldorado"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-green-dark/85 via-brand-green-dark/50 to-transparent" />
          <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-10 pt-20 sm:px-6">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-yellow text-brand-green-dark">
                <CalendarDays className="h-5 w-5" />
              </span>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-yellow">
                Calendario
              </p>
            </div>
            <h1 className="mt-3 font-heading text-4xl font-bold text-white sm:text-5xl">
              Eventos
            </h1>
            <p className="mt-2 max-w-lg text-base text-white/85">
              Culturales y deportivos. Festivales, ferias, competencias y mucho más durante todo el año.
            </p>
          </div>
        </div>
      </section>

      <EventosSection />

      <SiteFooter />
    </main>
  )
}
