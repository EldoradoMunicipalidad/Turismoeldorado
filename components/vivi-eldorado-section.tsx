import { Waves, Footprints, MapPin, Bike, Home } from "lucide-react"
import { SectionHeading } from "@/components/section-heading"

const activities = [
  { img: "/images/act-kayak.png", title: "Kayak y canotaje", icon: Waves },
  { img: "/images/act-trekking.png", title: "Senderismo y trekking", icon: Footprints },
  { img: "/images/act-aves.png", title: "Avistaje de aves", icon: MapPin },
  { img: "/images/act-ciclismo.png", title: "Ciclismo", icon: Bike },
  { img: "/images/act-rural.png", title: "Turismo rural", icon: Home },
]

export function ViviEldoradoSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <SectionHeading
        title="Viví Eldorado"
        subtitle="Experiencias para todos los gustos"
        linkLabel="Ver todas las actividades"
      />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {activities.map(({ img, title, icon: Icon }) => (
          <article
            key={title}
            className="group relative h-44 overflow-hidden rounded-2xl shadow-md"
          >
            <img
              src={img || "/placeholder.svg"}
              alt={title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-green-dark/90 via-brand-green-dark/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 p-4 text-white">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <Icon className="h-4 w-4" />
              </span>
              <h3 className="font-heading text-sm font-semibold leading-tight">
                {title}
              </h3>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
