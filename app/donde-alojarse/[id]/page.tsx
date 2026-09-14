import { notFound } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Phone,
  MessageCircle,
  MapPin,
  Camera,
  Globe,
  Coffee,
  Waves,
  Car,
  Heart,
  Users,
  ShieldCheck,
  Building2,
  Home,
  Warehouse,
  Hotel,
  Tent,
  TreePine,
} from "lucide-react"
import type { Metadata } from "next"
import type { AccommodationType } from "@/components/donde-alojarse-data"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { typeOptions } from "@/components/donde-alojarse-data"
import { readCollection } from "@/lib/db"

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

const typeLabels: Record<AccommodationType, string> = Object.fromEntries(
  typeOptions.map((o) => [o.value, o.label]),
) as Record<AccommodationType, string>

export const dynamic = "force-dynamic"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const accommodations = await readCollection("accommodations")
  const acc = accommodations.find((a) => a.id === id)
  if (!acc) return { title: "Alojamiento no encontrado" }
  return {
    title: acc.name,
    description: acc.description,
    openGraph: {
      title: acc.name,
      description: acc.description,
      images: acc.image ? [acc.image] : undefined,
    },
  }
}

export default async function AlojamientoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const accommodations = await readCollection("accommodations")
  const acc = accommodations.find((a) => a.id === id)
  if (!acc) notFound()

  const primaryType = acc.modalities[0]
  const Icon = typeIcons[primaryType]

  const related = accommodations
    .filter(
      (a) =>
        a.id !== acc.id &&
        a.modalities.some((m) => acc.modalities.includes(m)),
    )
    .slice(0, 3)

  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero banner */}
      <section className="relative">
        <div className="relative h-[280px] sm:h-[360px] lg:h-[420px]">
          <img
            src={acc.image}
            alt={acc.name}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-green-dark/90 via-brand-green-dark/40 to-transparent" />
        </div>
      </section>

      <section className="mx-auto -mt-20 max-w-5xl px-4 pb-12 sm:px-6 lg:-mt-32">
        <div className="rounded-2xl bg-card p-6 shadow-xl sm:p-8">
          <Link
            href="/donde-alojarse"
            className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-brand-green"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Volver a Dónde alojarse
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            {acc.modalities.map((mod) => {
              const TypeIcon = typeIcons[mod]
              return (
                <span
                  key={mod}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                    typeColors[mod]
                  }`}
                >
                  <TypeIcon className="h-3.5 w-3.5" />
                  {typeLabels[mod]}
                </span>
              )
            })}
            {acc.capacity.sportsTeams && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-yellow px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-green-dark">
                <ShieldCheck className="h-3 w-3" />
                Acepta equipos
              </span>
            )}
          </div>

          <h1 className="mt-4 flex items-center gap-3 font-heading text-3xl font-bold text-brand-green-dark sm:text-4xl">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-green text-white">
              <Icon className="h-6 w-6" />
            </span>
            {acc.name}
          </h1>

          <p className="mt-2 flex items-start gap-1.5 text-sm text-muted-foreground">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" />
            {acc.location}
          </p>

          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            {acc.description}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {acc.phone && (
              <a
                href={`tel:${acc.phone.replace(/[^0-9]/g, "")}`}
                className="inline-flex items-center gap-2 rounded-full bg-brand-yellow px-5 py-2.5 text-sm font-semibold text-brand-green-dark shadow transition-transform hover:scale-[1.03]"
              >
                <Phone className="h-4 w-4" />
                Llamar
              </a>
            )}
            {acc.whatsapp && (
              <a
                href={`https://wa.me/54${acc.whatsapp.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 rounded-full bg-brand-green px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-green-dark"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
            )}
            {acc.website && (
              <a
                href={`https://${acc.website}`}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 rounded-full border-2 border-brand-green px-5 py-2.5 text-sm font-semibold text-brand-green transition-colors hover:bg-brand-green hover:text-white"
              >
                <Globe className="h-4 w-4" />
                Web
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Servicios + capacidad */}
      <section className="mx-auto max-w-5xl px-4 pb-12 sm:px-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <article className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8 lg:col-span-2">
            <h2 className="font-heading text-xl font-bold text-brand-green-dark">
              Servicios
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Comodidades destacadas y servicios completos.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {acc.services.breakfast && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700">
                  <Coffee className="h-3.5 w-3.5" />
                  Desayuno
                </span>
              )}
              {acc.services.pool && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700">
                  <Waves className="h-3.5 w-3.5" />
                  Piscina
                </span>
              )}
              {acc.services.parking && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">
                  <Car className="h-3.5 w-3.5" />
                  Estacionamiento
                </span>
              )}
            </div>

            {acc.capacity.couples && (
              <span className="mt-3 mr-2 inline-flex items-center gap-1.5 rounded-full bg-pink-50 px-3 py-1.5 text-xs font-semibold text-pink-700">
                <Heart className="h-3.5 w-3.5" />
                Parejas
              </span>
            )}
            {acc.capacity.families && (
              <span className="mt-3 mr-2 inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-700">
                <Users className="h-3.5 w-3.5" />
                Familias
              </span>
            )}

            <h3 className="mt-7 font-heading text-sm font-semibold text-foreground">
              Todos los servicios
            </h3>
            <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {acc.fullServices.map((s) => (
                <li
                  key={s}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-green" />
                  {s}
                </li>
              ))}
            </ul>
          </article>

          {/* Contacto sidebar */}
          <aside className="rounded-2xl bg-brand-green-dark p-6 text-white shadow-sm sm:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-yellow">
              Contacto directo
            </p>

            <div className="mt-4 space-y-3 text-sm">
              {acc.phone && (
                <a
                  href={`tel:${acc.phone.replace(/[^0-9]/g, "")}`}
                  className="flex items-center gap-2.5 transition-colors hover:text-brand-yellow"
                >
                  <Phone className="h-4 w-4 text-brand-yellow" />
                  {acc.phone}
                </a>
              )}
              {acc.whatsapp && (
                <a
                  href={`https://wa.me/54${acc.whatsapp.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex items-center gap-2.5 transition-colors hover:text-brand-yellow"
                >
                  <MessageCircle className="h-4 w-4 text-brand-yellow" />
                  {acc.whatsapp}
                </a>
              )}
              {acc.instagram && (
                <a
                  href={`https://instagram.com/${acc.instagram}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex items-center gap-2.5 transition-colors hover:text-brand-yellow"
                >
                  <Camera className="h-4 w-4 text-brand-yellow" />
                  @{acc.instagram}
                </a>
              )}
              {acc.website && (
                <a
                  href={`https://${acc.website}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex items-center gap-2.5 transition-colors hover:text-brand-yellow"
                >
                  <Globe className="h-4 w-4 text-brand-yellow" />
                  {acc.website}
                </a>
              )}
            </div>

            <a
              href="/informacion-util"
              className="mt-6 block w-full rounded-full bg-brand-yellow py-3 text-center text-sm font-semibold text-brand-green-dark transition-transform hover:scale-[1.02]"
            >
              Ver más información
            </a>
          </aside>
        </div>
      </section>

      {related.length > 0 && (
        <section className="mx-auto max-w-5xl px-4 pb-12 sm:px-6">
          <h2 className="mb-6 font-heading text-2xl font-bold text-brand-green-dark">
            Alojamientos similares
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {related.map((r) => (
              <a
                key={r.id}
                href={`/donde-alojarse/${r.id}`}
                className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={r.image}
                    alt={r.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-heading text-sm font-bold text-foreground">
                    {r.name}
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
