import { Leaf, ChevronRight } from "lucide-react"

export function SectionHeading({
  title,
  subtitle,
  linkLabel,
  linkHref = "#",
}: {
  title: string
  subtitle?: string
  linkLabel?: string
  linkHref?: string
}) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <div>
        <h2 className="flex items-center gap-2 font-heading text-2xl font-bold text-brand-green-dark sm:text-3xl">
          {title}
          <Leaf className="h-5 w-5 text-brand-green" />
        </h2>
        {subtitle && (
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {linkLabel && (
        <a
          href={linkHref}
          className="hidden shrink-0 items-center gap-1 text-sm font-medium text-brand-green transition-colors hover:text-brand-green-dark sm:flex"
        >
          {linkLabel}
          <ChevronRight className="h-4 w-4" />
        </a>
      )}
    </div>
  )
}
