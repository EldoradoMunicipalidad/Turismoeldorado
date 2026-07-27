"use client"

import { useState } from "react"
import {
  Building2,
  Home,
  TreePine,
  Warehouse,
  Hotel,
  Tent,
  Coffee,
  Waves,
  Car,
  Heart,
  Users,
  ShieldCheck,
  MapPin,
  Phone,
  ArrowRight,
  ChevronDown,
  Camera,
  Globe,
  MessageCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  typeOptions,
  serviceOptions,
  capacityOptions,
  type Accommodation,
  type AccommodationType,
} from "@/components/donde-alojarse-data"

const typeIcons: Record<AccommodationType, typeof Building2> = {
  hotel: Hotel,
  apart: Building2,
  cabana: TreePine,
  estancia: Warehouse,
  lodge: Home,
  complejo: Home,
  camping: Tent,
}

const typeColors: Record<AccommodationType, string> = {
  hotel: "bg-blue-100 text-blue-700",
  apart: "bg-indigo-100 text-indigo-700",
  cabana: "bg-emerald-100 text-emerald-700",
  estancia: "bg-amber-100 text-amber-700",
  lodge: "bg-teal-100 text-teal-700",
  complejo: "bg-orange-100 text-orange-700",
  camping: "bg-lime-100 text-lime-700",
}

const typeLabels: Record<AccommodationType, string> = {
  hotel: "Hotel",
  apart: "Apart",
  cabana: "Cabaña",
  estancia: "Estancia",
  lodge: "Lodge",
  complejo: "Complejo",
  camping: "Camping",
}

