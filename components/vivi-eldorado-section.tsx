import { Waves, Footprints, MapPin, Bike, Home } from "lucide-react"
import { SectionHeading } from "@/components/section-heading"
import type { Experience } from "@/components/que-hacer-data"
import type { SportActivity } from "@/components/deportes-eventos-data"

const STATIC_ACTIVITIES = [
  { id: "kayak-parana", fallback: { title: "Kayak y canotaje", icon: Waves, image: "/images/act-kayak.png" } },
  { id: "trekking-selva", fallback: { title: "Senderismo y trekking", icon: Footprints, image: "/images/act-trekking.png" } },
  { id: "avistaje-aves", fallback: { title: "Avistaje de aves", icon: MapPin, image: "/images/act-aves.png" } },
  { id: "ciclismo-rural", fallback: { title: "Ciclismo", icon: Bike, image: "/images/act-ciclismo.png" } },
  { id: "visita-chacra", fallback: { title: "Turismo rural", icon: Home, image: "/images/act-rural.png" } },
]

const SPORT_FALLBACKS: Record<string, { title: string; icon: typeof Waves; image: string }> = {
  "kayak-piray": { title: "Kayak", icon: Waves, image: "/images/act-kayak.png" },
  "club-eldorado-futbol": { title: "Fútbol", icon: Home, image: "/images/act-trekking.png" },
  "club-rugby-troncos": { title: "Rugby", icon: Home, image: "/images/act-ciclismo.png" },
  "atletismo-escuela": { title: "Atletismo", icon: Footprints, image: "/images/act-trekking.png" },
  "ciclismo-club-misiones": { title: "Ciclismo", icon: Bike, image: "/images/act-ciclismo.png" },
  "tenis-paddle-eldo": { title: "Tenis y paddle", icon: Home, image: "/images/act-ciclismo.png" },
}

export function ViviEldoradoSection({
  experiences = [],
  sportActivities = [],
}: {
  experiences?: Experience[]
  sportActivities?: SportActivity[]
} = {}) {
  const expById = new Map(experiences.map((e) => [e.id, e]))
  const sportById = new Map(sportActivities.map((a) => [a.id, a]))

  // Construye la lista: usa experiencia del store si existe, si no la estática;
  // si no, intenta con deporte; si no, fallback.
  const items = STATIC_ACTIVITIES.map((slot) => {
    const e = expById.get(slot.id)
    if (e) {
      return {
        id: e.id,
        title: e.title,
        icon: slot.fallback.icon,
        img: e.image,
        href: `/que-hacer/${e.id}`,
      }
    }
    const sport = sportById.get(slot.id) || sportActivities.find((a) =>
      Object.keys(SPORT_FALLBACKS).includes(a.id) ? SPORT_FALLBACKS[a.id].icon === slot.fallback.icon : false,
    )
    if (sport) {
      return {
        id: sport.id,
        title: sport.title,
        icon: slot.fallback.icon,
        img: sport.image,
        href: `/deportes-eventos/${sport.id}`,
      }
    }
    return {
      id: slot.id,
      title: slot.fallback.title,
      icon: slot.fallback.icon,
      img: slot.fallback.image,
      href: `/que-hacer/${slot.id}`,
    }
  })

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <SectionHeading
        title="Viví Eldorado"
        subtitle="Experiencias para todos los gustos"
        linkLabel="Ver todas las actividades"
        linkHref="/que-hacer"
      />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {items.map((a) => (
          <a
            key={a.id}
            href={a.href}
            className="group relative h-44 overflow-hidden rounded-2xl shadow-md transition-transform hover:-translate-y-1 hover:shadow-lg"
          >
            <img
              src={a.img || "/placeholder.svg"}
              alt={a.title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-green-dark/90 via-brand-green-dark/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 p-4 text-white">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <a.icon className="h-4 w-4" />
              </span>
              <h3 className="font-heading text-sm font-semibold leading-tight">
                {a.title}
              </h3>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
