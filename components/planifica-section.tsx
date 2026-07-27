import { MapPin, Map, Utensils, BookOpen, Info, ChevronRight, Download } from "lucide-react"
import { SectionHeading } from "@/components/section-heading"

const cards = [
  {
    icon: MapPin,
    title: "¿Cómo llegar?",
    desc: "Rutas, accesos y medios de transporte para llegar a Eldorado.",
    cta: "Ver más",
    href: "/informacion-util#transporte",
  },
  {
    icon: Map,
    title: "¿Dónde alojarse?",
    desc: "Opciones para todos los gustos y presupuestos.",
    cta: "Ver más",
    href: "/donde-alojarse",
  },
  {
    icon: Utensils,
    title: "¿Dónde comer?",
    desc: "Gastronomía local para disfrutar sabores únicos.",
    cta: "Ver más",
    href: "/donde-comer",
  },
  {
    icon: BookOpen,
    title: "Guía turística",
    desc: "Descargá nuestra guía con mapas, consejos y más información.",
    cta: "Descargar",
    href: "/guias-turisticas",
    download: true,
  },
  {
    icon: Info,
    title: "Información útil",
    desc: "Recomendaciones, teléfonos útiles, salud, seguridad y más.",
    cta: "Ver más",
    href: "/informacion-util",
  },
]

export function PlanificaSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <SectionHeading title="Planificá tu viaje" />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map(({ icon: Icon, title, desc, cta, href, download }) => (
          <a
            key={title}
            href={href}
            className="group flex flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-cream text-brand-green transition-colors group-hover:bg-brand-green group-hover:text-white">
              <Icon className="h-5 w-5" />
            </span>
            <h3 className="mt-4 font-heading text-base font-semibold text-foreground">
              {title}
            </h3>
            <p className="mt-2 flex-1 text-xs leading-relaxed text-muted-foreground">
              {desc}
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-green transition-colors group-hover:text-brand-green-dark">
              {cta}
              {download ? (
                <Download className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </span>
          </a>
        ))}
      </div>
    </section>
  )
}
