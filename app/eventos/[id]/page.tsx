import { notFound } from "next/navigation"
import Link from "next/link"
import { formatPrice } from "@/components/deportes-eventos-helpers"
import { ArrowLeft, CalendarDays, Clock, MapPin, Tag, Sparkles } from "lucide-react"
import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { readCollection } from "@/lib/db"
import { formatDate } from "@/components/deportes-eventos-helpers"

const MONTHS = [
  "ENE", "FEB", "MAR", "ABR", "MAY", "JUN",
  "JUL", "AGO", "SEP", "OCT", "NOV", "DIC",
]

export const dynamic = "force-dynamic"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const events = await readCollection("events")
  const ev = events.find((e) => e.id === id)
  if (!ev) return { title: "Evento no encontrado" }
  return {
    title: ev.title,
    description: ev.description,
    openGraph: {
      title: ev.title,
      description: ev.description,
      images: ev.image ? [ev.image] : undefined,
    },
  }
}

export default async function EventoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const events = await readCollection("events")
  const ev = events.find((e) => e.id === id)
  if (!ev) notFound()

  const date = formatDate(ev.date)
  const isPast = new Date(ev.date) < new Date(new Date().toDateString())

  const related = events
    .filter((e) => e.id !== ev.id && e.type === ev.type)
    .slice(0, 3)

  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />

      <section className="mx-auto max-w-7xl px-4 pt-5 sm:px-6">
        <div className="relative isolate flex h-[240px] items-center justify-center overflow-hidden rounded-2xl bg-brand-green-dark shadow-sm sm:h-[320px] lg:h-[380px]">
          <div
            aria-hidden="true"
            className="absolute inset-0 scale-110 bg-cover bg-center opacity-50 blur-2xl"
            style={{ backgroundImage: `url("${ev.image}")` }}
          />
          <div className="absolute inset-0 bg-brand-green-dark/35" />
          <img
            src={ev.image}
            alt={ev.title}
            className="relative z-10 h-full w-full object-contain p-2 sm:p-4"
          />
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-12 pt-7 sm:px-6 sm:pt-9">
        <header className="mb-6">
          <Link
            href="/eventos"
            className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-brand-green"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Volver a Eventos
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                ev.type === "cultural"
                  ? "bg-rose-100 text-rose-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {ev.type === "cultural" ? "Cultural" : "Deportivo"}
            </span>
            {ev.highlight && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-yellow px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-green-dark">
                <Sparkles className="h-3 w-3" />
                Destacado
              </span>
            )}
            {isPast && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                Evento pasado
              </span>
            )}
          </div>
          <h1 className="mt-3 max-w-4xl font-heading text-3xl font-bold leading-tight text-brand-green-dark sm:text-4xl lg:text-5xl">
            {ev.title}
          </h1>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main */}
          <article className="rounded-2xl bg-card p-6 shadow-xl sm:p-8 lg:col-span-2">
            <h2 className="font-heading text-xl font-bold text-brand-green-dark">
              Sobre el evento
            </h2>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              {ev.description}
            </p>

            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex items-start gap-3 rounded-xl border border-border bg-background p-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-green/10 text-brand-green">
                  <CalendarDays className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Fecha
                  </p>
                  <p className="mt-0.5 text-sm font-medium text-foreground">
                    {date.full}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl border border-border bg-background p-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-green/10 text-brand-green">
                  <Clock className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Hora
                  </p>
                  <p className="mt-0.5 text-sm font-medium text-foreground">
                    {ev.time} hs
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl border border-border bg-background p-4 sm:col-span-2">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-green/10 text-brand-green">
                  <MapPin className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Lugar
                  </p>
                  <p className="mt-0.5 text-sm font-medium text-foreground">
                    {ev.location}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {!isPast && (
                <a
                  href="/informacion-util"
                  className="inline-flex items-center gap-2 rounded-full bg-brand-yellow px-6 py-3 text-sm font-semibold text-brand-green-dark shadow transition-transform hover:scale-[1.03]"
                >
                  <Tag className="h-4 w-4" />
                  {ev.isFree ? "Confirmar asistencia" : "Comprar entrada"}
                </a>
              )}
              <a
                href="/guias-turisticas"
                className="inline-flex items-center gap-2 rounded-full border-2 border-brand-green px-6 py-3 text-sm font-semibold text-brand-green transition-colors hover:bg-brand-green hover:text-white"
              >
                Ver guía del visitante
              </a>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="rounded-2xl bg-brand-green-dark p-6 text-white shadow-xl sm:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-yellow">
              Entrada
            </p>
            <p className="mt-2 font-heading text-3xl font-bold">
              {ev.isFree ? "Gratis" : ev.price ? formatPrice(ev.price) : "Con entrada"}
            </p>

            <div className="mt-6 space-y-2 border-t border-white/10 pt-6 text-sm">
              <p className="flex items-center justify-between text-white/80">
                <span>Tipo</span>
                <span className="font-medium text-white">
                  {ev.type === "cultural" ? "Cultural" : "Deportivo"}
                </span>
              </p>
              <p className="flex items-center justify-between text-white/80">
                <span>Día</span>
                <span className="font-medium text-white">
                  {date.day} {date.month} · {ev.time} hs
                </span>
              </p>
              <p className="flex items-center justify-between text-white/80">
                <span>Lugar</span>
                <span className="font-medium text-white">{ev.location}</span>
              </p>
            </div>

            {!isPast && (
              <a
                href="/informacion-util"
                className="mt-6 block w-full rounded-full bg-brand-yellow py-3 text-center text-sm font-semibold text-brand-green-dark transition-transform hover:scale-[1.02]"
              >
                {ev.isFree ? "Asistir" : "Comprar entrada"}
              </a>
            )}
          </aside>
        </div>
      </section>

      {related.length > 0 && (
        <section className="mx-auto max-w-5xl px-4 pb-12 sm:px-6">
          <h2 className="mb-6 font-heading text-2xl font-bold text-brand-green-dark">
            Eventos {ev.type === "cultural" ? "culturales" : "deportivos"} relacionados
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {related.map((r) => {
              const rd = formatDate(r.date)
              return (
                <a
                  key={r.id}
                  href={`/eventos/${r.id}`}
                  className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={r.image}
                      alt={r.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute left-2 top-2 flex flex-col items-center justify-center rounded-lg bg-white/95 px-2.5 py-1 text-center shadow">
                      <span className="font-heading text-sm font-bold leading-none text-brand-green-dark">
                        {rd.day}
                      </span>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-brand-green">
                        {rd.month}
                      </span>
                    </div>
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
              )
            })}
          </div>
        </section>
      )}

      <SiteFooter />
    </main>
  )
}
