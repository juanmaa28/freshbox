import { Minus, Plus } from 'lucide-react'
import { formatQuantity } from '../utils/quantity'

// Los botones viven dentro de la misma pastilla que la cifra: un solo objeto,
// no tres controles sueltos.
const btnCls =
  'press flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-gray-600 shadow-card ring-1 ring-gray-900/5 hover:text-fresh-700 disabled:pointer-events-none disabled:opacity-30 disabled:shadow-none dark:bg-gray-800 dark:text-gray-300 dark:ring-white/10 dark:hover:text-fresh-400'

/**
 * Control de cantidad con botones − y +.
 * El mínimo es 1: para dejar la despensa en cero está "Marcar como consumido".
 */
export default function QuantityStepper({ amount, unit, separator, onAdjust, decreaseLabel, increaseLabel }) {
  return (
    <div className="flex items-center gap-1.5 rounded-xl bg-gray-100 p-1 dark:bg-gray-900">
      <button
        type="button"
        onClick={() => onAdjust(-1)}
        disabled={amount <= 1}
        aria-label={decreaseLabel}
        className={btnCls}
      >
        <Minus size={14} strokeWidth={2.5} />
      </button>

      {/* El ancho mínimo evita que los botones salten al cambiar de 9 a 10. */}
      <span className="tabular min-w-[4.5rem] text-center text-[13.5px] font-semibold text-gray-900 dark:text-gray-100">
        {formatQuantity(amount, unit, separator)}
      </span>

      <button type="button" onClick={() => onAdjust(1)} aria-label={increaseLabel} className={btnCls}>
        <Plus size={14} strokeWidth={2.5} />
      </button>
    </div>
  )
}
