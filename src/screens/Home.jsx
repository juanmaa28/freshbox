import { useState } from 'react'
import { Search, Plus, PackageOpen } from 'lucide-react'
import { usePantry } from '../context/PantryContext'
import { daysLeft } from '../utils/dates'
import { pantryStats, bucketOf } from '../utils/stats'
import BottomNav from '../components/BottomNav'
import PantryStats from '../components/PantryStats'
import ProductCard from '../components/ProductCard'
import logoSrc from '../assets/freshbox-logo.jpeg'

export default function Home({ onNav }) {
  const { products, user, t } = usePantry()
  const [bucket, setBucket] = useState('all')
  const [sortBy, setSortBy] = useState('expiry')

  // Se ordena sin modificar el arreglo original del contexto.
  const sorted = [...products].sort((a, b) =>
    sortBy === 'name' ? a.name.localeCompare(b.name, 'es') : daysLeft(a.expiryDate) - daysLeft(b.expiryDate)
  )
  const stats = pantryStats(products)
  // Las casillas de estadísticas hacen de filtro de la lista.
  const visible = sorted.filter((p) => bucket === 'all' || bucketOf(daysLeft(p.expiryDate)) === bucket)
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

      {/* Resumen de la despensa; cada casilla filtra la lista de abajo. */}
      <div className="px-3 pt-3 shrink-0">
        <PantryStats stats={stats} selected={bucket} onSelect={setBucket} />
      </div>

      <div className="flex items-center justify-between px-3 mt-4 mb-2 shrink-0">
        <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-[0.09em]">
          {bucket === 'all' ? t('home.allPantry') : t(`stats.${bucket}`)}
        </span>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-transparent text-[10px] text-gray-500 dark:text-gray-400 focus:outline-none"
          aria-label={t('home.order')}
        >
          <option value="expiry">{t('home.expiry')}</option>
          <option value="name">{t('home.name')}</option>
        </select>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-3 pb-3 flex flex-col gap-2">
        {visible.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-8">
            <PackageOpen size={40} className="text-gray-300 dark:text-gray-700" strokeWidth={1.2} />
            <p className="text-sm text-gray-400">
              {products.length === 0
                ? t('home.empty')
                : bucket === 'soon'
                  ? t('home.fresh')
                  : t('home.noneInGroup')}
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
