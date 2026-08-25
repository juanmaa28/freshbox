import { useState } from 'react'
import { Search, Plus, AlertCircle, PackageOpen } from 'lucide-react'
import { usePantry } from '../context/PantryContext'
import { daysLeft } from '../utils/dates'
import BottomNav from '../components/BottomNav'
import ProductCard from '../components/ProductCard'
import logoSrc from '../assets/freshbox-logo.jpeg'

export default function Home({ onNav }) {
  const { products, user } = usePantry()
  const [showAll, setShowAll] = useState(false)
  const [sortBy, setSortBy] = useState('expiry')

  const sorted = [...products].sort((a, b) =>
    sortBy === 'name' ? a.name.localeCompare(b.name, 'es') : daysLeft(a.expiryDate) - daysLeft(b.expiryDate)
  )
  const expiringThisWeek = sorted.filter((p) => daysLeft(p.expiryDate) <= 7)
  const visible = showAll ? sorted : expiringThisWeek

  return (
    <div className="w-full h-full flex flex-col bg-gray-50 dark:bg-gray-950 relative">
      <header className="h-12 flex items-center justify-between px-4 border-b border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800 shrink-0">
        <div className="flex items-center gap-2">
          <img
            src={logoSrc}
            alt="FreshBox"
            className="object-contain w-10 h-10 mix-blend-multiply dark:mix-blend-normal dark:rounded-full dark:bg-white/90"
          />
          <div className="flex flex-col leading-tight">
            <span className="text-base font-bold text-fresh-800 dark:text-fresh-300">FreshBox</span>
            {user && <span className="text-[10px] text-gray-400 -mt-0.5">Hola, {user.name}</span>}
          </div>
        </div>
        <button onClick={() => onNav('search')} className="p-1" aria-label="Buscar">
          <Search size={18} className="text-gray-600 dark:text-gray-300" strokeWidth={1.75} />
        </button>
      </header>

      {expiringThisWeek.length > 0 && (
        <button onClick={() => onNav('notifications')} className="text-left shrink-0">
          <div className="mx-3 mt-3 border border-orange-200 bg-orange-50 dark:bg-orange-950/40 dark:border-orange-900 rounded-lg px-3 py-2.5 flex items-center gap-2">
            <AlertCircle size={14} className="text-orange-500 shrink-0" strokeWidth={2} />
            <span className="text-xs font-medium text-orange-700 dark:text-orange-300">
              <span className="font-bold">
                {expiringThisWeek.length} {expiringThisWeek.length === 1 ? 'producto' : 'productos'}
              </span>{' '}
              por vencer esta semana
            </span>
          </div>
        </button>
      )}

      <div className="flex items-center justify-between px-3 mt-4 mb-2 shrink-0">
        <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
          {showAll ? 'Toda la despensa' : 'Próximos a vencer'}
        </span>
        <div className="flex items-center gap-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-transparent text-[10px] text-gray-500 dark:text-gray-400 focus:outline-none"
            aria-label="Ordenar productos"
          >
            <option value="expiry">Por vencimiento</option>
            <option value="name">Por nombre</option>
          </select>
          <button onClick={() => setShowAll(!showAll)} aria-label={showAll ? 'Ver productos próximos a vencer' : 'Ver todos los productos'}>
            <span className="text-[10px] text-fresh-600 dark:text-fresh-400 font-semibold underline underline-offset-2">
              {showAll ? 'Ver próximos' : `Ver todos (${products.length})`}
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
                ? 'Tu despensa está vacía. Agrega tu primer producto con el botón +'
                : 'Nada por vencer esta semana. ¡Todo fresco! 🎉'}
            </p>
          </div>
        ) : (
          visible.map((p) => (
            <ProductCard key={p.id} product={p} onClick={() => onNav('detail', { productId: p.id })} />
          ))
        )}
      </div>

      <button
        onClick={() => onNav('add')}
        className="absolute w-13 h-13 bg-fresh-600 hover:bg-fresh-700 hover:scale-105 active:scale-95 rounded-full flex items-center justify-center shadow-lg shadow-fresh-600/30 transition-transform duration-150 bottom-[84px] right-4 z-10"
        aria-label="Agregar producto"
      >
        <Plus size={24} className="text-white" strokeWidth={2.5} />
      </button>

      <BottomNav active="home" onNav={onNav} />
    </div>
  )
}
