import { AdminTable, type FieldSchema } from "@/components/admin-table"
import { Trophy } from "lucide-react"

const schema: FieldSchema = {
  displayKey: "title",
  imageKey: "image",
  fields: [
    { kind: "text", key: "id", label: "ID (slug)", required: true },
    { kind: "text", key: "title", label: "Título", required: true },
    { kind: "textarea", key: "description", label: "Descripción", rows: 3 },
    { kind: "image", key: "image", label: "Imagen" },
    {
      kind: "multiselect",
      key: "disciplines",
      label: "Disciplinas",
      options: [
        { value: "futbol", label: "Fútbol" },
        { value: "rugby", label: "Rugby" },
        { value: "hockey", label: "Hockey" },
        { value: "basquet", label: "Básquet" },
        { value: "atletismo", label: "Atletismo" },
        { value: "ciclismo", label: "Ciclismo" },
        { value: "natacion", label: "Natación" },
        { value: "pesca", label: "Pesca" },
        { value: "kayak", label: "Kayak" },
        { value: "tenis", label: "Tenis" },
        { value: "paddel", label: "Paddel" },
      ],
    },
    {
      kind: "select",
      key: "category",
      label: "Categoría",
      options: [
        { value: "equipo", label: "Equipo" },
        { value: "individual", label: "Individual" },
        { value: "acuatico", label: "Acuático" },
        { value: "aventura", label: "Aventura" },
      ],
    },
    {
      kind: "select",
      key: "level",
      label: "Nivel",
      options: [
        { value: "todos", label: "Todos los niveles" },
        { value: "inicial", label: "Inicial" },
        { value: "intermedio", label: "Intermedio" },
        { value: "avanzado", label: "Avanzado" },
      ],
    },
    { kind: "text", key: "schedule", label: "Horario" },
    { kind: "text", key: "location", label: "Lugar" },
    { kind: "text", key: "contact", label: "Contacto / Instagram" },
  ],
}

export default function AdminSportActivitiesPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-orange-700">
            <Trophy className="h-4 w-4" />
          </span>
          <h1 className="font-heading text-2xl font-bold text-brand-green-dark sm:text-3xl">
            Deportes
          </h1>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Clubes, escuelas y academias deportivas.
        </p>
      </div>
      <AdminTable collection="sportActivities" schema={schema} />
    </div>
  )
}
