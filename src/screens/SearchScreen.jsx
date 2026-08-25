import { useState } from 'react'
import { Search, X, ChevronRight, Clock } from 'lucide-react'
import { usePantry } from '../context/PantryContext'
import { CATEGORIES, categoryById } from '../data/categories'
import { daysLeft, expiryText } from '../utils/dates'
import logoSrc from '../assets/freshbox-logo.jpeg'

export default function SearchScreen({ onNav }) {
  const { products, recentSearches, addRecentSearch, clearRecentSearches, removeRecentSearch } = usePantry()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')

  const filters = [{ id: 'all', label: 'Todos' }, ...CATEGORIES.map((c) => ({ id: c.id, label: c.label }))]
  const searchTerm = query.trim().toLowerCase()

  const results = searchTerm
    ? products.filter((p) => {
        const matchesQuery = p.name.toLowerCase().includes(searchTerm)
        const matchesFilter = filter === 'all' || p.category === filter
        return matchesQuery && matchesFilter
      })
    : []

  const openProduct = (p) => {
    if (query.trim()) addRecentSearch(query)
    onNav('detail', { productId: p.id })
  }

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-gray-950">
      <div className="h-10 flex items-center justify-center border-b border-gray-100 dark:border-gray-800 shrink-0 gap-1.5">
        <img
          src={logoSrc}
          alt="FreshBox"
          className="object-contain w-7 h-7 mix-blend-multiply dark:mix-blend-normal dark:rounded-full dark:bg-white/90"
        />
        <span className="text-sm font-bold text-gray-800 dark:text-gray-100">FreshBox</span>
      </div>

      <div className="px-3 py-3 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2 shrink-0">
        <div className="flex-1 h-10 border border-gray-300 dark:border-gray-700 rounded-full flex items-center gap-2.5 px-3.5 bg-gray-50 dark:bg-gray-900 focus-within:border-fresh-500 focus-within:ring-1 focus-within:ring-fresh-500">
          <Search size={14} className="text-gray-400 shrink-0" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar producto..."
            className="flex-1 bg-transparent text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none min-w-0"
          />
          {query && (
            <button onClick={() => setQuery('')} aria-label="Limpiar">
              <X size={14} className="text-gray-400" />
            </button>
          )}
        </div>
        <button onClick={() => onNav('home')}>
          <span className="text-sm text-fresh-600 dark:text-fresh-400 font-medium">Cancelar</span>
        </button>
      </div>

      <div className="flex gap-2 px-3 py-2 border-b border-gray-100 dark:border-gray-800 shrink-0 overflow-x-auto no-scrollbar">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-3 py-1 rounded-full border text-xs font-medium whitespace-nowrap flex-shrink-0 transition-colors ${
              filter === f.id
                ? 'bg-fresh-600 border-fresh-600 text-white'
                : 'border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {searchTerm && (
        <div className="px-3 py-2 shrink-0">
          <span className="text-[11px] text-gray-400">
            {results.length} {results.length === 1 ? 'resultado' : 'resultados'} para "{query.trim()}"
          </span>
        </div>
      )}

      <div className="flex-1 overflow-y-auto no-scrollbar px-3 pb-4 flex flex-col gap-2">
        {!searchTerm ? (
          <p className="text-sm text-gray-400 text-center mt-8">Escribe el nombre de un producto para buscar.</p>
        ) : results.length === 0 ? (
          <p className="text-sm text-gray-400 text-center mt-8">No se encontraron productos.</p>
        ) : (
          results.map((p) => {
            const cat = categoryById(p.category)
            const days = daysLeft(p.expiryDate)
            return (
              <button key={p.id} onClick={() => openProduct(p)} className="w-full text-left shrink-0">
                <div className="border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-3 flex items-center gap-3 active:bg-gray-50 dark:active:bg-gray-900 transition-colors">
                  {p.photo ? (
                    <img src={p.photo} alt={p.name} className="w-11 h-11 rounded-md object-cover shrink-0" />
                  ) : (
                    <div className={`w-11 h-11 rounded-md flex items-center justify-center shrink-0 ${cat.color}`}>
                      <cat.Icon size={19} strokeWidth={1.75} />
                    </div>
                  )}
                  <div className="flex-1 flex flex-col gap-1 min-w-0">
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-50 truncate">{p.name}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {cat.label} · {expiryText(days)}
                    </span>
                  </div>
                  <ChevronRight size={14} className="text-gray-300 dark:text-gray-600 shrink-0" />
                </div>
              </button>
            )
          })
        )}
        {recentSearches.length > 0 && (
          <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-800 shrink-0">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Búsquedas recientes</span>
              <button type="button" onClick={clearRecentSearches} className="text-[10px] text-fresh-600 dark:text-fresh-400 font-medium">
                Limpiar
              </button>
            </div>
            <div className="mt-2 flex flex-col gap-1.5">
              {recentSearches.map((t) => (
                <div key={t} className="flex items-center gap-2">
                  <button type="button" onClick={() => setQuery(t)} className="flex-1 flex items-center gap-2 text-left min-w-0">
                    <Clock size={11} className="text-gray-300 dark:text-gray-600 shrink-0" />
                    <span className="text-xs text-gray-500 dark:text-gray-400 truncate">{t}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => removeRecentSearch(t)}
                    className="p-1.5 rounded-full shrink-0 hover:bg-red-50 active:bg-red-100 dark:hover:bg-red-950/40 dark:active:bg-red-950/60"
                    aria-label={`Eliminar búsqueda ${t}`}
                    title="Eliminar búsqueda"
                  >
                    <X size={15} className="text-gray-500 hover:text-red-500" strokeWidth={2} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
