"use client"

import { useState, type FormEvent } from "react"
import { Save, Image as ImageIcon, X } from "lucide-react"
import { cn } from "@/lib/utils"

type HomeConfigState = {
  id: string
  heroImageUrl: string | null
  heroAlt: string | null
  heroTitle: string | null
  heroSubtitle: string | null
  heroDescription: string | null
  heroCtaPrimary: string | null
  heroCtaPrimaryHref: string | null
  heroCtaSecondary: string | null
  heroCtaSecondaryHref: string | null
  updatedAt: string | Date
}

export function HomeConfigForm({ initial }: { initial: HomeConfigState }) {
  const [data, setData] = useState(() => ({
    heroImageUrl: initial.heroImageUrl ?? "",
    heroAlt: initial.heroAlt ?? "",
    heroTitle: initial.heroTitle ?? "",
    heroSubtitle: initial.heroSubtitle ?? "",
    heroDescription: initial.heroDescription ?? "",
    heroCtaPrimary: initial.heroCtaPrimary ?? "",
    heroCtaPrimaryHref: initial.heroCtaPrimaryHref ?? "",
    heroCtaSecondary: initial.heroCtaSecondary ?? "",
    heroCtaSecondaryHref: initial.heroCtaSecondaryHref ?? "",
  }))
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [toast, setToast] = useState<{ kind: "ok" | "err"; msg: string } | null>(null)
  const [savedAt, setSavedAt] = useState<string | null>(null)

  function update<K extends keyof typeof data>(key: K, value: string) {
    setData((d) => ({ ...d, [key]: value }))
  }

  async function onUpload(file: File) {
    setUploading(true)
    setToast(null)
    try {
      const fd = new FormData()
      fd.append("file", file)
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: fd,
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Error subiendo")
      update("heroImageUrl", json.url)
      setToast({ kind: "ok", msg: "Imagen subida. Recordá guardar." })
    } catch (err: any) {
      setToast({ kind: "err", msg: err.message })
    } finally {
      setUploading(false)
    }
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    setToast(null)
    try {
      const res = await fetch("/api/admin/home", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Error guardando")
      setToast({ kind: "ok", msg: "Cambios guardados" })
      setSavedAt(new Date().toLocaleString())
    } catch (err: any) {
      setToast({ kind: "err", msg: err.message })
    } finally {
      setSaving(false)
    }
  }

  const previewImage = data.heroImageUrl?.trim()

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Imagen */}
        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="mb-3 font-heading text-base font-bold text-brand-green-dark">
            Imagen del hero
          </h2>
          <div className="aspect-[16/10] w-full overflow-hidden rounded-xl border border-border bg-muted">
            {previewImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewImage}
                alt={data.heroAlt || "preview"}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                sin imagen (mostrará el fallback)
              </div>
            )}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted">
              <ImageIcon className="h-3.5 w-3.5" />
              {uploading ? "Subiendo..." : "Subir imagen"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) onUpload(f)
                  e.target.value = ""
                }}
              />
            </label>
            {previewImage && (
              <button
                type="button"
                onClick={() => update("heroImageUrl", "")}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
                Quitar
              </button>
            )}
          </div>
          <label className="mt-3 block text-sm">
            <span className="mb-1 block text-xs font-semibold text-foreground">
              URL de la imagen
            </span>
            <input
              type="text"
              value={data.heroImageUrl}
              onChange={(e) => update("heroImageUrl", e.target.value)}
              placeholder="/images/hero-eldorado.png o /api/images/<id>"
              className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-brand-green"
            />
            <span className="mt-1 block text-[10px] text-muted-foreground">
              Acepta /images/... (estática) o /api/images/&lt;id&gt; (DB).
            </span>
          </label>
          <label className="mt-3 block text-sm">
            <span className="mb-1 block text-xs font-semibold text-foreground">
              Alt (texto alternativo)
            </span>
            <input
              type="text"
              value={data.heroAlt}
              onChange={(e) => update("heroAlt", e.target.value)}
              placeholder="Vista aérea de Eldorado al atardecer"
              className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-brand-green"
            />
          </label>
        </section>

        {/* Textos */}
        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="mb-3 font-heading text-base font-bold text-brand-green-dark">
            Textos del hero
          </h2>
          <div className="space-y-3">
            <label className="block text-sm">
              <span className="mb-1 block text-xs font-semibold text-foreground">
                Título (línea 1)
              </span>
              <input
                type="text"
                value={data.heroTitle}
                onChange={(e) => update("heroTitle", e.target.value)}
                placeholder="Eldorado,"
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-brand-green"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-xs font-semibold text-foreground">
                Subtítulo (línea 2, debajo del título)
              </span>
              <input
                type="text"
                value={data.heroSubtitle}
                onChange={(e) => update("heroSubtitle", e.target.value)}
                placeholder="siempre cerca tuyo"
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-brand-green"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-xs font-semibold text-foreground">
                Descripción
              </span>
              <textarea
                value={data.heroDescription}
                onChange={(e) => update("heroDescription", e.target.value)}
                rows={3}
                placeholder="Descubrí la magia de la selva misionera..."
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-brand-green"
              />
            </label>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-3 rounded-xl border border-border bg-background/50 p-3">
              <p className="text-xs font-semibold text-brand-green-dark">
                Botón primario
              </p>
              <label className="block text-sm">
                <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Texto
                </span>
                <input
                  type="text"
                  value={data.heroCtaPrimary}
                  onChange={(e) => update("heroCtaPrimary", e.target.value)}
                  placeholder="Descubrí Eldorado"
                  className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-brand-green"
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Link
                </span>
                <input
                  type="text"
                  value={data.heroCtaPrimaryHref}
                  onChange={(e) => update("heroCtaPrimaryHref", e.target.value)}
                  placeholder="/que-hacer"
                  className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-brand-green"
                />
              </label>
            </div>
            <div className="space-y-3 rounded-xl border border-border bg-background/50 p-3">
              <p className="text-xs font-semibold text-brand-green-dark">
                Botón secundario
              </p>
              <label className="block text-sm">
                <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Texto
                </span>
                <input
                  type="text"
                  value={data.heroCtaSecondary}
                  onChange={(e) => update("heroCtaSecondary", e.target.value)}
                  placeholder="Ver video"
                  className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-brand-green"
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Link
                </span>
                <input
                  type="text"
                  value={data.heroCtaSecondaryHref}
                  onChange={(e) => update("heroCtaSecondaryHref", e.target.value)}
                  placeholder="/guias-turisticas"
                  className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-brand-green"
                />
              </label>
            </div>
          </div>
        </section>
      </div>

      <div className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="text-xs text-muted-foreground">
          {savedAt ? `Guardado ${savedAt}` : "Cambios sin guardar"}
        </div>
        <div className="flex items-center gap-2">
          {toast && (
            <span
              className={cn(
                "text-xs font-semibold",
                toast.kind === "ok" ? "text-emerald-700" : "text-red-700",
              )}
            >
              {toast.msg}
            </span>
          )}
          <button
            type="submit"
            disabled={saving || uploading}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-green px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-green-dark disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </div>
    </form>
  )
}
