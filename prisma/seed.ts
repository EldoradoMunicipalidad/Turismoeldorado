import "dotenv/config"
import { prisma, type Experience, type EventItem, type Accommodation, type Restaurant, type SportActivity } from "../lib/db"
import { experiences as exp } from "../components/que-hacer-data"
import { events as ev } from "../components/eventos-data"
import { accommodations as acc } from "../components/donde-alojarse-data"
import { restaurants as res } from "../components/donde-comer-data"
import { sportActivities as sport } from "../components/deportes-eventos-data"

async function main() {
  console.log("Limpiando tablas...")
  await prisma.experience.deleteMany()
  await prisma.event.deleteMany()
  await prisma.accommodation.deleteMany()
  await prisma.restaurant.deleteMany()
  await prisma.sportActivity.deleteMany()

  console.log(`Cargando ${exp.length} experiencias...`)
  for (const e of exp) {
    await prisma.experience.create({
      data: {
        id: e.id,
        title: e.title,
        description: e.description,
        image: e.image,
        category: e.category,
        duration: e.duration,
        requiresReservation: e.requiresReservation,
        kidFriendly: e.kidFriendly,
        hasGuide: e.hasGuide,
      },
    })
  }

  console.log(`Cargando ${ev.length} eventos...`)
  for (const e of ev) {
    await prisma.event.create({
      data: {
        id: e.id,
        title: e.title,
        description: e.description,
        image: e.image,
        type: e.type,
        date: e.date,
        time: e.time,
        location: e.location,
        isFree: e.isFree,
        price: e.price ?? null,
        highlight: e.highlight ?? false,
      },
    })
  }

  console.log(`Cargando ${acc.length} alojamientos...`)
  for (const a of acc) {
    await prisma.accommodation.create({
      data: {
        id: a.id,
        name: a.name,
        description: a.description,
        image: a.image,
        modalities: a.modalities,
        services: a.services as any,
        fullServices: a.fullServices,
        capacity: a.capacity as any,
        location: a.location,
        phone: a.phone ?? null,
        whatsapp: a.whatsapp ?? null,
        instagram: a.instagram ?? null,
        website: a.website ?? null,
      },
    })
  }

  console.log(`Cargando ${res.length} restaurantes...`)
  for (const r of res) {
    await prisma.restaurant.create({
      data: {
        id: r.id,
        name: r.name,
        description: r.description,
        image: r.image,
        foodTypes: r.foodTypes,
        priceRange: r.priceRange,
        services: r.services as any,
        schedule: r.schedule,
        location: r.location,
        phone: r.phone ?? null,
        whatsapp: r.whatsapp ?? null,
        instagram: r.instagram ?? null,
        signature: r.signature ?? null,
      },
    })
  }

  console.log(`Cargando ${sport.length} actividades deportivas...`)
  for (const s of sport) {
    await prisma.sportActivity.create({
      data: {
        id: s.id,
        title: s.title,
        description: s.description,
        image: s.image,
        disciplines: s.disciplines,
        category: s.category,
        level: s.level,
        schedule: s.schedule,
        location: s.location,
        contact: s.contact ?? null,
      },
    })
  }

  const counts = {
    experiences: await prisma.experience.count(),
    events: await prisma.event.count(),
    accommodations: await prisma.accommodation.count(),
    restaurants: await prisma.restaurant.count(),
    sportActivities: await prisma.sportActivity.count(),
  }
  console.log("Seed completo:", counts)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
