import { AdminTable, type FieldSchema } from "@/components/admin-table"
import { Hotel } from "lucide-react"

const schema: FieldSchema = {
  displayKey: "name",
  imageKey: "image",
  fields: [
    { kind: "text", key: "id", label: "ID (slug)", required: true },
    { kind: "text", key: "name", label: "Nombre", required: true },
    { kind: "textarea", key: "description", label: "Descripción", rows: 3 },
    { kind: "image", key: "image", label: "Imagen" },
    {
      kind: "multiselect",
      key: "modalities",
      label: "Modalidades",
      options: [
        { value: "hotel", label: "Hotel" },
        { value: "apart", label: "Apart Hotel" },
        { value: "cabana", label: "Cabaña" },
        { value: "estancia", label: "Estancia" },
        { value: "lodge", label: "Lodge" },
        { value: "complejo", label: "Complejo" },
        { value: "camping", label: "Camping" },
      ],
    },
    { kind: "text", key: "location", label: "Dirección" },
    { kind: "text", key: "phone", label: "Teléfono", placeholder: "03751-..." },
    { kind: "text", key: "whatsapp", label: "WhatsApp", placeholder: "3751-..." },
    { kind: "text", key: "instagram", label: "Instagram (sin @)" },
    { kind: "text", key: "website", label: "Sitio web (sin https://)" },
    { kind: "list", key: "fullServices", label: "Servicios completos", placeholder: "WiFi, Piscina, ..." },
  ],
}

const groups = [
  {
    key: "services",
    label: "Servicios destacados",
    fields: [
      { key: "breakfast", label: "Desayuno" },
      { key: "pool", label: "Piscina" },
      { key: "parking", label: "Estacionamiento" },
    ],
  },
  {
    key: "capacity",
    label: "Capacidad",
    fields: [
      { key: "couples", label: "Parejas" },
      { key: "families", label: "Familias" },
      { key: "sportsTeams", label: "Equipos deportivos" },
    ],
  },
]

export default function AdminAccommodationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700">
            <Hotel className="h-4 w-4" />
          </span>
          <h1 className="font-heading text-2xl font-bold text-brand-green-dark sm:text-3xl">
            Alojamientos
          </h1>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Hoteles, cabañas, lodges y complejos de Eldorado.
        </p>
      </div>
      <AdminTable collection="accommodations" schema={schema} groups={groups} />
    </div>
  )
}
