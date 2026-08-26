import { BellOff } from 'lucide-react'
import { usePantry } from '../context/PantryContext'
import { daysLeft, URGENCY_META } from '../utils/dates'
import AppHeader from '../components/AppHeader'
import BottomNav from '../components/BottomNav'
import ProductCard from '../components/ProductCard'

const LEGEND = [
  { key: 'critical', i18nKey: 'alerts.critical' },
  { key: 'high', i18nKey: 'alerts.urgent' },
  { key: 'mid', i18nKey: 'alerts.medium' },
  { key: 'low', i18nKey: 'alerts.low' },
]

export default function Notifications({ onNav }) {
  const { products, t } = usePantry()

  // Solo se consideran alertas los productos que vencen en siete días o menos.
  const alerts = products
    .map((p) => ({ ...p, days: daysLeft(p.expiryDate) }))
    .filter((p) => p.days <= 7)
    .sort((a, b) => a.days - b.days)

  const urgentToday = alerts.filter((p) => p.days <= 0).length
  const thisWeek = alerts.filter((p) => p.days > 0 && p.days <= 7).length

  // Estas cifras resumen los mismos productos que aparecen en la lista inferior.
  // Cada cifra se tiñe con su nivel de urgencia en vez de teñir todo el bloque.
  const stats = [
    { label: t('alerts.today'), val: urgentToday, tone: 'text-danger-500 dark:text-danger-300' },
    { label: t('alerts.week'), val: thisWeek, tone: 'text-caution-500 dark:text-caution-300' },
    { label: t('alerts.total'), val: alerts.length, tone: 'text-gray-900 dark:text-gray-50' },
  ]

  return (
    <div className="relative flex h-full w-full flex-col bg-gray-50 dark:bg-gray-950">
      <AppHeader title={t('alerts.title')} />

      {/* Resumen en una sola tarjeta: sin líneas divisorias duras, el espacio
          separa las tres cifras. */}
      <div className="shrink-0 px-4 pt-4">
        <div className="grid grid-cols-3 rounded-2xl bg-white p-4 shadow-card ring-1 ring-gray-900/5 dark:bg-gray-900 dark:ring-white/5">
          {stats.map(({ label, val, tone }, i) => (
            <div
              key={label}
              className={`flex flex-col items-center gap-1.5 ${
                i > 0 ? 'border-l border-gray-900/[0.06] dark:border-white/[0.06]' : ''
              }`}
            >
              <span className={`tabular font-display text-[26px] font-semibold leading-none ${tone}`}>
                {val}
              </span>
              <span className="text-center text-[9.5px] font-semibold uppercase leading-tight tracking-[0.08em] text-gray-400 dark:text-gray-500">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* La leyenda usa las mismas franjas que las tarjetas, no puntos sueltos. */}
      <div className="flex shrink-0 items-center gap-4 px-5 pb-1 pt-4">
        {LEGEND.map(({ key, i18nKey }) => (
          <div key={key} className="flex items-center gap-1.5">
            <span className={`h-2.5 w-1 rounded-full ${URGENCY_META[key].rail}`} />
            <span className="text-[9px] font-semibold uppercase tracking-[0.08em] text-gray-400 dark:text-gray-500">
              {t(i18nKey)}
            </span>
          </div>
        ))}
      </div>

      <div className="stagger flex flex-1 flex-col gap-2.5 overflow-y-auto px-4 pb-[104px] pt-2 no-scrollbar">
        {alerts.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-fresh-50 text-fresh-600 ring-1 ring-fresh-100 dark:bg-fresh-900/25 dark:text-fresh-400 dark:ring-fresh-900/50">
              <BellOff size={28} strokeWidth={1.4} />
            </div>
            <p className="max-w-[15rem] text-[13.5px] leading-relaxed text-gray-500 dark:text-gray-400">
              {t('alerts.none')}
            </p>
          </div>
        ) : (
          // Se reutiliza ProductCard para que la lista sea idéntica a la de Inicio.
          alerts.map((p) => (
            <ProductCard key={p.id} product={p} onClick={() => onNav('detail', { productId: p.id })} />
          ))
        )}
      </div>

      <BottomNav active="notifications" onNav={onNav} />
    </div>
  )
}
