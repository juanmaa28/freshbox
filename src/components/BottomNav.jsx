import { Home, Grid2x2, Search, Bell, Settings } from 'lucide-react'
import { usePantry } from '../context/PantryContext'
import { daysLeft } from '../utils/dates'

const ITEMS = [
  { id: 'home', Icon: Home, label: 'Inicio' },
  { id: 'categories', Icon: Grid2x2, label: 'Categorías' },
  { id: 'search', Icon: Search, label: 'Buscar' },
  { id: 'notifications', Icon: Bell, label: 'Alertas' },
  { id: 'settings', Icon: Settings, label: 'Ajustes' },
]

// Navegación principal reutilizada en las pantallas del teléfono.
export default function BottomNav({ active, onNav }) {
  const { products, t } = usePantry()
  // El contador usa el mismo límite de siete días que la pantalla de alertas.
  const alertCount = products.filter((p) => daysLeft(p.expiryDate) <= 7).length

  const labels = { home: t('nav.home'), categories: t('nav.categories'), search: t('nav.search'), notifications: t('nav.alerts'), settings: t('nav.settings') }

  return (
    <nav className="h-[68px] border-t border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800 flex shrink-0">
      {ITEMS.map(({ id, Icon }) => {
        const isActive = active === id
        return (
          <button
            key={id}
            onClick={() => onNav(id)}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 relative focus:outline-none focus-visible:bg-fresh-50 dark:focus-visible:bg-fresh-950/40"
          >
            {isActive && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-fresh-600 rounded-b" />
            )}
            <div className="relative">
              <Icon
                size={20}
                strokeWidth={isActive ? 2.2 : 1.5}
                className={isActive ? 'text-fresh-600' : 'text-gray-400 dark:text-gray-500'}
              />
              {id === 'notifications' && alertCount > 0 && (
                <span className="absolute -top-1.5 -right-2 min-w-4 h-4 px-0.5 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {alertCount}
                </span>
              )}
            </div>
            <span
              className={`text-[9px] font-medium ${
                isActive ? 'text-fresh-600' : 'text-gray-400 dark:text-gray-500'
              }`}
            >
              {labels[id]}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
