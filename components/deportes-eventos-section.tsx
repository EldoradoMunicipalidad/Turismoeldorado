"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Trophy,
  CalendarDays,
  MapPin,
  Clock,
  Users,
  ArrowRight,
  ChevronDown,
  Tag,
  Activity,
  Target,
  Bike,
  Volleyball,
  Goal,
  Waves,
  Anchor,
  Fish,
  Footprints,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  sportCategories,
  sportLevels,
  type SportDiscipline,
  type SportCategory,
  type SportActivity,
} from "@/components/deportes-eventos-data"
import type { EventItem } from "@/components/eventos-data"
import { formatDate, formatPrice } from "@/components/deportes-eventos-helpers"

const disciplineIcons: Record<SportDiscipline, typeof Trophy> = {
  futbol: Goal,
  rugby: Volleyball,
  hockey: Activity,
  basquet: Activity,
  atletismo: Footprints,
  ciclismo: Bike,
  natacion: Waves,
  pesca: Fish,
  kayak: Anchor,
  tenis: Target,
  paddel: Target,
}

const disciplineColors: Record<SportDiscipline, string> = {
  futbol: "bg-emerald-100 text-emerald-700",
  rugby: "bg-amber-100 text-amber-700",
  hockey: "bg-blue-100 text-blue-700",
  basquet: "bg-orange-100 text-orange-700",
  atletismo: "bg-red-100 text-red-700",
  ciclismo: "bg-cyan-100 text-cyan-700",
  natacion: "bg-sky-100 text-sky-700",
  pesca: "bg-indigo-100 text-indigo-700",
  kayak: "bg-teal-100 text-teal-700",
  tenis: "bg-lime-100 text-lime-700",
  paddel: "bg-green-100 text-green-700",
}

const categoryColors: Record<SportCategory, string> = {
  equipo: "bg-blue-100 text-blue-700",
  individual: "bg-amber-100 text-amber-700",
  acuatico: "bg-cyan-100 text-cyan-700",
  aventura: "bg-orange-100 text-orange-700",
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

function SportCard({ activity }: { activity: SportActivity }) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={activity.image || "/placeholder.svg"}
          alt={activity.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {activity.disciplines.map((d) => {
            const Icon = disciplineIcons[d]
            return (
              <span
                key={d}
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold shadow-sm backdrop-blur-sm",
                  disciplineColors[d],
                )}
              >
                {Icon && <Icon className="h-3 w-3" />}
                {d.charAt(0).toUpperCase() + d.slice(1)}
              </span>
            )
          })}
        </div>
        <span
          className={cn(
            "absolute right-3 top-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider shadow-sm backdrop-blur-sm",
            categoryColors[activity.category],
          )}
        >
          {sportCategories.find((c) => c.value === activity.category)?.label}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-1 flex items-center gap-1.5">
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
              levelColors[activity.level],
            )}
          >
            <Trophy className="h-3 w-3" />
            {levelLabels[activity.level]}
          </span>
        </div>
        <h3 className="font-heading text-base font-bold text-foreground">
          {activity.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {activity.description}
        </p>
        <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
          <p className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-brand-green" />
            {activity.schedule}
          </p>
          <p className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-brand-green" />
            {activity.location}
          </p>
        </div>
        <Link
          href="/deportes-eventos"
          className="mt-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand-green px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-green-dark"
        >
          Unirme
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  )
}

function UpcomingEventCard({ ev }: { ev: EventItem }) {
  const date = formatDate(ev.date)
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:flex-row">
      <div className="relative h-32 overflow-hidden sm:h-auto sm:w-40 sm:shrink-0">
        <img
          src={ev.image || "/placeholder.svg"}
          alt={ev.title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
        <div className="absolute left-3 top-3 flex flex-col items-center justify-center rounded-xl bg-white/95 px-3 py-1.5 text-center shadow-md backdrop-blur-sm">
          <span className="font-heading text-lg font-bold leading-none text-brand-green-dark">
            {date.day}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-green">
            {date.month}
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-center gap-1.5 p-4">
        <h3 className="font-heading text-base font-bold text-foreground">
          {ev.title}
        </h3>
        <p className="line-clamp-1 text-xs text-muted-foreground">{ev.description}</p>
        <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-brand-green" />
            {ev.time} hs
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-brand-green" />
            {ev.location}
          </span>
        </div>
        <div className="mt-1 flex items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold",
              ev.isFree
                ? "bg-emerald-50 text-emerald-700"
                : "bg-amber-50 text-amber-700",
            )}
          >
            <Tag className="h-3 w-3" />
            {ev.isFree ? "Gratis" : ev.price ? formatPrice(ev.price) : "Con entrada"}
          </span>
          <a
            href={`/eventos/${ev.id}`}
            className="inline-flex items-center gap-1 rounded-full bg-brand-green px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-brand-green-dark"
          >
            Más info
            <ArrowRight className="h-3 w-3" />
          </a>
        </div>
      </div>
    </article>
  )
}

