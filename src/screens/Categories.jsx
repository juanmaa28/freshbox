import { useState } from 'react'
import { ChevronLeft, PackageOpen } from 'lucide-react'
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
      <div className="relative flex h-full w-full flex-col bg-gray-50 dark:bg-gray-950">
        <header className="flex h-[60px] shrink-0 items-center gap-2.5 border-b border-gray-900/[0.07] bg-white/85 px-4 backdrop-blur-xl dark:border-white/[0.06] dark:bg-gray-900/85">
          <button
            onClick={() => setSelected(null)}
            className="press -ml-1.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            aria-label={t('categories.back')}
          >
            <ChevronLeft size={19} strokeWidth={2} />
          </button>
          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] ${cat.color}`}>
            <cat.Icon size={16} strokeWidth={1.9} />
          </div>
          <h1 className="flex-1 truncate font-display text-[19px] font-semibold tracking-[-0.02em] text-gray-900 dark:text-gray-50">
            {translateCategory(cat.id, settings.language)}
          </h1>
          <span className="tabular shrink-0 text-[12px] font-medium text-gray-400">
            {items.length} {items.length === 1 ? t('categories.product') : t('categories.products')}
          </span>
        </header>

        <div className="stagger flex flex-1 flex-col gap-2.5 overflow-y-auto px-4 pb-[104px] pt-4 no-scrollbar">
          {items.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 dark:bg-gray-900">
                <PackageOpen size={28} strokeWidth={1.4} />
              </div>
              <p className="text-[13.5px] text-gray-500 dark:text-gray-400">{t('categories.empty')}</p>
            </div>
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
    <div className="relative flex h-full w-full flex-col bg-gray-50 dark:bg-gray-950">
      <AppHeader title={t('categories.title')} />
      <div className="flex-1 overflow-y-auto px-4 pb-[104px] pt-4 no-scrollbar">
        <div className="stagger grid grid-cols-2 gap-3">
          {CATEGORIES.map((cat) => {
            const count = products.filter((p) => p.category === cat.id).length
            const isEmpty = count === 0
            return (
              <button
                key={cat.id}
                onClick={() => setSelected(cat.id)}
                className="press group rounded-2xl text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-fresh-600 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 dark:focus-visible:ring-offset-gray-950"
              >
                <div className="flex h-full flex-col gap-3.5 rounded-2xl bg-white p-4 shadow-card ring-1 ring-gray-900/5 transition-shadow group-hover:shadow-raised dark:bg-gray-900 dark:ring-white/5">
                  <div className="flex items-start justify-between gap-2">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-[14px] ${cat.color}`}>
                      <cat.Icon size={20} strokeWidth={1.75} />
                    </div>
                    {/* La cifra usa la tipografía de marca: da peso al dato sin
                        necesidad de una etiqueta grande. */}
                    <span
                      className={`tabular font-display text-[24px] font-semibold leading-none ${
                        isEmpty ? 'text-gray-300 dark:text-gray-700' : 'text-gray-900 dark:text-gray-50'
                      }`}
                    >
                      {count}
                    </span>
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <span className="text-[14px] font-semibold tracking-[-0.015em] text-gray-900 dark:text-gray-50">
                      {translateCategory(cat.id, settings.language)}
                    </span>
                    <span className="text-[11.5px] text-gray-400 dark:text-gray-500">
                      {count === 1 ? t('categories.product') : t('categories.products')}
                    </span>
                  </div>

                  {/* La barra se tiñe con el color propio de la categoría. */}
                  <div className="mt-auto h-1 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                    <div
                      className="animate-fill h-full rounded-full"
                      style={{ width: `${(count / maxCount) * 100}%`, backgroundColor: cat.tint }}
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
