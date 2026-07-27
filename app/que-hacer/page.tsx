import type { Metadata } from "next"
import { Compass } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { QueHacerSection } from "@/components/que-hacer-section"
import { SiteFooter } from "@/components/site-footer"
import { readCollection } from "@/lib/db"
import { categories } from "@/components/que-hacer-data"

export const metadata: Metadata = {
  title: "Qué hacer",
  description:
    "Descubrí todas las experiencias únicas que Eldorado tiene para ofrecer: naturaleza, aventura, turismo rural, deportes, cultura y full days en la selva misionera.",
  alternates: { canonical: "/que-hacer" },
  openGraph: {
    title: "Qué hacer en Eldorado",
    description:
      "Naturaleza, aventura, turismo rural, deportes, cultura y más en Eldorado, Misiones.",
    url: "/que-hacer",
    images: ["/images/act-trekking.png"],
  },
}

export const dynamic = "force-dynamic"

export default async function QueHacerPage() {
  const experiences = await readCollection("experiences")

  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />

      <section className="relative overflow-hidden">
        <div className="relative min-h-[280px] sm:min-h-[320px]">
          <img
            src="/images/act-trekking.png"
            alt="Qué hacer en Eldorado"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-green-dark/85 via-brand-green-dark/50 to-transparent" />
          <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-10 pt-20 sm:px-6">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-yellow text-brand-green-dark">
                <Compass className="h-5 w-5" />
              </span>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-yellow">
                Experiencias
              </p>
            </div>
            <h1 className="mt-3 font-heading text-4xl font-bold text-white sm:text-5xl">
              Qué hacer en Eldorado
            </h1>
            <p className="mt-2 max-w-lg text-base text-white/85">
              Naturaleza, aventura, cultura y mucho más. Encontrá la experiencia perfecta para tu visita.
            </p>
          </div>
        </div>
      </section>

      <QueHacerSection experiences={experiences} categories={categories} />

      <SiteFooter />
    </main>
  )
}
