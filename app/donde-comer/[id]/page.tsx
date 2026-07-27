import { notFound } from "next/navigation"
import {
  ArrowLeft,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Camera,
  DollarSign,
  Utensils,
  Coffee,
  Pizza,
  Fish,
  Beef,
  Leaf,
  Cake,
  Car,
  Wifi,
  Snowflake,
  Baby,
  Truck,
} from "lucide-react"
import type { Metadata } from "next"
import type { FoodType } from "@/components/donde-comer-data"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { foodTypeOptions } from "@/components/donde-comer-data"
import { readCollection } from "@/lib/db"

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

const foodTypeLabels: Record<FoodType, string> = Object.fromEntries(
  foodTypeOptions.map((o) => [o.value, o.label]),
) as Record<FoodType, string>

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

export const dynamic = "force-dynamic"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const restaurants = await readCollection("restaurants")
  const rest = restaurants.find((r) => r.id === id)
  if (!rest) return { title: "Restaurante no encontrado" }
  return {
    title: rest.name,
    description: rest.description,
    openGraph: {
      title: rest.name,
      description: rest.description,
      images: rest.image ? [rest.image] : undefined,
    },
  }
}

export default async function ComidaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const restaurants = await readCollection("restaurants")
  const rest = restaurants.find((r) => r.id === id)
  if (!rest) notFound()

  const related = restaurants
    .filter(
      (r) =>
        r.id !== rest.id && r.foodTypes.some((ft) => rest.foodTypes.includes(ft)),
    )
    .slice(0, 3)

  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />

      <section className="relative">
        <div className="relative h-[280px] sm:h-[360px] lg:h-[420px]">
          <img
            src={rest.image}
            alt={rest.name}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-green-dark/90 via-brand-green-dark/40 to-transparent" />
        </div>
      </section>

      <section className="mx-auto -mt-20 max-w-5xl px-4 pb-12 sm:px-6 lg:-mt-32">
        <div className="rounded-2xl bg-card p-6 shadow-xl sm:p-8">
          <a
            href="/donde-comer"
            className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-brand-green"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Volver a Dónde comer
          </a>

          <div className="flex flex-wrap items-center gap-2">
            {rest.foodTypes.map((ft) => {
              const Icon = foodTypeIcons[ft]
              return (
                <span
                  key={ft}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                    foodTypeColors[ft]
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {foodTypeLabels[ft]}
                </span>
              )
            })}
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                priceRangeColor[rest.priceRange]
              }`}
            >
              <DollarSign className="h-3.5 w-3.5" />
              {priceRangeLabels[rest.priceRange]}
            </span>
          </div>

          <h1 className="mt-4 font-heading text-3xl font-bold text-brand-green-dark sm:text-4xl">
            {rest.name}
          </h1>

          {rest.signature && (
            <p className="mt-2 inline-flex items-start gap-1.5 rounded-xl bg-brand-green/5 px-3 py-2 text-sm font-medium text-brand-green">
              <Utensils className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              Recomendado: {rest.signature}
            </p>
          )}

          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            {rest.description}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {rest.phone && (
              <a
                href={`tel:${rest.phone.replace(/[^0-9]/g, "")}`}
                className="inline-flex items-center gap-2 rounded-full bg-brand-yellow px-5 py-2.5 text-sm font-semibold text-brand-green-dark shadow transition-transform hover:scale-[1.03]"
              >
                <Phone className="h-4 w-4" />
                Llamar
              </a>
            )}
            {rest.whatsapp && (
              <a
                href={`https://wa.me/54${rest.whatsapp.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 rounded-full bg-brand-green px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-green-dark"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-12 sm:px-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <article className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8 lg:col-span-2">
            <h2 className="font-heading text-xl font-bold text-brand-green-dark">
              Información práctica
            </h2>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex items-start gap-3 rounded-xl border border-border bg-background p-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-green/10 text-brand-green">
                  <MapPin className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Ubicación
                  </p>
                  <p className="mt-0.5 text-sm font-medium text-foreground">
                    {rest.location}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl border border-border bg-background p-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-green/10 text-brand-green">
                  <Clock className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Horario
                  </p>
                  <p className="mt-0.5 text-sm font-medium text-foreground">
                    {rest.schedule}
                  </p>
                </div>
              </div>
            </div>

            <h3 className="mt-7 font-heading text-sm font-semibold text-foreground">
              Servicios disponibles
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {rest.services.delivery && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700">
                  <Truck className="h-3.5 w-3.5" />
                  Delivery
                </span>
              )}
              {rest.services.parking && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">
                  <Car className="h-3.5 w-3.5" />
                  Estacionamiento
                </span>
              )}
              {rest.services.airCon && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-50 px-3 py-1.5 text-xs font-semibold text-cyan-700">
                  <Snowflake className="h-3.5 w-3.5" />
                  Aire acondicionado
                </span>
              )}
              {rest.services.wifi && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                  <Wifi className="h-3.5 w-3.5" />
                  WiFi
                </span>
              )}
              {rest.services.kidFriendly && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-pink-50 px-3 py-1.5 text-xs font-semibold text-pink-700">
                  <Baby className="h-3.5 w-3.5" />
                  Apto niños
                </span>
              )}
            </div>
          </article>

          <aside className="rounded-2xl bg-brand-green-dark p-6 text-white shadow-sm sm:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-yellow">
              Reservas y contacto
            </p>

            <div className="mt-4 space-y-3 text-sm">
              {rest.phone && (
                <a
                  href={`tel:${rest.phone.replace(/[^0-9]/g, "")}`}
                  className="flex items-center gap-2.5 transition-colors hover:text-brand-yellow"
                >
                  <Phone className="h-4 w-4 text-brand-yellow" />
                  {rest.phone}
                </a>
              )}
              {rest.whatsapp && (
                <a
                  href={`https://wa.me/54${rest.whatsapp.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex items-center gap-2.5 transition-colors hover:text-brand-yellow"
                >
                  <MessageCircle className="h-4 w-4 text-brand-yellow" />
                  {rest.whatsapp}
                </a>
              )}
              {rest.instagram && (
                <a
                  href={`https://instagram.com/${rest.instagram}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex items-center gap-2.5 transition-colors hover:text-brand-yellow"
                >
                  <Camera className="h-4 w-4 text-brand-yellow" />
                  @{rest.instagram}
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
            Otros lugares que te pueden gustar
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {related.map((r) => (
              <a
                key={r.id}
                href={`/donde-comer/${r.id}`}
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
