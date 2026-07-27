import { CalendarDays } from "lucide-react"

export function EventsBanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6">
      <div className="relative overflow-hidden rounded-2xl bg-brand-teal">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="flex items-center gap-5 p-8 lg:p-10">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white">
              <CalendarDays className="h-8 w-8" />
            </span>
            <div className="text-white">
              <h2 className="font-heading text-2xl font-bold">
                Calendario de eventos
              </h2>
              <p className="mt-1 max-w-md text-sm leading-relaxed text-white/85">
                No te pierdas los eventos, festivales y actividades que se
                realizan durante todo el año en Eldorado.
              </p>
              <a
                href="/eventos"
                className="mt-5 inline-block rounded-full bg-brand-yellow px-6 py-3 text-sm font-semibold text-brand-green-dark shadow transition-transform hover:scale-[1.03]"
              >
                Ver calendario
              </a>
            </div>
          </div>
          <div className="relative hidden min-h-[200px] lg:block">
            <img
              src="/images/eventos-concert.png"
              alt="Festival de música en Eldorado"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-teal to-transparent" />
          </div>
        </div>
      </div>
    </section>
  )
}
