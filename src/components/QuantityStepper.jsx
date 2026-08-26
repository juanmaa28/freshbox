import { Minus, Plus } from 'lucide-react'
import { formatQuantity } from '../utils/quantity'

const btnCls =
  'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-colors hover:bg-gray-50 hover:border-gray-300 active:bg-gray-100 disabled:opacity-35 disabled:hover:bg-transparent disabled:hover:border-gray-200 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800'

/**
 * Control de cantidad con botones − y +.
 * El mínimo es 1: para dejar la despensa en cero está "Marcar como consumido".
 */
export default function QuantityStepper({ amount, unit, separator, onAdjust, decreaseLabel, increaseLabel }) {
  return (
    <div className="flex items-center gap-2">
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
      <span className="tabular min-w-[5rem] text-center text-sm font-semibold text-gray-900 dark:text-gray-100">
        {formatQuantity(amount, unit, separator)}
      </span>

      <button
        type="button"
        onClick={() => onAdjust(1)}
        aria-label={increaseLabel}
        className={btnCls}
      >
        <Plus size={14} strokeWidth={2.5} />
      </button>
    </div>
  )
}
