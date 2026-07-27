"use client"

import { useState } from "react"
import {
  Utensils,
  Coffee,
  Pizza,
  Fish,
  Beef,
  Leaf,
  Cake,
  Phone,
  MessageCircle,
  MapPin,
  Camera,
  Globe,
  ArrowRight,
  ChevronDown,
  Clock,
  DollarSign,
  Tag,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  foodTypeOptions,
  priceRangeOptions,
  type Restaurant,
  type FoodType,
} from "@/components/donde-comer-data"

const foodTypeIcons: Record<FoodType, typeof Utensils> = {
  regional: Utensils,
  parrilla: Beef,
  pizza: Pizza,
  pesca: Fish,
  vegetariana: Leaf,
  cafe: Coffee,
  confiteria: Cake,
}

const foodTypeColors: Record<FoodType, string> = {
  regional: "bg-emerald-100 text-emerald-700",
  parrilla: "bg-red-100 text-red-700",
  pizza: "bg-orange-100 text-orange-700",
  pesca: "bg-sky-100 text-sky-700",
  vegetariana: "bg-lime-100 text-lime-700",
  cafe: "bg-amber-100 text-amber-700",
  confiteria: "bg-rose-100 text-rose-700",
}

const priceRangeLabels: Record<string, string> = {
  economico: "$ Económico",
  medio: "$$ Medio",
  alto: "$$$ Premium",
}

const priceRangeColor: Record<string, string> = {
  economico: "bg-emerald-50 text-emerald-700",
  medio: "bg-amber-50 text-amber-700",
  alto: "bg-purple-50 text-purple-700",
}

function RestaurantCard({ rest }: { rest: Restaurant }) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={rest.image || "/placeholder.svg"}
          alt={rest.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {rest.foodTypes.map((ft) => {
            const Icon = foodTypeIcons[ft]
            return (
              <span
                key={ft}
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold shadow-sm backdrop-blur-sm",
                  foodTypeColors[ft],
                )}
              >
                {Icon && <Icon className="h-3 w-3" />}
                {foodTypeOptions.find((o) => o.value === ft)?.label}
              </span>
            )
          })}
        </div>
        <span
          className={cn(
            "absolute right-3 top-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold shadow-sm backdrop-blur-sm",
            priceRangeColor[rest.priceRange],
          )}
        >
          <DollarSign className="h-3 w-3" />
          {priceRangeLabels[rest.priceRange]}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-heading text-base font-bold text-foreground">
          {rest.name}
        </h3>
        {rest.signature && (
          <p className="mt-1 flex items-start gap-1.5 text-xs font-medium text-brand-green">
            <Tag className="mt-0.5 h-3 w-3 shrink-0" />
            {rest.signature}
          </p>
        )}
        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {rest.description}
        </p>

        <p className="mt-2 flex items-start gap-1.5 text-xs text-muted-foreground">
          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-green" />
          {rest.location}
        </p>

        <p className="mt-1.5 flex items-start gap-1.5 text-xs text-muted-foreground">
          <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-green" />
          {rest.schedule}
        </p>

        {/* Services */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {rest.services.delivery && (
            <span className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-1 text-[11px] font-medium text-indigo-700">
              Delivery
            </span>
          )}
          {rest.services.parking && (
            <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-700">
              Estacionamiento
            </span>
          )}
          {rest.services.airCon && (
            <span className="inline-flex items-center gap-1 rounded-md bg-cyan-50 px-2 py-1 text-[11px] font-medium text-cyan-700">
              A/C
            </span>
          )}
          {rest.services.wifi && (
            <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-[11px] font-medium text-blue-700">
              WiFi
            </span>
          )}
          {rest.services.kidFriendly && (
            <span className="inline-flex items-center gap-1 rounded-md bg-pink-50 px-2 py-1 text-[11px] font-medium text-pink-700">
              Apto niños
            </span>
          )}
        </div>

        {/* Contact */}
        <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
          {rest.phone && (
            <span className="inline-flex items-center gap-1">
              <Phone className="h-3 w-3 text-brand-green" />
              {rest.phone}
            </span>
          )}
          {rest.whatsapp && (
            <span className="inline-flex items-center gap-1">
              <MessageCircle className="h-3 w-3 text-brand-green" />
              {rest.whatsapp}
            </span>
          )}
        </div>

        <a
          href={`/donde-comer/${rest.id}`}
          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-brand-green px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-green-dark"
        >
          Ver restaurante
          <ArrowRight className="h-4 w-4" />
        </a>

        {/* Social */}
        {(rest.instagram) && (
          <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Camera className="h-3 w-3" />@{rest.instagram}
            </span>
          </div>
        )}
      </div>
    </article>
  )
}

