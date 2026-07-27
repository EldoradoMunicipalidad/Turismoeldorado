"use client"

import { useEffect, useRef, useState } from "react"
import {
  Sun,
  CloudSun,
  ChevronDown,
  Search,
  BookOpen,
  Menu,
  X,
  Check,
} from "lucide-react"
import { Logo } from "@/components/logo"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Qué hacer", href: "/que-hacer" },
  { label: "Dónde alojarse", href: "/donde-alojarse" },
  { label: "Dónde comer", href: "/donde-comer" },
  { label: "Deportes y eventos", href: "/deportes-eventos" },
  { label: "Información útil", href: "/informacion-util" },
]

const languages = [
  { code: "ES", label: "Español" },
  { code: "PT", label: "Português" },
  { code: "EN", label: "English" },
] as const

// Búsqueda global liviana — combina los 4 directorios en una sola lista
import { experiences } from "@/components/que-hacer-data"
import { events } from "@/components/eventos-data"
import { accommodations } from "@/components/donde-alojarse-data"
import { restaurants } from "@/components/donde-comer-data"

type SearchItem = {
  title: string
  description: string
  href: string
  category: string
}

const searchIndex: SearchItem[] = [
  ...experiences.map((e) => ({
    title: e.title,
    description: e.description,
    href: `/que-hacer/${e.id}`,
    category: "Qué hacer",
  })),
  ...events.map((e) => ({
    title: e.title,
    description: e.description,
    href: `/eventos/${e.id}`,
    category: "Eventos",
  })),
  ...accommodations.map((a) => ({
    title: a.name,
    description: a.description,
    href: `/donde-alojarse/${a.id}`,
    category: "Alojamiento",
  })),
  ...restaurants.map((r) => ({
    title: r.name,
    description: r.description,
    href: `/donde-comer/${r.id}`,
    category: "Gastronomía",
  })),
]

