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
    <div className="w-full h-full flex flex-col bg-gray-50 dark:bg-gray-950">
      <AppHeader title={t('alerts.title')} />

      <div className="flex shrink-0 border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        {stats.map(({ label, val, tone }, i) => (
          <div
            key={label}
            className={`flex flex-1 flex-col items-center py-3.5 ${
              i < stats.length - 1 ? 'border-r border-gray-100 dark:border-gray-800' : ''
            }`}
          >
            <span className={`tabular text-2xl font-bold ${tone}`}>{val}</span>
            <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.07em] text-gray-400 dark:text-gray-500">
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* La leyenda usa las mismas franjas que las tarjetas, no puntos sueltos. */}
      <div className="flex shrink-0 items-center gap-3.5 px-3 py-2.5">
        {LEGEND.map(({ key, i18nKey }) => (
          <div key={key} className="flex items-center gap-1.5">
            <span className={`h-2.5 w-1 rounded-full ${URGENCY_META[key].rail}`} />
            <span className="text-[9px] font-medium uppercase tracking-[0.05em] text-gray-400 dark:text-gray-500">
              {t(i18nKey)}
            </span>
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-3 pb-3 flex flex-col gap-2">
        {alerts.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-8">
            <BellOff size={40} className="text-gray-300 dark:text-gray-700" strokeWidth={1.2} />
            <p className="text-sm text-gray-400">{t('alerts.none')}</p>
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
