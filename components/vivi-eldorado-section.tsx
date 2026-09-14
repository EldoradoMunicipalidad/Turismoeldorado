import { HomeIcon } from "@/components/home-icons"
import { SectionHeading } from "@/components/section-heading"
import type { Experience, SportActivity } from "@/lib/db"
import type { HomeContentDocument } from "@/lib/home-content"

export function ViviEldoradoSection({
  config,
  experiences,
  sportActivities,
}: {
  config: HomeContentDocument["vivi"]
  experiences: Experience[]
  sportActivities: SportActivity[]
}) {
  const items = config.items
    .map((item) => {
      const record =
        item.source === "experience"
          ? experiences.find((entry) => entry.id === item.sourceId)
          : sportActivities.find((entry) => entry.id === item.sourceId)
      const title = record?.title ?? item.title
      const image = record?.image ?? item.image
      const href =
        item.href ??
        (item.source === "experience"
          ? `/que-hacer/${item.sourceId}`
          : `/deportes-eventos/${item.sourceId}`)

      if (!title || !image || !href) return null
      return { title, image, href, icon: item.icon }
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)

  if (!config.enabled || items.length === 0) return null

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <SectionHeading
        title={config.title}
        subtitle={config.subtitle}
        linkLabel={config.linkLabel}
        linkHref={config.linkHref}
      />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {items.map((item, index) => (
          <a
            key={`${item.href}-${index}`}
            href={item.href}
            className="group relative h-44 overflow-hidden rounded-2xl shadow-md transition-transform hover:-translate-y-1 hover:shadow-lg"
          >
            <img
              src={item.image}
              alt={item.title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-green-dark/90 via-brand-green-dark/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 p-4 text-white">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <HomeIcon name={item.icon} className="h-4 w-4" />
              </span>
              <h3 className="font-heading text-sm font-semibold leading-tight">
                {item.title}
              </h3>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
