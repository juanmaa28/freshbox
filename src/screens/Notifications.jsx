import { Bell, BellOff } from 'lucide-react'
import { usePantry } from '../context/PantryContext'
import { daysLeft, urgencyOf, URGENCY_META, expiryText } from '../utils/dates'
import { categoryById } from '../data/categories'
import AppHeader from '../components/AppHeader'
import BottomNav from '../components/BottomNav'

const LEGEND = [
  { key: 'critical', label: 'Crítico' },
  { key: 'high', label: 'Urgente' },
  { key: 'mid', label: 'Medio' },
  { key: 'low', label: 'Bajo' },
]

export default function Notifications({ onNav }) {
  const { products } = usePantry()

  const alerts = products
    .map((p) => ({ ...p, days: daysLeft(p.expiryDate) }))
    .filter((p) => p.days <= 7)
    .sort((a, b) => a.days - b.days)

  const urgentToday = alerts.filter((p) => p.days <= 0).length
  const thisWeek = alerts.filter((p) => p.days > 0 && p.days <= 7).length

  const stats = [
    { label: 'Urgentes hoy', val: urgentToday },
    { label: 'Esta semana', val: thisWeek },
    { label: 'Total activas', val: alerts.length },
  ]

  return (
    <div className="w-full h-full flex flex-col bg-gray-50 dark:bg-gray-950">
      <AppHeader title="Notificaciones" />

      <div className="flex border-b border-orange-100 dark:border-orange-950/50 bg-orange-50/60 dark:bg-orange-950/20 shrink-0">
        {stats.map(({ label, val }, i) => (
          <div
            key={label}
            className={`flex-1 flex flex-col items-center py-3 ${
              i < stats.length - 1 ? 'border-r border-gray-100 dark:border-gray-800' : ''
            }`}
          >
            <span className="text-xl font-bold text-gray-900 dark:text-gray-50">{val}</span>
            <span className="text-[9px] font-medium text-gray-400 uppercase tracking-wide">{label}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-4 px-3 py-2 shrink-0">
        {LEGEND.map(({ key, label }) => (
          <div key={key} className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${URGENCY_META[key].dot}`} />
            <span className="text-[9px] text-gray-500 dark:text-gray-400">{label}</span>
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-3 pb-3 flex flex-col gap-2">
        {alerts.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-8">
            <BellOff size={40} className="text-gray-300 dark:text-gray-700" strokeWidth={1.2} />
            <p className="text-sm text-gray-400">Sin alertas activas. Tu despensa está bajo control. 🥦</p>
          </div>
        ) : (
          alerts.map((p) => {
            const cat = categoryById(p.category)
            const meta = URGENCY_META[urgencyOf(p.days)]
            return (
              <button key={p.id} onClick={() => onNav('detail', { productId: p.id })} className="w-full text-left shrink-0">
                <div className="border border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-lg px-3 py-3 flex items-center gap-3 active:bg-gray-50 dark:active:bg-gray-800 transition-colors">
                  <div className="flex items-center justify-center w-5 shrink-0">
                    <div className={`w-2.5 h-2.5 rounded-full ${meta.dot}`} />
                  </div>
                  {p.photo ? (
                    <img src={p.photo} alt={p.name} className="w-11 h-11 rounded-md object-cover shrink-0" />
                  ) : (
                    <div className={`w-11 h-11 rounded-md flex items-center justify-center shrink-0 ${cat.color}`}>
                      <cat.Icon size={19} strokeWidth={1.75} />
                    </div>
                  )}
                  <div className="flex-1 flex flex-col gap-0.5 min-w-0">
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-50 truncate">{p.name}</span>
                    <span className={`text-xs font-medium ${meta.text}`}>{expiryText(p.days)}</span>
                  </div>
                  <Bell size={13} className="text-gray-300 dark:text-gray-600 shrink-0" />
                </div>
              </button>
            )
          })
        )}
      </div>

      <BottomNav active="notifications" onNav={onNav} />
    </div>
  )
}
