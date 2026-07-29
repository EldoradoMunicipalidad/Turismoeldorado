import Link from "next/link"
import {
  Compass,
  CalendarDays,
  Hotel,
  Utensils,
  Trophy,
  ArrowRight,
  Map as MapIcon,
  Database,
} from "lucide-react"
import { getCounts, readAll } from "@/lib/db"

const CARDS = [
  {
    label: "Qué hacer",
    description: "Experiencias, aventuras y actividades",
    Icon: Compass,
    href: "/admin/experiences",
    collection: "experiences" as const,
    color: "bg-emerald-100 text-emerald-700",
  },
  {
    label: "Eventos",
    description: "Calendario cultural y deportivo",
    Icon: CalendarDays,
    href: "/admin/events",
    collection: "events" as const,
    color: "bg-rose-100 text-rose-700",
  },
  {
    label: "Alojamientos",
    description: "Hoteles, cabañas, lodges y más",
    Icon: Hotel,
    href: "/admin/accommodations",
    collection: "accommodations" as const,
    color: "bg-blue-100 text-blue-700",
  },
  {
    label: "Gastronomía",
    description: "Restaurantes, cafés y confiterías",
    Icon: Utensils,
    href: "/admin/restaurants",
    collection: "restaurants" as const,
    color: "bg-amber-100 text-amber-700",
  },
  {
    label: "Deportes",
    description: "Clubes, escuelas y academias",
    Icon: Trophy,
    href: "/admin/sportActivities",
    collection: "sportActivities" as const,
    color: "bg-orange-100 text-orange-700",
  },
] as const

export default async function AdminDashboard() {
  const [counts, all] = await Promise.all([getCounts(), readAll()])

  const total =
    counts.experiences +
    counts.events +
    counts.accommodations +
    counts.restaurants +
    counts.sportActivities

  const upcomingEvents = all.events
    .filter((e) => new Date(e.date) >= new Date(new Date().toDateString()))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 5)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-brand-green-dark sm:text-3xl">
          Resumen
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Estado actual del contenido del sitio. Editá cualquier card o creá nuevos items desde las secciones.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {CARDS.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="group flex flex-col gap-2 rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-full ${c.color}`}
            >
              <c.Icon className="h-5 w-5" />
            </span>
            <p className="font-heading text-2xl font-bold text-foreground">
              {counts[c.collection]}
            </p>
            <p className="text-xs font-medium text-muted-foreground">
              {c.label}
            </p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Acceso rápido */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm lg:col-span-2">
          <div className="mb-4 flex items-center gap-2">
            <Database className="h-4 w-4 text-brand-green" />
            <h2 className="font-heading text-base font-bold text-brand-green-dark">
              Contenido editable
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {CARDS.map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="group flex items-center justify-between gap-3 rounded-xl border border-border bg-background p-3 transition-colors hover:border-brand-green hover:bg-brand-green/5"
              >
                <span className="flex items-center gap-3">
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${c.color}`}
                  >
                    <c.Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-foreground">
                      {c.label}
                    </span>
                    <span className="line-clamp-1 text-xs text-muted-foreground">
                      {c.description}
                    </span>
                  </span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-brand-green" />
              </Link>
            ))}
          </div>
        </div>

        {/* Próximos eventos */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-brand-green" />
            <h2 className="font-heading text-base font-bold text-brand-green-dark">
              Próximos eventos
            </h2>
          </div>
          {upcomingEvents.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No hay eventos próximos cargados.
            </p>
          ) : (
            <ul className="space-y-2.5">
              {upcomingEvents.map((e) => (
                <li key={e.id}>
                  <Link
                    href={`/admin/events/${e.id}`}
                    className="group flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-muted"
                  >
                    <span className="flex h-9 w-9 shrink-0 flex-col items-center justify-center rounded-lg bg-rose-100 text-rose-700">
                      <span className="font-heading text-sm font-bold leading-none">
                        {new Date(e.date).getDate()}
                      </span>
                      <span className="text-[8px] font-bold uppercase">
                        {e.date.slice(5, 7)}/{e.date.slice(0, 4)}
                      </span>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="line-clamp-1 text-sm font-semibold text-foreground">
                        {e.title}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {e.location} · {e.time} hs
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <Link
            href="/admin/events"
            className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-brand-green hover:text-brand-green-dark"
          >
            Ver todos los eventos
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* Info del sistema */}
      <div className="rounded-2xl border border-brand-green/20 bg-brand-green/5 p-5">
        <p className="flex items-start gap-3 text-sm text-foreground">
          <MapIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" />
          <span>
            <strong className="font-semibold">Almacenamiento local:</strong>{" "}
            los datos persisten en{" "}
            <code className="rounded bg-card px-1.5 py-0.5 text-xs">
              data/store.json
            </code>
            . Total de items: <strong>{total}</strong>. Los cambios se
            reflejan al instante en el sitio público.
          </span>
        </p>
      </div>
    </div>
  )
}
