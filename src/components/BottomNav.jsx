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

// Espacio horizontal que la barra reserva a cada lado (px-1.5 → 0.375rem × 2).
const NAV_PADDING = '0.75rem'

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

  // El indicador es uno solo para toda la barra: así puede viajar de una sección
  // a otra en vez de desaparecer de un botón y aparecer en el siguiente.
  const activeIndex = ITEMS.findIndex((item) => item.id === active)

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 px-3 pb-3 pt-8 bg-gradient-to-t from-gray-50 via-gray-50/85 to-transparent dark:from-gray-950 dark:via-gray-950/85">
      <nav
        aria-label={t('nav.home')}
        className="grain pointer-events-auto relative flex h-[62px] items-stretch overflow-hidden rounded-[22px] bg-fresh-900/95 px-1.5 py-1.5 shadow-hero ring-1 ring-white/10 backdrop-blur-xl"
      >
        {/* Pastilla deslizante. Se mueve con `transform`, que va por GPU, y con
            una curva con un punto de rebote: el salto se siente físico. */}
        {activeIndex >= 0 && (
          <span
            aria-hidden="true"
            className="absolute inset-y-1.5 left-1.5 rounded-2xl bg-white/12 ring-1 ring-white/10 transition-transform duration-[380ms] ease-[cubic-bezier(0.34,1.4,0.5,1)] motion-reduce:transition-none"
            style={{
              width: `calc((100% - ${NAV_PADDING}) / ${ITEMS.length})`,
              transform: `translateX(${activeIndex * 100}%)`,
            }}
          />
        )}

        {ITEMS.map(({ id, Icon }) => {
          const isActive = active === id
          return (
            <button
              key={id}
              onClick={() => onNav(id)}
              aria-current={isActive ? 'page' : undefined}
              className="press relative flex flex-1 flex-col items-center justify-center gap-1 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-fresh-300"
            >
              <span className="relative">
                <Icon
                  size={19}
                  strokeWidth={isActive ? 2.2 : 1.6}
                  className={`transition-colors duration-300 ${
                    isActive ? 'text-white' : 'text-fresh-200/60'
                  }`}
                />
                {id === 'notifications' && alertCount > 0 && (
                  <span className="tabular absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger-500 px-1 text-[9px] font-bold text-white ring-2 ring-fresh-900">
                    {alertCount}
                  </span>
                )}
              </span>
              <span
                className={`text-[9px] font-semibold tracking-[0.02em] transition-colors duration-300 ${
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
