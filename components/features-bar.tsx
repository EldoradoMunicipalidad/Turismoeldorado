import { Leaf, Camera, Mountain, Trophy, Users } from "lucide-react"

const features = [
  {
    icon: Leaf,
    color: "bg-brand-green",
    title: "Naturaleza",
    desc: "Selva, ríos y saltos que enamoran.",
  },
  {
    icon: Camera,
    color: "bg-brand-teal",
    title: "Aventura",
    desc: "Actividades para vivir emociones únicas.",
  },
  {
    icon: Mountain,
    color: "bg-brand-yellow",
    title: "Turismo rural",
    desc: "Vivencias auténticas en el campo misionero.",
  },
  {
    icon: Trophy,
    color: "bg-brand-green",
    title: "Deportes",
    desc: "Todo el deporte y la adrenalina en un solo lugar.",
  },
  {
    icon: Users,
    color: "bg-brand-teal",
    title: "Cultura",
    desc: "Tradición, historia y la calidez de nuestra gente.",
  },
]

export function FeaturesBar() {
  return (
    <div className="relative z-20 mx-auto -mt-20 max-w-7xl px-4 sm:px-6">
      <div className="rounded-2xl bg-card p-6 shadow-xl sm:p-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {features.map(({ icon: Icon, color, title, desc }) => (
            <div key={title} className="flex items-start gap-3">
              <span
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white ${color}`}
              >
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-heading text-sm font-semibold text-foreground">
                  {title}
                </h3>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
