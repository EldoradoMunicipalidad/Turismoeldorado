import { ArrowRight } from "lucide-react"
import { SectionHeading } from "@/components/section-heading"
import type { Experience, SportActivity } from "@/lib/db"
import type { HomeContentDocument } from "@/lib/home-content"

export function ImperdiblesSection({
  config,
  experiences,
  sportActivities,
}: {
  config: HomeContentDocument["imperdibles"]
  experiences: Experience[]
  sportActivities: SportActivity[]
}) {
  const places = config.items
    .map((item) => {
      const record =
        item.source === "experience"
          ? experiences.find((entry) => entry.id === item.sourceId)
          : sportActivities.find((entry) => entry.id === item.sourceId)
      const title = record?.title ?? item.title
      const description = record?.description ?? item.description
      const image = record?.image ?? item.image
      const href =
        item.href ??
        (item.source === "experience"
          ? `/que-hacer/${item.sourceId}`
          : `/deportes-eventos/${item.sourceId}`)

      if (!title || !image || !href) return null
      return { title, description, image, href }
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)

  if (!config.enabled || places.length === 0) return null

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <SectionHeading
        title={config.title}
        subtitle={config.subtitle}
        linkLabel={config.linkLabel}
        linkHref={config.linkHref}
      />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {places.map((place, index) => (
          <a
            key={`${place.href}-${index}`}
            href={place.href}
            className="group relative h-80 overflow-hidden rounded-2xl shadow-md transition-transform hover:-translate-y-1 hover:shadow-lg"
          >
            <img
              src={place.image}
              alt={place.title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-green-dark/90 via-brand-green-dark/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4 text-white">
              <h3 className="font-heading text-base font-semibold leading-tight text-balance">
                {place.title}
              </h3>
              {place.description && (
                <p className="mt-1.5 text-xs leading-relaxed text-white/85">
                  {place.description}
                </p>
              )}
              <span
                aria-label={place.title}
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