function AccommodationCard({ acc }: { acc: Accommodation }) {
  const primaryType = acc.modalities[0]
  const extraModalities = acc.modalities.slice(1)

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={acc.image || "/placeholder.svg"}
          alt={acc.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {acc.modalities.map((mod) => {
            const Icon = typeIcons[mod]
            return (
              <span
                key={mod}
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold shadow-sm backdrop-blur-sm",
                  typeColors[mod],
                )}
              >
                {Icon && <Icon className="h-3 w-3" />}
                {typeLabels[mod]}
              </span>
            )
          })}
        </div>
        {acc.capacity.sportsTeams && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-brand-yellow px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-green-dark shadow-sm backdrop-blur-sm">
            <ShieldCheck className="h-3 w-3" />
            Equipos
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-heading text-base font-bold text-foreground">
          {acc.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {acc.description}
        </p>

        <p className="mt-2 flex items-start gap-1.5 text-xs text-muted-foreground">
          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-green" />
          {acc.location}
        </p>

        {/* Capacity indicators */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {acc.capacity.couples && (
            <span className="inline-flex items-center gap-1 rounded-md bg-pink-50 px-2 py-1 text-[11px] font-medium text-pink-700">
              <Heart className="h-3 w-3" />
              Parejas
            </span>
          )}
          {acc.capacity.families && (
            <span className="inline-flex items-center gap-1 rounded-md bg-teal-50 px-2 py-1 text-[11px] font-medium text-teal-700">
              <Users className="h-3 w-3" />
              Familias
            </span>
          )}
        </div>

        {/* Service highlights */}
        <div className="mt-2 flex flex-wrap gap-1.5">
          {acc.services.breakfast && (
            <span className="inline-flex items-center gap-1 rounded-md bg-rose-50 px-2 py-1 text-[11px] font-medium text-rose-700">
              <Coffee className="h-3 w-3" />
              Desayuno
            </span>
          )}
          {acc.services.pool && (
            <span className="inline-flex items-center gap-1 rounded-md bg-sky-50 px-2 py-1 text-[11px] font-medium text-sky-700">
              <Waves className="h-3 w-3" />
              Piscina
            </span>
          )}
          {acc.services.parking && (
            <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-700">
              <Car className="h-3 w-3" />
              Estacionamiento
            </span>
          )}
        </div>

        {/* Contact */}
        <div className="mt-auto flex flex-wrap items-center gap-2 pt-3 text-[11px] text-muted-foreground">
          {acc.phone && (
            <span className="inline-flex items-center gap-1">
              <Phone className="h-3 w-3 text-brand-green" />
              {acc.phone}
            </span>
          )}
          {acc.whatsapp && (
            <span className="inline-flex items-center gap-1">
              <MessageCircle className="h-3 w-3 text-brand-green" />
              {acc.whatsapp}
            </span>
          )}
        </div>

        <div className="mt-3 flex gap-2">
          <a
            href={`/donde-alojarse/${acc.id}`}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-brand-green px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-green-dark"
          >
            Ver alojamiento
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        {/* Social */}
        {(acc.instagram || acc.website) && (
          <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
            {acc.instagram && (
              <span className="inline-flex items-center gap-1">
                <Camera className="h-3 w-3" />
                @{acc.instagram}
              </span>
            )}
            {acc.website && (
              <span className="inline-flex items-center gap-1">
                <Globe className="h-3 w-3" />
                {acc.website}
              </span>
            )}
          </div>
        )}
      </div>
    </article>
  )
}

export function DondeAlojarseSection({
  accommodations,
}: {
  accommodations: Accommodation[]
}) {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [selectedCapacities, setSelectedCapacities] = useState<string[]>([])
  const [visibleCount, setVisibleCount] = useState(6)

  function toggleArray(arr: string[], val: string): string[] {
    return arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]
  }

  const filtered = accommodations.filter((acc) => {
    if (selectedTypes.length > 0 && !acc.modalities.some((m) => selectedTypes.includes(m))) return false

    if (selectedServices.length > 0) {
      const serviceMap: Record<string, boolean> = {
        breakfast: acc.services.breakfast,
        pool: acc.services.pool,
        parking: acc.services.parking,
      }
      if (!selectedServices.every((s) => serviceMap[s])) return false
    }

    if (selectedCapacities.length > 0) {
      const capacityMap: Record<string, boolean> = {
        couples: acc.capacity.couples,
        families: acc.capacity.families,
        sportsTeams: acc.capacity.sportsTeams,
      }
      if (!selectedCapacities.every((c) => capacityMap[c])) return false
    }

    return true
  })

  const visible = filtered.slice(0, visibleCount)
  const hasMore = filtered.length > visibleCount

  function resetFilters() {
    setSelectedTypes([])
    setSelectedServices([])
    setSelectedCapacities([])
    setVisibleCount(6)
  }

  const hasActiveFilters =
    selectedTypes.length > 0 ||
    selectedServices.length > 0 ||
    selectedCapacities.length > 0

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      {/* Section header */}
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-green text-white">
            <Building2 className="h-4 w-4" />
          </span>
          <h2 className="font-heading text-2xl font-bold text-brand-green-dark sm:text-3xl">
            Dónde alojarse
          </h2>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Encontrá el lugar perfecto para tu estadía en Eldorado
        </p>
      </div>

      {/* Filter groups */}
      <div className="mb-8 space-y-4">
        {/* Tipo */}
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Tipo
          </p>
          <div className="flex flex-wrap gap-2">
            {typeOptions.map((opt) => {
              const Icon = typeIcons[opt.value as AccommodationType]
              return (
                <button
                  key={opt.value}
                  onClick={() => {
                    setSelectedTypes((prev) => toggleArray(prev, opt.value))
                    setVisibleCount(6)
                  }}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border-2 px-4 py-2 text-sm font-semibold transition-all",
                    selectedTypes.includes(opt.value)
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

        {/* Servicios */}
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Servicios
          </p>
          <div className="flex flex-wrap gap-2">
            {serviceOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  setSelectedServices((prev) => toggleArray(prev, opt.value))
                  setVisibleCount(6)
                }}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border-2 px-4 py-2 text-sm font-semibold transition-all",
                  selectedServices.includes(opt.value)
                    ? "border-brand-green bg-brand-green text-white shadow-sm"
                    : "border-border bg-card text-foreground/70 hover:border-brand-green/50 hover:text-brand-green",
                )}
              >
                {opt.value === "breakfast" && <Coffee className="h-4 w-4" />}
                {opt.value === "pool" && <Waves className="h-4 w-4" />}
                {opt.value === "parking" && <Car className="h-4 w-4" />}
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Capacidad */}
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Capacidad
          </p>
          <div className="flex flex-wrap gap-2">
            {capacityOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  setSelectedCapacities((prev) => toggleArray(prev, opt.value))
                  setVisibleCount(6)
                }}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border-2 px-4 py-2 text-sm font-semibold transition-all",
                  selectedCapacities.includes(opt.value)
                    ? "border-brand-green bg-brand-green text-white shadow-sm"
                    : "border-border bg-card text-foreground/70 hover:border-brand-green/50 hover:text-brand-green",
                )}
              >
                {opt.value === "couples" && <Heart className="h-4 w-4" />}
                {opt.value === "families" && <Users className="h-4 w-4" />}
                {opt.value === "sportsTeams" && <ShieldCheck className="h-4 w-4" />}
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Limpiar filtros */}
        {hasActiveFilters && (
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
          ? "No encontramos alojamientos con esos filtros."
          : `${filtered.length} alojamiento${filtered.length !== 1 ? "s" : ""} encontrado${filtered.length !== 1 ? "s" : ""}`}
      </p>

      {/* Grid */}
      {filtered.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((acc) => (
              <AccommodationCard key={acc.id} acc={acc} />
            ))}
          </div>

          {hasMore && (
            <div className="mt-10 text-center">
              <button
                onClick={() => setVisibleCount((c) => c + 6)}
                className="inline-flex items-center gap-2 rounded-full border-2 border-brand-green px-8 py-3 text-sm font-semibold text-brand-green transition-all hover:bg-brand-green hover:text-white"
              >
                Ver más alojamientos
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          )}
        </>
      )}
    </section>
  )
}