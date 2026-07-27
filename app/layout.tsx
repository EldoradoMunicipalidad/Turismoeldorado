import type { Metadata, Viewport } from "next"
import { Poppins, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
})
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
})

const SITE_URL = "https://turismoeldorado.gob.ar"
const SITE_NAME = "Turismo Eldorado Misiones"
const SITE_DESCRIPTION =
  "Descubrí la magia de la selva misionera: Saltos del Moconá, Reserva Delicia, kayak en el Paraná, cabañas, gastronomía regional y eventos durante todo el año. Eldorado, siempre cerca tuyo."
const SITE_KEYWORDS = [
  "turismo Eldorado",
  "Eldorado Misiones",
  "selva misionera",
  "Saltos del Moconá",
  "Reserva Delicia",
  "turismo rural Misiones",
  "costas del Paraná",
  "camping Misiones",
  "cabañas Eldorado",
  "festival de la selva",
  "turismo Argentina",
  "que hacer en Eldorado",
  "donde alojarse Eldorado",
  "donde comer Eldorado",
]

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Naturaleza, aventura y descanso`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  authors: [{ name: "Municipalidad de Eldorado" }],
  creator: "Municipalidad de Eldorado — Dirección de Turismo",
  publisher: "Municipalidad de Eldorado",

  applicationName: SITE_NAME,
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  // Iconos (Next detecta app/icon.png y app/apple-icon.png automáticamente)
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [{ url: "/apple-icon.png", type: "image/png", sizes: "180x180" }],
  },

  // OpenGraph (Facebook, LinkedIn, WhatsApp)
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Naturaleza, aventura y descanso`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/images/hero-waterfall.png",
        width: 1200,
        height: 630,
        alt: "Cascada en la selva misionera de Eldorado",
        type: "image/png",
      },
    ],
  },

  // Twitter / X
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Naturaleza, aventura y descanso`,
    description: SITE_DESCRIPTION,
    images: ["/images/hero-waterfall.png"],
  },

  // Idioma
  alternates: {
    canonical: SITE_URL,
    languages: {
      "es-AR": SITE_URL,
    },
  },

  // Categoría y clasificación
  category: "Travel & Tourism",
  classification: "Official tourism portal — Eldorado, Misiones, Argentina",

  // Verificación de propiedad (reemplazar con el código real de cada buscador)
  // verification: {
  //   google: "google-site-verification-code",
  // },
}

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es-AR"
      className={`${poppins.variable} ${inter.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
