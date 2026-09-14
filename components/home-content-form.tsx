"use client"

import { useState, type ChangeEvent } from "react"
import { ArrowDown, ArrowUp, Plus, Save, Trash2, Upload } from "lucide-react"
import type { HomeContentDocument } from "@/lib/home-content"

type FieldSpec = {
  key: string
  label: string
  kind?: "text" | "textarea" | "image" | "checkbox" | "select" | "number"
  min?: number
  max?: number
  step?: number
  options?: { value: string; label: string }[]
}

type ListSpec = {
  path: string[]
  title: string
  fields: FieldSpec[]
  blank: Record<string, unknown>
}

const iconOptions = [
  ["pin", "Ubicación"], ["map", "Mapa"], ["navigation", "Navegación"],
  ["book", "Guía"], ["leaf", "Naturaleza"], ["camera", "Aventura"],
  ["mountain", "Montaña"], ["trophy", "Deporte"], ["users", "Cultura"],
  ["waves", "Agua"], ["footprints", "Caminata"], ["bike", "Bicicleta"],
  ["home", "Rural"], ["utensils", "Gastronomía"], ["info", "Información"],
  ["shield", "Seguridad"], ["file", "Documento"],
].map(([value, label]) => ({ value, label }))

const colorOptions = [
  { value: "bg-brand-green", label: "Verde" },
  { value: "bg-brand-teal", label: "Turquesa" },
  { value: "bg-brand-yellow", label: "Amarillo" },
]

const sourceOptions = [
  { value: "experience", label: "Experiencia" },
  { value: "sportActivity", label: "Actividad deportiva" },
]

const mapCategoryOptions = [
  { value: "experiences", label: "Experiencias" },
  { value: "events", label: "Eventos" },
  { value: "accommodations", label: "Alojamientos" },
  { value: "restaurants", label: "Gastronomía" },
  { value: "sportActivities", label: "Deportes" },
]

const sharedLinkFields: FieldSpec[] = [
  { key: "label", label: "Texto" },
  { key: "href", label: "Enlace" },
]

function readPath(value: unknown, path: string[]): any {
  return path.reduce<any>((current, key) => current?.[key], value)
}

