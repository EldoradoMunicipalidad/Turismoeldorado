"use client"

import { useEffect, useRef, useState } from "react"
import {
  Map as MapIcon,
  Compass,
  Hotel,
  Utensils,
  Trophy,
  MapPin,
  Phone,
} from "lucide-react"
import { experiences } from "@/components/que-hacer-data"
import { events } from "@/components/eventos-data"
import { accommodations } from "@/components/donde-alojarse-data"
import { restaurants } from "@/components/donde-comer-data"
import { sportActivities } from "@/components/deportes-eventos-data"
import { formatDate } from "@/components/deportes-eventos-helpers"

type Tab = "experiencias" | "eventos" | "alojamientos" | "gastronomia" | "deportes"

const TABS: { value: Tab; label: string; Icon: typeof MapIcon }[] = [
  { value: "experiencias", label: "Experiencias", Icon: Compass },
  { value: "eventos", label: "Eventos", Icon: MapIcon },
  { value: "alojamientos", label: "Alojamientos", Icon: Hotel },
  { value: "gastronomia", label: "Gastronomía", Icon: Utensils },
  { value: "deportes", label: "Deportes", Icon: Trophy },
]

type ColorKey = "emerald" | "rose" | "blue" | "amber" | "orange"

const COLOR_HEX: Record<ColorKey, string> = {
  emerald: "#10b981",
  rose: "#f43f5e",
  blue: "#3b82f6",
  amber: "#f59e0b",
  orange: "#f97316",
}

const TAB_COLORS: Record<Tab, ColorKey> = {
  experiencias: "emerald",
  eventos: "rose",
  alojamientos: "blue",
  gastronomia: "amber",
  deportes: "orange",
}

// Eldorado, Misiones. Para cada POI dispersión determinística según id.
const ELDORADO_CENTER: [number, number] = [-26.4049, -54.6246]

function hashCode(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i)
    h |= 0
  }
  return Math.abs(h)
}

function offsetFor(id: string): [number, number] {
  const h = hashCode(id)
  const lat = -26.4049 + ((h % 100) - 50) / 1250
  const lng = -54.6246 + (((h >> 7) % 100) - 50) / 1250
  return [lat, lng]
}

