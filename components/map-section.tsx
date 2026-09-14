"use client"

import { useEffect, useRef, useState } from "react"
import {
  Map as MapIcon,
  Compass,
  Hotel,
  Utensils,
  Trophy,
  MapPin,
} from "lucide-react"
import type { MapCategory, MapPageContent } from "@/lib/home-content"

export type MapPlace = {
  id: string
  title: string
  description: string
  detail: string
  href: string
}

export type MapItems = Record<MapCategory, MapPlace[]>

const TABS: { value: MapCategory; Icon: typeof MapIcon }[] = [
  { value: "experiences", Icon: Compass },
  { value: "events", Icon: MapIcon },
  { value: "accommodations", Icon: Hotel },
  { value: "restaurants", Icon: Utensils },
  { value: "sportActivities", Icon: Trophy },
]

const COLORS: Record<MapCategory, string> = {
  experiences: "#10b981",
  events: "#f43f5e",
  accommodations: "#3b82f6",
  restaurants: "#f59e0b",
  sportActivities: "#f97316",
}

function hashCode(value: string): number {
  let hash = 0
  for (let index = 0; index < value.length; index++) {
    hash = (hash << 5) - hash + value.charCodeAt(index)
    hash |= 0
  }
  return Math.abs(hash)
}

function approximatePosition(id: string, center: [number, number]): [number, number] {
  const hash = hashCode(id)
  return [
    center[0] + ((hash % 100) - 50) / 1250,
    center[1] + (((hash >> 7) % 100) - 50) / 1250,
  ]
}

function escapeHtml(value: string): string {
  const entities: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }
  return value.replace(/[&<>"']/g, (character) => entities[character])
}

export function MapSection({
  content,
  items,
}: {
  content: MapPageContent
  items: MapItems
}) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markerLayerRef = useRef<any>(null)
  const leafletRef = useRef<any>(null)
  const [tab, setTab] = useState<MapCategory>("experiences")
  const [mapReady, setMapReady] = useState(false)
  const [mapError, setMapError] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined" || !mapRef.current) return
    let cancelled = false
    let map: any = null

    async function initialize() {
      try {
        const leafletModule = await import("leaflet")
        const L = leafletModule.default || leafletModule
        await import("leaflet/dist/leaflet.css")
        if (cancelled || !mapRef.current) return

        const iconRetinaUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png"
        const iconUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png"
        const shadowUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
        // @ts-ignore Leaflet's default icon helper is private but must be removed to set explicit URLs.
        delete L.Icon.Default.prototype._getIconUrl
        L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl })

        map = L.map(mapRef.current, {
          center: [content.map.centerLatitude, content.map.centerLongitude],
          zoom: content.map.zoom,
          scrollWheelZoom: false,
        })
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 19,
        }).addTo(map)

        mapInstanceRef.current = map
        markerLayerRef.current = L.layerGroup().addTo(map)
        leafletRef.current = L
        setMapReady(true)
      } catch (error) {
        console.error("Error cargando Leaflet:", error)
        if (!cancelled) setMapError(true)
      }
    }

    void initialize()
    return () => {
      cancelled = true
      try {
        map?.remove()
      } catch {
        // The map may already have been removed during route navigation.
      }
    }
  }, [content.map.centerLatitude, content.map.centerLongitude, content.map.zoom])

  useEffect(() => {
    if (!mapReady) return
    const markerLayer = markerLayerRef.current
    const L = leafletRef.current
    if (!markerLayer || !L) return

    markerLayer.clearLayers()
    const center: [number, number] = [content.map.centerLatitude, content.map.centerLongitude]
    const icon = L.divIcon({
      html: `<div style="background:${COLORS[tab]};width:18px;height:18px;border-radius:9999px;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,.3);"></div>`,
      className: "",
      iconSize: [18, 18],
    })

    for (const item of items[tab]) {
      const override = content.locations.find(
        (location) => location.category === tab && location.itemId === item.id,
      )
      const position = override
        ? [override.latitude, override.longitude] as [number, number]
        : approximatePosition(item.id, center)
      const popup = `<strong>${escapeHtml(item.title)}</strong><br/><span style="color:#555;font-size:12px">${escapeHtml(item.detail || item.description)}</span><br/><a href="${escapeHtml(item.href)}" style="color:#16a34a;font-weight:600">Ver detalle →</a>`
      L.marker(position, { icon }).bindPopup(popup).addTo(markerLayer)
    }
  }, [content.locations, content.map.centerLatitude, content.map.centerLongitude, items, mapReady, tab])

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-green text-white">
            <MapIcon className="h-4 w-4" />
          </span>
          <h2 className="font-heading text-2xl font-bold text-brand-green-dark sm:text-3xl">
            {content.map.sectionTitle}
          </h2>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{content.map.sectionDescription}</p>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {TABS.map(({ value, Icon }) => (
          <button
            key={value}
            type="button"
            onClick={() => setTab(value)}
            aria-pressed={tab === value}
            className={`inline-flex items-center gap-2 rounded-full border-2 px-4 py-2 text-sm font-semibold transition-all ${
              tab === value
                ? "border-brand-green bg-brand-green text-white shadow-sm"
                : "border-border bg-card text-foreground/70 hover:border-brand-green/50 hover:text-brand-green"
            }`}
          >
            <Icon className="h-4 w-4" />
            {content.tabs[value]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div
            ref={mapRef}
            className="h-[480px] w-full overflow-hidden rounded-2xl border border-border bg-muted shadow-sm"
            aria-label={content.map.mapAriaLabel}
          >
            {!mapReady && !mapError && (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                {content.map.loadingMessage}
              </div>
            )}
            {mapError && (
              <div className="flex h-full items-center justify-center p-6 text-center text-sm text-muted-foreground">
                {content.map.errorMessage}
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
            . {content.map.approximateLocationsNote}
          </p>
        </div>

        <aside className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h3 className="font-heading text-base font-bold text-brand-green-dark">
            {content.tabs[tab]}
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">{content.map.listInstruction}</p>
          <ul className="mt-4 max-h-[420px] divide-y divide-border overflow-y-auto">
            {items[tab].map((item) => (
              <li key={item.id}>
                <a
                  href={item.href}
                  className="flex items-start gap-2 py-2.5 text-sm transition-colors hover:text-brand-green"
                >
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-green" />
                  <span className="line-clamp-1">{item.title}</span>
                </a>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  )
}
