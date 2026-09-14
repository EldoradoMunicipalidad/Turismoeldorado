import { Phone, Mail, MapPin, ArrowRight, Heart } from "lucide-react"
import Link from "next/link"
import { LeafMark } from "@/components/logo"

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z" />
    </svg>
  )
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M21.6 7.2a2.7 2.7 0 0 0-1.9-1.9C18 4.8 12 4.8 12 4.8s-6 0-7.7.5A2.7 2.7 0 0 0 2.4 7.2 28 28 0 0 0 2 12a28 28 0 0 0 .4 4.8 2.7 2.7 0 0 0 1.9 1.9c1.7.5 7.7.5 7.7.5s6 0 7.7-.5a2.7 2.7 0 0 0 1.9-1.9A28 28 0 0 0 22 12a28 28 0 0 0-.4-4.8ZM10 15V9l5.2 3L10 15Z" />
    </svg>
  )
}

const enlaces = [
  { label: "Mapa del sitio", href: "/mapa" },
  { label: "Guía turística", href: "/guias-turisticas" },
  { label: "Términos y condiciones", href: "/guias-turisticas#terminos" },
  { label: "Política de privacidad", href: "/guias-turisticas#privacidad" },
]

const redes = [
  { label: "Facebook", href: "https://www.facebook.com/turismoeldorado", Icon: FacebookIcon },
  { label: "Instagram", href: "https://www.instagram.com/eldoradomisiones", Icon: InstagramIcon },
  { label: "YouTube", href: "https://www.youtube.com/@eldoradomisiones", Icon: YoutubeIcon },
]

export function SiteFooter() {
  return (
    <footer className="relative">
      {/* curved top divider */}
      <div className="h-12 bg-background">
        <svg
          viewBox="0 0 1440 48"
          preserveAspectRatio="none"
          className="h-12 w-full"
          aria-hidden="true"
        >
          <path
            d="M0 48 C 360 0, 1080 0, 1440 48 L 1440 48 L 0 48 Z"
            fill="oklch(0.4 0.09 155)"
          />
        </svg>
      </div>

      <div className="bg-brand-green-dark text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div>
              <Link href="/" aria-label="Inicio">
                <LeafMark />
              </Link>
              <p className="mt-4 text-sm text-white/70">
                Naturaleza que enamora
              </p>
            </div>

            {/* Enlaces */}
            <div>
              <h3 className="font-heading text-base font-semibold">
                Enlaces útiles
              </h3>
              <ul className="mt-4 space-y-2.5">
                {enlaces.map((e) => (
                  <li key={e.label}>
                    <a
                      href={e.href}
                      className="text-sm text-white/75 transition-colors hover:text-brand-yellow"
                    >
                      {e.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contacto */}
            <div>
              <h3 className="font-heading text-base font-semibold">Contacto</h3>
              <ul className="mt-4 space-y-3 text-sm text-white/75">
                <li>
                  <a
                    href="tel:+543751123456"
                    className="flex items-center gap-2.5 transition-colors hover:text-brand-yellow"
                  >
                    <Phone className="h-4 w-4 shrink-0 text-brand-yellow" />
                    +54 9 3751 123456
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:turismo@eldorado.gob.ar"
                    className="flex items-center gap-2.5 transition-colors hover:text-brand-yellow"
                  >
                    <Mail className="h-4 w-4 shrink-0 text-brand-yellow" />
                    turismo@eldorado.gob.ar
                  </a>
                </li>
                <li>
                  <a
                    href="/informacion-util#transporte"
                    className="flex items-center gap-2.5 transition-colors hover:text-brand-yellow"
                  >
                    <MapPin className="h-4 w-4 shrink-0 text-brand-yellow" />
                    Eldorado, Misiones, Argentina
                  </a>
                </li>
              </ul>
              <div className="mt-4 flex gap-2.5">
                {redes.map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={label}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-brand-yellow hover:text-brand-green-dark"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="font-heading text-base font-semibold">
                Suscribite a nuestro newsletter
              </h3>
              <p className="mt-4 text-sm text-white/75">
                Recibí novedades y promociones para tu próxima visita.
              </p>
              <form
                action="mailto:turismo@eldorado.gob.ar"
                method="post"
                encType="text/plain"
                className="mt-4 flex items-center gap-2 rounded-full bg-white p-1 pl-4"
              >
                <label htmlFor="newsletter-email" className="sr-only">
                  Tu correo electrónico
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  name="email"
                  required
                  placeholder="Tu correo electrónico"
                  className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />
                <button
                  type="submit"
                  aria-label="Suscribirse"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-yellow text-brand-green-dark transition-transform hover:scale-105"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-white/60 sm:flex-row sm:px-6">
            <p>© 2024 Turismo Eldorado - Todos los derechos reservados.</p>
            <p className="flex items-center gap-1.5">
              Desarrollado con
              <Heart className="h-3.5 w-3.5 fill-brand-yellow text-brand-yellow" />
              para Eldorado
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
