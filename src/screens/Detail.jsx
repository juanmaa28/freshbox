import { useState } from 'react'
import { Trash2, AlertCircle, CheckCircle2, Pencil, Check, ShoppingBag } from 'lucide-react'
import { usePantry } from '../context/PantryContext'
import { categoryById } from '../data/categories'
import { translateCategory } from '../utils/i18n'
import { daysLeft, urgencyOf, URGENCY_META, expiryText, formatDate } from '../utils/dates'
import AppHeader from '../components/AppHeader'
import ConfirmDialog from '../components/ConfirmDialog'
import { BtnOutline } from '../components/FormFields'

export default function Detail({ onNav, params }) {
  const { products, deleteProduct, settings, t } = usePantry()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [consumeOpen, setConsumeOpen] = useState(false)
  const product = products.find((p) => p.id === params?.productId)

  // La ruta puede apuntar a un producto eliminado; se muestra un estado seguro.
  if (!product) {
    return (
      <div className="w-full h-full flex flex-col bg-white dark:bg-gray-950">
        <AppHeader title={t('detail.title')} showBack onBack={() => onNav('home')} />
        <div className="flex-1 flex items-center justify-center px-8 text-center">
          <p className="text-sm text-gray-400">{t('detail.missing')}</p>
        </div>
      </div>
    )
  }

  const cat = categoryById(product.category)
  const days = daysLeft(product.expiryDate)
  const urgency = urgencyOf(days)
  const meta = URGENCY_META[urgency]
  const isOk = urgency === 'low'
  // La misma información de urgencia se reutiliza en color, texto y alerta.
  const urgencyLabel = { expired: t('alerts.critical'), critical: t('alerts.critical'), high: t('alerts.urgent'), mid: t('alerts.medium'), low: t('alerts.low') }[urgency]

  const rows = [
    { label: t('detail.purchase'), value: formatDate(product.purchaseDate, settings.language) },
    { label: t('detail.expiryDate'), value: formatDate(product.expiryDate, settings.language) },
    { label: t('detail.remaining'), value: days < 0 ? t('common.expired') : `${days} ${days === 1 ? t('common.day') : t('common.days')}` },
    { label: t('detail.quantity'), value: product.quantity || t('common.dash') },
    { label: t('detail.location'), value: product.location || t('common.dash') },
  ]

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-gray-950 relative">
      <AppHeader title={t('detail.title')} showBack onBack={() => onNav('home')} />

      {params?.notice && (
        <div className="mx-4 mt-3 flex items-center gap-2 rounded-lg border border-fresh-200 bg-fresh-50 px-3 py-2 text-xs text-fresh-700 dark:border-fresh-900 dark:bg-fresh-900/20 dark:text-fresh-300">
          <Check size={14} className="shrink-0" />
          <span>{params.notice}</span>
        </div>
      )}

      {product.photo ? (
        <img src={product.photo} alt={product.name} className="w-full h-40 object-cover shrink-0" />
      ) : (
        <div className={`w-full h-40 shrink-0 flex items-center justify-center ${cat.color}`}>
          <cat.Icon size={56} strokeWidth={1.2} />
        </div>
      )}

      <div className="flex-1 px-5 py-4 flex flex-col gap-4 overflow-y-auto no-scrollbar">
        <div className="flex flex-col gap-1.5">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-50">{product.name}</h2>
          <div className="flex items-center gap-2">
            <div className={`rounded-full px-2.5 py-0.5 ${cat.color}`}>
                <span className="text-[10px] font-semibold">{translateCategory(product.category, settings.language)}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${meta.dot}`} />
              <span className={`text-[10px] font-semibold ${meta.text}`}>{urgencyLabel}</span>
            </div>
          </div>
        </div>

        <div>
          {rows.map(({ label, value }, i) => (
            <div
              key={label}
              className={`flex justify-between py-3 ${
                i < rows.length - 1 ? 'border-b border-gray-100 dark:border-gray-800' : ''
              }`}
            >
              <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 text-right">{value}</span>
            </div>
          ))}
        </div>

        {product.notes && (
          <div className="border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2.5 bg-gray-50 dark:bg-gray-900">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block mb-1">{t('detail.notes')}</span>
            <p className="text-sm text-gray-700 dark:text-gray-300">{product.notes}</p>
          </div>
        )}

        <div
          className={`flex items-center gap-2 border rounded-lg px-3 py-2.5 ${
            isOk
              ? 'border-fresh-200 bg-fresh-50 dark:border-fresh-900 dark:bg-fresh-900/20'
              : 'border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950/40'
          }`}
        >
          {isOk ? (
            <CheckCircle2 size={14} className="text-fresh-600 shrink-0" />
          ) : (
            <AlertCircle size={14} className="text-orange-500 shrink-0" />
          )}
          <span className={`text-xs ${isOk ? 'text-fresh-700 dark:text-fresh-300' : 'text-orange-700 dark:text-orange-300'}`}>
            {isOk ? t('detail.fresh') : expiryText(days, settings.language)}
          </span>
        </div>

        <div className="flex flex-col gap-2 mt-auto pb-2">
          <BtnOutline
            label={t('detail.consumed')}
            icon={<ShoppingBag size={14} />}
            onClick={() => setConsumeOpen(true)}
          />
          <div className="flex gap-3">
          <div className="flex-1">
            <BtnOutline
              label={t('detail.edit')}
              icon={<Pencil size={14} />}
              onClick={() => onNav('add', { productId: product.id })}
            />
          </div>
          <div className="flex-1">
            <BtnOutline label={t('detail.delete')} danger icon={<Trash2 size={14} />} onClick={() => setConfirmOpen(true)} />
          </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={consumeOpen}
        title={t('detail.consumeTitle')}
        message={t('detail.consumeMessage', { name: product.name })}
        onCancel={() => setConsumeOpen(false)}
        onConfirm={() => {
          deleteProduct(product.id)
          onNav('home')
        }}
      />

      <ConfirmDialog
        open={confirmOpen}
        title={t('detail.deleteTitle')}
        message={t('detail.deleteMessage', { name: product.name })}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          deleteProduct(product.id)
          onNav('home')
        }}
      />
    </div>
  )
}
