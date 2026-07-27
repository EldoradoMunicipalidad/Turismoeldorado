import type { Metadata } from "next"
import {
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  Clock,
  AlertTriangle,
  Stethoscope,
  Siren,
  ShieldCheck,
  CreditCard,
  Wifi,
  Plug,
  Globe,
  CloudSun,
  Languages,
  HeartPulse,
  TreePine,
  Info,
  Building2,
} from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export const metadata: Metadata = {
  title: "Información útil",
  description:
    "Teléfonos de emergencia, transporte, salud, seguridad, clima y recomendaciones para tu visita a Eldorado, Misiones. Todo lo que necesitás saber antes de viajar.",
  alternates: { canonical: "/informacion-util" },
  openGraph: {
    title: "Información útil — Eldorado",
    description:
      "Teléfonos de emergencia, transporte, salud, seguridad y recomendaciones para tu visita a Eldorado.",
    url: "/informacion-util",
  },
}

export default function InformacionUtilPage() {
  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />

      <section className="relative overflow-hidden">
        <div className="relative min-h-[260px] sm:min-h-[300px]">
          <img
            src="/images/museo.png"
            alt="Información útil Eldorado"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-green-dark/85 via-brand-green-dark/50 to-transparent" />
          <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-10 pt-20 sm:px-6">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-yellow text-brand-green-dark">
                <Info className="h-5 w-5" />
              </span>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-yellow">
                Información útil
              </p>
            </div>
            <h1 className="mt-3 font-heading text-4xl font-bold text-white sm:text-5xl">
              Todo lo que necesitás saber
            </h1>
            <p className="mt-2 max-w-lg text-base text-white/85">
              Teléfonos de emergencia, transporte, salud, clima y recomendaciones para tu visita a Eldorado.
            </p>
          </div>
        </div>
      </section>

      {/* Emergencias */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="mb-6 flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white">
            <Siren className="h-4 w-4" />
          </span>
          <h2 className="font-heading text-2xl font-bold text-brand-green-dark sm:text-3xl">
            Teléfonos de emergencia
          </h2>
        </div>
        <p className="mb-6 text-sm text-muted-foreground">
          Mantené estos números a mano durante tu estadía.
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {emergencias.map((e) => (
            <ContactCard key={e.name} icon={e.icon} name={e.name} detail={e.detail} tel={e.tel} />
          ))}
        </div>
      </section>

      {/* Transporte */}
      <section id="transporte" className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="mb-6 flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-green text-white">
            <MapPin className="h-4 w-4" />
          </span>
          <h2 className="font-heading text-2xl font-bold text-brand-green-dark sm:text-3xl">
            Cómo llegar y moverte
          </h2>
        </div>
        <p className="mb-6 text-sm text-muted-foreground">
          Opciones para llegar y recorrer Eldorado y la zona.
        </p>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {transporte.map((t) => (
            <article
              key={t.title}
              className="group flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-green/10 text-brand-green">
                <t.icon className="h-6 w-6" />
              </span>
              <h3 className="font-heading text-base font-bold text-foreground">
                {t.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{t.detail}</p>
              {t.address && (
                <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-green" />
                  {t.address}
                </p>
              )}
              {t.tel && (
                <a
                  href={`tel:${t.tel.replace(/[^0-9]/g, "")}`}
                  className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-brand-green transition-colors hover:text-brand-green-dark"
                >
                  <Phone className="h-3.5 w-3.5" />
                  {t.tel}
                </a>
              )}
            </article>
          ))}
        </div>
      </section>

      {/* Municipalidad / informes */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="mb-6 flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-green text-white">
            <Building2 className="h-4 w-4" />
          </span>
          <h2 className="font-heading text-2xl font-bold text-brand-green-dark sm:text-3xl">
            Municipalidad e informes
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {municipalidad.map((m) => (
            <div
              key={m.label}
              className="flex flex-col gap-1.5 rounded-2xl border border-border bg-card p-4 shadow-sm"
            >
              <h3 className="font-heading text-sm font-bold text-foreground">{m.label}</h3>
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3 shrink-0 text-brand-green" />
                {m.detail}
              </p>
              <a
                href={`tel:${m.tel.replace(/[^0-9]/g, "")}`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-green"
              >
                <Phone className="h-3 w-3" />
                {m.tel}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Info general */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="mb-6 flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-green text-white">
            <Info className="h-4 w-4" />
          </span>
          <h2 className="font-heading text-2xl font-bold text-brand-green-dark sm:text-3xl">
            Datos prácticos
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {info.map((b) => (
            <article
              key={b.title}
              className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-green text-white">
                  <b.icon className="h-5 w-5" />
                </span>
                <h3 className="font-heading text-base font-bold text-foreground">
                  {b.title}
                </h3>
              </div>
              <ul className="space-y-1.5 text-sm leading-relaxed text-muted-foreground">
                {b.items.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-green" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* Enlaces externos */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="rounded-2xl bg-brand-green-dark p-8 text-white sm:p-10">
          <h2 className="font-heading text-2xl font-bold">Enlaces oficiales</h2>
          <p className="mt-2 text-sm text-white/80">
            Para más información, consultá los sitios oficiales.
          </p>
          <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {enlacesExternos.map((e) => (
              <li key={e.url}>
                <a
                  href={e.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-3 text-sm font-medium transition-colors hover:bg-white/20"
                >
                  <Globe className="h-4 w-4 text-brand-yellow" />
                  {e.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}

const emergencias = [
  {
    icon: Siren,
    name: "Emergencias (911)",
    detail: "Policía · Bomberos · Ambulancia",
    tel: "911",
  },
  {
    icon: ShieldCheck,
    name: "Comisaría 1ª Eldorado",
    detail: "Av. San Martín 850, Km 8",
    tel: "03751-422222",
  },
  {
    icon: ShieldCheck,
    name: "Comisaría de la Mujer",
    detail: "Atención y denuncias 24 h",
    tel: "0800-666-6853",
  },
  {
    icon: HeartPulse,
    name: "Hospital Samic Eldorado",
    detail: "Av. San Martín Km 9 – Guardia 24 h",
    tel: "03751-421500",
  },
  {
    icon: Stethoscope,
    name: "Centro de Salud Municipal",
    detail: "Atención primaria",
    tel: "03751-421880",
  },
  {
    icon: AlertTriangle,
    name: "Defensa Civil Eldorado",
    detail: "Asistencia ante emergencias climáticas",
    tel: "03751-421300",
  },
  {
    icon: AlertTriangle,
    name: "Bomberos Voluntarios",
    detail: "Incendios y rescates",
    tel: "100",
  },
  {
    icon: ShieldCheck,
    name: "Guardia Urbana Municipal",
    detail: "Patrullaje urbano y tránsito",
    tel: "03751-422110",
  },
]

const transporte = [
  {
    icon: MapPin,
    title: "Terminal de Ómnibus",
    detail:
      "Servicios diarios a Posadas, Iguazú, Buenos Aires y principales destinos del país.",
    address: "Av. San Martín y Belgrano, Km 8",
    tel: "03751-422020",
  },
  {
    icon: Globe,
    title: "Aeropuerto Libertador General San Martín",
    detail:
      "A 90 km de Eldorado (Posadas). Conexión aérea a Buenos Aires y principales ciudades.",
    address: "Ruta Nacional 12, Posadas, Misiones",
    tel: "0376-444-0235",
  },
  {
    icon: Clock,
    title: "Rent a Car",
    detail:
      "Varias empresas locales con oficinas en el centro y la terminal de ómnibus.",
    address: "Centro, Km 8",
  },
  {
    icon: Clock,
    title: "Remises Eldorado",
    detail:
      "Servicio de remises 24 h, tarifas locales y a localidades vecinas.",
    tel: "03751-424242",
  },
  {
    icon: MapPin,
    title: "Transporte Urbano",
    detail:
      "Líneas de colectivo que conectan los distintos kilómetros y barrios de la ciudad.",
  },
  {
    icon: MapPin,
    title: "Estaciones de servicio",
    detail:
      "YPF, Shell y Axion sobre Ruta Nacional 12 y Av. San Martín. Atención 24 h.",
  },
]

const municipalidad = [
  { label: "Municipalidad de Eldorado", detail: "Av. San Martín 800, Km 8", tel: "03751-421001" },
  { label: "Dirección de Turismo", detail: "Av. San Martín 800, Km 8", tel: "03751-421002" },
  { label: "Secretaría de Cultura", detail: "Centro Cultural, Km 9", tel: "03751-421555" },
  { label: "Oficina de Informes Turísticos", detail: "Costanera, Km 9", tel: "03751-421999" },
]

const info = [
  {
    icon: CloudSun,
    title: "Clima",
    items: [
      "Tropical sin estación seca. Promedio anual: 20–24°C.",
      "Verano caluroso y húmedo (dic–mar). Ideal para paseos por ríos.",
      "Lluvias frecuentes en cualquier época, especialmente de octubre a abril.",
      "Llevar repelente de insectos y protector solar todo el año.",
    ],
  },
  {
    icon: CreditCard,
    title: "Moneda y pagos",
    items: [
      "Moneda oficial: peso argentino (ARS).",
      "Efectivo recomendado en ferias, puestos rurales y pequeños locales.",
      "Tarjetas (débito/crédito) aceptadas en hoteles, restaurantes grandes y estaciones de servicio.",
      "Cajeros automáticos en el centro y la costanera (Red Link y Bapro).",
    ],
  },
  {
    icon: Languages,
    title: "Idioma",
    items: [
      "Idioma oficial: español.",
      "En el norte de Misiones se escuchan también el guaraní y el portugués (zona fronteriza con Brasil).",
    ],
  },
  {
    icon: Clock,
    title: "Horarios comerciales",
    items: [
      "Comercios: lunes a sábado 9:00–13:00 y 17:00–21:00.",
      "Supermercados y estaciones de servicio: atención 24 h.",
      "Restaurantes: varía; en general cena desde las 20:00.",
    ],
  },
  {
    icon: Plug,
    title: "Electricidad",
    items: [
      "Tensión: 220 V / 50 Hz.",
      "Enchufes tipo I (tres patas planas, en línea). Recomendable llevar adaptador.",
    ],
  },
  {
    icon: Wifi,
    title: "Conectividad",
    items: [
      "WiFi gratuito en plazas, costanera, terminal y edificios municipales.",
      "Cobertura 4G en zonas urbanas. Señal limitada en reservas y selva.",
    ],
  },
  {
    icon: HeartPulse,
    title: "Salud y vacunas",
    items: [
      "Vacuna contra fiebre amarilla recomendada para zonas de selva.",
      "Profilaxis contra malaria no requerida para esta zona.",
      "Repelente de insectos esencial — dengue y leishmaniasis presentes en la región.",
      "Agua: se recomienda consumir agua embotellada en zonas rurales.",
    ],
  },
  {
    icon: TreePine,
    title: "Recomendaciones para la selva",
    items: [
      "No caminar solo por senderos. Contratar guías habilitados.",
      "Ropa clara, calzado cerrado y repelente siempre.",
      "No alimentar ni acercarse a la fauna silvestre.",
      "Respetar las áreas protegidas: está prohibido hacer fuego fuera de los fogones habilitados.",
    ],
  },
  {
    icon: Globe,
    title: "Embajadas y consulados",
    items: [
      "Brasil: Consulado en Posadas, Av. Roque Pérez 1626, +54 376 442-3464.",
      "Paraguay: Consulado en Posadas, Av. Costanera y Tucumán.",
      "Para otras nacionalidades, consultar consulados en Buenos Aires antes de viajar.",
    ],
  },
]

const enlacesExternos = [
  { label: "Municipalidad de Eldorado", url: "https://eldorado.gob.ar" },
  { label: "Turismo Misiones (Gobierno Provincial)", url: "https://misiones.tur.ar" },
  { label: "Pronóstico extendido", url: "https://www.smn.gob.ar" },
  { label: "Argentina Travel", url: "https://www.argentina.gob.ar/turismoydeportes" },
]

function ContactCard({
  icon: Icon,
  name,
  detail,
  tel,
}: {
  icon: typeof Phone
  name: string
  detail: string
  tel: string
}) {
  return (
    <div className="flex flex-col gap-1.5 rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-700">
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-heading text-sm font-bold text-foreground">{name}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">{detail}</p>
        </div>
      </div>
      <a
        href={`tel:${tel.replace(/[^0-9]/g, "")}`}
        className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-green px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-green-dark"
      >
        <Phone className="h-3.5 w-3.5" />
        {tel}
      </a>
    </div>
  )
}
