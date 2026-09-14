import { Compass, Play } from "lucide-react"
import { HomeIcon } from "@/components/home-icons"
import type { HomeContentDocument, HomeLink } from "@/lib/home-content"

export function HeroSection({
  config,
  eyebrow,
  quickLinks = [],
}: {
  config?: HomeContentDocument["hero"] | null
  eyebrow?: string
  quickLinks?: HomeLink[]
}) {
  const image = config?.imageUrl?.trim()
  const alt = config?.alt?.trim() ?? ""
  const title = config?.title?.trim()
  const subtitle = config?.subtitle?.trim()
  const description = config?.description?.trim()
  const primaryLabel = config?.ctaPrimary?.trim()
  const primaryHref = config?.ctaPrimaryHref?.trim()
  const secondaryLabel = config?.ctaSecondary?.trim()
  const secondaryHref = config?.ctaSecondaryHref?.trim()

  if (!image && !title && !subtitle && !description && !primaryLabel && !secondaryLabel) {
    return null
  }

  return (
    <section className="relative">
      <div className="relative min-h-[600px] overflow-hidden lg:min-h-[640px]">
        {image && (
          <img
            src={image}
            alt={alt}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-green-dark/85 via-brand-green-dark/40 to-transparent" />

        <div className="relative mx-auto flex max-w-7xl flex-col px-4 pb-28 pt-16 sm:px-6 lg:pt-20">
          <div className="max-w-xl text-white">
            {eyebrow && (
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-brand-yellow">
                {eyebrow}
              </p>
            )}
            {(title || subtitle) && (
              <h1 className="font-heading text-5xl font-bold leading-[1.05] text-balance sm:text-6xl">
                {title}
                {subtitle && <span className="mt-2 block font-light">{subtitle}</span>}
              </h1>
            )}
            {description && (
              <p className="mt-6 max-w-md text-base leading-relaxed text-white/90">
                {description}
              </p>
            )}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              {primaryLabel && primaryHref && (
                <a
                  href={primaryHref}
                  className="inline-flex items-center gap-2 rounded-full bg-brand-yellow px-6 py-3.5 text-sm font-semibold text-brand-green-dark shadow-lg transition-transform hover:scale-[1.03]"
                >
                  <Compass className="h-4 w-4" />
                  {primaryLabel}
                </a>
              )}
              {secondaryLabel && secondaryHref && (
                <a
                  href={secondaryHref}
                  className="inline-flex items-center gap-3 rounded-full bg-white/15 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/25"
                >
                  {secondaryLabel}
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-yellow text-brand-green-dark">
                    <Play className="h-3.5 w-3.5 fill-current" />
                  </span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Floating side menu */}
        <div className="absolute right-6 top-1/2 hidden -translate-y-1/2 lg:block">
          <div className="flex flex-col overflow-hidden rounded-2xl bg-brand-green/85 backdrop-blur-sm">
            {quickLinks.map(({ icon, label, href }) => (
              <a
                key={label}
                href={href}
                className="flex w-28 flex-col items-center gap-1.5 px-3 py-4 text-center text-white transition-colors hover:bg-brand-green-dark"
              >
                <HomeIcon name={icon} className="h-6 w-6" />
                <span className="text-xs font-medium leading-tight">{label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
