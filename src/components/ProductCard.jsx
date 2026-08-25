import { categoryById } from '../data/categories'
import { daysLeft, urgencyOf, URGENCY_META, expiryText } from '../utils/dates'

export default function ProductCard({ product, onClick }) {
  const cat = categoryById(product.category)
  const days = daysLeft(product.expiryDate)
  const urgency = urgencyOf(days)
  const meta = URGENCY_META[urgency]

  return (
    <button onClick={onClick} className="w-full text-left shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-fresh-500 focus-visible:ring-offset-2 rounded-lg">
      <div className="border border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-lg px-3 py-2.5 flex items-center gap-3 active:bg-gray-50 dark:active:bg-gray-800 transition-colors">
        {product.photo ? (
          <img src={product.photo} alt={product.name} className="w-10 h-10 rounded-md object-cover shrink-0" />
        ) : (
          <div className={`w-10 h-10 rounded-md flex items-center justify-center shrink-0 ${cat.color}`}>
            <cat.Icon size={18} strokeWidth={1.75} />
          </div>
        )}
        <div className="flex-1 flex flex-col gap-1 min-w-0">
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-50 truncate">{product.name}</span>
          <div className="flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
            <span className="text-[10px] text-gray-500 dark:text-gray-400">
              {cat.label} · {expiryText(days)}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className={`text-xs font-bold ${meta.text}`}>{days < 0 ? '¡Ya!' : `${days}d`}</span>
          <div className="w-8 h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
            <div
              className={`h-full rounded-full ${meta.bar}`}
              style={{ width: `${Math.max(12, Math.min(100, 100 - days * 12))}%` }}
            />
          </div>
        </div>
      </div>
    </button>
  )
}
