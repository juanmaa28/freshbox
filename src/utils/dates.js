const MS_PER_DAY = 24 * 60 * 60 * 1000

/** Días restantes hasta el vencimiento (0 = vence hoy, negativo = vencido). */
export function daysLeft(expiryDate) {
  // Se comparan fechas a medianoche para evitar errores por la hora actual.
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const expiry = new Date(expiryDate + 'T00:00:00')
  return Math.round((expiry - today) / MS_PER_DAY)
}

/** Nivel de urgencia según los días restantes. */
export function urgencyOf(days) {
  // El nivel se obtiene a partir de rangos simples de días restantes.
  if (days < 0) return 'expired'
  if (days <= 1) return 'critical'
  if (days <= 3) return 'high'
  if (days <= 5) return 'mid'
  return 'low'
}

/**
 * Estilos por nivel de urgencia.
 * `rail` es la pastilla de acento del borde izquierdo de cada tarjeta: comunica
 * el estado sin competir con el resto del contenido. `chip` agrupa fondo,
 * contorno y texto para etiquetas y avisos.
 *
 * El contorno va con `ring-1` en lugar de `border`: así el chip se puede
 * aplicar a cualquier elemento sin que su tamaño cambie por el grosor del borde.
 */
export const URGENCY_META = {
  expired: {
    rail: 'bg-danger-700',
    dot: 'bg-danger-700',
    text: 'text-danger-700 dark:text-danger-300',
    chip: 'bg-danger-50 ring-1 ring-danger-100 text-danger-700 dark:bg-danger-700/15 dark:ring-danger-700/40 dark:text-danger-300',
  },
  critical: {
    rail: 'bg-danger-500',
    dot: 'bg-danger-500',
    text: 'text-danger-500 dark:text-danger-300',
    chip: 'bg-danger-50 ring-1 ring-danger-100 text-danger-700 dark:bg-danger-500/15 dark:ring-danger-500/40 dark:text-danger-300',
  },
  high: {
    rail: 'bg-warn-500',
    dot: 'bg-warn-500',
    text: 'text-warn-500 dark:text-warn-300',
    chip: 'bg-warn-50 ring-1 ring-warn-100 text-warn-700 dark:bg-warn-500/15 dark:ring-warn-500/40 dark:text-warn-300',
  },
  mid: {
    rail: 'bg-caution-500',
    dot: 'bg-caution-500',
    text: 'text-caution-500 dark:text-caution-300',
    chip: 'bg-caution-50 ring-1 ring-caution-100 text-caution-700 dark:bg-caution-500/15 dark:ring-caution-500/40 dark:text-caution-300',
  },
  low: {
    rail: 'bg-fresh-500',
    dot: 'bg-fresh-500',
    text: 'text-fresh-600 dark:text-fresh-400',
    chip: 'bg-fresh-50 ring-1 ring-fresh-100 text-fresh-700 dark:bg-fresh-500/15 dark:ring-fresh-500/40 dark:text-fresh-300',
  },
}

/** Texto corto tipo "Vence hoy", "Vence mañana", "Vence en 4 días", "Venció hace 2 días". */
export function expiryText(days, language = 'Español') {
  // Genera una frase localizada para mostrar el estado del producto.
  if (language === 'English') {
    if (days < -1) return `Expired ${-days} days ago`
    if (days === -1) return 'Expired yesterday'
    if (days === 0) return 'Expires today'
    if (days === 1) return 'Expires tomorrow'
    return `Expires in ${days} days`
  }
  if (days < -1) return `Venció hace ${-days} días`
  if (days === -1) return 'Venció ayer'
  if (days === 0) return 'Vence hoy'
  if (days === 1) return 'Vence mañana'
  return `Vence en ${days} días`
}

const MONTHS_ES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']

/** "2026-08-19" → "19 ago 2026" */
export function formatDate(isoDate, language = 'Español') {
  if (!isoDate) return '—'
  const d = new Date(isoDate + 'T00:00:00')
  if (language === 'English') return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
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