export function MapSection() {
  const mapRef = useRef<HTMLDivElement>(null)
  const [tab, setTab] = useState<Tab>("experiencias")
  const [mapReady, setMapReady] = useState(false)
  const [mapError, setMapError] = useState(false)
  // Refs al mapa y a la capa de marcadores (set en el primer useEffect)
  const mapInstanceRef = useRef<any>(null)
  const markerLayerRef = useRef<any>(null)
  const LRef = useRef<any>(null)

  useEffect(() => {
    if (typeof window === "undefined") return
    if (!mapRef.current) return

    let cancelled = false
    let map: any = null

    async function init() {
      try {
        const L = (await import("leaflet")).default || (await import("leaflet"))
        await import("leaflet/dist/leaflet.css")
        if (cancelled || !mapRef.current) return

        const iconRetinaUrl =
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png"
        const iconUrl =
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png"
        const shadowUrl =
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
        // @ts-ignore
        delete L.Icon.Default.prototype._getIconUrl
        L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl })

        map = L.map(mapRef.current, {
          center: ELDORADO_CENTER,
          zoom: 12,
          scrollWheelZoom: false,
        })

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 19,
        }).addTo(map)

        const markerLayer = L.layerGroup().addTo(map)

        mapInstanceRef.current = map
        markerLayerRef.current = markerLayer
        LRef.current = L
        setMapReady(true)
      } catch (err) {
        console.error("Error cargando Leaflet:", err)
        if (!cancelled) setMapError(true)
      }
    }
    init()

    return () => {
      cancelled = true
      try {
        map?.remove()
      } catch {
        // ignore
      }
    }
  }, [])

  // Re-pintar marcadores cuando cambia el tab
  useEffect(() => {
    if (!mapReady) return
    const markerLayer = markerLayerRef.current
    const map = mapInstanceRef.current
    const L = LRef.current
    if (!markerLayer || !map || !L) return

    markerLayer.clearLayers()
    const color = COLOR_HEX[TAB_COLORS[tab]]

    const makeIcon = (hex: string) =>
      L.divIcon({
        html: `<div style="background:${hex};width:18px;height:18px;border-radius:9999px;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,.3);"></div>`,
        className: "",
        iconSize: [18, 18],
      })

    if (tab === "experiencias") {
      experiences.forEach((e) => {
        const [lat, lng] = offsetFor(e.id)
        L.marker([lat, lng], { icon: makeIcon(color) })
          .bindPopup(
            `<strong>${e.title}</strong><br/><span style="color:#555;font-size:12px">${e.description}</span><br/><a href="/que-hacer/${e.id}" style="color:#16a34a;font-weight:600">Ver detalle →</a>`,
          )
          .addTo(markerLayer)
      })
    } else if (tab === "eventos") {
      events.forEach((e) => {
        const [lat, lng] = offsetFor(e.id)
        const d = formatDate(e.date)
        L.marker([lat, lng], { icon: makeIcon(color) })
          .bindPopup(
            `<strong>${e.title}</strong><br/><span style="color:#555;font-size:12px">${d.full} · ${e.time} hs · ${e.location}</span><br/><a href="/eventos/${e.id}" style="color:#16a34a;font-weight:600">Ver detalle →</a>`,
          )
          .addTo(markerLayer)
      })
    } else if (tab === "alojamientos") {
      accommodations.forEach((a) => {
        const [lat, lng] = offsetFor(a.id)
        L.marker([lat, lng], { icon: makeIcon(color) })
          .bindPopup(
            `<strong>${a.name}</strong><br/><span style="color:#555;font-size:12px">${a.location}</span><br/><a href="/donde-alojarse/${a.id}" style="color:#16a34a;font-weight:600">Ver detalle →</a>`,
          )
          .addTo(markerLayer)
      })
    } else if (tab === "gastronomia") {
      restaurants.forEach((r) => {
        const [lat, lng] = offsetFor(r.id)
        L.marker([lat, lng], { icon: makeIcon(color) })
          .bindPopup(
            `<strong>${r.name}</strong><br/><span style="color:#555;font-size:12px">${r.schedule}</span><br/><a href="/donde-comer/${r.id}" style="color:#16a34a;font-weight:600">Ver detalle →</a>`,
          )
          .addTo(markerLayer)
      })
    } else if (tab === "deportes") {
      sportActivities.forEach((a) => {
        const [lat, lng] = offsetFor(a.id)
        L.marker([lat, lng], { icon: makeIcon(color) })
          .bindPopup(
            `<strong>${a.title}</strong><br/><span style="color:#555;font-size:12px">${a.location}</span><br/><a href="/deportes-eventos/${a.id}" style="color:#16a34a;font-weight:600">Ver detalle →</a>`,
          )
          .addTo(markerLayer)
      })
    }
  }, [tab, mapReady])

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-green text-white">
            <MapIcon className="h-4 w-4" />
          </span>
          <h2 className="font-heading text-2xl font-bold text-brand-green-dark sm:text-3xl">
            Mapa del sitio
          </h2>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Explorá los atractivos, alojamientos, restaurantes y actividades de Eldorado en el mapa.
        </p>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {TABS.map(({ value, label, Icon }) => (
          <button
            key={value}
            onClick={() => setTab(value)}
            className={`inline-flex items-center gap-2 rounded-full border-2 px-4 py-2 text-sm font-semibold transition-all ${
              tab === value
                ? "border-brand-green bg-brand-green text-white shadow-sm"
                : "border-border bg-card text-foreground/70 hover:border-brand-green/50 hover:text-brand-green"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div
            ref={mapRef}
            className="h-[480px] w-full overflow-hidden rounded-2xl border border-border bg-muted shadow-sm"
            aria-label="Mapa interactivo de Eldorado"
          >
            {!mapReady && !mapError && (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                Cargando mapa…
              </div>
            )}
            {mapError && (
              <div className="flex h-full items-center justify-center p-6 text-center text-sm text-muted-foreground">
                No pudimos cargar el mapa interactivo. Verificá tu conexión e intentá nuevamente.
              </div>
            )}
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            Datos del mapa &copy;{" "}
            <a
              href="https://www.openstreetmap.org/copyright"
              target="_blank"
              rel="noreferrer noopener"
              className="text-brand-green hover:underline"
            >
              OpenStreetMap
            </a>
            . Las ubicaciones son aproximadas.
          </p>
        </div>

        <aside className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h3 className="font-heading text-base font-bold text-brand-green-dark">
            {TABS.find((t) => t.value === tab)?.label}
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Hacé click en un pin del mapa o en un item de la lista para ver el detalle.
          </p>
          <ul className="mt-4 max-h-[420px] divide-y divide-border overflow-y-auto">
            {tab === "experiencias" &&
              experiences.map((e) => (
                <li key={e.id}>
                  <a
                    href={`/que-hacer/${e.id}`}
                    className="flex items-start gap-2 py-2.5 text-sm transition-colors hover:text-brand-green"
                  >
                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-green" />
                    <span className="line-clamp-1">{e.title}</span>
                  </a>
                </li>
              ))}
            {tab === "eventos" &&
              events.map((e) => (
                <li key={e.id}>
                  <a
                    href={`/eventos/${e.id}`}
                    className="flex items-start gap-2 py-2.5 text-sm transition-colors hover:text-brand-green"
                  >
                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-green" />
                    <span className="line-clamp-1">{e.title}</span>
                  </a>
                </li>
              ))}
            {tab === "alojamientos" &&
              accommodations.map((a) => (
                <li key={a.id}>
                  <a
                    href={`/donde-alojarse/${a.id}`}
                    className="flex items-start gap-2 py-2.5 text-sm transition-colors hover:text-brand-green"
                  >
                    <Phone className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-green" />
                    <span className="line-clamp-1">{a.name}</span>
                  </a>
                </li>
              ))}
            {tab === "gastronomia" &&
              restaurants.map((r) => (
                <li key={r.id}>
                  <a
                    href={`/donde-comer/${r.id}`}
                    className="flex items-start gap-2 py-2.5 text-sm transition-colors hover:text-brand-green"
                  >
                    <Utensils className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-green" />
                    <span className="line-clamp-1">{r.name}</span>
                  </a>
                </li>
              ))}
            {tab === "deportes" &&
              sportActivities.map((a) => (
                <li key={a.id}>
                  <a
                    href={`/deportes-eventos/${a.id}`}
                    className="flex items-start gap-2 py-2.5 text-sm transition-colors hover:text-brand-green"
                  >
                    <Trophy className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-green" />
                    <span className="line-clamp-1">{a.title}</span>
                  </a>
                </li>
              ))}
          </ul>
        </aside>
      </div>
    </section>
  )
}
