import Link from "next/link"
import {
  LayoutDashboard,
  Compass,
  CalendarDays,
  Hotel,
  Utensils,
  Trophy,
  Map as MapIcon,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react"
import { getCounts } from "@/lib/db"

// El admin lee de la DB (counts en el sidebar), así que todas las sub-páginas
// deben renderizarse on-demand, no en build-time.
export const dynamic = "force-dynamic"

const NAV = [
  { href: "/admin", label: "Resumen", Icon: LayoutDashboard, exact: true },
  {
    href: "/admin/experiences",
    label: "Qué hacer",
    Icon: Compass,
    collection: "experiences" as const,
  },
  {
    href: "/admin/events",
    label: "Eventos",
    Icon: CalendarDays,
    collection: "events" as const,
  },
  {
    href: "/admin/accommodations",
    label: "Alojamientos",
    Icon: Hotel,
    collection: "accommodations" as const,
  },
  {
    href: "/admin/restaurants",
    label: "Gastronomía",
    Icon: Utensils,
    collection: "restaurants" as const,
  },
  {
    href: "/admin/sportActivities",
    label: "Deportes",
    Icon: Trophy,
    collection: "sportActivities" as const,
  },
  { href: "/mapa", label: "Mapa público", Icon: MapIcon },
] as const

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const counts = await getCounts()

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card lg:flex">
        <div className="flex items-center gap-2 border-b border-border px-5 py-4">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-green text-white">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <div>
            <p className="font-heading text-sm font-bold text-brand-green-dark">
              Admin Eldorado
            </p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Panel interno
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-0.5 px-3 py-4">
          {NAV.map(({ href, label, Icon, collection }) => {
            const count = collection
              ? counts[collection as keyof typeof counts]
              : null
            return (
              <Link
                key={href}
                href={href}
                className="group flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-brand-green"
              >
                <span className="flex items-center gap-2.5">
                  <Icon className="h-4 w-4" />
                  {label}
                </span>
                {count !== null && (
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground group-hover:bg-brand-green/10 group-hover:text-brand-green">
                    {count}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-border p-3">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Ver sitio público
          </Link>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3 lg:hidden">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-green text-white">
              <ShieldCheck className="h-4 w-4" />
            </span>
            <span className="font-heading text-sm font-bold text-brand-green-dark">
              Admin
            </span>
          </Link>
          <Link
            href="/"
            className="text-xs font-medium text-muted-foreground hover:text-brand-green"
          >
            ← Sitio
          </Link>
        </header>
        <nav className="flex gap-1 overflow-x-auto border-b border-border bg-card px-3 py-2 lg:hidden">
          {NAV.map(({ href, label, Icon }) => (
            <Link
              key={href}
              href={href}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs font-semibold text-foreground/80"
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </Link>
          ))}
        </nav>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  )
}
