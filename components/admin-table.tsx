"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Plus,
  Trash2,
  Save,
  ArrowLeft,
  Pencil,
  X,
  Search,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

type FieldDef =
  | { kind: "text"; key: string; label: string; required?: boolean; placeholder?: string }
  | { kind: "textarea"; key: string; label: string; required?: boolean; rows?: number }
  | { kind: "image"; key: string; label: string; placeholder?: string }
  | { kind: "checkbox"; key: string; label: string }
  | { kind: "select"; key: string; label: string; options: { value: string; label: string }[] }
  | { kind: "multiselect"; key: string; label: string; options: { value: string; label: string }[] }
  | { kind: "list"; key: string; label: string; placeholder?: string }
  | { kind: "number"; key: string; label: string; min?: number; step?: number }

export type FieldSchema = {
  fields: FieldDef[]
  // Para selects/multiselects, cuál es el "label" humano del item
  displayKey: string
  imageKey?: string
}

type Props = {
  collection: string
  schema: FieldSchema
  // Mapeo de campos que son arrays de objetos booleanos (p.ej. services)
  groups?: { key: string; label: string; fields: { key: string; label: string }[] }[]
}

export function AdminTable({ collection, schema, groups }: Props) {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editing, setEditing] = useState<any | null>(null)
  const [creating, setCreating] = useState(false)
  const [query, setQuery] = useState("")
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ kind: "ok" | "err"; msg: string } | null>(null)

  async function load() {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/${collection}`, { cache: "no-store" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Error cargando")
      setItems(data.items)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [collection])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2500)
    return () => clearTimeout(t)
  }, [toast])

  const filtered = useMemo(() => {
    if (!query.trim()) return items
    const q = query.toLowerCase()
    return items.filter((it) =>
      Object.values(it).some(
        (v) => typeof v === "string" && v.toLowerCase().includes(q),
      ),
    )
  }, [items, query])

  function newItem() {
    const base: Record<string, any> = { id: "" }
    for (const f of schema.fields) {
      if (f.kind === "checkbox") base[f.key] = false
      else if (f.kind === "multiselect" || f.kind === "list") base[f.key] = []
      else if (f.kind === "number") base[f.key] = f.min ?? 0
      else base[f.key] = ""
    }
    if (groups) {
      for (const g of groups) {
        base[g.key] = {}
        for (const f of g.fields) base[g.key][f.key] = false
      }
    }
    setCreating(true)
    setEditing(base)
  }

  function editItem(item: any) {
    setCreating(false)
    // Clon profundo para edición
    setEditing(JSON.parse(JSON.stringify(item)))
  }

  async function save() {
    if (!editing) return
    setSaving(true)
    try {
      if (!editing.id || !editing.id.trim()) {
        setToast({ kind: "err", msg: "El id es obligatorio" })
        setSaving(false)
        return
      }
      const res = await fetch(`/api/admin/${collection}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(editing),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Error guardando")
      setToast({ kind: "ok", msg: creating ? "Item creado" : "Cambios guardados" })
      setEditing(null)
      setCreating(false)
      await load()
    } catch (err: any) {
      setToast({ kind: "err", msg: err.message })
    } finally {
      setSaving(false)
    }
  }

  async function remove(id: string) {
    if (!confirm(`¿Eliminar el item "${id}"? Esta acción no se puede deshacer.`))
      return
    try {
      const res = await fetch(`/api/admin/${collection}/${id}`, {
        method: "DELETE",
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Error eliminando")
      setToast({ kind: "ok", msg: "Item eliminado" })
      await load()
    } catch (err: any) {
      setToast({ kind: "err", msg: err.message })
    }
  }

  if (editing) {
    return (
      <ItemForm
        item={editing}
        creating={creating}
        schema={schema}
        groups={groups}
        saving={saving}
        onChange={setEditing}
        onCancel={() => {
          setEditing(null)
          setCreating(false)
        }}
        onSave={save}
      />
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar en el listado..."
            className="h-10 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-sm outline-none transition-colors focus:border-brand-green"
          />
        </div>
        <button
          onClick={newItem}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-green px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-green-dark"
        >
          <Plus className="h-4 w-4" />
          Nuevo item
        </button>
      </div>

      {toast && (
        <div
          role="status"
          className={cn(
            "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm",
            toast.kind === "ok"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-red-200 bg-red-50 text-red-800",
          )}
        >
          {toast.kind === "ok" ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <AlertTriangle className="h-4 w-4" />
          )}
          {toast.msg}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-muted-foreground">Cargando...</p>
      ) : error ? (
        <p className="text-sm text-red-700">Error: {error}</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {items.length === 0
            ? "No hay items cargados. Creá el primero con el botón de arriba."
            : "Ningún item coincide con tu búsqueda."}
        </p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/40 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                {schema.imageKey && <th className="px-3 py-2.5">Imagen</th>}
                <th className="px-3 py-2.5">Título</th>
                <th className="hidden px-3 py-2.5 sm:table-cell">ID</th>
                <th className="hidden px-3 py-2.5 md:table-cell">Categoría</th>
                <th className="px-3 py-2.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((it) => {
                const catField = schema.fields.find(
                  (f) => f.kind === "select" || f.kind === "multiselect",
                ) as FieldDef | undefined
                const cat = catField
                  ? Array.isArray(it[catField.key])
                    ? (it[catField.key] as string[]).join(", ")
                    : (it[catField.key] as string)
                  : ""
                return (
                  <tr key={it.id} className="hover:bg-muted/30">
                    {schema.imageKey && (
                      <td className="px-3 py-2">
                        <div className="h-10 w-14 overflow-hidden rounded-md bg-muted">
                          {it[schema.imageKey] ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={it[schema.imageKey]}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-[10px] text-muted-foreground">
                              sin img
                            </div>
                          )}
                        </div>
                      </td>
                    )}
                    <td className="px-3 py-2 font-medium text-foreground">
                      {it[schema.displayKey]}
                    </td>
                    <td className="hidden px-3 py-2 font-mono text-xs text-muted-foreground sm:table-cell">
                      {it.id}
                    </td>
                    <td className="hidden px-3 py-2 text-xs text-muted-foreground md:table-cell">
                      {cat || "—"}
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => editItem(it)}
                          aria-label="Editar"
                          className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-brand-green/10 hover:text-brand-green"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => remove(it.id)}
                          aria-label="Eliminar"
                          className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-700"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {collection === "experiences" || collection === "events" ||
      collection === "accommodations" || collection === "restaurants" ||
      collection === "sportActivities" ? (
        <p className="text-xs text-muted-foreground">
          ¿Querés ver el resultado público?{" "}
          <Link
            href={
              collection === "experiences"
                ? "/que-hacer"
                : collection === "events"
                  ? "/eventos"
                  : collection === "accommodations"
                    ? "/donde-alojarse"
                    : collection === "restaurants"
                      ? "/donde-comer"
                      : "/deportes-eventos"
            }
            className="font-semibold text-brand-green hover:text-brand-green-dark"
          >
            Abrir esta sección en el sitio →
          </Link>
        </p>
      ) : null}
    </div>
  )
}

function ItemForm({
  item,
  creating,
  schema,
  groups,
  saving,
  onChange,
  onCancel,
  onSave,
}: {
  item: any
  creating: boolean
  schema: FieldSchema
  groups?: Props["groups"]
  saving: boolean
  onChange: (next: any) => void
  onCancel: () => void
  onSave: () => void
}) {
  function update(key: string, value: any) {
    onChange({ ...item, [key]: value })
  }
  function updateGroup(groupKey: string, key: string, value: any) {
    onChange({
      ...item,
      [groupKey]: { ...(item[groupKey] ?? {}), [key]: value },
    })
  }
  function toggleMulti(key: string, value: string) {
    const arr = (item[key] as string[]) ?? []
    onChange({
      ...item,
      [key]: arr.includes(value)
        ? arr.filter((v) => v !== value)
        : [...arr, value],
    })
  }
  function addListItem(key: string) {
    const arr = (item[key] as string[]) ?? []
    onChange({ ...item, [key]: [...arr, ""] })
  }
  function updateListItem(key: string, idx: number, value: string) {
    const arr = (item[key] as string[]) ?? []
    const next = [...arr]
    next[idx] = value
    onChange({ ...item, [key]: next })
  }
  function removeListItem(key: string, idx: number) {
    const arr = (item[key] as string[]) ?? []
    onChange({ ...item, [key]: arr.filter((_, i) => i !== idx) })
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <button
          onClick={onCancel}
          className="inline-flex items-center gap-1.5 rounded-lg bg-muted px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted/70"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Volver al listado
        </button>
        <h2 className="font-heading text-lg font-bold text-brand-green-dark">
          {creating ? "Crear nuevo item" : "Editar item"}
        </h2>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {schema.fields.map((f) => {
            if (f.kind === "text") {
              return (
                <label key={f.key} className="block">
                  <span className="mb-1 block text-xs font-semibold text-foreground">
                    {f.label}
                    {f.required && <span className="ml-1 text-red-600">*</span>}
                  </span>
                  <input
                    type="text"
                    value={item[f.key] ?? ""}
                    onChange={(e) => update(f.key, e.target.value)}
                    placeholder={f.placeholder}
                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-brand-green"
                  />
                </label>
              )
            }
            if (f.kind === "number") {
              return (
                <label key={f.key} className="block">
                  <span className="mb-1 block text-xs font-semibold text-foreground">
                    {f.label}
                  </span>
                  <input
                    type="number"
                    value={item[f.key] ?? 0}
                    min={f.min}
                    step={f.step}
                    onChange={(e) => update(f.key, Number(e.target.value))}
                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-brand-green"
                  />
                </label>
              )
            }
            if (f.kind === "textarea") {
              return (
                <label
                  key={f.key}
                  className={cn(
                    "block",
                    f.key === schema.displayKey ? "md:col-span-2" : "",
                  )}
                >
                  <span className="mb-1 block text-xs font-semibold text-foreground">
                    {f.label}
                  </span>
                  <textarea
                    value={item[f.key] ?? ""}
                    onChange={(e) => update(f.key, e.target.value)}
                    rows={f.rows ?? 3}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-brand-green"
                  />
                </label>
              )
            }
            if (f.kind === "image") {
              return (
                <div key={f.key} className="block md:col-span-2">
                  <span className="mb-1 block text-xs font-semibold text-foreground">
                    {f.label}
                  </span>
                  <div className="flex flex-wrap items-start gap-3">
                    <div className="h-20 w-28 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
                      {item[f.key] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item[f.key]}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[10px] text-muted-foreground">
                          sin imagen
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={item[f.key] ?? ""}
                        onChange={(e) => update(f.key, e.target.value)}
                        placeholder={f.placeholder ?? "/images/... o /api/images/ID"}
                        className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-brand-green"
                      />
                      <div className="flex items-center gap-2">
                        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0]
                              if (!file) return
                              try {
                                const fd = new FormData()
                                fd.append("file", file)
                                const res = await fetch(
                                  "/api/admin/upload",
                                  { method: "POST", body: fd },
                                )
                                const data = await res.json()
                                if (!res.ok)
                                  throw new Error(data.error || "Error subiendo")
                                update(f.key, data.url)
                                setToast({
                                  kind: "ok",
                                  msg: "Imagen subida",
                                })
                              } catch (err: any) {
                                setToast({
                                  kind: "err",
                                  msg: err.message,
                                })
                              } finally {
                                e.target.value = ""
                              }
                            }}
                          />
                          Subir imagen
                        </label>
                        {item[f.key]?.startsWith("/api/images/") && (
                          <span className="text-[10px] text-muted-foreground">
                            Almacenada en Neon
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            }
            if (f.kind === "checkbox") {
              return (
                <label
                  key={f.key}
                  className="flex items-center gap-2 self-end pb-2"
                >
                  <input
                    type="checkbox"
                    checked={!!item[f.key]}
                    onChange={(e) => update(f.key, e.target.checked)}
                    className="h-4 w-4 rounded border-border text-brand-green focus:ring-brand-green"
                  />
                  <span className="text-sm font-medium text-foreground">
                    {f.label}
                  </span>
                </label>
              )
            }
            if (f.kind === "select") {
              return (
                <label key={f.key} className="block">
                  <span className="mb-1 block text-xs font-semibold text-foreground">
                    {f.label}
                  </span>
                  <select
                    value={item[f.key] ?? ""}
                    onChange={(e) => update(f.key, e.target.value)}
                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-brand-green"
                  >
                    {f.options.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </label>
              )
            }
            if (f.kind === "multiselect") {
              return (
                <fieldset key={f.key} className="block md:col-span-2">
                  <legend className="mb-2 block text-xs font-semibold text-foreground">
                    {f.label}
                  </legend>
                  <div className="flex flex-wrap gap-2">
                    {f.options.map((o) => {
                      const arr = (item[f.key] as string[]) ?? []
                      const active = arr.includes(o.value)
                      return (
                        <button
                          type="button"
                          key={o.value}
                          onClick={() => toggleMulti(f.key, o.value)}
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-full border-2 px-3 py-1 text-xs font-semibold transition-all",
                            active
                              ? "border-brand-green bg-brand-green text-white"
                              : "border-border bg-background text-foreground/70 hover:border-brand-green/50",
                          )}
                        >
                          {o.label}
                        </button>
                      )
                    })}
                  </div>
                </fieldset>
              )
            }
            if (f.kind === "list") {
              const arr = (item[f.key] as string[]) ?? []
              return (
                <fieldset key={f.key} className="block md:col-span-2">
                  <legend className="mb-2 flex w-full items-center justify-between text-xs font-semibold text-foreground">
                    {f.label}
                    <button
                      type="button"
                      onClick={() => addListItem(f.key)}
                      className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-foreground hover:bg-muted/70"
                    >
                      <Plus className="h-3 w-3" />
                      Agregar
                    </button>
                  </legend>
                  <div className="space-y-1.5">
                    {arr.length === 0 && (
                      <p className="text-xs text-muted-foreground">
                        (vacío — agregá un item)
                      </p>
                    )}
                    {arr.map((v, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={v}
                          onChange={(e) =>
                            updateListItem(f.key, i, e.target.value)
                          }
                          placeholder={f.placeholder}
                          className="h-9 flex-1 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-brand-green"
                        />
                        <button
                          type="button"
                          onClick={() => removeListItem(f.key, i)}
                          className="rounded-md p-1.5 text-muted-foreground hover:bg-red-50 hover:text-red-700"
                          aria-label="Quitar"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </fieldset>
              )
            }
            return null
          })}

          {/* Grupos booleanos (p.ej. services: { breakfast, pool, parking }) */}
          {groups?.map((g) => (
            <fieldset key={g.key} className="block md:col-span-2">
              <legend className="mb-2 block text-xs font-semibold text-foreground">
                {g.label}
              </legend>
              <div className="flex flex-wrap gap-3">
                {g.fields.map((f) => (
                  <label
                    key={f.key}
                    className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={!!item[g.key]?.[f.key]}
                      onChange={(e) =>
                        updateGroup(g.key, f.key, e.target.checked)
                      }
                      className="h-4 w-4 rounded border-border text-brand-green focus:ring-brand-green"
                    />
                    {f.label}
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-end gap-2 border-t border-border pt-5">
          <button
            onClick={onCancel}
            className="rounded-lg bg-muted px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted/70"
          >
            Cancelar
          </button>
          <button
            onClick={onSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-green px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-green-dark disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            {saving ? "Guardando..." : creating ? "Crear item" : "Guardar cambios"}
          </button>
        </div>
      </div>
    </div>
  )
}
