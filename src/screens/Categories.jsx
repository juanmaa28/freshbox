import { useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import { usePantry } from '../context/PantryContext'
import { CATEGORIES, categoryById } from '../data/categories'
import { daysLeft } from '../utils/dates'
import AppHeader from '../components/AppHeader'
import BottomNav from '../components/BottomNav'
import ProductCard from '../components/ProductCard'
import { translateCategory } from '../utils/i18n'

export default function Categories({ onNav }) {
  const { products, settings, t } = usePantry()
  const [selected, setSelected] = useState(null)

  const maxCount = Math.max(1, ...CATEGORIES.map((c) => products.filter((p) => p.category === c.id).length))

  // La misma pantalla cambia entre resumen de categorías y detalle seleccionado.
  if (selected) {
    const cat = categoryById(selected)
    const items = products
      .filter((p) => p.category === selected)
      .sort((a, b) => daysLeft(a.expiryDate) - daysLeft(b.expiryDate))
    return (
      <div className="w-full h-full flex flex-col bg-gray-50 dark:bg-gray-950">
        <header className="h-16 flex items-center px-4 border-b border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800 shrink-0 gap-2">
          <button onClick={() => setSelected(null)} className="-ml-1 p-1" aria-label={t('categories.back')}>
            <ChevronLeft size={20} className="text-gray-700 dark:text-gray-300" />
          </button>
          <span className="text-base font-bold text-gray-900 dark:text-gray-50 flex-1">{translateCategory(cat.id, settings.language)}</span>
          <span className="text-xs text-gray-400">{items.length} {items.length === 1 ? t('categories.product') : t('categories.products')}</span>
        </header>
        <div className="flex-1 overflow-y-auto no-scrollbar px-3 py-3 flex flex-col gap-2">
          {items.length === 0 ? (
            <p className="text-sm text-gray-400 text-center mt-10">{t('categories.empty')}</p>
          ) : (
            items.map((p) => (
              <ProductCard key={p.id} product={p} onClick={() => onNav('detail', { productId: p.id })} />
            ))
          )}
        </div>
        <BottomNav active="categories" onNav={onNav} />
      </div>
    )
  }

  return (
    <div className="w-full h-full flex flex-col bg-gray-50 dark:bg-gray-950">
      <AppHeader title={t('categories.title')} />
      <div className="flex-1 overflow-y-auto no-scrollbar px-3 py-3">
        <div className="grid grid-cols-2 gap-2.5">
          {CATEGORIES.map((cat) => {
            const count = products.filter((p) => p.category === cat.id).length
            return (
              <button key={cat.id} onClick={() => setSelected(cat.id)} className="text-left">
                <div className="border border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl p-4 flex flex-col gap-3 active:bg-gray-50 dark:active:bg-gray-800 transition-colors">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${cat.color}`}>
                    <cat.Icon size={18} strokeWidth={1.75} />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-bold text-gray-900 dark:text-gray-50">{translateCategory(cat.id, settings.language)}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {count} {count === 1 ? t('categories.product') : t('categories.products')}
                    </span>
                  </div>
                  <div className="h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-fresh-500 rounded-full transition-all"
                      style={{ width: `${(count / maxCount) * 100}%` }}
                    />
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
      <BottomNav active="categories" onNav={onNav} />
    </div>
  )
}
