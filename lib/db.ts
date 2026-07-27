import { PrismaClient } from "@prisma/client"
import { PrismaNeon } from "@prisma/adapter-neon"

// Singleton — evita reinicializar el cliente en dev (HMR).
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL no está definida. Configurá .env con la connection string de Neon.",
    )
  }
  const adapter = new PrismaNeon({ connectionString })
  return new PrismaClient({ adapter })
}

export const prisma: PrismaClient =
  globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}

// ============================================================
//  Tipos compartidos con el resto del código
// ============================================================
export type Experience = {
  id: string
  title: string
  description: string
  image: string
  category: string
  duration: string
  requiresReservation: boolean
  kidFriendly: boolean
  hasGuide: boolean
}

export type EventItem = {
  id: string
  title: string
  description: string
  image: string
  type: string
  date: string
  time: string
  location: string
  isFree: boolean
  price?: number
  highlight?: boolean
}

export type Accommodation = {
  id: string
  name: string
  description: string
  image: string
  modalities: string[]
  services: { breakfast: boolean; pool: boolean; parking: boolean }
  fullServices: string[]
  capacity: { couples: boolean; families: boolean; sportsTeams: boolean }
  location: string
  phone?: string
  whatsapp?: string
  instagram?: string
  website?: string
}

export type Restaurant = {
  id: string
  name: string
  description: string
  image: string
  foodTypes: string[]
  priceRange: string
  services: {
    delivery: boolean
    parking: boolean
    airCon: boolean
    wifi: boolean
    kidFriendly: boolean
  }
  schedule: string
  location: string
  phone?: string
  whatsapp?: string
  instagram?: string
  signature?: string
}

export type SportActivity = {
  id: string
  title: string
  description: string
  image: string
  disciplines: string[]
  category: string
  level: string
  schedule: string
  location: string
  contact?: string
}

export type Collection =
  | "experiences"
  | "events"
  | "accommodations"
  | "restaurants"
  | "sportActivities"

export const COLLECTIONS: Collection[] = [
  "experiences",
  "events",
  "accommodations",
  "restaurants",
  "sportActivities",
]

// ============================================================
//  Lectura (la API pública que ya consumen las páginas)
// ============================================================
export async function readCollection<K extends Collection>(
  name: K,
): Promise<any[]> {
  switch (name) {
    case "experiences":
      return prisma.experience.findMany({ orderBy: { title: "asc" } })
    case "events":
      return prisma.event.findMany({ orderBy: { date: "asc" } })
    case "accommodations":
      return prisma.accommodation.findMany({ orderBy: { name: "asc" } })
    case "restaurants":
      return prisma.restaurant.findMany({ orderBy: { name: "asc" } })
    case "sportActivities":
      return prisma.sportActivity.findMany({ orderBy: { title: "asc" } })
  }
}

export async function readAll() {
  const [experiences, events, accommodations, restaurants, sportActivities] =
    await Promise.all([
      readCollection("experiences"),
      readCollection("events"),
      readCollection("accommodations"),
      readCollection("restaurants"),
      readCollection("sportActivities"),
    ])
  return { experiences, events, accommodations, restaurants, sportActivities }
}

export async function getCounts(): Promise<Record<Collection, number>> {
  const [experiences, events, accommodations, restaurants, sportActivities] =
    await Promise.all([
      prisma.experience.count(),
      prisma.event.count(),
      prisma.accommodation.count(),
      prisma.restaurant.count(),
      prisma.sportActivity.count(),
    ])
  return {
    experiences,
    events,
    accommodations,
    restaurants,
    sportActivities,
  }
}

// ============================================================
//  Escritura (usado por las API routes del admin)
// ============================================================
export async function upsertItem<K extends Collection>(
  collection: K,
  item: any,
): Promise<any> {
  const id = String(item.id).trim()
  if (!id) throw new Error("Falta el campo id")

  const data = sanitizeFor(collection, item)

  switch (collection) {
    case "experiences":
      return prisma.experience.upsert({
        where: { id },
        create: { id, ...data },
        update: data,
      })
    case "events":
      return prisma.event.upsert({
        where: { id },
        create: { id, ...data },
        update: data,
      })
    case "accommodations":
      return prisma.accommodation.upsert({
        where: { id },
        create: { id, ...data },
        update: data,
      })
    case "restaurants":
      return prisma.restaurant.upsert({
        where: { id },
        create: { id, ...data },
        update: data,
      })
    case "sportActivities":
      return prisma.sportActivity.upsert({
        where: { id },
        create: { id, ...data },
        update: data,
      })
  }
}