export function HomeContentForm({ initial }: { initial: HomeContentDocument }) {
  const [content, setContent] = useState(initial)
  const [saving, setSaving] = useState(false)
  const [savedAt, setSavedAt] = useState<string | null>(null)
  const [toast, setToast] = useState<{ kind: "ok" | "err"; message: string } | null>(null)
  const [uploading, setUploading] = useState<string | null>(null)

  function setPath(path: string[], value: unknown) {
    setContent((current) => {
      const next = JSON.parse(JSON.stringify(current)) as Record<string, any>
      let target = next
      for (const key of path.slice(0, -1)) target = target[key]
      target[path[path.length - 1]] = value
      return next as HomeContentDocument
    })
  }

  function setListItem(path: string[], index: number, key: string, value: unknown) {
    const items = readPath(content, path) as Record<string, unknown>[]
    const next = items.map((item, itemIndex) =>
      itemIndex === index ? { ...item, [key]: value } : item,
    )
    setPath(path, next)
  }

  function moveListItem(path: string[], index: number, direction: -1 | 1) {
    const items = [...(readPath(content, path) as unknown[])]
    const destination = index + direction
    if (destination < 0 || destination >= items.length) return
    ;[items[index], items[destination]] = [items[destination], items[index]]
    setPath(path, items)
  }

  function stringListEditor(path: string[], title: string) {
    const items = readPath(content, path) as string[]
    return (
      <section key={path.join("-")} className="rounded-xl border border-border bg-background/60 p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h4 className="text-sm font-semibold text-foreground">{title}</h4>
          <button type="button" onClick={() => setPath(path, [...items, ""])} className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs font-semibold hover:bg-muted">
            <Plus className="h-3.5 w-3.5" /> Agregar
          </button>
        </div>
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={`${path.join("-")}-${index}`} className="flex items-center gap-2">
              <input aria-label={`${title} ${index + 1}`} value={item} onChange={(event) => setPath(path, items.map((value, itemIndex) => itemIndex === index ? event.target.value : value))} className="h-10 min-w-0 flex-1 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-brand-green" />
              <button type="button" disabled={index === 0} onClick={() => moveListItem(path, index, -1)} aria-label="Mover arriba" className="rounded-md p-1 disabled:opacity-40"><ArrowUp className="h-4 w-4" /></button>
              <button type="button" disabled={index === items.length - 1} onClick={() => moveListItem(path, index, 1)} aria-label="Mover abajo" className="rounded-md p-1 disabled:opacity-40"><ArrowDown className="h-4 w-4" /></button>
              <button type="button" onClick={() => setPath(path, items.filter((_, itemIndex) => itemIndex !== index))} aria-label="Quitar elemento" className="rounded-md p-1 text-red-700 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
        </div>
      </section>
    )
  }

  async function uploadImage(path: string, file: File) {
    setUploading(path)
    setToast(null)
    try {
      const formData = new FormData()
      formData.append("file", file)
      const response = await fetch("/api/admin/upload", { method: "POST", body: formData })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || "No se pudo subir la imagen")
      setPath(path.split("."), result.url)
      setToast({ kind: "ok", message: "Imagen subida. Guardá los cambios para publicarla." })
    } catch (error) {
      setToast({ kind: "err", message: error instanceof Error ? error.message : "Error subiendo imagen" })
    } finally {
      setUploading(null)
    }
  }

  async function save() {
    setSaving(true)
    setToast(null)
    try {
      const response = await fetch("/api/admin/home-content", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(content),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || "No se pudo guardar la configuración")
      setContent(result.content)
      setSavedAt(new Date().toLocaleString())
      setToast({ kind: "ok", message: "Contenido del sitio guardado" })
    } catch (error) {
      setToast({ kind: "err", message: error instanceof Error ? error.message : "Error guardando" })
    } finally {
      setSaving(false)
    }
  }

  function textField(
    path: string[],
    label: string,
    kind: FieldSpec["kind"] = "text",
    limits?: Pick<FieldSpec, "min" | "max" | "step">,
  ) {
    const id = path.join("-")
    const value = readPath(content, path)
    return (
      <Field
        key={id}
        id={id}
        label={label}
        kind={kind}
        min={limits?.min}
        max={limits?.max}
        step={limits?.step}
        value={value}
        uploading={uploading === path.join(".")}
        onChange={(next) => setPath(path, next)}
        onUpload={(file) => uploadImage(path.join("."), file)}
      />
    )
  }

  function listEditor(spec: ListSpec) {
    const items = readPath(content, spec.path) as Record<string, unknown>[]
    return (
      <section key={spec.path.join("-")} className="rounded-xl border border-border bg-background/60 p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h4 className="text-sm font-semibold text-foreground">{spec.title}</h4>
          <button
            type="button"
            onClick={() => setPath(spec.path, [...items, spec.blank])}
            className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs font-semibold hover:bg-muted"
          >
            <Plus className="h-3.5 w-3.5" /> Agregar
          </button>
        </div>
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={`${spec.path.join("-")}-${index}`} className="rounded-lg border border-border bg-card p-3">
              <div className="mb-3 flex justify-end">
                <button type="button" onClick={() => moveListItem(spec.path, index, -1)} disabled={index === 0} aria-label="Mover arriba" className="rounded-md px-2 py-1 text-xs disabled:opacity-40">
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => moveListItem(spec.path, index, 1)} disabled={index === items.length - 1} aria-label="Mover abajo" className="rounded-md px-2 py-1 text-xs disabled:opacity-40">
                  <ArrowDown className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => setPath(spec.path, items.filter((_, itemIndex) => itemIndex !== index))} aria-label="Quitar elemento" className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-red-700 hover:bg-red-50">
                  <Trash2 className="h-3.5 w-3.5" /> Quitar
                </button>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {spec.fields.map((field) => (
                  <Field
                    key={field.key}
                    id={`${spec.path.join("-")}-${index}-${field.key}`}
                    label={field.label}
                    kind={field.kind ?? "text"}
                    min={field.min}
                    max={field.max}
                    step={field.step}
                    value={item[field.key]}
                    options={field.options}
                    uploading={uploading === `${spec.path.join(".")}.${index}.${field.key}`}
                    onChange={(next) => setListItem(spec.path, index, field.key, next)}
                    onUpload={(file) => uploadImage(`${spec.path.join(".")}.${index}.${field.key}`, file)}
                  />
                ))}
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="text-xs text-muted-foreground">La lista está vacía.</p>}
        </div>
      </section>
    )
  }

  const hrefField: FieldSpec = { key: "href", label: "Enlace" }
  const iconField: FieldSpec = { key: "icon", label: "Ícono", kind: "select", options: iconOptions }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-brand-green/20 bg-brand-green/5 p-4 text-sm text-foreground">
        Editá desde acá los textos, imágenes, enlaces y elementos que aparecen en el home y en la guía turística. Las tarjetas vinculadas a una experiencia o actividad deportiva usan la ficha actual; si esa ficha no existe, muestran el contenido propio guardado en esta configuración.
      </div>

      <details open className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <summary className="cursor-pointer font-heading text-base font-bold text-brand-green-dark">Hero de portada</summary>
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          {textField(["hero", "imageUrl"], "Imagen del hero", "image")}
          {textField(["hero", "alt"], "Texto alternativo de la imagen")}
          {textField(["hero", "title"], "Título")}
          {textField(["hero", "subtitle"], "Subtítulo")}
          {textField(["hero", "description"], "Descripción", "textarea")}
          {textField(["hero", "ctaPrimary"], "Texto del botón principal")}
          {textField(["hero", "ctaPrimaryHref"], "Enlace del botón principal")}
          {textField(["hero", "ctaSecondary"], "Texto del botón secundario")}
          {textField(["hero", "ctaSecondaryHref"], "Enlace del botón secundario")}
        </div>
      </details>

      <details open className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <summary className="cursor-pointer font-heading text-base font-bold text-brand-green-dark">SEO y encabezado</summary>
        <div className="mt-4 space-y-5">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {textField(["metadata", "siteName"], "Nombre del sitio")}
            {textField(["metadata", "title"], "Título SEO")}
            {textField(["metadata", "description"], "Descripción SEO", "textarea")}
            {textField(["metadata", "openGraphTitle"], "Título al compartir")}
            {textField(["metadata", "openGraphDescription"], "Descripción al compartir", "textarea")}
            {textField(["header", "logoUrl"], "URL del logo del encabezado", "image")}
            {textField(["header", "logoAlt"], "Texto alternativo del logo")}
            {textField(["header", "weatherTemperature"], "Dato del clima: temperatura")}
            {textField(["header", "weatherCondition"], "Dato del clima: condición")}
            {textField(["header", "siteMapLabel"], "Texto del enlace al mapa")}
            {textField(["header", "siteMapHref"], "Enlace al mapa")}
            {textField(["header", "faqLabel"], "Texto de preguntas frecuentes")}
            {textField(["header", "faqHref"], "Enlace de preguntas frecuentes")}
            {textField(["header", "languageLabel"], "Accesibilidad: idiomas")}
            {textField(["header", "ctaLabel"], "Texto del botón principal")}
            {textField(["header", "ctaHref"], "Enlace del botón principal")}
            {textField(["header", "openMenuLabel"], "Accesibilidad: abrir menú")}
            {textField(["header", "closeMenuLabel"], "Accesibilidad: cerrar menú")}
            {textField(["heroEyebrow"], "Frase breve sobre el hero")}
          </div>
          {stringListEditor(["metadata", "keywords"], "Palabras clave")}
          {listEditor({ path: ["header", "navItems"], title: "Navegación principal", fields: sharedLinkFields, blank: { label: "", href: "" } })}
          {listEditor({ path: ["header", "quickLinks"], title: "Accesos rápidos del hero", fields: [...sharedLinkFields, iconField], blank: { label: "", href: "", icon: "" } })}
          {listEditor({ path: ["header", "languages"], title: "Idiomas visibles", fields: [{ key: "code", label: "Código" }, { key: "label", label: "Nombre" }], blank: { code: "", label: "" } })}
          <section className="space-y-3 rounded-xl border border-border bg-background/60 p-4">
            <h4 className="text-sm font-semibold text-foreground">Buscador</h4>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {([
                ["openLabel", "Texto accesible para abrir"], ["closeLabel", "Texto accesible para cerrar"],
                ["dialogLabel", "Título accesible de búsqueda"], ["placeholder", "Texto del campo"],
                ["startPrompt", "Instrucción inicial"], ["noResultsPrefix", "Mensaje sin resultados"],
                ["resultCountSingular", "Etiqueta para un resultado"], ["resultCountPlural", "Etiqueta para varios resultados"],
                ["resultCategoryExperiences", "Categoría de experiencias"], ["resultCategoryEvents", "Categoría de eventos"],
                ["resultCategoryAccommodations", "Categoría de alojamientos"], ["resultCategoryRestaurants", "Categoría de restaurantes"],
                ["resultCategorySports", "Categoría de deportes"], ["footerDirectory", "Texto del pie del buscador"],
                ["escapeKeyLabel", "Tecla para cerrar"], ["escapeHint", "Ayuda de teclado"],
              ] as const).map(([key, label]) => textField(["header", "search", key], label))}
            </div>
          </section>
        </div>
      </details>

      <details open className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <summary className="cursor-pointer font-heading text-base font-bold text-brand-green-dark">Secciones del home</summary>
        <div className="mt-4 space-y-5">
          <section className="rounded-xl border border-border bg-background/60 p-4">
            <h4 className="mb-3 text-sm font-semibold text-foreground">Orden de las secciones</h4>
            <div className="space-y-2">
              {content.sectionOrder.map((section, index) => (
                <div key={section} className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2 text-sm">
                  <span>{section}</span>
                  <div className="flex gap-1">
                    <button type="button" disabled={index === 0} onClick={() => moveListItem(["sectionOrder"], index, -1)} aria-label="Mover sección arriba" className="rounded p-1 disabled:opacity-40"><ArrowUp className="h-4 w-4" /></button>
                    <button type="button" disabled={index === content.sectionOrder.length - 1} onClick={() => moveListItem(["sectionOrder"], index, 1)} aria-label="Mover sección abajo" className="rounded p-1 disabled:opacity-40"><ArrowDown className="h-4 w-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </section>
          <section className="space-y-3 rounded-xl border border-border bg-background/60 p-4">
            <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={content.features.enabled} onChange={(event) => setPath(["features", "enabled"], event.target.checked)} /> Mostrar accesos por categoría</label>
            {listEditor({ path: ["features", "items"], title: "Categorías", fields: [iconField, { key: "color", label: "Color", kind: "select", options: colorOptions }, { key: "title", label: "Título" }, { key: "description", label: "Descripción", kind: "textarea" }, hrefField], blank: { icon: "", color: "bg-brand-green", title: "", description: "", href: "" } })}
          </section>

          <section className="space-y-3 rounded-xl border border-border bg-background/60 p-4">
            <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={content.imperdibles.enabled} onChange={(event) => setPath(["imperdibles", "enabled"], event.target.checked)} /> Mostrar atractivos</label>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {textField(["imperdibles", "title"], "Título")}
              {textField(["imperdibles", "subtitle"], "Bajada")}
              {textField(["imperdibles", "linkLabel"], "Texto del enlace")}
              {textField(["imperdibles", "linkHref"], "Destino del enlace")}
            </div>
            {listEditor({ path: ["imperdibles", "items"], title: "Tarjetas de atractivos", fields: [{ key: "source", label: "Origen", kind: "select", options: sourceOptions }, { key: "sourceId", label: "ID de la ficha" }, { key: "title", label: "Título propio si no hay ficha" }, { key: "description", label: "Descripción propia", kind: "textarea" }, { key: "image", label: "Imagen propia", kind: "image" }, hrefField], blank: { source: "experience", sourceId: "", title: "", description: "", image: "", href: "" } })}
          </section>

          <section className="space-y-3 rounded-xl border border-border bg-background/60 p-4">
            <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={content.events.enabled} onChange={(event) => setPath(["events", "enabled"], event.target.checked)} /> Mostrar calendario</label>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {textField(["events", "title"], "Título")}
              {textField(["events", "description"], "Descripción", "textarea")}
              {textField(["events", "buttonLabel"], "Texto del botón")}
              {textField(["events", "buttonHref"], "Enlace del botón")}
              {textField(["events", "image"], "Imagen del banner", "image")}
              {textField(["events", "imageAlt"], "Texto alternativo de la imagen")}
              {textField(["events", "eventListTitle"], "Título de eventos próximos")}
              {textField(["events", "eventLimit"], "Cantidad máxima de eventos", "number")}
            </div>
          </section>

          <section className="space-y-3 rounded-xl border border-border bg-background/60 p-4">
            <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={content.planifica.enabled} onChange={(event) => setPath(["planifica", "enabled"], event.target.checked)} /> Mostrar planificación del viaje</label>
            {textField(["planifica", "title"], "Título de la sección")}
            {listEditor({ path: ["planifica", "items"], title: "Tarjetas de planificación", fields: [iconField, { key: "title", label: "Título" }, { key: "description", label: "Descripción", kind: "textarea" }, { key: "ctaLabel", label: "Texto del botón" }, hrefField, { key: "download", label: "Mostrar ícono de descarga", kind: "checkbox" }], blank: { icon: "", title: "", description: "", ctaLabel: "", href: "", download: false } })}
          </section>

          <section className="space-y-3 rounded-xl border border-border bg-background/60 p-4">
            <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={content.vivi.enabled} onChange={(event) => setPath(["vivi", "enabled"], event.target.checked)} /> Mostrar actividades</label>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {textField(["vivi", "title"], "Título")}
              {textField(["vivi", "subtitle"], "Bajada")}
              {textField(["vivi", "linkLabel"], "Texto del enlace")}
              {textField(["vivi", "linkHref"], "Destino del enlace")}
            </div>
            {listEditor({ path: ["vivi", "items"], title: "Tarjetas de actividades", fields: [{ key: "source", label: "Origen", kind: "select", options: sourceOptions }, { key: "sourceId", label: "ID de la ficha" }, iconField, { key: "title", label: "Título propio si no hay ficha" }, { key: "image", label: "Imagen propia", kind: "image" }, hrefField], blank: { source: "experience", sourceId: "", icon: "", title: "", image: "", href: "" } })}
          </section>
        </div>
      </details>

      <details id="guia-turistica" className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <summary className="cursor-pointer font-heading text-base font-bold text-brand-green-dark">Guía turística</summary>
        <div className="mt-4 space-y-5">
          <section className="space-y-3 rounded-xl border border-border bg-background/60 p-4">
            <h4 className="text-sm font-semibold text-foreground">SEO de la guía</h4>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {textField(["guide", "metadata", "title"], "Título SEO")}
              {textField(["guide", "metadata", "description"], "Descripción SEO", "textarea")}
              {textField(["guide", "metadata", "openGraphTitle"], "Título al compartir")}
              {textField(["guide", "metadata", "openGraphDescription"], "Descripción al compartir", "textarea")}
            </div>
          </section>

          <section className="space-y-3 rounded-xl border border-border bg-background/60 p-4">
            <h4 className="text-sm font-semibold text-foreground">Portada</h4>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {textField(["guide", "hero", "imageUrl"], "Imagen de portada", "image")}
              {textField(["guide", "hero", "alt"], "Texto alternativo de la imagen")}
              {textField(["guide", "hero", "eyebrow"], "Texto breve superior")}
              {textField(["guide", "hero", "title"], "Título")}
              {textField(["guide", "hero", "description"], "Descripción", "textarea")}
              {textField(["guide", "hero", "downloadLabel"], "Texto del botón de descarga")}
              {textField(["guide", "hero", "downloadHref"], "Enlace del botón de descarga")}
              {textField(["guide", "hero", "exploreLabel"], "Texto del botón para explorar")}
              {textField(["guide", "hero", "exploreHref"], "Enlace del botón para explorar")}
            </div>
          </section>

          <section className="space-y-3 rounded-xl border border-border bg-background/60 p-4">
            <h4 className="text-sm font-semibold text-foreground">Aviso de entrega por correo</h4>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {textField(["guide", "delivery", "description"], "Descripción", "textarea")}
              {textField(["guide", "delivery", "instructionPrefix"], "Texto antes del botón")}
              {textField(["guide", "delivery", "downloadLabel"], "Texto destacado")}
              {textField(["guide", "delivery", "instructionSuffix"], "Texto después del botón", "textarea")}
              {textField(["guide", "delivery", "emailLabel"], "Correo visible")}
              {textField(["guide", "delivery", "emailHref"], "Enlace del correo")}
              {textField(["guide", "delivery", "closing"], "Texto final")}
            </div>
          </section>

          <section className="space-y-3 rounded-xl border border-border bg-background/60 p-4">
            <h4 className="text-sm font-semibold text-foreground">Secciones de la guía</h4>
            {textField(["guide", "sectionsTitle"], "Título de la sección")}
            {listEditor({ path: ["guide", "sections"], title: "Tarjetas", fields: [iconField, { key: "title", label: "Título" }, { key: "description", label: "Descripción", kind: "textarea" }], blank: { icon: "book", title: "", description: "" } })}
          </section>

          <section className="space-y-3 rounded-xl border border-border bg-background/60 p-4">
            <h4 className="text-sm font-semibold text-foreground">Términos y privacidad</h4>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {textField(["guide", "legal", "termsTitle"], "Título de términos")}
              {textField(["guide", "legal", "termsText"], "Texto de términos", "textarea")}
              {textField(["guide", "legal", "privacyTitle"], "Título de privacidad")}
              {textField(["guide", "legal", "privacyText"], "Texto de privacidad", "textarea")}
            </div>
          </section>
        </div>
      </details>

      <details id="mapa" open className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <summary className="cursor-pointer font-heading text-base font-bold text-brand-green-dark">Mapa</summary>
        <div className="mt-4 space-y-5">
          <section className="space-y-3 rounded-xl border border-border bg-background/60 p-4">
            <h4 className="text-sm font-semibold text-foreground">SEO y portada</h4>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {textField(["mapPage", "metadata", "title"], "Título SEO")}
              {textField(["mapPage", "metadata", "description"], "Descripción SEO", "textarea")}
              {textField(["mapPage", "metadata", "openGraphTitle"], "Título al compartir")}
              {textField(["mapPage", "metadata", "openGraphDescription"], "Descripción al compartir", "textarea")}
              {textField(["mapPage", "hero", "eyebrow"], "Texto breve superior")}
              {textField(["mapPage", "hero", "title"], "Título de portada")}
              {textField(["mapPage", "hero", "description"], "Descripción de portada", "textarea")}
            </div>
          </section>

          <section className="space-y-3 rounded-xl border border-border bg-background/60 p-4">
            <h4 className="text-sm font-semibold text-foreground">Mapa y textos visibles</h4>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {textField(["mapPage", "map", "sectionTitle"], "Título de la sección")}
              {textField(["mapPage", "map", "sectionDescription"], "Descripción de la sección", "textarea")}
              {textField(["mapPage", "map", "mapAriaLabel"], "Texto accesible del mapa")}
              {textField(["mapPage", "map", "loadingMessage"], "Mensaje de carga")}
              {textField(["mapPage", "map", "errorMessage"], "Mensaje de error", "textarea")}
              {textField(["mapPage", "map", "listInstruction"], "Instrucción de la lista")}
              {textField(["mapPage", "map", "approximateLocationsNote"], "Nota sobre ubicaciones aproximadas")}
              {textField(["mapPage", "map", "centerLatitude"], "Latitud inicial", "number", { min: -90, max: 90, step: 0.0001 })}
              {textField(["mapPage", "map", "centerLongitude"], "Longitud inicial", "number", { min: -180, max: 180, step: 0.0001 })}
              {textField(["mapPage", "map", "zoom"], "Zoom inicial", "number", { min: 1, max: 20, step: 1 })}
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {textField(["mapPage", "tabs", "experiences"], "Etiqueta: experiencias")}
              {textField(["mapPage", "tabs", "events"], "Etiqueta: eventos")}
              {textField(["mapPage", "tabs", "accommodations"], "Etiqueta: alojamientos")}
              {textField(["mapPage", "tabs", "restaurants"], "Etiqueta: gastronomía")}
              {textField(["mapPage", "tabs", "sportActivities"], "Etiqueta: deportes")}
            </div>
          </section>

          <section className="space-y-3 rounded-xl border border-border bg-background/60 p-4">
            <h4 className="text-sm font-semibold text-foreground">Pines con ubicación exacta</h4>
            <p className="text-xs text-muted-foreground">
              Opcional: cargá coordenadas para reemplazar la posición aproximada de un elemento. Usá el ID de su ficha en la sección correspondiente del admin.
            </p>
            {listEditor({
              path: ["mapPage", "locations"],
              title: "Ubicaciones",
              fields: [
                { key: "category", label: "Sección", kind: "select", options: mapCategoryOptions },
                { key: "itemId", label: "ID de la ficha" },
                { key: "latitude", label: "Latitud", kind: "number", min: -90, max: 90, step: 0.000001 },
                { key: "longitude", label: "Longitud", kind: "number", min: -180, max: 180, step: 0.000001 },
              ],
              blank: { category: "experiences", itemId: "", latitude: 0, longitude: 0 },
            })}
          </section>
        </div>
      </details>

      <details className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <summary className="cursor-pointer font-heading text-base font-bold text-brand-green-dark">Pie de página</summary>
        <div className="mt-4 space-y-5">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {textField(["footer", "logoUrl"], "Logo del pie", "image")}
            {textField(["footer", "logoAlt"], "Texto alternativo del logo")}
            {textField(["footer", "tagline"], "Frase de marca")}
            {textField(["footer", "linksTitle"], "Título de enlaces")}
            {textField(["footer", "contactTitle"], "Título de contacto")}
            {textField(["footer", "phoneLabel"], "Teléfono visible")}
            {textField(["footer", "phoneHref"], "Enlace telefónico")}
            {textField(["footer", "emailLabel"], "Correo visible")}
            {textField(["footer", "emailHref"], "Enlace de correo")}
            {textField(["footer", "locationLabel"], "Ubicación visible")}
            {textField(["footer", "locationHref"], "Enlace de ubicación")}
            {textField(["footer", "newsletterTitle"], "Título del boletín")}
            {textField(["footer", "newsletterDescription"], "Descripción del boletín", "textarea")}
            {textField(["footer", "newsletterEmailPlaceholder"], "Texto del campo de correo")}
            {textField(["footer", "newsletterSubmitLabel"], "Texto accesible del botón")}
            {textField(["footer", "newsletterAction"], "Acción del formulario")}
            {textField(["footer", "copyright"], "Derechos de autor")}
            {textField(["footer", "creditPrefix"], "Crédito, texto inicial")}
            {textField(["footer", "creditSuffix"], "Crédito, texto final")}
          </div>
          {listEditor({ path: ["footer", "links"], title: "Enlaces del pie", fields: sharedLinkFields, blank: { label: "", href: "" } })}
          {listEditor({ path: ["footer", "socials"], title: "Redes sociales", fields: [...sharedLinkFields, { key: "icon", label: "Red social", kind: "select", options: [{ value: "facebook", label: "Facebook" }, { value: "instagram", label: "Instagram" }, { value: "youtube", label: "YouTube" }] }], blank: { label: "", href: "", icon: "" } })}
        </div>
      </details>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="text-xs text-muted-foreground">{savedAt ? `Guardado ${savedAt}` : "Cambios sin guardar"}</div>
        <div className="flex items-center gap-3">
          {toast && <span role="status" className={`text-xs font-semibold ${toast.kind === "ok" ? "text-emerald-700" : "text-red-700"}`}>{toast.message}</span>}
          <button type="button" onClick={save} disabled={saving || !!uploading} className="inline-flex items-center gap-2 rounded-lg bg-brand-green px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-green-dark disabled:opacity-60">
            <Save className="h-4 w-4" />{saving ? "Guardando..." : "Guardar contenido"}
          </button>
        </div>
      </div>
    </div>
  )
}

function Field({
  id,
  label,
  kind = "text",
  value,
  options,
  min,
  max,
  step,
  uploading,
  onChange,
  onUpload,
}: {
  id: string
  label: string
  kind?: FieldSpec["kind"]
  value: unknown
  options?: FieldSpec["options"]
  min?: number
  max?: number
  step?: number
  uploading?: boolean
  onChange: (value: unknown) => void
  onUpload: (file: File) => void
}) {
  if (kind === "checkbox") {
    return (
      <label className="flex items-center gap-2 text-sm font-medium text-foreground">
        <input type="checkbox" checked={value === true} onChange={(event) => onChange(event.target.checked)} className="h-4 w-4 rounded border-border text-brand-green" />
        {label}
      </label>
    )
  }

  return (
    <label htmlFor={id} className="block text-sm">
      <span className="mb-1 block text-xs font-semibold text-foreground">{label}</span>
      {kind === "textarea" ? (
        <textarea id={id} value={String(value ?? "")} onChange={(event) => onChange(event.target.value)} rows={3} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-brand-green" />
      ) : kind === "select" ? (
        <select id={id} value={String(value ?? "")} onChange={(event) => onChange(event.target.value)} className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-brand-green">
          <option value=""></option>
          {options?.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
      ) : (
        <div className="flex gap-2">
          <input id={id} type={kind === "number" ? "number" : "text"} min={kind === "number" ? min ?? 0 : undefined} max={kind === "number" ? max ?? 20 : undefined} step={kind === "number" ? step ?? 1 : undefined} value={String(value ?? "")} onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(kind === "number" ? Number(event.target.value) : event.target.value)} className="h-10 min-w-0 flex-1 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-brand-green" />
          {kind === "image" && (
            <label className="inline-flex h-10 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-xs font-semibold hover:bg-muted">
              <Upload className="h-3.5 w-3.5" />{uploading ? "Subiendo" : "Subir"}
              <input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={(event) => {
                const file = event.target.files?.[0]
                if (file) onUpload(file)
                event.target.value = ""
              }} />
            </label>
          )}
        </div>
      )}
    </label>
  )
}
