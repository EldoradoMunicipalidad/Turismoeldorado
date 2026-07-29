import { fileURLToPath } from "node:url"

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone produce un bundle con solo lo necesario para producción,
  // incluyendo el servidor. Es lo que usa el Dockerfile para una imagen
  // final pequeña.
  output: "standalone",

  // Mismas opciones que ya estaban antes — preservamos el comportamiento previo
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },

  // El servidor standalone escucha en 0.0.0.0 dentro del contenedor.
  experimental: {
    serverActions: {
      bodySizeLimit: "8mb", // uploads de imagen del admin
    },
  },

  // Turbopack necesita un root explícito cuando hay otros lockfiles
  // en el árbol (ej: C:\Users\Damian\package-lock.json). Si no, intenta
  // tomar el padre como root y compila desde un subdirectorio virtual.
  turbopack: {
    root: fileURLToPath(new URL("./", import.meta.url)),
  },
}

export default nextConfig
