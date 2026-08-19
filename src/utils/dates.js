const MS_PER_DAY = 24 * 60 * 60 * 1000

/** Días restantes hasta el vencimiento (0 = vence hoy, negativo = vencido). */
export function daysLeft(expiryDate) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const expiry = new Date(expiryDate + 'T00:00:00')
  return Math.round((expiry - today) / MS_PER_DAY)
}

/** Nivel de urgencia según los días restantes. */
export function urgencyOf(days) {
  if (days < 0) return 'expired'
  if (days <= 1) return 'critical'
  if (days <= 3) return 'high'
  if (days <= 5) return 'mid'
  return 'low'
}

export const URGENCY_META = {
  expired: { label: 'Vencido', dot: 'bg-red-700', bar: 'bg-red-700', text: 'text-red-700 dark:text-red-400' },
  critical: { label: 'Crítico', dot: 'bg-red-500', bar: 'bg-red-500', text: 'text-red-600 dark:text-red-400' },
  high: { label: 'Urgente', dot: 'bg-orange-500', bar: 'bg-orange-500', text: 'text-orange-600 dark:text-orange-400' },
  mid: { label: 'Medio', dot: 'bg-amber-400', bar: 'bg-amber-400', text: 'text-amber-600 dark:text-amber-400' },
  low: { label: 'Bajo', dot: 'bg-fresh-500', bar: 'bg-fresh-500', text: 'text-fresh-600 dark:text-fresh-400' },
}

/** Texto corto tipo "Vence hoy", "Vence mañana", "Vence en 4 días", "Venció hace 2 días". */
export function expiryText(days) {
  if (days < -1) return `Venció hace ${-days} días`
  if (days === -1) return 'Venció ayer'
  if (days === 0) return 'Vence hoy'
  if (days === 1) return 'Vence mañana'
  return `Vence en ${days} días`
}

const MONTHS_ES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']

/** "2026-08-19" → "19 ago 2026" */
export function formatDate(isoDate) {
  if (!isoDate) return '—'
  const d = new Date(isoDate + 'T00:00:00')
  return `${d.getDate()} ${MONTHS_ES[d.getMonth()]} ${d.getFullYear()}`
}

/** Fecha de hoy en formato ISO yyyy-mm-dd (hora local). */
export function todayISO() {
  const d = new Date()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${mm}-${dd}`
}

/** Fecha de hoy + n días en formato ISO. */
export function daysFromNowISO(n) {
  const d = new Date()
  d.setDate(d.getDate() + n)
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${mm}-${dd}`
}
