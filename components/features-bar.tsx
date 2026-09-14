import { HomeIcon } from "@/components/home-icons"
import type { HomeContentDocument } from "@/lib/home-content"

const colorStyles: Record<string, string> = {
  "bg-brand-green": "bg-brand-green",
  "bg-brand-teal": "bg-brand-teal",
  "bg-brand-yellow": "bg-brand-yellow",
}

export function FeaturesBar({
  config,
}: {
  config: HomeContentDocument["features"]
}) {
  if (!config.enabled || config.items.length === 0) return null

  return (
    <div className="relative z-20 mx-auto -mt-20 max-w-7xl px-4 sm:px-6">
      <div className="rounded-2xl bg-card p-6 shadow-xl sm:p-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {config.items.map((item, index) => (
            <a
              key={`${item.title}-${index}`}
              href={item.href}
              className="group flex items-start gap-3 rounded-xl p-2 -m-2 transition-colors hover:bg-muted/50"
            >
              <span
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white transition-transform group-hover:scale-110 ${colorStyles[item.color] ?? ""}`}
              >
                <HomeIcon name={item.icon} className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-heading text-sm font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
