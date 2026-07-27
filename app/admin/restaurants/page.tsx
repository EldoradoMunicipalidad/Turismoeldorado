import { AdminTable, type FieldSchema } from "@/components/admin-table"
import { Utensils } from "lucide-react"

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
      key: "foodTypes",
      label: "Tipo de comida",
      options: [
        { value: "regional", label: "Regional" },
        { value: "parrilla", label: "Parrilla" },
        { value: "pizza", label: "Pizza" },
        { value: "pesca", label: "Pescados" },
        { value: "vegetariana", label: "Vegetariana" },
        { value: "cafe", label: "Café / Brunch" },
        { value: "confiteria", label: "Confitería" },
      ],
    },
    {
      kind: "select",
      key: "priceRange",
      label: "Rango de precio",
      options: [
        { value: "economico", label: "Económico" },
        { value: "medio", label: "Medio" },
        { value: "alto", label: "Premium" },
      ],
    },
    { kind: "text", key: "schedule", label: "Horario", placeholder: "Lun–Sáb · 20:00–00:00" },
    { kind: "text", key: "location", label: "Dirección" },
    { kind: "text", key: "phone", label: "Teléfono" },
    { kind: "text", key: "whatsapp", label: "WhatsApp" },
    { kind: "text", key: "instagram", label: "Instagram (sin @)" },
    { kind: "text", key: "signature", label: "Platillo recomendado" },
  ],
}

const groups = [
  {
    key: "services",
    label: "Servicios",
    fields: [
      { key: "delivery", label: "Delivery" },
      { key: "parking", label: "Estacionamiento" },
      { key: "airCon", label: "Aire acondicionado" },
      { key: "wifi", label: "WiFi" },
      { key: "kidFriendly", label: "Apto niños" },
    ],
  },
]

export default function AdminRestaurantsPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-700">
            <Utensils className="h-4 w-4" />
          </span>
          <h1 className="font-heading text-2xl font-bold text-brand-green-dark sm:text-3xl">
            Gastronomía
          </h1>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Restaurantes, cafés, confiterías y más.
        </p>
      </div>
      <AdminTable collection="restaurants" schema={schema} groups={groups} />
    </div>
  )
}
