import { AdminTable, type FieldSchema } from "@/components/admin-table"
import { Compass } from "lucide-react"

const schema: FieldSchema = {
  displayKey: "title",
  imageKey: "image",
  fields: [
    { kind: "text", key: "id", label: "ID (slug)", required: true, placeholder: "saltos-mocona" },
    { kind: "text", key: "title", label: "Título", required: true },
    { kind: "textarea", key: "description", label: "Descripción", rows: 3 },
    { kind: "image", key: "image", label: "Imagen", placeholder: "/images/saltos-mocona.png" },
    {
      kind: "select",
      key: "category",
      label: "Categoría",
      options: [
        { value: "naturaleza", label: "Naturaleza" },
        { value: "aventura", label: "Aventura" },
        { value: "turismo-rural", label: "Turismo rural" },
        { value: "deportes", label: "Deportes" },
        { value: "cultura", label: "Cultura" },
        { value: "full-day", label: "Full day" },
      ],
    },
    {
      kind: "select",
      key: "duration",
      label: "Duración",
      options: [
        { value: "1h", label: "1 hora" },
        { value: "medio-dia", label: "Medio día" },
        { value: "dia-completo", label: "Día completo" },
      ],
    },
    { kind: "checkbox", key: "requiresReservation", label: "Requiere reserva" },
    { kind: "checkbox", key: "kidFriendly", label: "Apto niños" },
    { kind: "checkbox", key: "hasGuide", label: "Con guía" },
  ],
}

export default function AdminExperiencesPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <Compass className="h-4 w-4" />
          </span>
          <h1 className="font-heading text-2xl font-bold text-brand-green-dark sm:text-3xl">
            Qué hacer
          </h1>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Experiencias, aventuras y actividades de Eldorado. Cambios se reflejan al instante en el sitio.
        </p>
      </div>
      <AdminTable collection="experiences" schema={schema} />
    </div>
  )
}