export function DondeComerSection({
  restaurants,
}: {
  restaurants: Restaurant[]
}) {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null)
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [visibleCount, setVisibleCount] = useState(6)

  function toggleArray(arr: string[], val: string): string[] {
    return arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]
  }

  const filtered = restaurants.filter((rest) => {
    if (
      selectedTypes.length > 0 &&
      !rest.foodTypes.some((ft) => selectedTypes.includes(ft))
    )
      return false
    if (selectedPrice && rest.priceRange !== selectedPrice) return false
    if (selectedServices.length > 0) {
      const serviceMap: Record<string, boolean> = {
        delivery: rest.services.delivery,
        parking: rest.services.parking,
        airCon: rest.services.airCon,
        wifi: rest.services.wifi,
        kidFriendly: rest.services.kidFriendly,
      }
      if (!selectedServices.every((s) => serviceMap[s])) return false
    }
    return true
  })

  const visible = filtered.slice(0, visibleCount)
  const hasMore = filtered.length > visibleCount

  function resetFilters() {
    setSelectedTypes([])
    setSelectedPrice(null)
    setSelectedServices([])
    setVisibleCount(6)
  }

  const hasActiveFilters =
    selectedTypes.length > 0 || selectedPrice !== null || selectedServices.length > 0

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-green text-white">
            <Utensils className="h-4 w-4" />
          </span>
          <h2 className="font-heading text-2xl font-bold text-brand-green-dark sm:text-3xl">
            Dónde comer
          </h2>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Restaurantes, cafés y confiterías para todos los gustos
        </p>
      </div>

      {/* Filter groups */}
      <div className="mb-8 space-y-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Tipo de comida
          </p>
          <div className="flex flex-wrap gap-2">
            {foodTypeOptions.map((opt) => {
              const Icon = foodTypeIcons[opt.value as FoodType]
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

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Rango de precio
          </p>
          <div className="flex flex-wrap gap-2">
            {priceRangeOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  setSelectedPrice(selectedPrice === opt.value ? null : opt.value)
                  setVisibleCount(6)
                }}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border-2 px-4 py-2 text-sm font-semibold transition-all",
                  selectedPrice === opt.value
                    ? "border-brand-green bg-brand-green text-white shadow-sm"
                    : "border-border bg-card text-foreground/70 hover:border-brand-green/50 hover:text-brand-green",
                )}
              >
                <DollarSign className="h-4 w-4" />
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Servicios
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              { value: "delivery", label: "Delivery" },
              { value: "parking", label: "Estacionamiento" },
              { value: "airCon", label: "Aire acondicionado" },
              { value: "wifi", label: "WiFi" },
              { value: "kidFriendly", label: "Apto niños" },
            ].map((opt) => (
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
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {hasActiveFilters && (
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
          ? "No encontramos restaurantes con esos filtros."
          : `${filtered.length} restaurante${filtered.length !== 1 ? "s" : ""} encontrado${filtered.length !== 1 ? "s" : ""}`}
      </p>

      {filtered.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((rest) => (
              <RestaurantCard key={rest.id} rest={rest} />
            ))}
          </div>

          {hasMore && (
            <div className="mt-10 text-center">
              <button
                onClick={() => setVisibleCount((c) => c + 6)}
                className="inline-flex items-center gap-2 rounded-full border-2 border-brand-green px-8 py-3 text-sm font-semibold text-brand-green transition-all hover:bg-brand-green hover:text-white"
              >
                Ver más restaurantes
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          )}
        </>
      )}
    </section>
  )
}
