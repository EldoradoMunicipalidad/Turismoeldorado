"use client"

import { useState } from "react"
import { Sun, CloudSun, ChevronDown, Search, BookOpen, Menu, X } from "lucide-react"
import { Logo } from "@/components/logo"
import { cn } from "@/lib/utils"

const navItems = [
  "Qué hacer",
  "Dónde alojarse",
  "Dónde comer",
  "Deportes y eventos",
  "Información útil",
]

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="relative z-30">
      {/* Top utility bar */}
      <div className="bg-brand-green-dark text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-xs sm:px-6">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Sun className="h-3.5 w-3.5 text-brand-yellow" />
              23°C
            </span>
            <span className="hidden items-center gap-1.5 sm:flex">
              <CloudSun className="h-3.5 w-3.5 text-brand-yellow" />
              Soleado
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="hidden transition-colors hover:text-brand-yellow sm:inline">
              Mapa del sitio
            </a>
            <a href="#" className="hidden transition-colors hover:text-brand-yellow sm:inline">
              Preguntas frecuentes
            </a>
            <button className="flex items-center gap-1 font-medium transition-colors hover:text-brand-yellow">
              ES <ChevronDown className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Logo src="/images/logo-header.png" className="h-[52px]" />

          <nav className="hidden items-center gap-6 xl:flex">
            {navItems.map((item, i) => (
              <a
                key={item}
                href="#"
                className={cn(
                  "relative py-1.5 text-sm font-medium transition-colors hover:text-brand-green",
                  i === 0 ? "text-brand-green" : "text-foreground/80",
                )}
              >
                {item}
                {i === 0 && (
                  <span className="absolute -bottom-0.5 left-0 h-0.5 w-full rounded-full bg-brand-yellow" />
                )}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button className="hidden items-center gap-2 rounded-full bg-brand-yellow px-5 py-2.5 text-sm font-semibold text-brand-green-dark shadow-sm transition-transform hover:scale-[1.03] sm:flex">
              <BookOpen className="h-4 w-4" />
              Guía Turística
            </button>
            <button
              aria-label="Buscar"
              className="flex h-10 w-10 items-center justify-center rounded-full text-foreground/70 transition-colors hover:bg-muted hover:text-brand-green"
            >
              <Search className="h-5 w-5" />
            </button>
            <button
              aria-label="Abrir menú"
              onClick={() => setMobileOpen((v) => !v)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-foreground/70 transition-colors hover:bg-muted xl:hidden"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <nav className="border-t border-border bg-white px-4 py-3 xl:hidden">
            <ul className="flex flex-col gap-1">
              {navItems.map((item, i) => (
                <li key={item}>
                  <a
                    href="#"
                    className={cn(
                      "block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
                      i === 0 ? "text-brand-green" : "text-foreground/80",
                    )}
                  >
                    {item}
                  </a>
                </li>
              ))}
              <li className="pt-2">
                <button className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 py-2.5 text-sm font-semibold text-brand-green-dark">
                  <BookOpen className="h-4 w-4" />
                  Guía Turística
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  )
}
