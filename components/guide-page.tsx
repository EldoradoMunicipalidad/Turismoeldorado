import {
  ArrowRight,
  BookOpen,
  Camera,
  Download,
  FileText,
  Mail,
  Map as MapIcon,
  Shield,
  type LucideIcon,
} from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import type { GuidePageContent } from "@/lib/home-content"

const guideIcons: Record<string, LucideIcon> = {
  map: MapIcon,
  camera: Camera,
  shield: Shield,
  file: FileText,
  book: BookOpen,
}

export function GuidePage({ content }: { content: GuidePageContent }) {
  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />

      <section className="relative overflow-hidden">
        <div className="relative min-h-[300px] sm:min-h-[360px]">
          <img
            src={content.hero.imageUrl}
            alt={content.hero.alt}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-green-dark/85 via-brand-green-dark/50 to-transparent" />
          <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-10 pt-20 sm:px-6">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-yellow text-brand-green-dark">
                <BookOpen className="h-5 w-5" />
              </span>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-yellow">
                {content.hero.eyebrow}
              </p>
            </div>
            <h1 className="mt-3 font-heading text-4xl font-bold text-white sm:text-5xl">
              {content.hero.title}
            </h1>
            <p className="mt-2 max-w-2xl text-base text-white/85">
              {content.hero.description}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={content.hero.downloadHref}
                className="inline-flex items-center gap-2 rounded-full bg-brand-yellow px-6 py-3 text-sm font-semibold text-brand-green-dark shadow transition-transform hover:scale-[1.03]"
              >
                <Download className="h-4 w-4" />
                {content.hero.downloadLabel}
              </a>
              <a
                href={content.hero.exploreHref}
                className="inline-flex items-center gap-2 rounded-full bg-white/15 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/25"
              >
                {content.hero.exploreLabel}
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pt-10 sm:px-6">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="flex items-start gap-3 text-sm text-muted-foreground">
            <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" />
            <span>
              {content.delivery.description}{" "}
              {content.delivery.instructionPrefix}{" "}
              <strong className="text-foreground">{content.delivery.downloadLabel}</strong>{" "}
              {content.delivery.instructionSuffix}{" "}
              <a
                href={content.delivery.emailHref}
                className="font-semibold text-brand-green underline-offset-2 hover:underline"
              >
                {content.delivery.emailLabel}
              </a>
              {content.delivery.closing}
            </span>
          </p>
        </div>
      </section>

      <section id="secciones" className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="mb-6 flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-green text-white">
            <BookOpen className="h-4 w-4" />
          </span>
          <h2 className="font-heading text-2xl font-bold text-brand-green-dark sm:text-3xl">
            {content.sectionsTitle}
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {content.sections.map((section, index) => {
            const Icon = guideIcons[section.icon] ?? BookOpen
            return (
              <article
                key={`${section.title}-${index}`}
                className="group flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-green/10 text-brand-green">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="font-heading text-base font-bold text-foreground">
                  {section.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {section.description}
                </p>
              </article>
            )
          })}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <article id="terminos" className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="font-heading text-lg font-bold text-brand-green-dark">
              {content.legal.termsTitle}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {content.legal.termsText}
            </p>
          </article>
          <article id="privacidad" className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="font-heading text-lg font-bold text-brand-green-dark">
              {content.legal.privacyTitle}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {content.legal.privacyText}
            </p>
          </article>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
