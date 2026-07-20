export type EventItem = {
  id: string
  title: string
  description: string
  image: string
  type: "cultural" | "deportivo"
  date: string
  time: string
  location: string
  isFree: boolean
  price?: number
  highlight?: boolean
}

export const events: EventItem[] = [
  {
    id: "festival-selva",
    title: "Festival de la Selva",
    description: "Música en vivo, gastronomía regional y artesanías en el corazón de la selva.",
    image: "/images/eventos-concert.png",
    type: "cultural",
    date: "2026-07-15",
    time: "20:00",
    location: "Costanera",
    isFree: true,
    highlight: true,
  },
  {
    id: "feria-artesanias",
    title: "Feria de Artesanías Misioneras",
    description: "Exposición y venta de productos artesanales locales y regionales.",
    image: "/images/museo.png",
    type: "cultural",
    date: "2026-07-22",
    time: "10:00",
    location: "Plaza central",
    isFree: true,
  },
  {
    id: "noche-yerba",
    title: "Noche de la Yerba Mate",
    description: "Celebración tradicional con productores, música y la mejor yerba de la región.",
    image: "/images/act-rural.png",
    type: "cultural",
    date: "2026-08-05",
    time: "19:00",
    location: "Centro de la ciudad",
    isFree: true,
  },
  {
    id: "maraton-eldorado",
    title: "Maratón Eldorado 21K",
    description: "La carrera más esperada del año, atravesando la selva y la costanera.",
    image: "/images/act-ciclismo.png",
    type: "deportivo",
    date: "2026-08-12",
    time: "07:00",
    location: "Costanera",
    isFree: false,
    price: 15000,
    highlight: true,
  },
  {
    id: "rally-bicicleta",
    title: "Rally Ciclista de la Selva",
    description: "Competencia de mountain bike por senderos de la selva misionera.",
    image: "/images/act-ciclismo.png",
    type: "deportivo",
    date: "2026-08-20",
    time: "09:00",
    location: "Reserva Delicia",
    isFree: false,
    price: 8000,
  },
  {
    id: "festival-cine",
    title: "Festival de Cine Regional",
    description: "Proyecciones de cortometrajes y documentales sobre la región.",
    image: "/images/cuevas.png",
    type: "cultural",
    date: "2026-08-28",
    time: "20:30",
    location: "Centro Cultural",
    isFree: true,
  },
  {
    id: "torneo-futbol",
    title: "Torneo Apertura de Fútbol",
    description: "Torneo local con equipos de toda la zona, entrada libre y gratuita.",
    image: "/images/act-trekking.png",
    type: "deportivo",
    date: "2026-09-02",
    time: "15:00",
    location: "Estadio Municipal",
    isFree: true,
  },
  {
    id: "concierto-sinfonico",
    title: "Concierto Sinfónico al Atardecer",
    description: "Orquesta regional interpretando clásicos y música popular argentina.",
    image: "/images/eventos-concert.png",
    type: "cultural",
    date: "2026-09-10",
    time: "18:00",
    location: "Anfiteatro Costanera",
    isFree: true,
    highlight: true,
  },
  {
    id: "kayak-tour",
    title: "Kayak Tour Competitivo",
    description: "Recorrido por el río Paraná, categoría amateur y profesional.",
    image: "/images/act-kayak.png",
    type: "deportivo",
    date: "2026-09-18",
    time: "08:00",
    location: "Río Paraná",
    isFree: false,
    price: 12000,
  },
  {
    id: "dia-tradiciones",
    title: "Día de las Tradiciones",
    description: "Desfile, música folklórica y comidas típicas en una jornada completa.",
    image: "/images/act-rural.png",
    type: "cultural",
    date: "2026-09-25",
    time: "11:00",
    location: "Centro y Costanera",
    isFree: true,
  },
  {
    id: "triatlon-selva",
    title: "Triatlón de la Selva",
    description: "Natación, ciclismo y running en un escenario único de naturaleza.",
    image: "/images/act-kayak.png",
    type: "deportivo",
    date: "2026-10-05",
    time: "07:30",
    location: "Costanera y Selva",
    isFree: false,
    price: 20000,
  },
  {
    id: "noche-museos",
    title: "Noche de los Museos",
    description: "Recorrido nocturno por los museos locales con actividades especiales.",
    image: "/images/museo.png",
    type: "cultural",
    date: "2026-10-15",
    time: "20:00",
    location: "Museo Cooperativo",
    isFree: true,
  },
]

export const eventTypes = [
  { value: "todos", label: "Todos" },
  { value: "cultural", label: "Culturales" },
  { value: "deportivo", label: "Deportivos" },
] as const

export const priceFilters = [
  { value: "todos", label: "Todos" },
  { value: "gratis", label: "Gratis" },
  { value: "pago", label: "Con entrada" },
] as const
