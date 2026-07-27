import { events } from "@/components/eventos-data"

export type SportDiscipline =
  | "futbol"
  | "rugby"
  | "hockey"
  | "basquet"
  | "atletismo"
  | "ciclismo"
  | "natacion"
  | "pesca"
  | "kayak"
  | "tenis"
  | "paddel"

export type SportCategory = "equipo" | "individual" | "aventura" | "acuatico"

export type SportActivity = {
  id: string
  title: string
  description: string
  image: string
  disciplines: SportDiscipline[]
  category: SportCategory
  level: "inicial" | "intermedio" | "avanzado" | "todos"
  schedule: string
  location: string
  contact?: string
}

export const sportActivities: SportActivity[] = [
  {
    id: "club-eldorado-futbol",
    title: "Club Eldorado – Fútbol",
    description:
      "Liga local con categorías Sub 13, Sub 15, Sub 17, Primera y Veteranos. Entrenamientos y partidos durante todo el año.",
    image: "/images/act-trekking.png",
    disciplines: ["futbol"],
    category: "equipo",
    level: "todos",
    schedule: "Lun–Sáb · 16:00–22:00",
    location: "Estadio Municipal – Av. San Martín, Km 9",
    contact: "club_eldorado_futbol",
  },
  {
    id: "club-rugby-troncos",
    title: "Troncos Rugby Club",
    description:
      "Escuela de rugby con infantiles, juveniles y primera división. Entrenamientos en cancha propia con gimnasio.",
    image: "/images/act-ciclismo.png",
    disciplines: ["rugby"],
    category: "equipo",
    level: "todos",
    schedule: "Mar, Jue y Sáb · 19:00–22:00",
    location: "Predio Ruta 12 km 1548, Eldorado",
    contact: "troncos.rc",
  },
  {
    id: "hockey-eldo",
    title: "Hockey Eldorado",
    description:
      "Hockey sobre césped para todas las edades, con planteles femeninos y masculinos. Competencia regional y provincial.",
    image: "/images/act-trekking.png",
    disciplines: ["hockey"],
    category: "equipo",
    level: "todos",
    schedule: "Mar y Jue · 18:30–21:00",
    location: "Polideportivo Municipal, Eldorado",
  },
  {
    id: "club-basquet-eldo",
    title: "Club Básquet Eldorado",
    description:
      "Formación deportiva y competencia de básquet en categorías formativas y primera. Sede con cancha reglamentaria.",
    image: "/images/act-ciclismo.png",
    disciplines: ["basquet"],
    category: "equipo",
    level: "todos",
    schedule: "Lun–Vie · 18:00–22:00",
    location: "Av. San Martín 1500, Km 9, Eldorado",
  },
  {
    id: "atletismo-escuela",
    title: "Escuela Municipal de Atletismo",
    description:
      "Entrenamiento en pista para todas las edades: velocidad, fondo, salto y lanzamientos. Profesores especializados.",
    image: "/images/act-trekking.png",
    disciplines: ["atletismo"],
    category: "individual",
    level: "todos",
    schedule: "Lun, Mié y Vie · 17:00–20:00",
    location: "Pista Municipal de Atletismo",
  },
  {
    id: "ciclismo-club-misiones",
    title: "Ciclismo Club Misiones",
    description:
      "Club de ciclismo de ruta y mountain bike con salidas grupales todos los fines de semana. Eventos de rally y pruebas regionales.",
    image: "/images/act-ciclismo.png",
    disciplines: ["ciclismo"],
    category: "individual",
    level: "intermedio",
    schedule: "Sáb y Dom · 07:00–12:00",
    location: "Salida: Costanera, Km 9, Eldorado",
  },
  {
    id: "natacion-acuacenter",
    title: "AcuaCenter – Natación",
    description:
      "Escuela de natación para todas las edades en pileta climatizada. Clases para chicos, adultos y entrenamiento competitivo.",
    image: "/images/act-kayak.png",
    disciplines: ["natacion"],
    category: "acuatico",
    level: "todos",
    schedule: "Lun–Sáb · 08:00–21:00",
    location: "Av. Paraguay 220, Km 8, Eldorado",
  },
  {
    id: "club-pesca-deportiva",
    title: "Club de Pesca Deportiva Eldorado",
    description:
      "Pesca de dorado, surubí y pacú en el río Paraná. Torneos anuales y jornadas de pesca con devolución.",
    image: "/images/act-kayak.png",
    disciplines: ["pesca"],
    category: "aventura",
    level: "intermedio",
    schedule: "Sáb y Dom · 06:00–14:00",
    location: "Embarcadero Costanera, Km 9",
  },
  {
    id: "kayak-piray",
    title: "Kayak Piray",
    description:
      "Escuela y alquiler de kayaks en el arroyo Piray. Travesías guiadas, descenso y canopy aventura.",
    image: "/images/act-kayak.png",
    disciplines: ["kayak"],
    category: "acuatico",
    level: "todos",
    schedule: "Todos los días · 09:00–18:00",
    location: "Calle Nolde s/n – Km 3, Eldorado",
    contact: "kayak.piray",
  },
  {
    id: "tenis-paddle-eldo",
    title: "Tenis & Paddle Eldorado",
    description:
      "Canchas de polvo de ladrillo y paddle con clases individuales y grupales. Torneos y clinics para todos los niveles.",
    image: "/images/act-ciclismo.png",
    disciplines: ["tenis", "paddel"],
    category: "individual",
    level: "todos",
    schedule: "Lun–Dom · 08:00–22:00",
    location: "Av. San Martín 1800, Km 9, Eldorado",
  },
]

export const sportCategories = [
  { value: "equipo", label: "Deportes de equipo" },
  { value: "individual", label: "Deportes individuales" },
  { value: "acuatico", label: "Deportes acuáticos" },
  { value: "aventura", label: "Aventura" },
] as const

export const sportLevels = [
  { value: "todos", label: "Todos los niveles" },
  { value: "inicial", label: "Inicial" },
  { value: "intermedio", label: "Intermedio" },
  { value: "avanzado", label: "Avanzado" },
] as const

// Próximos eventos deportivos (subset de eventos con type="deportivo")
export const upcomingSportEvents = events
  .filter((e) => e.type === "deportivo")
  .sort((a, b) => a.date.localeCompare(b.date))
