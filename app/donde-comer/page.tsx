import type { Metadata } from "next"
import { Utensils } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { DondeComerSection } from "@/components/donde-comer-section"
import { SiteFooter } from "@/components/site-footer"
import { readCollection } from "@/lib/db"

export const metadata: Metadata = {
  title: "Dónde comer",
  description:
    "Descubrí la gastronomía de Eldorado, Misiones: restaurantes regionales, parrillas, pizzerías, cafés, confiterías y opciones vegetarianas con sabores de la selva.",
  alternates: { canonical: "/donde-comer" },
  openGraph: {
    title: "Dónde comer en Eldorado",
    description:
      "Restaurantes regionales, parrillas, pizzerías, cafés y confiterías en Eldorado.",
    url: "/donde-comer",
    images: ["/images/costanera.png"],
  },
}

export const dynamic = "force-dynamic"

export default async function DondeComerPage() {
  const restaurants = await readCollection("restaurants")

  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />

      <section className="relative overflow-hidden">
        <div className="relative min-h-[260px] sm:min-h-[300px]">
          <img
            src="/images/costanera.png"
            alt="Dónde comer en Eldorado"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-green-dark/85 via-brand-green-dark/50 to-transparent" />
          <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-10 pt-20 sm:px-6">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-yellow text-brand-green-dark">
                <Utensils className="h-5 w-5" />
              </span>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-yellow">
                Gastronomía
              </p>
            </div>
            <h1 className="mt-3 font-heading text-4xl font-bold text-white sm:text-5xl">
              Dónde comer
            </h1>
            <p className="mt-2 max-w-lg text-base text-white/85">
              Sabores de la selva misionera. Restaurantes, cafés, parrillas y confiterías para todos los paladares.
            </p>
          </div>
        </div>
      </section>

      <DondeComerSection restaurants={restaurants} />

      <SiteFooter />
    </main>
  )
}
