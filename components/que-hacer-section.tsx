"use client"

import { useState } from "react"
import {
  Clock,
  TicketCheck,
  Users,
  MapPin,
  Waves,
  Trees,
  Mountain,
  Bike,
  Landmark,
  Sun,
  ArrowRight,
  ChevronDown,
} from "lucide-react"
import { SectionHeading } from "@/components/section-heading"
import { cn } from "@/lib/utils"
import { durationOptions, type Experience } from "@/components/que-hacer-data"

const categoryIcons: Record<string, typeof Trees> = {
  naturaleza: Trees,
  aventura: Mountain,
  "turismo-rural": Bike,
  deportes: Bike,
  cultura: Landmark,
  "full-day": Sun,
}

const categoryColors: Record<string, string> = {
  naturaleza: "bg-emerald-100 text-emerald-700",
  aventura: "bg-orange-100 text-orange-700",
  "turismo-rural": "bg-amber-100 text-amber-700",
  deportes: "bg-blue-100 text-blue-700",
  cultura: "bg-purple-100 text-purple-700",
  "full-day": "bg-rose-100 text-rose-700",
}

const categoryBorderColors: Record<string, string> = {
  naturaleza: "border-emerald-500",
  aventura: "border-orange-500",
  "turismo-rural": "border-amber-500",
  deportes: "border-blue-500",
  cultura: "border-purple-500",
  "full-day": "border-rose-500",
}

const durationLabels: Record<string, string> = {
  "1h": "1 hora",
  "medio-dia": "½ día",
  "dia-completo": "Día completo",
}

type Category = { value: string; label: string }

export function QueHacerSection({
  experiences,
  categories,
}: {
  experiences: Experience[]
  categories: readonly Category[]
}) {
  return (
    <QueHacerInner
      experiences={experiences}
      categories={categories}
    />
  )
}

