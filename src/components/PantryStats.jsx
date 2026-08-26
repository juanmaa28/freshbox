import { usePantry } from '../context/PantryContext'

// Cada casilla combina el grupo de datos con su color semántico.
const TILES = [
  { id: 'all', field: 'total', i18nKey: 'stats.total', tone: 'text-gray-900 dark:text-gray-50', active: 'border-gray-900 dark:border-gray-100' },
  { id: 'expired', field: 'expired', i18nKey: 'stats.expired', tone: 'text-danger-500 dark:text-danger-300', active: 'border-danger-500' },
  { id: 'soon', field: 'soon', i18nKey: 'stats.soon', tone: 'text-warn-500 dark:text-warn-300', active: 'border-warn-500' },
  { id: 'fresh', field: 'fresh', i18nKey: 'stats.fresh', tone: 'text-fresh-600 dark:text-fresh-400', active: 'border-fresh-500' },
]

/**
 * Resumen de la despensa en cuatro cifras.
 * Si recibe `onSelect`, cada casilla funciona además como filtro de la lista.
 */
export default function PantryStats({ stats, selected, onSelect }) {
  const { t } = usePantry()

  return (
    <div className="grid grid-cols-4 gap-2">
      {TILES.map(({ id, field, i18nKey, tone, active }) => {
        const isActive = selected === id
        const content = (
          <>
            <span className={`tabular text-xl font-bold leading-none ${tone}`}>{stats[field]}</span>
            <span className="mt-1 text-[9px] font-semibold uppercase leading-tight tracking-[0.04em] text-gray-400 dark:text-gray-500">
              {t(i18nKey)}
            </span>
          </>
        )
        const base = `flex flex-col items-center rounded-xl border bg-white px-1 py-2.5 shadow-card dark:bg-gray-900 ${
          isActive ? active : 'border-gray-100 dark:border-gray-800'
        }`

        // Sin onSelect el bloque es solo informativo (por ejemplo, en el perfil).
        return onSelect ? (
          <button
            key={id}
            type="button"
            onClick={() => onSelect(id)}
            aria-pressed={isActive}
            className={`${base} transition-colors hover:border-gray-300 dark:hover:border-gray-600`}
          >
            {content}
          </button>
        ) : (
          <div key={id} className={base}>
            {content}
          </div>
        )
      })}
    </div>
  )
}
