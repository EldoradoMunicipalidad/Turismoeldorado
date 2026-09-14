import { CalendarDays } from "lucide-react"
import type { EventItem } from "@/lib/db"
import type { HomeContentDocument } from "@/lib/home-content"

export function EventsBanner({
  config,
  events,
}: {
  config: HomeContentDocument["events"]
  events: EventItem[]
}) {
  if (!config.enabled) return null

  const today = new Date().toISOString().slice(0, 10)
  const upcoming = events
    .filter((event) => event.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, config.eventLimit)

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6">
      <div className="relative overflow-hidden rounded-2xl bg-brand-teal">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="flex items-center gap-5 p-8 lg:p-10">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white">
              <CalendarDays className="h-8 w-8" />
            </span>
            <div className="text-white">
              <h2 className="font-heading text-2xl font-bold">{config.title}</h2>
              {config.description && (
                <p className="mt-1 max-w-md text-sm leading-relaxed text-white/85">
                  {config.description}
                </p>
              )}
              {config.buttonLabel && config.buttonHref && (
                <a
                  href={config.buttonHref}
                  className="mt-5 inline-block rounded-full bg-brand-yellow px-6 py-3 text-sm font-semibold text-brand-green-dark shadow transition-transform hover:scale-[1.03]"
                >
                  {config.buttonLabel}
                </a>
              )}
            </div>
          </div>
          {config.image && (
            <div className="relative hidden min-h-[200px] lg:block">
              <img
                src={config.image}
                alt={config.imageAlt}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-brand-teal to-transparent" />
            </div>
          )}
        </div>
      </div>
      {upcoming.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-4 font-heading text-xl font-bold text-brand-green-dark sm:text-2xl">
            {config.eventListTitle}
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((event) => (
              <a
                key={event.id}
                href={`/eventos/${event.id}`}
                className="group overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                {event.image && (
                  <div className="h-40 overflow-hidden bg-muted">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand-green">
                    {event.date}{event.time ? ` · ${event.time}` : ""}
                  </p>
                  <h3 className="mt-1 font-heading text-base font-semibold text-foreground">
                    {event.title}
                  </h3>
                  {event.description && (
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {event.description}
                    </p>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
