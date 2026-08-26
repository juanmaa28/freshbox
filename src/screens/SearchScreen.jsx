import { useState } from 'react'
import { Search, X, Clock, SearchX } from 'lucide-react'
import { usePantry } from '../context/PantryContext'
import { CATEGORIES } from '../data/categories'
import ProductCard from '../components/ProductCard'
import { translateCategory } from '../utils/i18n'

// Compara sin distinguir mayúsculas ni tildes: "lacteos" encuentra "Lácteos".
function normalize(text) {
  return (text ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
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
    <div className="flex h-full w-full flex-col bg-gray-50 dark:bg-gray-950">
      {/* El campo de búsqueda es el protagonista de la pantalla, no un añadido
          debajo de una cabecera de marca. */}
      <div className="shrink-0 border-b border-gray-900/[0.06] bg-white px-4 pb-3 pt-5 dark:border-white/[0.06] dark:bg-gray-900 md:pt-10">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h1 className="font-display text-[21px] font-semibold leading-[1.3] tracking-[-0.025em] text-gray-900 dark:text-gray-50">
            {t('nav.search')}
          </h1>
          <button
            onClick={() => onNav('home')}
            className="press rounded-lg px-2 py-1 text-[13px] font-semibold text-fresh-700 hover:bg-fresh-50 dark:text-fresh-400 dark:hover:bg-fresh-900/25"
          >
            {t('search.cancel')}
          </button>
        </div>

        <div className="flex h-12 items-center gap-2.5 rounded-2xl bg-gray-100 px-4 ring-1 ring-transparent transition-shadow focus-within:bg-white focus-within:ring-2 focus-within:ring-fresh-600 dark:bg-gray-800 dark:focus-within:bg-gray-800">
          <Search size={16} strokeWidth={2} className="shrink-0 text-gray-400" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('search.placeholder')}
            className="min-w-0 flex-1 bg-transparent text-[15px] text-gray-900 placeholder:text-gray-400 focus:outline-none dark:text-gray-100"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              aria-label={t('search.clearInput')}
              className="press flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-300 text-white hover:bg-gray-400 dark:bg-gray-600"
            >
              <X size={13} strokeWidth={2.6} />
            </button>
          )}
        </div>
      </div>

      <div className="flex shrink-0 gap-2 overflow-x-auto px-4 py-3 no-scrollbar">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            aria-pressed={filter === f.id}
            className={`press shrink-0 whitespace-nowrap rounded-full px-3.5 py-1.5 text-[12px] font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-fresh-600 ${
              filter === f.id
                ? 'bg-fresh-700 text-white shadow-card'
                : 'bg-white text-gray-500 ring-1 ring-gray-900/[0.07] hover:text-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:ring-white/[0.07]'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {searchTerm && (
        <div className="shrink-0 px-5 pb-1">
          <span className="text-[11.5px] text-gray-400">
            <span className="tabular font-semibold text-gray-600 dark:text-gray-300">{results.length}</span>{' '}
            {results.length === 1 ? t('search.result') : t('search.results')} {t('search.for')} “{query.trim()}”
          </span>
        </div>
      )}

      {/* Buscar es una de las cinco secciones de la barra inferior, así que su
          lista reserva el mismo espacio que el resto para no quedar tapada. */}
      <div className="flex flex-1 flex-col gap-2.5 overflow-y-auto px-4 pb-[104px] pt-2 no-scrollbar">
        {!searchTerm ? (
          <div className="flex flex-col items-center gap-3 px-8 pt-8 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-gray-400 shadow-card ring-1 ring-gray-900/5 dark:bg-gray-900 dark:ring-white/5">
              <Search size={24} strokeWidth={1.5} />
            </div>
            <p className="max-w-[15rem] text-[13px] leading-relaxed text-gray-500 dark:text-gray-400">
              {t('search.type')}
            </p>
          </div>
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-8 pt-8 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-gray-400 shadow-card ring-1 ring-gray-900/5 dark:bg-gray-900 dark:ring-white/5">
              <SearchX size={24} strokeWidth={1.5} />
            </div>
            <p className="text-[13px] text-gray-500 dark:text-gray-400">{t('search.none')}</p>
          </div>
        ) : (
          // Misma tarjeta que en Inicio y Alertas para mantener una sola lectura.
          <div className="stagger flex flex-col gap-2.5">
            {results.map((p) => (
              <ProductCard key={p.id} product={p} onClick={() => openProduct(p)} />
            ))}
          </div>
        )}

        {recentSearches.length > 0 && (
          <section className="mt-4 shrink-0 border-t border-gray-900/[0.06] pt-4 dark:border-white/[0.06]">
            <div className="flex items-center justify-between">
              <span className="eyebrow">{t('search.recent')}</span>
              <button
                type="button"
                onClick={clearRecentSearches}
                className="press rounded-md px-1.5 py-0.5 text-[11px] font-semibold text-fresh-700 hover:bg-fresh-50 dark:text-fresh-400 dark:hover:bg-fresh-900/25"
              >
                {t('search.clear')}
              </button>
            </div>
            <div className="mt-2 flex flex-col">
              {recentSearches.map((term) => (
                <div key={term} className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setQuery(term)}
                    className="press flex min-w-0 flex-1 items-center gap-2.5 rounded-lg py-2 pl-1 pr-2 text-left hover:bg-white dark:hover:bg-gray-900"
                  >
                    <Clock size={13} strokeWidth={1.8} className="shrink-0 text-gray-300 dark:text-gray-600" />
                    <span className="truncate text-[13px] text-gray-600 dark:text-gray-300">{term}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => removeRecentSearch(term)}
                    className="press flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-400 hover:bg-danger-50 hover:text-danger-500 dark:hover:bg-danger-700/20"
                    aria-label={t('search.remove', { term })}
                  >
                    <X size={14} strokeWidth={2.2} />
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
