import { Phone, Mail, MapPin, ArrowRight, Heart } from "lucide-react"
import Link from "next/link"
import type { HomeContentDocument } from "@/lib/home-content"

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z" />
    </svg>
  )
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M21.6 7.2a2.7 2.7 0 0 0-1.9-1.9C18 4.8 12 4.8 12 4.8s-6 0-7.7.5A2.7 2.7 0 0 0 2.4 7.2 28 28 0 0 0 2 12a28 28 0 0 0 .4 4.8 2.7 2.7 0 0 0 1.9 1.9c1.7.5 7.7.5 7.7.5s6 0 7.7-.5a2.7 2.7 0 0 0 1.9-1.9A28 28 0 0 0 22 12a28 28 0 0 0-.4-4.8ZM10 15V9l5.2 3L10 15Z" />
    </svg>
  )
}

const socialIcons = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  youtube: YoutubeIcon,
} as const

export function HomeSiteFooter({
  config,
}: {
  config: HomeContentDocument["footer"]
}) {
  const socials = config.socials.flatMap((social) => {
    const Icon = social.icon && social.icon in socialIcons
      ? socialIcons[social.icon as keyof typeof socialIcons]
      : null
    return Icon ? [{ ...social, Icon }] : []
  })

  return (
    <footer className="relative">
      <div className="h-12 bg-background">
        <svg viewBox="0 0 1440 48" preserveAspectRatio="none" className="h-12 w-full" aria-hidden="true">
          <path d="M0 48 C 360 0, 1080 0, 1440 48 L 1440 48 L 0 48 Z" fill="oklch(0.4 0.09 155)" />
        </svg>
      </div>

      <div className="bg-brand-green-dark text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
            <div>
              {config.logoUrl && (
                <Link href="/" aria-label={config.logoAlt}>
                  <img src={config.logoUrl} alt={config.logoAlt} className="h-10 w-auto" />
                </Link>
              )}
              {config.tagline && <p className="mt-4 text-sm text-white/70">{config.tagline}</p>}
            </div>

            <div>
              {config.linksTitle && <h3 className="font-heading text-base font-semibold">{config.linksTitle}</h3>}
              <ul className="mt-4 space-y-2.5">
                {config.links.map((link, index) => (
                  <li key={`${link.href}-${index}`}>
                    <a href={link.href} className="text-sm text-white/75 transition-colors hover:text-brand-yellow">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              {config.contactTitle && <h3 className="font-heading text-base font-semibold">{config.contactTitle}</h3>}
              <ul className="mt-4 space-y-3 text-sm text-white/75">
                {config.phoneLabel && config.phoneHref && (
                  <li><a href={config.phoneHref} className="flex items-center gap-2.5 transition-colors hover:text-brand-yellow"><Phone className="h-4 w-4 shrink-0 text-brand-yellow" />{config.phoneLabel}</a></li>
                )}
                {config.emailLabel && config.emailHref && (
                  <li><a href={config.emailHref} className="flex items-center gap-2.5 transition-colors hover:text-brand-yellow"><Mail className="h-4 w-4 shrink-0 text-brand-yellow" />{config.emailLabel}</a></li>
                )}
                {config.locationLabel && config.locationHref && (
                  <li><a href={config.locationHref} className="flex items-center gap-2.5 transition-colors hover:text-brand-yellow"><MapPin className="h-4 w-4 shrink-0 text-brand-yellow" />{config.locationLabel}</a></li>
                )}
              </ul>
              {socials.length > 0 && (
                <div className="mt-4 flex gap-2.5">
                  {socials.map(({ label, href, Icon }, index) => (
                    <a key={`${href}-${index}`} href={href} target="_blank" rel="noreferrer noopener" aria-label={label} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-brand-yellow hover:text-brand-green-dark">
                      <Icon className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              )}
            </div>

            <div>
              {config.newsletterTitle && <h3 className="font-heading text-base font-semibold">{config.newsletterTitle}</h3>}
              {config.newsletterDescription && <p className="mt-4 text-sm text-white/75">{config.newsletterDescription}</p>}
              {config.newsletterAction && (
                <form action={config.newsletterAction} method="post" encType="text/plain" className="mt-4 flex items-center gap-2 rounded-full bg-white p-1 pl-4">
                  <label htmlFor="newsletter-email" className="sr-only">{config.newsletterEmailPlaceholder}</label>
                  <input id="newsletter-email" type="email" name="email" required placeholder={config.newsletterEmailPlaceholder} className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground" />
                  <button type="submit" aria-label={config.newsletterSubmitLabel} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-yellow text-brand-green-dark transition-transform hover:scale-105">
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-white/60 sm:flex-row sm:px-6">
            {config.copyright && <p>{config.copyright}</p>}
            {(config.creditPrefix || config.creditSuffix) && (
              <p className="flex items-center gap-1.5">
                {config.creditPrefix}
                <Heart className="h-3.5 w-3.5 fill-brand-yellow text-brand-yellow" />
                {config.creditSuffix}
              </p>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}