export function DeportesEventosSection({
  sportActivities,
  upcomingSportEvents,
}: {
  sportActivities: SportActivity[]
  upcomingSportEvents: EventItem[]
}) {
  const [activeCategory, setActiveCategory] = useState<string>("todas")
  const [activeLevel, setActiveLevel] = useState<string | null>(null)
  const [visibleCount, setVisibleCount] = useState(6)

  const filtered = sportActivities.filter((a) => {
    if (activeCategory !== "todas" && a.category !== activeCategory) return false
    if (activeLevel && a.level !== activeLevel && a.level !== "todos") return false
    return true
  })

  const visible = filtered.slice(0, visibleCount)
  const hasMore = filtered.length > visibleCount

  function resetFilters() {
    setActiveCategory("todas")
    setActiveLevel(null)
    setVisibleCount(6)
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      {/* Actividad deportiva */}
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-green text-white">
            <Trophy className="h-4 w-4" />
          </span>
          <h2 className="font-heading text-2xl font-bold text-brand-green-dark sm:text-3xl">
            Dónde practicar deportes
          </h2>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Clubes, escuelas y academias de Eldorado para todos los niveles
        </p>
      </div>

      {/* Filtros */}
      <div className="mb-8 space-y-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Categoría
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setActiveCategory("todas")
                setVisibleCount(6)
              }}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border-2 px-4 py-2 text-sm font-semibold transition-all",
                activeCategory === "todas"
                  ? "border-brand-green bg-brand-green text-white shadow-sm"
                  : "border-border bg-card text-foreground/70 hover:border-brand-green/50 hover:text-brand-green",
              )}
            >
              Todas
            </button>
            {sportCategories.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  setActiveCategory(opt.value)
                  setVisibleCount(6)
                }}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border-2 px-4 py-2 text-sm font-semibold transition-all",
                  activeCategory === opt.value
                    ? "border-brand-green bg-brand-green text-white shadow-sm"
                    : "border-border bg-card text-foreground/70 hover:border-brand-green/50 hover:text-brand-green",
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Nivel
          </p>
          <div className="flex flex-wrap gap-2">
            {sportLevels.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  setActiveLevel(activeLevel === opt.value ? null : opt.value)
                  setVisibleCount(6)
                }}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border-2 px-4 py-2 text-sm font-semibold transition-all",
                  activeLevel === opt.value
                    ? "border-brand-green bg-brand-green text-white shadow-sm"
                    : "border-border bg-card text-foreground/70 hover:border-brand-green/50 hover:text-brand-green",
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {(activeCategory !== "todas" || activeLevel !== null) && (
          <button
            onClick={resetFilters}
            className="text-xs font-medium text-muted-foreground underline underline-offset-2 hover:text-foreground"
          >
            Limpiar todos los filtros
          </button>
        )}
      </div>

      <p className="mb-6 text-sm text-muted-foreground">
        {filtered.length === 0
          ? "No encontramos actividades con esos filtros."
          : `${filtered.length} actividad${filtered.length !== 1 ? "es" : ""} encontrada${filtered.length !== 1 ? "s" : ""}`}
      </p>

      {filtered.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((a) => (
              <SportCard key={a.id} activity={a} />
            ))}
          </div>
          {hasMore && (
            <div className="mt-10 text-center">
              <button
                onClick={() => setVisibleCount((c) => c + 4)}
                className="inline-flex items-center gap-2 rounded-full border-2 border-brand-green px-8 py-3 text-sm font-semibold text-brand-green transition-all hover:bg-brand-green hover:text-white"
              >
                Ver más actividades
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          )}
        </>
      )}

      {/* Próximos eventos deportivos */}
      <div className="mt-20">
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-green text-white">
              <CalendarDays className="h-4 w-4" />
            </span>
            <h2 className="font-heading text-2xl font-bold text-brand-green-dark sm:text-3xl">
              Próximos eventos deportivos
            </h2>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Carreras, competencias y torneos en Eldorado
          </p>
        </div>

        {upcomingSportEvents.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No hay eventos deportivos próximos.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {upcomingSportEvents.map((ev) => (
              <UpcomingEventCard key={ev.id} ev={ev} />
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            href="/eventos"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-green transition-colors hover:text-brand-green-dark"
          >
            Ver todos los eventos (culturales y deportivos)
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
