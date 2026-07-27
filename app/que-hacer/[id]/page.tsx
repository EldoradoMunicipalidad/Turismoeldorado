import { notFound } from "next/navigation"
import { ArrowLeft, Clock, TicketCheck, Users, MapPin } from "lucide-react"
import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { categories, durationOptions } from "@/components/que-hacer-data"
import { readCollection } from "@/lib/db"

const categoryLabels: Record<string, string> = Object.fromEntries(
  categories.map((c) => [c.value, c.label]),
)
const durationLabels: Record<string, string> = Object.fromEntries(
  durationOptions.map((d) => [d.value, d.label]),
)

const categoryColors: Record<string, string> = {
  naturaleza: "bg-emerald-100 text-emerald-700",
  aventura: "bg-orange-100 text-orange-700",
  "turismo-rural": "bg-amber-100 text-amber-700",
  deportes: "bg-blue-100 text-blue-700",
  cultura: "bg-purple-100 text-purple-700",
  "full-day": "bg-rose-100 text-rose-700",
}

export const dynamic = "force-dynamic"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const experiences = await readCollection("experiences")
  const exp = experiences.find((e) => e.id === id)
  if (!exp) return { title: "Experiencia no encontrada" }
  return {
    title: exp.title,
    description: exp.description,
    openGraph: {
      title: exp.title,
      description: exp.description,
      images: exp.image ? [exp.image] : undefined,
    },
  }
}

export default async function QueHacerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const experiences = await readCollection("experiences")
  const exp = experiences.find((e) => e.id === id)
  if (!exp) notFound()

  const related = experiences
    .filter((e) => e.id !== exp.id && e.category === exp.category)
    .slice(0, 3)

  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero banner */}
      <section className="relative">
        <div className="relative h-[260px] sm:h-[320px] lg:h-[400px]">
          <img
            src={exp.image}
            alt={exp.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-green-dark/90 via-brand-green-dark/40 to-transparent" />
        </div>
      </section>

      {/* Body */}
      <section className="mx-auto -mt-20 max-w-5xl px-4 pb-12 sm:px-6 lg:-mt-32">
        <div className="rounded-2xl bg-card p-6 shadow-xl sm:p-8">
          <a
            href="/que-hacer"
            className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-brand-green"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Volver a Qué hacer
          </a>

          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                categoryColors[exp.category] ?? "bg-muted text-foreground"
              }`}
            >
              {categoryLabels[exp.category] ?? exp.category}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              {durationLabels[exp.duration] ?? exp.duration}
            </span>
            {exp.requiresReservation && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                <TicketCheck className="h-3.5 w-3.5" />
                Requiere reserva
              </span>
            )}
            {exp.kidFriendly && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700">
                <Users className="h-3.5 w-3.5" />
                Apto niños
              </span>
            )}
            {exp.hasGuide && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                <MapPin className="h-3.5 w-3.5" />
                Con guía
              </span>
            )}
          </div>

          <h1 className="mt-4 font-heading text-3xl font-bold text-brand-green-dark sm:text-4xl">
            {exp.title}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            {exp.description}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="/informacion-util"
              className="inline-flex items-center gap-2 rounded-full bg-brand-yellow px-6 py-3 text-sm font-semibold text-brand-green-dark shadow transition-transform hover:scale-[1.03]"
            >
              <TicketCheck className="h-4 w-4" />
              Reservar / Consultar
            </a>
            <a
              href="/guias-turisticas"
              className="inline-flex items-center gap-2 rounded-full border-2 border-brand-green px-6 py-3 text-sm font-semibold text-brand-green transition-colors hover:bg-brand-green hover:text-white"
            >
              Descargar guía
            </a>
          </div>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="mx-auto max-w-5xl px-4 pb-12 sm:px-6">
          <h2 className="mb-6 font-heading text-2xl font-bold text-brand-green-dark">
            Experiencias similares
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {related.map((r) => (
              <a
                key={r.id}
                href={`/que-hacer/${r.id}`}
                className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={r.image}
                    alt={r.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-heading text-sm font-bold text-foreground">
                    {r.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                    {r.description}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      <SiteFooter />
    </main>
  )
}