function highlight(text: string, query: string) {
  if (!query) return text
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return text
  return (
    <>
      {text.slice(0, idx)}
      <mark className="rounded bg-brand-yellow/40 px-0.5 text-foreground">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  )
}

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [lang, setLang] = useState<"ES" | "PT" | "EN">("ES")
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState("")
  const searchInputRef = useRef<HTMLInputElement>(null)
  const langRef = useRef<HTMLDivElement>(null)

  // Cerrar dropdown de idioma al hacer click fuera
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false)
      }
    }
    if (langOpen) document.addEventListener("mousedown", onClick)
    return () => document.removeEventListener("mousedown", onClick)
  }, [langOpen])

  // Focus al input cuando se abre la búsqueda
  useEffect(() => {
    if (searchOpen) {
      searchInputRef.current?.focus()
    } else {
      setQuery("")
    }
  }, [searchOpen])

  // Cerrar búsqueda con Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && searchOpen) setSearchOpen(false)
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [searchOpen])

  const trimmed = query.trim().toLowerCase()
  const results = trimmed
    ? searchIndex
        .filter(
          (item) =>
            item.title.toLowerCase().includes(trimmed) ||
            item.description.toLowerCase().includes(trimmed) ||
            item.category.toLowerCase().includes(trimmed),
        )
        .slice(0, 8)
    : []

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
            <a
              href="/mapa"
              className="hidden transition-colors hover:text-brand-yellow sm:inline"
            >
              Mapa del sitio
            </a>
            <a
              href="/informacion-util"
              className="hidden transition-colors hover:text-brand-yellow sm:inline"
            >
              Preguntas frecuentes
            </a>

            {/* Selector de idioma */}
            <div ref={langRef} className="relative">
              <button
                onClick={() => setLangOpen((v) => !v)}
                aria-haspopup="listbox"
                aria-expanded={langOpen}
                aria-label="Cambiar idioma"
                className="flex items-center gap-1 font-medium transition-colors hover:text-brand-yellow"
              >
                {lang} <ChevronDown className="h-3 w-3" />
              </button>
              {langOpen && (
                <ul
                  role="listbox"
                  className="absolute right-0 top-full mt-1.5 w-40 overflow-hidden rounded-lg border border-border bg-white text-foreground shadow-lg"
                >
                  {languages.map((l) => (
                    <li key={l.code}>
                      <button
                        role="option"
                        aria-selected={lang === l.code}
                        onClick={() => {
                          setLang(l.code)
                          setLangOpen(false)
                        }}
                        className={cn(
                          "flex w-full items-center justify-between px-3 py-2 text-xs font-medium transition-colors hover:bg-muted",
                          lang === l.code && "bg-muted text-brand-green",
                        )}
                      >
                        <span className="flex flex-col items-start">
                          <span className="text-sm font-bold">{l.code}</span>
                          <span className="text-[11px] font-normal text-muted-foreground">
                            {l.label}
                          </span>
                        </span>
                        {lang === l.code && <Check className="h-3.5 w-3.5 text-brand-green" />}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <a href="/" aria-label="Inicio">
            <Logo src="/images/logo-header.png" className="h-[52px]" />
          </a>

          <nav className="hidden items-center gap-6 xl:flex">
            {navItems.map((item, i) => (
              <a
                key={item.href}
                href={item.href}
                className={cn(
                  "relative py-1.5 text-sm font-medium transition-colors hover:text-brand-green",
                  i === 0 ? "text-brand-green" : "text-foreground/80",
                )}
              >
                {item.label}
                {i === 0 && (
                  <span className="absolute -bottom-0.5 left-0 h-0.5 w-full rounded-full bg-brand-yellow" />
                )}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="/guias-turisticas"
              className="hidden items-center gap-2 rounded-full bg-brand-yellow px-5 py-2.5 text-sm font-semibold text-brand-green-dark shadow-sm transition-transform hover:scale-[1.03] sm:inline-flex"
            >
              <BookOpen className="h-4 w-4" />
              Guía Turística
            </a>
            <button
              aria-label="Abrir búsqueda"
              onClick={() => setSearchOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-foreground/70 transition-colors hover:bg-muted hover:text-brand-green"
            >
              <Search className="h-5 w-5" />
            </button>
            <button
              aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={mobileOpen}
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
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
                      i === 0 ? "text-brand-green" : "text-foreground/80",
                    )}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li className="pt-2">
                <a
                  href="/guias-turisticas"
                  onClick={() => setMobileOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 py-2.5 text-sm font-semibold text-brand-green-dark"
                >
                  <BookOpen className="h-4 w-4" />
                  Guía Turística
                </a>
              </li>
            </ul>
          </nav>
        )}
      </div>

      {/* Search overlay */}
      {searchOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Buscar en Eldorado"
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 px-4 pt-16 backdrop-blur-sm sm:pt-24"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-border px-4">
              <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
              <input
                ref={searchInputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar experiencias, eventos, alojamientos, restaurantes..."
                className="h-14 flex-1 bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground"
              />
              <button
                onClick={() => setSearchOpen(false)}
                aria-label="Cerrar búsqueda"
                className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              {!trimmed && (
                <div className="px-4 py-10 text-center text-sm text-muted-foreground">
                  Empezá a escribir para buscar en el directorio de Eldorado.
                </div>
              )}
              {trimmed && results.length === 0 && (
                <div className="px-4 py-10 text-center text-sm text-muted-foreground">
                  No encontramos resultados para &ldquo;{query}&rdquo;.
                </div>
              )}
              {results.length > 0 && (
                <ul className="divide-y divide-border">
                  {results.map((item) => (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        onClick={() => setSearchOpen(false)}
                        className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-muted"
                      >
                        <span className="mt-0.5 inline-flex shrink-0 items-center rounded-full bg-brand-green/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-green">
                          {item.category}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold text-foreground">
                            {highlight(item.title, query)}
                          </span>
                          <span className="line-clamp-1 text-xs text-muted-foreground">
                            {highlight(item.description, query)}
                          </span>
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-border bg-muted/30 px-4 py-2 text-[11px] text-muted-foreground">
              <span>
                {results.length > 0
                  ? `${results.length} resultado${results.length !== 1 ? "s" : ""}`
                  : "Directorio completo de Eldorado"}
              </span>
              <span>
                <kbd className="rounded border border-border bg-white px-1.5 py-0.5 font-mono text-[10px]">
                  Esc
                </kbd>{" "}
                para cerrar
              </span>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