export async function deleteItem<K extends Collection>(
  collection: K,
  id: string,
): Promise<boolean> {
  switch (collection) {
    case "experiences":
      return !!(await prisma.experience.delete({ where: { id } }).catch(() => null))
    case "events":
      return !!(await prisma.event.delete({ where: { id } }).catch(() => null))
    case "accommodations":
      return !!(await prisma.accommodation.delete({ where: { id } }).catch(() => null))
    case "restaurants":
      return !!(await prisma.restaurant.delete({ where: { id } }).catch(() => null))
    case "sportActivities":
      return !!(await prisma.sportActivity.delete({ where: { id } }).catch(() => null))
  }
}

// ============================================================
//  Imágenes (binarios en Neon)
// ============================================================
export async function saveImage(opts: {
  filename: string
  mime: string
  bytes: Buffer
  width?: number
  height?: number
}) {
  return prisma.imageAsset.create({
    data: {
      filename: opts.filename,
      mime: opts.mime,
      bytes: opts.bytes,
      size: opts.bytes.length,
      width: opts.width,
      height: opts.height,
    },
  })
}

export async function getImage(id: string) {
  return prisma.imageAsset.findUnique({ where: { id } })
}

export async function listImages() {
  return prisma.imageAsset.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      filename: true,
      mime: true,
      size: true,
      width: true,
      height: true,
      createdAt: true,
    },
  })
}

// ============================================================
//  Helpers de sanitización por colección
// ============================================================
function sanitizeFor(collection: Collection, raw: any): any {
  const str = (v: any, fallback = "") =>
    v === undefined || v === null ? fallback : String(v)
  const num = (v: any) =>
    v === undefined || v === null || v === "" ? null : Number(v)
  const bool = (v: any) => v === true || v === "true"
  const arr = (v: any) =>
    Array.isArray(v) ? v.map((x) => String(x)) : []

  switch (collection) {
    case "experiences":
      return {
        title: str(raw.title),
        description: str(raw.description),
        image: str(raw.image),
        category: str(raw.category, "naturaleza"),
        duration: str(raw.duration, "1h"),
        requiresReservation: bool(raw.requiresReservation),
        kidFriendly: bool(raw.kidFriendly),
        hasGuide: bool(raw.hasGuide),
      }
    case "events":
      return {
        title: str(raw.title),
        description: str(raw.description),
        image: str(raw.image),
        type: str(raw.type, "cultural"),
        date: str(raw.date),
        time: str(raw.time, "20:00"),
        location: str(raw.location),
        isFree: bool(raw.isFree),
        price: raw.isFree ? null : num(raw.price),
        highlight: bool(raw.highlight),
      }
    case "accommodations":
      return {
        name: str(raw.name),
        description: str(raw.description),
        image: str(raw.image),
        modalities: arr(raw.modalities),
        services: {
          breakfast: bool(raw.services?.breakfast),
          pool: bool(raw.services?.pool),
          parking: bool(raw.services?.parking),
        },
        fullServices: arr(raw.fullServices),
        capacity: {
          couples: bool(raw.capacity?.couples),
          families: bool(raw.capacity?.families),
          sportsTeams: bool(raw.capacity?.sportsTeams),
        },
        location: str(raw.location),
        phone: raw.phone ? str(raw.phone) : null,
        whatsapp: raw.whatsapp ? str(raw.whatsapp) : null,
        instagram: raw.instagram ? str(raw.instagram) : null,
        website: raw.website ? str(raw.website) : null,
      }
    case "restaurants":
      return {
        name: str(raw.name),
        description: str(raw.description),
        image: str(raw.image),
        foodTypes: arr(raw.foodTypes),
        priceRange: str(raw.priceRange, "medio"),
        services: {
          delivery: bool(raw.services?.delivery),
          parking: bool(raw.services?.parking),
          airCon: bool(raw.services?.airCon),
          wifi: bool(raw.services?.wifi),
          kidFriendly: bool(raw.services?.kidFriendly),
        },
        schedule: str(raw.schedule),
        location: str(raw.location),
        phone: raw.phone ? str(raw.phone) : null,
        whatsapp: raw.whatsapp ? str(raw.whatsapp) : null,
        instagram: raw.instagram ? str(raw.instagram) : null,
        signature: raw.signature ? str(raw.signature) : null,
      }
    case "sportActivities":
      return {
        title: str(raw.title),
        description: str(raw.description),
        image: str(raw.image),
        disciplines: arr(raw.disciplines),
        category: str(raw.category, "equipo"),
        level: str(raw.level, "todos"),
        schedule: str(raw.schedule),
        location: str(raw.location),
        contact: raw.contact ? str(raw.contact) : null,
      }
  }
}

export function generateId(title: string): string {
  return (
    title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 48) +
    "-" +
    Date.now().toString(36).slice(-4)
  )
}
