import { Home, Grid2x2, Search, Bell, Settings } from 'lucide-react'
import { usePantry } from '../context/PantryContext'
import { daysLeft } from '../utils/dates'

const ITEMS = [
  { id: 'home', Icon: Home },
  { id: 'categories', Icon: Grid2x2 },
  { id: 'search', Icon: Search },
  { id: 'notifications', Icon: Bell },
  { id: 'settings', Icon: Settings },
]

/**
 * Navegación principal: una pastilla flotante en el verde profundo de la marca,
 * no una barra pegada al borde. El contenido pasa por debajo con un degradado
 * que lo desvanece, así la lista se siente continua en lugar de recortada.
 *
 * Las pantallas que la usan reservan espacio con `pb-[104px]` en su scroll.
 */
export default function BottomNav({ active, onNav }) {
  const { products, t } = usePantry()
  // El contador usa el mismo límite de siete días que la pantalla de alertas.
  const alertCount = products.filter((p) => daysLeft(p.expiryDate) <= 7).length

  const labels = {
    home: t('nav.home'),
    categories: t('nav.categories'),
    search: t('nav.search'),
    notifications: t('nav.alerts'),
    settings: t('nav.settings'),
  }

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 px-3 pb-3 pt-8 bg-gradient-to-t from-gray-50 via-gray-50/85 to-transparent dark:from-gray-950 dark:via-gray-950/85">
      <nav
        aria-label={t('nav.home')}
        className="grain pointer-events-auto relative flex h-[62px] items-center gap-0.5 overflow-hidden rounded-[22px] bg-fresh-900/95 px-1.5 shadow-hero ring-1 ring-white/10 backdrop-blur-xl"
      >
        {ITEMS.map(({ id, Icon }) => {
          const isActive = active === id
          return (
            <button
              key={id}
              onClick={() => onNav(id)}
              aria-current={isActive ? 'page' : undefined}
              className="press relative z-10 flex flex-1 flex-col items-center justify-center gap-1 rounded-2xl py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-fresh-300"
            >
              {/* La pastilla activa se dibuja detrás del icono, no como un
                  subrayado suelto: el estado vive dentro del propio botón. */}
              {isActive && (
                <span
                  aria-hidden="true"
                  className="absolute inset-x-1 inset-y-0.5 -z-10 rounded-2xl bg-white/12 ring-1 ring-white/10"
                />
              )}
              <span className="relative">
                <Icon
                  size={19}
                  strokeWidth={isActive ? 2.2 : 1.6}
                  className={isActive ? 'text-white' : 'text-fresh-200/60'}
                />
                {id === 'notifications' && alertCount > 0 && (
                  <span className="tabular absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger-500 px-1 text-[9px] font-bold text-white ring-2 ring-fresh-900">
                    {alertCount}
                  </span>
                )}
              </span>
              <span
                className={`text-[9px] font-semibold tracking-[0.02em] ${
                  isActive ? 'text-white' : 'text-fresh-200/50'
                }`}
              >
                {labels[id]}
              </span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
