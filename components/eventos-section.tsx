"use client"

import { useState } from "react"
import {
  CalendarDays,
  MapPin,
  Clock,
  Music,
  Trophy,
  Sparkles,
  Tag,
  ArrowRight,
  ChevronDown,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  eventTypes,
  priceFilters,
  type EventItem,
} from "@/components/eventos-data"

const typeColors: Record<string, string> = {
  cultural: "bg-rose-100 text-rose-700",
  deportivo: "bg-blue-100 text-blue-700",
}

const typeIcons: Record<string, typeof Music> = {
  cultural: Music,
  deportivo: Trophy,
}

const typeLabels: Record<string, string> = {
  cultural: "Cultural",
  deportivo: "Deportivo",
}

function formatDate(dateStr: string): { day: string; month: string; full: string } {
  const months = [
    "ENE", "FEB", "MAR", "ABR", "MAY", "JUN",
    "JUL", "AGO", "SEP", "OCT", "NOV", "DIC",
  ]
  const d = new Date(dateStr)
  const day = String(d.getDate()).padStart(2, "0")
  const month = months[d.getMonth()]
  const full = `${day} de ${month.toLowerCase()} ${d.getFullYear()}`
  return { day, month, full }
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(price)
}

function EventCard({ ev }: { ev: EventItem }) {
  const Icon = typeIcons[ev.type]
  const date = formatDate(ev.date)

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={ev.image || "/placeholder.svg"}
          alt={ev.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />

        {/* Date badge */}
        <div className="absolute left-3 top-3 flex flex-col items-center justify-center rounded-xl bg-white/95 px-3 py-1.5 text-center shadow-md backdrop-blur-sm">
          <span className="font-heading text-lg font-bold leading-none text-brand-green-dark">
            {date.day}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-green">
            {date.month}
          </span>
        </div>

        {/* Type badge */}
        <span
          className={cn(
            "absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold shadow-sm backdrop-blur-sm",
            typeColors[ev.type],
          )}
        >
          {Icon && <Icon className="h-3 w-3" />}
          {typeLabels[ev.type]}
        </span>

        {/* Highlight badge */}
        {ev.highlight && (
          <span className="absolute right-3 top-12 inline-flex items-center gap-1 rounded-full bg-brand-yellow px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-green-dark shadow-sm backdrop-blur-sm">
            <Sparkles className="h-3 w-3" />
            Destacado
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-heading text-base font-bold text-foreground">
          {ev.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {ev.description}
        </p>
        <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
          <p className="flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5 text-brand-green" />
            {date.full}
          </p>
          <p className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-brand-green" />
            {ev.time} hs
          </p>
          <p className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-brand-green" />
            {ev.location}
          </p>
        </div>
        <div className="mt-auto flex items-center justify-between gap-2 pt-4">
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold",
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

function FeaturedEvent({ ev }: { ev: EventItem }) {
  const Icon = typeIcons[ev.type]
  const date = formatDate(ev.date)

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl bg-brand-green-dark text-white shadow-md transition-all duration-300 hover:shadow-xl sm:flex-row">
      <div className="relative h-56 overflow-hidden sm:h-auto sm:w-1/2 sm:min-h-[300px]">
        <img
          src={ev.image || "/placeholder.svg"}
          alt={ev.title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent sm:bg-gradient-to-t" />
        <div className="absolute left-4 top-4 flex flex-col items-center justify-center rounded-xl bg-white/95 px-4 py-2 text-center shadow-md backdrop-blur-sm">
          <span className="font-heading text-2xl font-bold leading-none text-brand-green-dark">
            {date.day}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-green">
            {date.month}
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-center gap-3 p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
              ev.type === "cultural"
                ? "bg-rose-500/20 text-rose-100"
                : "bg-blue-500/20 text-blue-100",
            )}
          >
            {Icon && <Icon className="h-3 w-3" />}
            {typeLabels[ev.type]}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-brand-yellow px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-green-dark">
            <Sparkles className="h-3 w-3" />
            Destacado
          </span>
        </div>
        <h3 className="font-heading text-2xl font-bold text-balance sm:text-3xl">
          {ev.title}
        </h3>
        <p className="max-w-md text-sm leading-relaxed text-white/85">
          {ev.description}
        </p>
        <div className="mt-2 space-y-1.5 text-xs text-white/85">
          <p className="flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5 text-brand-yellow" />
            {date.full}
          </p>
          <p className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-brand-yellow" />
            {ev.time} hs
          </p>
          <p className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-brand-yellow" />
            {ev.location}
          </p>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold",
              ev.isFree
                ? "bg-emerald-500/20 text-emerald-100"
                : "bg-amber-500/20 text-amber-100",
            )}
          >
            <Tag className="h-3 w-3" />
            {ev.isFree ? "Gratis" : ev.price ? formatPrice(ev.price) : "Con entrada"}
          </span>
          <a
            href={`/eventos/${ev.id}`}
            className="inline-flex items-center gap-1.5 rounded-full bg-brand-yellow px-4 py-2 text-xs font-semibold text-brand-green-dark transition-transform hover:scale-105"
          >
            Ver evento
            <ArrowRight className="h-3 w-3" />
          </a>
        </div>
      </div>
    </article>
  )
}

export function EventosSection({ events }: { events: EventItem[] }) {
  const [activeType, setActiveType] = useState("todos")
  const [activePrice, setActivePrice] = useState("todos")
  const [visibleCount, setVisibleCount] = useState(6)

  const filtered = events
    .filter((ev) => {
      if (activeType !== "todos" && ev.type !== activeType) return false
      if (activePrice === "gratis" && !ev.isFree) return false
      if (activePrice === "pago" && ev.isFree) return false
      return true
    })
    .sort((a, b) => a.date.localeCompare(b.date))

  const featured = filtered.filter((ev) => ev.highlight)
  const rest = filtered.filter((ev) => !ev.highlight)
  const visible = rest.slice(0, visibleCount)
  const hasMore = rest.length > visibleCount

  function resetFilters() {
    setActiveType("todos")
    setActivePrice("todos")
    setVisibleCount(6)
  }

  function handleTypeChange(val: string) {
    setActiveType(val)
    setVisibleCount(6)
  }

  function handlePriceChange(val: string) {
    setActivePrice(val)
    setVisibleCount(6)
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      {/* Section header */}
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-green text-white">
            <CalendarDays className="h-4 w-4" />
          </span>
          <h2 className="font-heading text-2xl font-bold text-brand-green-dark sm:text-3xl">
            Eventos
          </h2>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Culturales y deportivos, todo lo que pasa en Eldorado
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 space-y-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Tipo de evento
          </p>
          <div className="flex flex-wrap gap-2">
            {eventTypes.map((opt) => {
              const Icon = opt.value === "todos" ? CalendarDays : typeIcons[opt.value]
              return (
                <button
                  key={opt.value}
                  onClick={() => handleTypeChange(opt.value)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border-2 px-4 py-2 text-sm font-semibold transition-all",
                    activeType === opt.value
                      ? "border-brand-green bg-brand-green text-white shadow-sm"
                      : "border-border bg-card text-foreground/70 hover:border-brand-green/50 hover:text-brand-green",
                  )}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  {opt.label}
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Entrada
          </p>
          <div className="flex flex-wrap gap-2">
            {priceFilters.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handlePriceChange(opt.value)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border-2 px-4 py-2 text-sm font-semibold transition-all",
                  activePrice === opt.value
                    ? "border-brand-green bg-brand-green text-white shadow-sm"
                    : "border-border bg-card text-foreground/70 hover:border-brand-green/50 hover:text-brand-green",
                )}
              >
                <Tag className="h-4 w-4" />
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {(activeType !== "todos" || activePrice !== "todos") && (
          <button
            onClick={resetFilters}
            className="text-xs font-medium text-muted-foreground underline underline-offset-2 hover:text-foreground"
          >
            Limpiar todos los filtros
          </button>
        )}
      </div>

      {/* Results count */}
      <p className="mb-6 text-sm text-muted-foreground">
        {filtered.length === 0
          ? "No encontramos eventos con esos filtros."
          : `${filtered.length} evento${filtered.length !== 1 ? "s" : ""} encontrado${filtered.length !== 1 ? "s" : ""}`}
      </p>

      {filtered.length > 0 && (
        <>
          {/* Featured events */}
          {featured.length > 0 && (
            <div className="mb-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
              {featured.map((ev) => (
                <FeaturedEvent key={ev.id} ev={ev} />
              ))}
            </div>
          )}

          {/* Grid of rest */}
          {visible.length > 0 && (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {visible.map((ev) => (
                  <EventCard key={ev.id} ev={ev} />
                ))}
              </div>

              {hasMore && (
                <div className="mt-10 text-center">
                  <button
                    onClick={() => setVisibleCount((c) => c + 4)}
                    className="inline-flex items-center gap-2 rounded-full border-2 border-brand-green px-8 py-3 text-sm font-semibold text-brand-green transition-all hover:bg-brand-green hover:text-white"
                  >
                    Ver más eventos
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </section>
  )
}
