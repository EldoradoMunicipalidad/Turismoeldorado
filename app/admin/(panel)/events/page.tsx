import { AdminTable, type FieldSchema } from "@/components/admin-table"
import { CalendarDays } from "lucide-react"

const schema: FieldSchema = {
  displayKey: "title",
  imageKey: "image",
  fields: [
    { kind: "text", key: "id", label: "ID (slug)", required: true, placeholder: "festival-selva" },
    { kind: "text", key: "title", label: "Título", required: true },
    { kind: "textarea", key: "description", label: "Descripción", rows: 3 },
    { kind: "image", key: "image", label: "Imagen" },
    {
      kind: "select",
      key: "type",
      label: "Tipo",
      options: [
        { value: "cultural", label: "Cultural" },
        { value: "deportivo", label: "Deportivo" },
      ],
    },
    { kind: "text", key: "date", label: "Fecha (YYYY-MM-DD)", placeholder: "2026-09-15" },
    { kind: "text", key: "time", label: "Hora (HH:MM)", placeholder: "20:00" },
    { kind: "text", key: "location", label: "Lugar" },
    { kind: "checkbox", key: "isFree", label: "Entrada gratuita" },
    { kind: "number", key: "price", label: "Precio (ARS)", min: 0, step: 100 },
    { kind: "checkbox", key: "highlight", label: "Destacado" },
  ],
}

export default function AdminEventsPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-100 text-rose-700">
            <CalendarDays className="h-4 w-4" />
          </span>
          <h1 className="font-heading text-2xl font-bold text-brand-green-dark sm:text-3xl">
            Eventos
          </h1>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Calendario cultural y deportivo. Los próximos eventos aparecen en la portada según la configuración del Home.
        </p>
      </div>
      <AdminTable collection="events" schema={schema} />
    </div>
  )
}