function QueHacerInner({
  experiences,
  categories,
}: {
  experiences: Experience[]
  categories: readonly Category[]
}) {
  const [activeCategory, setActiveCategory] = useState("todas")
  const [selectedDuration, setSelectedDuration] = useState<string | null>(null)
  const [reservationOnly, setReservationOnly] = useState(false)
  const [kidsOnly, setKidsOnly] = useState(false)
  const [guideOnly, setGuideOnly] = useState(false)
  const [visibleCount, setVisibleCount] = useState(6)

  const filtered = experiences.filter((exp) => {
    if (activeCategory !== "todas" && exp.category !== activeCategory)
      return false
    if (selectedDuration && exp.duration !== selectedDuration) return false
    if (reservationOnly && !exp.requiresReservation) return false
    if (kidsOnly && !exp.kidFriendly) return false
    if (guideOnly && !exp.hasGuide) return false
    return true
  })

  const visible = filtered.slice(0, visibleCount)
  const hasMore = filtered.length > visibleCount

  function resetFilters() {
    setSelectedDuration(null)
    setReservationOnly(false)
    setKidsOnly(false)
    setGuideOnly(false)
  }

  function handleCategoryChange(cat: string) {
    setActiveCategory(cat)
    resetFilters()
    setVisibleCount(6)
  }

  function toggleFilter(
    setter: (v: boolean) => void,
    current: boolean,
  ) {
    setter(!current)
    setVisibleCount(6)
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <SectionHeading
        title="Qué hacer"
        subtitle="Experiencias únicas en Eldorado"
      />

      {/* Category pills */}
      <div className="mb-6 -mx-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
        <div className="flex gap-2 min-w-max sm:flex-wrap">
          {categories.map((cat) => {
            const Icon = categoryIcons[cat.value]
            return (
              <button
                key={cat.value}
                onClick={() => handleCategoryChange(cat.value)}
                className={cn(
                  "flex items-center gap-2 rounded-full border-2 px-4 py-2 text-sm font-semibold transition-all",
                  activeCategory === cat.value
                    ? "border-brand-green bg-brand-green text-white shadow-md"
                    : "border-border bg-card text-foreground/70 hover:border-brand-green/50 hover:text-brand-green",
                )}
              >
                {Icon && <Icon className="h-4 w-4" />}
                {cat.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Secondary filters */}
      <div className="mb-8 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 rounded-xl border border-border bg-card p-1">
          {durationOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                setSelectedDuration(
                  selectedDuration === opt.value ? null : opt.value,
                )
                setVisibleCount(6)
              }}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                selectedDuration === opt.value
                  ? "bg-brand-green text-white"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <FilterToggle
          active={reservationOnly}
          onChange={() => toggleFilter(setReservationOnly, reservationOnly)}
        >
          <TicketCheck className="h-3.5 w-3.5" />
          Con reserva
        </FilterToggle>

        <FilterToggle
          active={kidsOnly}
          onChange={() => toggleFilter(setKidsOnly, kidsOnly)}
        >
          <Users className="h-3.5 w-3.5" />
          Apto niños
        </FilterToggle>

        <FilterToggle
          active={guideOnly}
          onChange={() => toggleFilter(setGuideOnly, guideOnly)}
        >
          <MapPin className="h-3.5 w-3.5" />
          Con guía
        </FilterToggle>

        {(selectedDuration || reservationOnly || kidsOnly || guideOnly) && (
          <button
            onClick={() => {
              resetFilters()
              setVisibleCount(6)
            }}
            className="text-xs font-medium text-muted-foreground underline underline-offset-2 hover:text-foreground"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      <p className="mb-6 text-sm text-muted-foreground">
        {filtered.length === 0
          ? "No encontramos experiencias con esos filtros."
          : `${filtered.length} experiencia${filtered.length !== 1 ? "s" : ""} encontrada${filtered.length !== 1 ? "s" : ""}`}
      </p>

      {filtered.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((exp) => (
              <ExperienceCard
                key={exp.id}
                exp={exp}
                categories={categories}
              />
            ))}
          </div>

          {hasMore && (
            <div className="mt-10 text-center">
              <button
                onClick={() => setVisibleCount((c) => c + 4)}
                className="inline-flex items-center gap-2 rounded-full border-2 border-brand-green px-8 py-3 text-sm font-semibold text-brand-green transition-all hover:bg-brand-green hover:text-white"
              >
                Ver más experiencias
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          )}
        </>
      )}
    </section>
  )
}

function ExperienceCard({
  exp,
  categories,
}: {
  exp: Experience
  categories: readonly Category[]
}) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={exp.image || "/placeholder.svg"}
          alt={exp.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <span
          className={cn(
            "absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold shadow-sm backdrop-blur-sm",
            categoryColors[exp.category],
          )}
        >
          {exp.title}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-1 flex items-center gap-1.5">
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
              categoryColors[exp.category],
            )}
          >
            {exp.category === "naturaleza" && <Waves className="h-3 w-3" />}
            {exp.category === "aventura" && <Mountain className="h-3 w-3" />}
            {exp.category === "turismo-rural" && <Bike className="h-3 w-3" />}
            {exp.category === "deportes" && <Bike className="h-3 w-3" />}
            {exp.category === "cultura" && <Landmark className="h-3 w-3" />}
            {exp.category === "full-day" && <Sun className="h-3 w-3" />}
            {categories.find((c) => c.value === exp.category)?.label}
          </span>
        </div>
        <h3 className="font-heading text-base font-bold text-foreground">
          {exp.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {exp.description}
        </p>
        <div className="mt-auto flex flex-wrap items-center gap-2 pt-3">
          <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
            <Clock className="h-3 w-3" />
            {durationLabels[exp.duration]}
          </span>
          {exp.requiresReservation && (
            <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700">
              <TicketCheck className="h-3 w-3" />
              Reserva
            </span>
          )}
          {exp.kidFriendly && (
            <span className="inline-flex items-center gap-1 rounded-md bg-sky-50 px-2 py-1 text-xs font-medium text-sky-700">
              <Users className="h-3 w-3" />
              Niños
            </span>
          )}
          {exp.hasGuide && (
            <span className="inline-flex items-center gap-1 rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
              <MapPin className="h-3 w-3" />
              Guía
            </span>
          )}
        </div>
        <a
          href={`/que-hacer/${exp.id}`}
          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-brand-green px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-green-dark"
        >
          Ver experiencia
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </article>
  )
}

function FilterToggle({
  active,
  onChange,
  children,
}: {
  active: boolean
  onChange: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onChange}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-all",
        active
          ? "border-brand-green bg-brand-green/10 text-brand-green shadow-sm"
          : "border-border bg-card text-muted-foreground hover:border-brand-green/50 hover:text-brand-green",
      )}
    >
      {children}
    </button>
  )
}
