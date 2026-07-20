import { ArrowRight } from "lucide-react"
import { SectionHeading } from "@/components/section-heading"

const places = [
  {
    img: "/images/saltos-mocona.png",
    title: "Saltos del Moconá",
    desc: "Un espectáculo natural único en el mundo.",
  },
  {
    img: "/images/reserva-bird.png",
    title: "Reserva Natural Delicia",
    desc: "Conservación y biodiversidad en un entorno de selva paranaense.",
  },
  {
    img: "/images/museo.png",
    title: "Museo Cooperativo Eldorado",
    desc: "Conocé la historia del trabajo y el esfuerzo de nuestra comunidad.",
  },
  {
    img: "/images/costanera.png",
    title: "Costanera Eldorado",
    desc: "Un paseo ideal para disfrutar del río, la gastronomía y los atardeceres.",
  },
  {
    img: "/images/cuevas.png",
    title: "Cuevas de Santo Ángel",
    desc: "Aventura y arqueología en un entorno natural fascinante.",
  },
]

export function ImperdiblesSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <SectionHeading
        title="Imperdibles"
        subtitle="Lugares que tenés que conocer"
        linkLabel="Ver todos los atractivos"
      />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {places.map((p) => (
          <article
            key={p.title}
            className="group relative h-80 overflow-hidden rounded-2xl shadow-md"
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
              <button
                aria-label={`Ver más sobre ${p.title}`}
                className="mt-3 flex h-9 w-9 items-center justify-center rounded-full bg-brand-green text-white transition-colors hover:bg-brand-yellow hover:text-brand-green-dark"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
