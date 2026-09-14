"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import {
  Sun,
  ChevronDown,
  Search,
  BookOpen,
  Menu,
  X,
  Check,
} from "lucide-react"
import { Logo } from "@/components/logo"
import Link from "next/link"
import { cn } from "@/lib/utils"
import type { HomeContentDocument } from "@/lib/home-content"

export type SearchItem = {
  title: string
  description: string
  href: string
  category: string
}

export function HomeSiteHeader({
  config,
  searchItems,
}: {
  config: HomeContentDocument["header"]
  searchItems: SearchItem[]
}) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [lang, setLang] = useState(config.languages[0]?.code ?? "")
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState("")
  const searchInputRef = useRef<HTMLInputElement>(null)
  const langRef = useRef<HTMLDivElement>(null)
  const closeSearch = useCallback(() => {
    setSearchOpen(false)
    setQuery("")
  }, [])

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangOpen(false)
      }
    }
    if (langOpen) document.addEventListener("mousedown", onClick)
    return () => document.removeEventListener("mousedown", onClick)
  }, [langOpen])

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus()
  }, [searchOpen])

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape" && searchOpen) closeSearch()
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [closeSearch, searchOpen])

  const trimmed = query.trim().toLowerCase()
  const results = trimmed
    ? searchItems
        .filter(
          (item) =>
            item.title.toLowerCase().includes(trimmed) ||
            item.description.toLowerCase().includes(trimmed) ||
            item.category.toLowerCase().includes(trimmed),
        )
        .slice(0, 8)
    : []

  function highlight(text: string) {
    if (!trimmed) return text
    const index = text.toLowerCase().indexOf(trimmed)
    if (index === -1) return text
    return (
      <>
        {text.slice(0, index)}
        <mark className="rounded bg-brand-yellow/40 px-0.5 text-foreground">
          {text.slice(index, index + trimmed.length)}
        </mark>
        {text.slice(index + trimmed.length)}
      </>
    )
  }

  return (
    <header className="relative z-30">
      <div className="bg-brand-green-dark text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-xs sm:px-6">
          <div className="flex items-center gap-4">
            {(config.weatherTemperature || config.weatherCondition) && (
              <span className="flex items-center gap-1.5">
                <Sun className="h-3.5 w-3.5 text-brand-yellow" />
                {config.weatherTemperature}
              </span>
            )}
            {config.weatherCondition && (
              <span className="hidden items-center gap-1.5 sm:flex">
                <Sun className="h-3.5 w-3.5 text-brand-yellow" />
                {config.weatherCondition}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            {config.siteMapLabel && config.siteMapHref && (
              <a href={config.siteMapHref} className="hidden transition-colors hover:text-brand-yellow sm:inline">
                {config.siteMapLabel}
              </a>
            )}
            {config.faqLabel && config.faqHref && (
              <a href={config.faqHref} className="hidden transition-colors hover:text-brand-yellow sm:inline">
                {config.faqLabel}
              </a>
            )}
            {config.languages.length > 0 && (
              <div ref={langRef} className="relative">
                <button
                  onClick={() => setLangOpen((current) => !current)}
                  aria-haspopup="listbox"
                  aria-expanded={langOpen}
                  aria-label={config.languageLabel}
                  className="flex items-center gap-1 font-medium transition-colors hover:text-brand-yellow"
                >
                  {lang} <ChevronDown className="h-3 w-3" />
                </button>
                {langOpen && (
                  <ul role="listbox" className="absolute right-0 top-full mt-1.5 w-40 overflow-hidden rounded-lg border border-border bg-white text-foreground shadow-lg">
                    {config.languages.map((language) => (
                      <li key={language.code}>
                        <button
                          role="option"
                          aria-selected={lang === language.code}
                          onClick={() => {
                            setLang(language.code)
                            setLangOpen(false)
                          }}
                          className={cn(
                            "flex w-full items-center justify-between px-3 py-2 text-xs font-medium transition-colors hover:bg-muted",
                            lang === language.code && "bg-muted text-brand-green",
                          )}
                        >
                          <span className="flex flex-col items-start">
                            <span className="text-sm font-bold">{language.code}</span>
                            <span className="text-[11px] font-normal text-muted-foreground">{language.label}</span>
                          </span>
                          {lang === language.code && <Check className="h-3.5 w-3.5 text-brand-green" />}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          {config.logoUrl && (
            <Link href="/" aria-label={config.logoAlt}>
              <Logo src={config.logoUrl} alt={config.logoAlt} className="h-[52px]" />
            </Link>
          )}

          {config.navItems.length > 0 && (
            <nav className="hidden items-center gap-6 xl:flex">
              {config.navItems.map((item) => (
                <a key={`${item.href}-${item.label}`} href={item.href} className="relative py-1.5 text-sm font-medium text-foreground/80 transition-colors hover:text-brand-green">
                  {item.label}
                </a>
              ))}
            </nav>
          )}

          <div className="flex items-center gap-3">
            {config.ctaLabel && config.ctaHref && (
              <a href={config.ctaHref} className="hidden items-center gap-2 rounded-full bg-brand-yellow px-5 py-2.5 text-sm font-semibold text-brand-green-dark shadow-sm transition-transform hover:scale-[1.03] sm:inline-flex">
                <BookOpen className="h-4 w-4" />
                {config.ctaLabel}
              </a>
            )}
            <button
              aria-label={config.search.openLabel}
              onClick={() => setSearchOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-foreground/70 transition-colors hover:bg-muted hover:text-brand-green"
            >
              <Search className="h-5 w-5" />
            </button>
            <button
              aria-label={mobileOpen ? config.closeMenuLabel : config.openMenuLabel}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((current) => !current)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-foreground/70 transition-colors hover:bg-muted xl:hidden"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <nav className="border-t border-border bg-white px-4 py-3 xl:hidden">
            <ul className="flex flex-col gap-1">
              {config.navItems.map((item) => (
                <li key={`${item.href}-${item.label}`}>
                  <a href={item.href} onClick={() => setMobileOpen(false)} className="block rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted">
                    {item.label}
                  </a>
                </li>
              ))}
              {config.ctaLabel && config.ctaHref && (
                <li className="pt-2">
                  <a href={config.ctaHref} onClick={() => setMobileOpen(false)} className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 py-2.5 text-sm font-semibold text-brand-green-dark">
                    <BookOpen className="h-4 w-4" />
                    {config.ctaLabel}
                  </a>
                </li>
              )}
            </ul>
          </nav>
        )}
      </div>

      {searchOpen && (
        <div role="dialog" aria-modal="true" aria-label={config.search.dialogLabel} className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 px-4 pt-16 backdrop-blur-sm sm:pt-24" onClick={closeSearch}>
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center gap-3 border-b border-border px-4">
              <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
              <input ref={searchInputRef} type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={config.search.placeholder} aria-label={config.search.dialogLabel} className="h-14 flex-1 bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground" />
              <button onClick={closeSearch} aria-label={config.search.closeLabel} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              {!trimmed && <div className="px-4 py-10 text-center text-sm text-muted-foreground">{config.search.startPrompt}</div>}
              {trimmed && results.length === 0 && (
                <div className="px-4 py-10 text-center text-sm text-muted-foreground">
                  {config.search.noResultsPrefix} &ldquo;{query}&rdquo;.
                </div>
              )}
              {results.length > 0 && (
                <ul className="divide-y divide-border">
                  {results.map((item) => (
                    <li key={item.href}>
                      <a href={item.href} onClick={closeSearch} className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-muted">
                        <span className="mt-0.5 inline-flex shrink-0 items-center rounded-full bg-brand-green/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-green">{item.category}</span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold text-foreground">{highlight(item.title)}</span>
                          <span className="line-clamp-1 text-xs text-muted-foreground">{highlight(item.description)}</span>
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
                  ? `${results.length} ${results.length === 1 ? config.search.resultCountSingular : config.search.resultCountPlural}`
                  : config.search.footerDirectory}
              </span>
              <span><kbd className="rounded border border-border bg-white px-1.5 py-0.5 font-mono text-[10px]">{config.search.escapeKeyLabel}</kbd> {config.search.escapeHint}</span>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
