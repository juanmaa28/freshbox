import { useState } from 'react'
import { Search, Plus, AlertCircle, PackageOpen, ChevronRight } from 'lucide-react'
import { usePantry } from '../context/PantryContext'
import { daysLeft } from '../utils/dates'
import BottomNav from '../components/BottomNav'
import ProductCard from '../components/ProductCard'
import logoSrc from '../assets/freshbox-logo.jpeg'

export default function Home({ onNav }) {
  const { products, user, t } = usePantry()
  const [showAll, setShowAll] = useState(false)
  const [sortBy, setSortBy] = useState('expiry')

  // Se ordena sin modificar el arreglo original del contexto.
  const sorted = [...products].sort((a, b) =>
    sortBy === 'name' ? a.name.localeCompare(b.name, 'es') : daysLeft(a.expiryDate) - daysLeft(b.expiryDate)
  )
  const expiringThisWeek = sorted.filter((p) => daysLeft(p.expiryDate) <= 7)
  const visible = showAll ? sorted : expiringThisWeek
  // Los grupos ayudan a identificar rápidamente el nivel de urgencia.
  const groups = [
    { label: t('home.expired'), products: visible.filter((p) => daysLeft(p.expiryDate) < 0) },
    { label: t('home.urgent'), products: visible.filter((p) => daysLeft(p.expiryDate) >= 0 && daysLeft(p.expiryDate) <= 3) },
    { label: t('home.week'), products: visible.filter((p) => daysLeft(p.expiryDate) > 3 && daysLeft(p.expiryDate) <= 7) },
    { label: t('home.later'), products: visible.filter((p) => daysLeft(p.expiryDate) > 7) },
  ].filter((group) => group.products.length > 0)

  return (
    <div className="w-full h-full flex flex-col bg-gray-50 dark:bg-gray-950 relative">
      <header className="h-16 flex items-center justify-between px-4 border-b border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800 shrink-0">
        <div className="flex items-center gap-2">
          <img
            src={logoSrc}
            alt="FreshBox"
            className="object-contain w-10 h-10 mix-blend-multiply dark:mix-blend-normal dark:rounded-full dark:bg-white/90"
          />
          <div className="flex flex-col leading-tight">
            <span className="text-base font-bold text-fresh-800 dark:text-fresh-300">FreshBox</span>
            {user && <span className="text-[10px] text-gray-400 -mt-0.5">{t('home.greeting', { name: user.name })}</span>}
          </div>
        </div>
        <button onClick={() => onNav('search')} className="p-1" aria-label="Buscar">
          <Search size={18} className="text-gray-600 dark:text-gray-300" strokeWidth={1.75} />
        </button>
      </header>

      {expiringThisWeek.length > 0 && (
        <button onClick={() => onNav('notifications')} className="mx-3 mt-3 shrink-0 text-left">
          <div className="flex items-center gap-2.5 rounded-xl border border-warn-100 bg-warn-50 px-3 py-2.5 transition-colors hover:border-warn-300/60 dark:border-warn-500/30 dark:bg-warn-500/10">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-warn-100 dark:bg-warn-500/20">
              <AlertCircle size={15} className="text-warn-500 dark:text-warn-300" strokeWidth={2.2} />
            </span>
            <span className="flex-1 text-xs font-medium text-warn-700 dark:text-warn-300">
              {t('home.expiring', {
                count: expiringThisWeek.length,
                item: expiringThisWeek.length === 1 ? t('home.product') : t('home.products'),
              })}
            </span>
            <ChevronRight size={15} className="shrink-0 text-warn-500/50 dark:text-warn-300/50" />
          </div>
        </button>
      )}

      <div className="flex items-center justify-between px-3 mt-4 mb-2 shrink-0">
        <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-[0.09em]">
          {showAll ? t('home.allPantry') : t('home.upcoming')}
        </span>
        <div className="flex items-center gap-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-transparent text-[10px] text-gray-500 dark:text-gray-400 focus:outline-none"
            aria-label={t('home.order')}
          >
            <option value="expiry">{t('home.expiry')}</option>
            <option value="name">{t('home.name')}</option>
          </select>
          <button onClick={() => setShowAll(!showAll)} aria-label={showAll ? 'Ver productos próximos a vencer' : 'Ver todos los productos'}>
            <span className="text-[10px] text-fresh-600 dark:text-fresh-400 font-semibold underline underline-offset-2">
              {showAll ? t('home.seeUpcoming') : t('home.seeAll', { count: products.length })}
            </span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-3 pb-3 flex flex-col gap-2">
        {visible.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-8">
            <PackageOpen size={40} className="text-gray-300 dark:text-gray-700" strokeWidth={1.2} />
            <p className="text-sm text-gray-400">
              {products.length === 0
                ? t('home.empty')
                : t('home.fresh')}
            </p>
          </div>
        ) : (
          groups.map((group) => (
            <div key={group.label} className="flex flex-col gap-2">
              <span className="pt-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">{group.label}</span>
              {group.products.map((p) => (
                <ProductCard key={p.id} product={p} onClick={() => onNav('detail', { productId: p.id })} />
              ))}
            </div>
          ))
        )}
      </div>

      <button
        onClick={() => onNav('add')}
        className="absolute w-14 h-14 bg-fresh-600 hover:bg-fresh-700 hover:scale-105 active:scale-95 rounded-full flex items-center justify-center shadow-float transition-transform duration-150 bottom-[84px] right-4 z-10"
        aria-label={t('home.add')}
      >
        <Plus size={24} className="text-white" strokeWidth={2.5} />
      </button>

      <BottomNav active="home" onNav={onNav} />
    </div>
  )
}
