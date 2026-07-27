import { ArrowRight } from "lucide-react"
import { SectionHeading } from "@/components/section-heading"
import type { Experience } from "@/components/que-hacer-data"

const STATIC_PLACES = [
  { id: "saltos-mocona", fallback: { title: "Saltos del Moconá", image: "/images/saltos-mocona.png", description: "Un espectáculo natural único en el mundo." } },
  { id: "reserva-delicia", fallback: { title: "Reserva Natural Delicia", image: "/images/reserva-bird.png", description: "Conservación y biodiversidad en un entorno de selva paranaense." } },
  { id: "museo-eldorado", fallback: { title: "Museo Cooperativo Eldorado", image: "/images/museo.png", description: "Conocé la historia del trabajo y el esfuerzo de nuestra comunidad." } },
  { id: "costanera-atardecer", fallback: { title: "Costanera Eldorado", image: "/images/costanera.png", description: "Un paseo ideal para disfrutar del río, la gastronomía y los atardeceres." } },
  { id: "cuevas-santoangel", fallback: { title: "Cuevas de Santo Ángel", image: "/images/cuevas.png", description: "Aventura y arqueología en un entorno natural fascinante." } },
]

export function ImperdiblesSection({ experiences = [] }: { experiences?: Experience[] } = {}) {
  // Mezcla: prioriza el item editado del store, si existe; si no, usa el estático.
  const byId = new Map(experiences.map((e) => [e.id, e]))
  const places = STATIC_PLACES.map((p) => {
    const e = byId.get(p.id)
    if (e) {
      return {
        id: e.id,
        img: e.image,
        title: e.title,
        desc: e.description,
        href: `/que-hacer/${e.id}`,
      }
    }
    return {
      id: p.id,
      img: p.fallback.image,
      title: p.fallback.title,
      desc: p.fallback.description,
      href: `/que-hacer/${p.id}`,
    }
  })
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <SectionHeading
        title="Imperdibles"
        subtitle="Lugares que tenés que conocer"
        linkLabel="Ver todos los atractivos"
        linkHref="/que-hacer"
      />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {places.map((p) => (
          <a
            key={p.id}
            href={p.href}
            className="group relative h-80 overflow-hidden rounded-2xl shadow-md transition-transform hover:-translate-y-1 hover:shadow-lg"
          >
            <img
              src={p.img || "/placeholder.svg"}
              alt={p.title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-green-dark/90 via-brand-green-dark/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4 text-white">
              <h3 className="font-heading text-base font-semibold leading-tight text-balance">
                {p.title}
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-white/85">
                {p.desc}
              </p>
              <span
                aria-label={`Ver más sobre ${p.title}`}
                className="mt-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand-green text-white transition-colors group-hover:bg-brand-yellow group-hover:text-brand-green-dark"
              >
                <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
