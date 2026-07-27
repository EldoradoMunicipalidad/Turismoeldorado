import { Compass, Play, Map, Navigation, MapPin, BookOpen } from "lucide-react"

const sideLinks = [
  { icon: Map, label: "Mapa", href: "/mapa" },
  { icon: Navigation, label: "¿Cómo llegar?", href: "/informacion-util#transporte" },
  { icon: MapPin, label: "Actividades", href: "/que-hacer" },
  { icon: BookOpen, label: "Guía turística", href: "/guias-turisticas" },
]

export function HeroSection() {
  return (
    <section className="relative">
      <div className="relative min-h-[600px] overflow-hidden lg:min-h-[640px]">
        <img
          src="/images/hero-waterfall.png"
          alt="Cascada en la selva misionera de Eldorado"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-green-dark/85 via-brand-green-dark/40 to-transparent" />

        <div className="relative mx-auto flex max-w-7xl flex-col px-4 pb-28 pt-16 sm:px-6 lg:pt-20">
          <div className="max-w-xl text-white">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-brand-yellow">
              Naturaleza. Aventura. Descanso.
            </p>
            <h1 className="font-heading text-5xl font-bold leading-[1.05] text-balance sm:text-6xl">
              Eldorado,
              <span className="mt-2 block font-light">siempre cerca tuyo</span>
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-white/90">
              Descubrí la magia de la selva misionera, sus paisajes únicos, su
              gente y experiencias que te van a sorprender.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="/que-hacer"
                className="inline-flex items-center gap-2 rounded-full bg-brand-yellow px-6 py-3.5 text-sm font-semibold text-brand-green-dark shadow-lg transition-transform hover:scale-[1.03]"
              >
                <Compass className="h-4 w-4" />
                Descubrí Eldorado
              </a>
              <a
                href="/guias-turisticas"
                className="inline-flex items-center gap-3 rounded-full bg-white/15 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/25"
              >
                Ver video
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-yellow text-brand-green-dark">
                  <Play className="h-3.5 w-3.5 fill-current" />
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Floating side menu */}
        <div className="absolute right-6 top-1/2 hidden -translate-y-1/2 lg:block">
          <div className="flex flex-col overflow-hidden rounded-2xl bg-brand-green/85 backdrop-blur-sm">
            {sideLinks.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                className="flex w-28 flex-col items-center gap-1.5 px-3 py-4 text-center text-white transition-colors hover:bg-brand-green-dark"
              >
                <Icon className="h-6 w-6" strokeWidth={1.5} />
                <span className="text-xs font-medium leading-tight">{label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
