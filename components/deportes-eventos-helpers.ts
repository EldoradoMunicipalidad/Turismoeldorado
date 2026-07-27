const MONTHS = [
  "ENE", "FEB", "MAR", "ABR", "MAY", "JUN",
  "JUL", "AGO", "SEP", "OCT", "NOV", "DIC",
]

export function formatDate(dateStr: string): { day: string; month: string; full: string } {
  // Fallback defensivo para fechas inválidas o vacías.
  if (!dateStr) {
    return { day: "--", month: "---", full: "Fecha a confirmar" }
  }
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) {
    return { day: "--", month: "---", full: "Fecha a confirmar" }
  }
  const day = String(d.getDate()).padStart(2, "0")
  const month = MONTHS[d.getMonth()] ?? "---"
  const full = `${day} de ${month.toLowerCase()} ${d.getFullYear()}`
  return { day, month, full }
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(price)
}
