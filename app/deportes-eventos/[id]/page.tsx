import { notFound } from "next/navigation"
import { ArrowLeft, Trophy, Clock, MapPin, Calendar } from "lucide-react"
import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { readCollection } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const list = await readCollection("sportActivities")
  const a = list.find((x) => x.id === id)
  if (!a) return { title: "Actividad no encontrada" }
  return {
    title: a.title,
    description: a.description,
    openGraph: {
      title: a.title,
      description: a.description,
      images: a.image ? [a.image] : undefined,
    },
  }
}

const levelLabels: Record<string, string> = {
  todos: "Todos los niveles",
  inicial: "Inicial",
  intermedio: "Intermedio",
  avanzado: "Avanzado",
}

const levelColors: Record<string, string> = {
  todos: "bg-slate-100 text-slate-700",
  inicial: "bg-emerald-50 text-emerald-700",
  intermedio: "bg-amber-50 text-amber-700",
  avanzado: "bg-red-50 text-red-700",
}

const categoryLabels: Record<string, string> = {
  equipo: "Deportes de equipo",
  individual: "Deportes individuales",
  acuatico: "Deportes acuáticos",
  aventura: "Aventura",
}

export default async function DeporteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const list = await readCollection("sportActivities")
  const a = list.find((x) => x.id === id)
  if (!a) notFound()

  const related = list
    .filter((x) => x.id !== a.id && x.category === a.category)
    .slice(0, 3)

  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />

      <section className="relative">
        <div className="relative h-[280px] sm:h-[360px] lg:h-[420px]">
          <img
            src={a.image}
            alt={a.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-green-dark/90 via-brand-green-dark/40 to-transparent" />
        </div>
      </section>

      <section className="mx-auto -mt-20 max-w-5xl px-4 pb-12 sm:px-6 lg:-mt-32">
        <div className="rounded-2xl bg-card p-6 shadow-xl sm:p-8">
          <a
            href="/deportes-eventos"
            className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-brand-green"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Volver a Deportes y eventos
          </a>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-green/10 px-3 py-1 text-xs font-semibold text-brand-green">
              <Trophy className="h-3.5 w-3.5" />
              {categoryLabels[a.category]}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                levelColors[a.level]
              }`}
            >
              {levelLabels[a.level]}
            </span>
          </div>

          <h1 className="mt-4 font-heading text-3xl font-bold text-brand-green-dark sm:text-4xl">
            {a.title}
          </h1>

          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            {a.description}
          </p>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex items-start gap-3 rounded-xl border border-border bg-background p-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-green/10 text-brand-green">
                <Clock className="h-4 w-4" />
              </span>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Horario
                </p>
                <p className="mt-0.5 text-sm font-medium text-foreground">
                  {a.schedule}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-border bg-background p-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-green/10 text-brand-green">
                <MapPin className="h-4 w-4" />
              </span>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Lugar
                </p>
                <p className="mt-0.5 text-sm font-medium text-foreground">
                  {a.location}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="/informacion-util"
              className="inline-flex items-center gap-2 rounded-full bg-brand-yellow px-6 py-3 text-sm font-semibold text-brand-green-dark shadow transition-transform hover:scale-[1.03]"
            >
              <Calendar className="h-4 w-4" />
              Unirme / Consultar
            </a>
            <a
              href="/deportes-eventos"
              className="inline-flex items-center gap-2 rounded-full border-2 border-brand-green px-6 py-3 text-sm font-semibold text-brand-green transition-colors hover:bg-brand-green hover:text-white"
            >
              Ver otras actividades
            </a>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="mx-auto max-w-5xl px-4 pb-12 sm:px-6">
          <h2 className="mb-6 font-heading text-2xl font-bold text-brand-green-dark">
            Actividades similares
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {related.map((r) => (
              <a
                key={r.id}
                href={`/deportes-eventos/${r.id}`}
                className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
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
