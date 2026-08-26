import { useState } from 'react'
import { Search, X, Clock } from 'lucide-react'
import { usePantry } from '../context/PantryContext'
import { CATEGORIES } from '../data/categories'
import ProductCard from '../components/ProductCard'
import logoSrc from '../assets/freshbox-logo.jpeg'
import { translateCategory } from '../utils/i18n'

// Compara sin distinguir mayúsculas ni tildes: "lacteos" encuentra "Lácteos".
function normalize(text) {
  return (text ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

export default function SearchScreen({ onNav }) {
  const { products, recentSearches, addRecentSearch, clearRecentSearches, removeRecentSearch, t, settings } = usePantry()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')

  // Los filtros se generan desde las categorías disponibles en el dominio.
  const filters = [{ id: 'all', label: t('search.all') }, ...CATEGORIES.map((c) => ({ id: c.id, label: translateCategory(c.id, settings.language) }))]
  const searchTerm = normalize(query.trim())

  // La lista permanece vacía hasta que el usuario escribe un término.
  const results = searchTerm
    ? products.filter((p) => {
        const matchesFilter = filter === 'all' || p.category === filter
        if (!matchesFilter) return false
        // Se busca por nombre, categoría (id y nombre traducido) y ubicación.
        const campos = [
          p.name,
          p.category,
          translateCategory(p.category, settings.language),
          p.location,
        ]
        return campos.some((campo) => normalize(campo).includes(searchTerm))
      })
    : []

  const openProduct = (p) => {
    // Solo se guarda una búsqueda cuando el usuario elige un resultado.
    if (query.trim()) addRecentSearch(query)
    onNav('detail', { productId: p.id })
  }

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-gray-950">
      <header className="h-16 flex items-center justify-center border-b border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800 shrink-0">
        {/* El texto queda centrado y el logo cuelga a su izquierda sin desplazarlo. */}
        <span className="relative text-base font-bold text-gray-900 dark:text-gray-50">
          <img
            src={logoSrc}
            alt="FreshBox"
            className="absolute right-full mr-2 top-1/2 -translate-y-1/2 object-contain w-10 h-10 rounded-full mix-blend-multiply dark:mix-blend-normal dark:rounded-full dark:bg-white/90"
          />
          FreshBox
        </span>
      </header>

      <div className="px-3 py-3 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2 shrink-0">
        <div className="flex-1 h-10 border border-gray-300 dark:border-gray-700 rounded-full flex items-center gap-2.5 px-3.5 bg-gray-50 dark:bg-gray-900 focus-within:border-fresh-500 focus-within:ring-1 focus-within:ring-fresh-500">
          <Search size={14} className="text-gray-400 shrink-0" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('search.placeholder')}
            className="flex-1 bg-transparent text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none min-w-0"
          />
          {query && (
            <button onClick={() => setQuery('')} aria-label={t('search.clearInput')}>
              <X size={14} className="text-gray-400" />
            </button>
          )}
        </div>
        <button onClick={() => onNav('home')}>
          <span className="text-sm text-fresh-600 dark:text-fresh-400 font-medium">{t('search.cancel')}</span>
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
            {results.length} {results.length === 1 ? t('search.result') : t('search.results')} {t('search.for')} "{query.trim()}"
          </span>
        </div>
      )}

      <div className="flex-1 overflow-y-auto no-scrollbar px-3 pb-4 flex flex-col gap-2">
        {!searchTerm ? (
          <p className="text-sm text-gray-400 text-center mt-8">{t('search.type')}</p>
        ) : results.length === 0 ? (
          <p className="text-sm text-gray-400 text-center mt-8">{t('search.none')}</p>
        ) : (
          // Misma tarjeta que en Inicio y Alertas para mantener una sola lectura.
          results.map((p) => <ProductCard key={p.id} product={p} onClick={() => openProduct(p)} />)
        )}
        {recentSearches.length > 0 && (
          <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-800 shrink-0">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('search.recent')}</span>
              <button type="button" onClick={clearRecentSearches} className="text-[10px] text-fresh-600 dark:text-fresh-400 font-medium">
                {t('search.clear')}
              </button>
            </div>
            <div className="mt-2 flex flex-col gap-1.5">
              {recentSearches.map((term) => (
                <div key={term} className="flex items-center gap-2">
                  <button type="button" onClick={() => setQuery(term)} className="flex-1 flex items-center gap-2 text-left min-w-0">
                    <Clock size={11} className="text-gray-300 dark:text-gray-600 shrink-0" />
                    <span className="text-xs text-gray-500 dark:text-gray-400 truncate">{term}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => removeRecentSearch(term)}
                    className="p-1.5 rounded-full shrink-0 hover:bg-red-50 active:bg-red-100 dark:hover:bg-red-950/40 dark:active:bg-red-950/60"
                    aria-label={t('search.remove', { term })}
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
