export type FoodType =
  | "regional"
  | "parrilla"
  | "pizza"
  | "pesca"
  | "vegetariana"
  | "cafe"
  | "confiteria"

export type PriceRange = "economico" | "medio" | "alto"

export type Restaurant = {
  id: string
  name: string
  description: string
  image: string
  foodTypes: FoodType[]
  priceRange: PriceRange
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

export const restaurants: Restaurant[] = [
  {
    id: "la-casona",
    name: "La Casona",
    description:
      "Cocina regional misionera en un ambiente cálido, con platos típicos a base de yerba mate, mandioca y pescado de río.",
    image: "/images/costanera.png",
    foodTypes: ["regional", "pesca"],
    priceRange: "medio",
    services: { delivery: false, parking: true, airCon: true, wifi: true, kidFriendly: true },
    schedule: "Mar–Dom · 12:00–15:00 y 20:00–00:00",
    location: "Av. San Martín 850 – Km 8, Eldorado, Misiones",
    phone: "03751-421234",
    whatsapp: "3751-411223",
    instagram: "lacasona_eldo",
    signature: "Surubí a la parrilla con puré de mandioca",
  },
  {
    id: "el-tarasco",
    name: "El Tarasco",
    description:
      "Parrilla tradicional con cortes de carne de la región y achuras. Ambiente familiar y amplio estacionamiento.",
    image: "/images/act-rural.png",
    foodTypes: ["parrilla"],
    priceRange: "medio",
    services: { delivery: false, parking: true, airCon: true, wifi: true, kidFriendly: true },
    schedule: "Todos los días · 12:00–15:00 y 20:00–01:00",
    location: "Ruta Nacional 12 km 1540 – Km 6, Eldorado",
    phone: "03751-422110",
    instagram: "eltarasco_eldorado",
    signature: "Asado de tira con chimichurri regional",
  },
  {
    id: "pizzeria-don-remo",
    name: "Pizzería Don Remo",
    description:
      "Pizzas a la piedra, muzza, napolitana y especialidades de la casa. Masa madre fermentada 48 horas.",
    image: "/images/eventos-concert.png",
    foodTypes: ["pizza"],
    priceRange: "economico",
    services: { delivery: true, parking: false, airCon: true, wifi: true, kidFriendly: true },
    schedule: "Mar–Dom · 19:30–00:00",
    location: "Av. San Martín 1210 – Km 8, Eldorado",
    phone: "03751-422001",
    whatsapp: "3751-300100",
    instagram: "donremo.pizza",
  },
  {
    id: "resto-bar-mama-mia",
    name: "Resto Bar Mamá Mía",
    description:
      "Trattoria familiar con pastas frescas, risottos y una carta de vinos de la región.",
    image: "/images/costanera.png",
    foodTypes: ["pizza", "regional"],
    priceRange: "medio",
    services: { delivery: true, parking: true, airCon: true, wifi: true, kidFriendly: true },
    schedule: "Mar–Dom · 20:00–00:30",
    location: "Kennedy 75 – Km 9, Eldorado",
    phone: "03751-440022",
    instagram: "mamamia.eldorado",
    signature: "Ñoquis de mandioca con salsa de queso y nuez",
  },
  {
    id: "los-troperos",
    name: "Los Troperos",
    description:
      "Restaurante de campo con comida regional en abundancia: locro, guiso carrero, empanadas y tortas fritas.",
    image: "/images/act-rural.png",
    foodTypes: ["regional"],
    priceRange: "economico",
    services: { delivery: false, parking: true, airCon: false, wifi: false, kidFriendly: true },
    schedule: "Mié–Dom · 12:00–15:30",
    location: "Picada 12, Km 18, Eldorado, Misiones",
    phone: "03751-665110",
    instagram: "troperos.eldorado",
    signature: "Locro campero con queso criollo",
  },
  {
    id: "costa-parana",
    name: "Costa Paraná",
    description:
      "Sobre la costanera, ideal para comer pescado fresco del Paraná con vista al río. Amplia carta de tragos.",
    image: "/images/costanera.png",
    foodTypes: ["pesca", "regional"],
    priceRange: "alto",
    services: { delivery: false, parking: true, airCon: true, wifi: true, kidFriendly: false },
    schedule: "Jue–Dom · 12:00–15:00 y 20:00–01:00",
    location: "Costanera y Av. Paraná – Km 9, Eldorado",
    phone: "03751-423020",
    whatsapp: "3751-600200",
    instagram: "costaparana.eldo",
    signature: "Pacú al horno en hojas de banana",
  },
  {
    id: "verdeo-coffee",
    name: "Verdeo Coffee",
    description:
      "Café de especialidad, brunch vegetariano, opciones veganas y pastelería artesanal en un espacio moderno.",
    image: "/images/museo.png",
    foodTypes: ["cafe", "vegetariana"],
    priceRange: "medio",
    services: { delivery: true, parking: false, airCon: true, wifi: true, kidFriendly: true },
    schedule: "Lun–Sáb · 08:00–20:00 · Dom 09:00–13:00",
    location: "Av. San Martín 720 – Km 7, Eldorado",
    phone: "03751-422190",
    instagram: "verdeo.coffee",
    signature: "Brunch vegano con pan de masa madre",
  },
  {
    id: "confiteria-aurora",
    name: "Confitería Aurora",
    description:
      "Confitería histórica de Eldorado, famosa por sus medialunas, tortas caseras y desayunos completos.",
    image: "/images/eventos-concert.png",
    foodTypes: ["confiteria", "cafe"],
    priceRange: "economico",
    services: { delivery: false, parking: false, airCon: true, wifi: true, kidFriendly: true },
    schedule: "Todos los días · 07:00–21:00",
    location: "Av. San Martín 990 – Km 8, Eldorado",
    phone: "03751-421008",
    signature: "Medialunas de manteca y torta de coco",
  },
  {
    id: "casa-te",
    name: "Casa Té",
    description:
      "Casa de té y meriendas con blends propios de yerba mate y tortas regionales. Ambiente tranquilo y decoración con artesanías locales.",
    image: "/images/museo.png",
    foodTypes: ["cafe", "confiteria"],
    priceRange: "medio",
    services: { delivery: true, parking: false, airCon: true, wifi: true, kidFriendly: true },
    schedule: "Mié–Dom · 16:00–20:30",
    location: "Esperanza 220 – Km 9, Eldorado",
    whatsapp: "3751-550300",
    instagram: "casate.eldo",
    signature: "Té de yerba mate con torta de frutos rojos",
  },
  {
    id: "puesto-gringo",
    name: "Puesto del Gringo",
    description:
      "Comida criolla de autor, carnes ahumadas y embutidos regionales. Cena con música en vivo los fines de semana.",
    image: "/images/act-rural.png",
    foodTypes: ["parrilla", "regional"],
    priceRange: "medio",
    services: { delivery: false, parking: true, airCon: true, wifi: true, kidFriendly: true },
    schedule: "Jue–Sáb · 20:00–02:00",
    location: "Ruta Provincial 17 km 5, Eldorado",
    phone: "03751-557720",
    instagram: "puestodelgringo",
    signature: "Costillar ahumado 12 horas",
  },
  {
    id: "almendra",
    name: "Almendra",
    description:
      "Cocina vegetariana creativa con productos de estación de la huerta local. Carta 100% plant-based.",
    image: "/images/reserva-bird.png",
    foodTypes: ["vegetariana", "cafe"],
    priceRange: "medio",
    services: { delivery: true, parking: false, airCon: true, wifi: true, kidFriendly: true },
    schedule: "Mar–Sáb · 11:00–15:00 y 19:00–22:30",
    location: "Dr. Prieto 410, Eldorado",
    instagram: "almendra.eldo",
    signature: "Hamburguesa de poroto mung con alioli de palta",
  },
  {
    id: "puerto-cuevas",
    name: "Puerto Cuevas",
    description:
      "Restaurante a orillas del arroyo Piray Miní, especializado en truchas y surubí de la zona.",
    image: "/images/cuevas.png",
    foodTypes: ["pesca", "regional"],
    priceRange: "alto",
    services: { delivery: false, parking: true, airCon: false, wifi: true, kidFriendly: true },
    schedule: "Vie–Dom · 12:00–16:00",
    location: "Calle Nolde s/n – Km 3, Eldorado",
    phone: "3751-408200",
    instagram: "puerto.cuevas",
    signature: "Trucha arcoíris a la manteca de hierbas",
  },
]

export const foodTypeOptions = [
  { value: "regional", label: "Regional" },
  { value: "parrilla", label: "Parrilla" },
  { value: "pizza", label: "Pizza" },
  { value: "pesca", label: "Pescados" },
  { value: "vegetariana", label: "Vegetariana" },
  { value: "cafe", label: "Café / Brunch" },
  { value: "confiteria", label: "Confitería" },
] as const

export const priceRangeOptions = [
  { value: "economico", label: "Económico" },
  { value: "medio", label: "Precio medio" },
  { value: "alto", label: "Premium" },
] as const
