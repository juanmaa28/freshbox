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
      className="press group w-full shrink-0 text-left rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-fresh-600 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 dark:focus-visible:ring-offset-gray-950"
    >
      {/* Sin borde duro: la tarjeta se apoya en una sombra teñida y un filo de
          1px casi invisible. El borde vuelve solo cuando el producto ya venció. */}
      <div
        className={`relative flex items-stretch overflow-hidden rounded-2xl shadow-card ring-1 transition-shadow group-hover:shadow-raised ${
          isExpired
            ? 'bg-danger-50 ring-danger-100 dark:bg-danger-700/10 dark:ring-danger-700/30'
            : 'bg-white ring-gray-900/5 dark:bg-gray-900 dark:ring-white/5'
        }`}
      >
        {/* Franja de acento: una pastilla embutida, no un bloque a sangre. */}
        <span aria-hidden="true" className="w-1.5 shrink-0 py-2.5 pl-1.5">
          <span className={`block h-full w-1 rounded-full ${meta.rail}`} />
        </span>

        <div className="flex min-w-0 flex-1 items-center gap-3 py-3 pl-2.5 pr-3.5">
            {/* Usa la foto del producto; si no existe, reemplaza la imagen por el
              icono y color de la categoría correspondiente. */}
            {product.photo ? (
            <img
              src={product.photo}
              alt={product.name}
              className="h-12 w-12 shrink-0 rounded-[14px] object-cover ring-1 ring-gray-900/5"
            />
          ) : (
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] ${cat.color}`}
            >
              <cat.Icon size={20} strokeWidth={1.75} />
            </div>
          )}

          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            {/* Mismo caso que el saludo de Inicio: nombre escrito por el usuario
                con `truncate`. Inter necesita 1.430 de interlineado; con 1.35 y
                `py-1` quedan ~3.4 px libres arriba y abajo. La tarjeta no crece:
                su altura la marca el icono de 48 px, no el texto. */}
            <span className="truncate py-1 text-[15px] font-semibold leading-[1.35] tracking-[-0.015em] text-gray-900 dark:text-gray-50">
              {product.name}
            </span>
            {/* La categoría queda en un tono neutro para que resalte el vencimiento. */}
            <div className="flex min-w-0 items-center gap-1.5">
              <span className="truncate text-[11.5px] text-gray-400 dark:text-gray-500">
                {translateCategory(product.category, settings.language)}
              </span>
              <span className="text-gray-300 dark:text-gray-700">·</span>
              <span className={`shrink-0 text-[11.5px] font-medium ${meta.text}`}>
                {expiryText(days, settings.language)}
              </span>
            </div>
          </div>

          {/* Los vencidos usan una etiqueta sólida; el resto, la cuenta regresiva
              en la tipografía de marca, que le da peso editorial a la cifra. */}
          {isExpired ? (
            <span
              className={`shrink-0 rounded-lg px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em] ${meta.chip}`}
            >
              {t('common.overdueBadge')}
            </span>
          ) : (
            <div className="flex shrink-0 flex-col items-center leading-none">
              <span className={`tabular font-display text-[26px] font-semibold leading-none ${meta.text}`}>
                {days}
              </span>
              <span className="mt-1 text-[8.5px] font-semibold uppercase tracking-[0.12em] text-gray-400 dark:text-gray-500">
                {days === 1 ? t('common.day') : t('common.days')}
              </span>
            </div>
          )}
        </div>
      </div>
    </button>
  )
}
