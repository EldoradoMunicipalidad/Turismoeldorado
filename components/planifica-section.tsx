import { ChevronRight, Download } from "lucide-react"
import { HomeIcon } from "@/components/home-icons"
import { SectionHeading } from "@/components/section-heading"
import type { HomeContentDocument } from "@/lib/home-content"

export function PlanificaSection({
  config,
}: {
  config: HomeContentDocument["planifica"]
}) {
  if (!config.enabled || config.items.length === 0) return null

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <SectionHeading title={config.title} />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {config.items.map((item, index) => (
          <a
            key={`${item.title}-${index}`}
            href={item.href}
            className="group flex flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-cream text-brand-green transition-colors group-hover:bg-brand-green group-hover:text-white">
              <HomeIcon name={item.icon} className="h-5 w-5" />
            </span>
            <h3 className="mt-4 font-heading text-base font-semibold text-foreground">
              {item.title}
            </h3>
            {item.description && (
              <p className="mt-2 flex-1 text-xs leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            )}
            {item.ctaLabel && (
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-green transition-colors group-hover:text-brand-green-dark">
                {item.ctaLabel}
                {item.download ? (
                  <Download className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </span>
            )}
          </a>
        ))}
      </div>
    </section>
  )
}
