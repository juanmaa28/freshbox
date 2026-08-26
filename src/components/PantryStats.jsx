import { usePantry } from '../context/PantryContext'

// Segmentos de la barra de frescura, en orden de urgencia descendente.
// Los tonos son claros porque viven sobre el verde profundo del hero.
const SEGMENTS = [
  { id: 'expired', field: 'expired', i18nKey: 'stats.expired', bar: 'bg-danger-300', dot: 'bg-danger-300' },
  { id: 'soon', field: 'soon', i18nKey: 'stats.soon', bar: 'bg-caution-300', dot: 'bg-caution-300' },
  { id: 'fresh', field: 'fresh', i18nKey: 'stats.fresh', bar: 'bg-fresh-300', dot: 'bg-fresh-300' },
]

// Filtros de la lista. `all` abre el grupo completo; el resto reusa los buckets.
const FILTERS = [
  { id: 'all', field: 'total', i18nKey: 'stats.total', tone: 'text-gray-900 dark:text-gray-50' },
  { id: 'expired', field: 'expired', i18nKey: 'stats.expired', tone: 'text-danger-500 dark:text-danger-300' },
  { id: 'soon', field: 'soon', i18nKey: 'stats.soon', tone: 'text-caution-500 dark:text-caution-300' },
  { id: 'fresh', field: 'fresh', i18nKey: 'stats.fresh', tone: 'text-fresh-600 dark:text-fresh-400' },
]

/**
 * Hero de marca: una sola cifra grande y la barra de frescura, que responden de
 * un vistazo a "¿cómo está mi despensa?".
 *
 * Va dentro del scroll de Inicio, así que se desplaza y desaparece al bajar por
 * la lista. Es contexto, no un control: no hace falta tenerlo siempre delante.
 */
export function PantryHero({ stats }) {
  const { t } = usePantry()
  const total = stats.total || 1

  return (
    <section className="grain glow-hero relative overflow-hidden rounded-3xl bg-fresh-800 px-5 pb-4 pt-4 shadow-hero">
      <div className="relative z-10 flex flex-col gap-3.5">
        <span className="text-[10px] font-bold uppercase leading-none tracking-[0.16em] text-fresh-300/80">
          {t('home.heroTitle')}
        </span>

        <div className="flex items-end gap-2.5">
          <span className="tabular font-display text-[52px] font-semibold leading-[0.82] text-white">
            {stats.total}
          </span>
          <span className="mb-1 max-w-[9rem] text-[12.5px] font-medium leading-[1.25] text-fresh-100/80">
            {t('home.heroCaption')}
          </span>
        </div>

        {/* Barra de frescura: la proporción real de la despensa en una línea. */}
        <div className="flex h-2 w-full gap-1 overflow-hidden rounded-full bg-fresh-950/40">
            {/* Solo crea una franja si el grupo tiene productos; así no quedan
              segmentos vacíos dentro de la barra proporcional. */}
            {SEGMENTS.map(({ id, field, bar }) =>
            stats[field] > 0 ? (
              <span
                key={id}
                className={`animate-fill h-full rounded-full ${bar}`}
                style={{ width: `${(stats[field] / total) * 100}%` }}
              />
            ) : null
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1">
          {/* Muestra el conteo y la etiqueta de cada grupo junto a su color. */}
          {SEGMENTS.map(({ id, field, i18nKey, dot }) => (
            <span key={id} className="flex items-center gap-1.5">
              <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
              <span className="tabular text-[11px] font-semibold text-white/90">{stats[field]}</span>
              <span className="text-[11px] text-fresh-100/60">{t(i18nKey).toLowerCase()}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

/**
 * Control segmentado: convierte cada grupo en un filtro de la lista.
 *
 * A diferencia del hero, este sí queda fijo mientras se recorre la lista: es la
 * forma de cambiar de grupo sin tener que volver arriba.
 */
export function PantryFilter({ stats, selected, onSelect }) {
  const { t } = usePantry()

  return (
    <div
      role="group"
      aria-label={t('home.allPantry')}
      className="grid grid-cols-4 gap-1 rounded-2xl bg-gray-100 p-1 dark:bg-gray-900"
    >
      {/* Cada botón selecciona un grupo y muestra su conteo actualizado. */}
      {FILTERS.map(({ id, field, i18nKey, tone }) => {
        const isActive = selected === id
        return (
          <button
            key={id}
            type="button"
            onClick={() => onSelect?.(id)}
            aria-pressed={isActive}
            className={`press flex flex-col items-center justify-center rounded-xl px-1 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-fresh-600 ${
              isActive ? 'bg-white shadow-card dark:bg-gray-800' : 'hover:bg-white/60 dark:hover:bg-gray-800/50'
            }`}
          >
            <span
              className={`tabular font-display text-[19px] font-semibold leading-none ${
                isActive ? tone : 'text-gray-400 dark:text-gray-500'
              }`}
            >
              {stats[field]}
            </span>
            <span
              className={`mt-1.5 text-[9px] font-semibold uppercase leading-none tracking-[0.07em] ${
                isActive ? 'text-gray-500 dark:text-gray-400' : 'text-gray-400 dark:text-gray-600'
              }`}
            >
              {t(i18nKey)}
            </span>
          </button>
        )
      })}
    </div>
  )
}
