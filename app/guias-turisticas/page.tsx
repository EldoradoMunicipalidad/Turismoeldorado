import type { Metadata } from "next"
import {
  BookOpen,
  Download,
  Map,
  FileText,
  Shield,
  Camera,
  ArrowRight,
  Mail,
} from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export const metadata: Metadata = {
  title: "Guía turística",
  description:
    "Descargá la guía turística completa de Eldorado, Misiones. Mapas, recomendaciones, atractivos imperdibles, deportes y contactos útiles para tu visita.",
  alternates: { canonical: "/guias-turisticas" },
  openGraph: {
    title: "Guía turística — Eldorado",
    description:
      "Mapas, recomendaciones, atractivos imperdibles, deportes y contactos útiles para tu visita a Eldorado.",
    url: "/guias-turisticas",
  },
}

const secciones = [
  {
    icon: Map,
    title: "Mapa de la ciudad",
    desc: "Recorrido por los principales puntos de Eldorado, kilómetros y rutas de acceso.",
  },
  {
    icon: Camera,
    title: "Imperdibles",
    desc: "Saltos del Moconá, Reserva Delicia, Museo Cooperativo, Costanera y más.",
  },
  {
    icon: Shield,
    title: "Información útil",
    desc: "Emergencias, transporte, salud, recomendaciones para la selva y servicios.",
  },
  {
    icon: FileText,
    title: "Calendario de eventos",
    desc: "Festivales, competencias y actividades durante todo el año.",
  },
]

const enlaces = [
  {
    titulo: "Términos y condiciones",
    anchor: "terminos",
    texto:
      "El uso de esta guía y del sitio web está sujeto a los términos y condiciones del Municipio de Eldorado. La información publicada es de carácter orientativo y puede variar sin previo aviso. Las imágenes son ilustrativas.",
  },
  {
    titulo: "Política de privacidad",
    anchor: "privacidad",
    texto:
      "Los datos personales que se recaben a través de los formularios de este sitio se utilizan únicamente para responder consultas y enviar información turística. No se ceden a terceros. Para ejercer derechos de acceso, rectificación o supresión, escribir a turismo@eldorado.gob.ar.",
  },
]

export default function GuiasTuristicasPage() {
  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />

      <section className="relative overflow-hidden">
        <div className="relative min-h-[300px] sm:min-h-[360px]">
          <img
            src="/images/hero-waterfall.png"
            alt="Guía turística Eldorado"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-green-dark/85 via-brand-green-dark/50 to-transparent" />
          <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-10 pt-20 sm:px-6">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-yellow text-brand-green-dark">
                <BookOpen className="h-5 w-5" />
              </span>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-yellow">
                Guía turística
              </p>
            </div>
            <h1 className="mt-3 font-heading text-4xl font-bold text-white sm:text-5xl">
              Tu próxima aventura empieza acá
            </h1>
            <p className="mt-2 max-w-2xl text-base text-white/85">
              Descargá la guía completa de Eldorado o explorá sus secciones para planificar tu visita a la selva misionera.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="mailto:turismo@eldorado.gob.ar?subject=Solicitud%20guia%20turistica%20PDF&body=Hola%2C%20quisiera%20recibir%20la%20guia%20turistica%20de%20Eldorado%20en%20formato%20PDF."
                className="inline-flex items-center gap-2 rounded-full bg-brand-yellow px-6 py-3 text-sm font-semibold text-brand-green-dark shadow transition-transform hover:scale-[1.03]"
              >
                <Download className="h-4 w-4" />
                Descargar guía PDF
              </a>
              <a
                href="#secciones"
                className="inline-flex items-center gap-2 rounded-full bg-white/15 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/25"
              >
                Explorar secciones
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pt-10 sm:px-6">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="flex items-start gap-3 text-sm text-muted-foreground">
            <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" />
            <span>
              La guía completa en PDF se entrega por correo electrónico.
              Hacé click en <strong className="text-foreground">Descargar guía PDF</strong> y te
              abriremos tu cliente de correo con un mensaje pre-llenado a{" "}
              <a
                href="mailto:turismo@eldorado.gob.ar"
                className="font-semibold text-brand-green underline-offset-2 hover:underline"
              >
                turismo@eldorado.gob.ar
              </a>
              . Recibirás la descarga en tu casilla.
            </span>
          </p>
        </div>
      </section>

      <section id="secciones" className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="mb-6 flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-green text-white">
            <BookOpen className="h-4 w-4" />
          </span>
          <h2 className="font-heading text-2xl font-bold text-brand-green-dark sm:text-3xl">
            ¿Qué vas a encontrar?
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {secciones.map((s) => (
            <article
              key={s.title}
              className="group flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-green/10 text-brand-green">
                <s.icon className="h-6 w-6" />
              </span>
              <h3 className="font-heading text-base font-bold text-foreground">
                {s.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {s.desc}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {enlaces.map((e) => (
            <article
              key={e.anchor}
              id={e.anchor}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              <h2 className="font-heading text-lg font-bold text-brand-green-dark">
                {e.titulo}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {e.texto}
              </p>
            </article>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
