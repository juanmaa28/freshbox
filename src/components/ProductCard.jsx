import { categoryById } from '../data/categories'
import { daysLeft, urgencyOf, URGENCY_META, expiryText } from '../utils/dates'
import { usePantry } from '../context/PantryContext'
import { translateCategory } from '../utils/i18n'

// Tarjeta reutilizable para representar un producto en listas y búsquedas.
export default function ProductCard({ product, onClick }) {
  const cat = categoryById(product.category)
  const { settings, t } = usePantry()
  // El color y la franja de acento dependen de la urgencia calculada.
  const days = daysLeft(product.expiryDate)
  const urgency = urgencyOf(days)
  const meta = URGENCY_META[urgency]
  const isExpired = days < 0

  return (
    <button
      onClick={onClick}
      className="w-full text-left shrink-0 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-fresh-500 focus-visible:ring-offset-2"
    >
      <div className="flex items-stretch overflow-hidden rounded-xl border border-gray-100 bg-white shadow-card transition-colors hover:border-gray-200 active:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:active:bg-gray-800">
        {/* Franja de acento: comunica la urgencia sin añadir elementos sueltos. */}
        <div className={`w-1 shrink-0 ${meta.rail}`} />

        <div className="flex min-w-0 flex-1 items-center gap-3 px-3 py-3">
          {product.photo ? (
            <img src={product.photo} alt={product.name} className="h-11 w-11 shrink-0 rounded-lg object-cover" />
          ) : (
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${cat.color}`}>
              <cat.Icon size={19} strokeWidth={1.75} />
            </div>
          )}

          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <span className="truncate text-[15px] font-semibold tracking-[-0.01em] text-gray-900 dark:text-gray-50">
              {product.name}
            </span>
            {/* La categoría queda en un tono neutro para que resalte el vencimiento. */}
            <div className="flex min-w-0 items-center gap-1.5">
              <span className="truncate text-[11px] text-gray-400 dark:text-gray-500">
                {translateCategory(product.category, settings.language)}
              </span>
              <span className="text-gray-300 dark:text-gray-700">·</span>
              <span className={`shrink-0 text-[11px] font-medium ${meta.text}`}>
                {expiryText(days, settings.language)}
              </span>
            </div>
          </div>

          {/* Los vencidos usan una etiqueta sólida; el resto, la cuenta regresiva. */}
          {isExpired ? (
            <span className={`shrink-0 rounded-md border px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${meta.chip}`}>
              {t('common.overdueBadge')}
            </span>
          ) : (
            <div className="flex shrink-0 flex-col items-center leading-none">
              <span className={`tabular text-xl font-bold ${meta.text}`}>{days}</span>
              <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.08em] text-gray-400 dark:text-gray-500">
                {days === 1 ? t('common.day') : t('common.days')}
              </span>
            </div>
          )}
        </div>
      </div>
    </button>
  )
}
