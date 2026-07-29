"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, type FormEvent } from "react"
import { Lock, ShieldCheck, User } from "lucide-react"

export function LoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const next = params.get("next") || "/admin"

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(
          typeof data?.error === "string"
            ? data.error
            : "No se pudo iniciar sesión.",
        )
        return
      }
      router.push(next)
      router.refresh()
    } catch {
      setError("Error de red. Probá de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-6 flex flex-col items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-green text-white shadow-sm">
          <ShieldCheck className="h-6 w-6" />
        </span>
        <div className="text-center">
          <h1 className="font-heading text-xl font-bold text-brand-green-dark">
            Admin Eldorado
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Inicia sesión para editar el contenido del sitio
          </p>
        </div>
      </div>

      <form
        onSubmit={onSubmit}
        className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm"
      >
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium text-foreground">
            Usuario
          </span>
          <span className="relative block">
            <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              name="username"
              autoComplete="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none transition-colors focus-visible:border-brand-green focus-visible:ring-2 focus-visible:ring-brand-green/30"
              placeholder="admin"
            />
          </span>
        </label>

        <label className="block text-sm">
          <span className="mb-1.5 block font-medium text-foreground">
            Contraseña
          </span>
          <span className="relative block">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none transition-colors focus-visible:border-brand-green focus-visible:ring-2 focus-visible:ring-brand-green/30"
              placeholder="••••••••"
            />
          </span>
        </label>

        {error && (
          <p
            role="alert"
            className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs font-medium text-destructive"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-brand-green px-3 text-sm font-semibold text-white transition-colors hover:bg-brand-green-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/50 disabled:opacity-60"
        >
          {loading ? "Verificando..." : "Ingresar"}
        </button>

        <p className="text-center text-[10px] text-muted-foreground">
          Acceso restringido a personal autorizado.
        </p>
      </form>
    </div>
  )
}
