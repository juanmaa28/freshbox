import { useState } from 'react'
import { Trash2, AlertCircle, CheckCircle2, Pencil, Check, ShoppingBag } from 'lucide-react'
import { usePantry } from '../context/PantryContext'
import { categoryById } from '../data/categories'
import { translateCategory } from '../utils/i18n'
import { daysLeft, urgencyOf, URGENCY_META, expiryText, formatDate } from '../utils/dates'
import { parseQuantity } from '../utils/quantity'
import AppHeader from '../components/AppHeader'
import ConfirmDialog from '../components/ConfirmDialog'
import QuantityStepper from '../components/QuantityStepper'
import { BtnOutline } from '../components/FormFields'

export default function Detail({ onNav, params }) {
  const { products, deleteProduct, adjustQuantity, settings, t } = usePantry()
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

  // Solo se ofrece el control +/− cuando la cantidad empieza por un número.
  const quantity = parseQuantity(product.quantity)

  const rows = [
    { id: 'purchase', label: t('detail.purchase'), value: formatDate(product.purchaseDate, settings.language) },
    { id: 'expiry', label: t('detail.expiryDate'), value: formatDate(product.expiryDate, settings.language) },
    { id: 'remaining', label: t('detail.remaining'), value: days < 0 ? t('common.expired') : `${days} ${days === 1 ? t('common.day') : t('common.days')}` },
    { id: 'quantity', label: t('detail.quantity'), value: product.quantity || t('common.dash') },
    { id: 'location', label: t('detail.location'), value: product.location || t('common.dash') },
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
          {/* La categoría es metadato (neutro) y la urgencia es la señal (con color). */}
          <div className="flex items-center gap-2">
            <span className="rounded-md border border-gray-200 bg-gray-50 px-2 py-0.5 text-[10px] font-semibold text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
              {translateCategory(product.category, settings.language)}
            </span>
            <span className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${meta.chip}`}>
              {urgencyLabel}
            </span>
          </div>
        </div>

        <div>
          {rows.map(({ id, label, value }, i) => (
            <div
              key={id}
              className={`flex items-center justify-between gap-3 py-3 ${
                i < rows.length - 1 ? 'border-b border-gray-100 dark:border-gray-800' : ''
              }`}
            >
              <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
              {id === 'quantity' && quantity ? (
                <QuantityStepper
                  amount={quantity.amount}
                  unit={quantity.unit}
                  separator={quantity.separator}
                  onAdjust={(delta) => adjustQuantity(product.id, delta)}
                  decreaseLabel={t('detail.decrease')}
                  increaseLabel={t('detail.increase')}
                />
              ) : (
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 text-right">{value}</span>
              )}
            </div>
          ))}
        </div>

        {product.notes && (
          <div className="border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2.5 bg-gray-50 dark:bg-gray-900">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block mb-1">{t('detail.notes')}</span>
            <p className="text-sm text-gray-700 dark:text-gray-300">{product.notes}</p>
          </div>
        )}

        {/* El aviso reutiliza el chip del nivel de urgencia para mantener coherencia. */}
        <div className={`flex items-center gap-2.5 rounded-xl border px-3.5 py-3 ${meta.chip}`}>
          {isOk ? (
            <CheckCircle2 size={16} className="shrink-0" strokeWidth={2} />
          ) : (
            <AlertCircle size={16} className="shrink-0" strokeWidth={2} />
          )}
          <span className="text-xs font-medium">
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
        confirmLabel={t('detail.consumed')}
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
