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
      <div className="flex h-full w-full flex-col bg-white dark:bg-gray-950">
        <AppHeader title={t('detail.title')} showBack onBack={() => onNav('home')} />
        <div className="flex flex-1 items-center justify-center px-8 text-center">
          <p className="text-[13.5px] text-gray-500 dark:text-gray-400">{t('detail.missing')}</p>
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
    <div className="relative flex h-full w-full flex-col bg-gray-50 dark:bg-gray-950">
      <AppHeader title={t('detail.title')} showBack onBack={() => onNav('home')} />

      {params?.notice && (
        <div className="mx-4 mt-3 flex shrink-0 items-center gap-2 rounded-xl bg-fresh-50 px-3.5 py-2.5 text-[12.5px] font-medium text-fresh-800 ring-1 ring-fresh-100 dark:bg-fresh-900/25 dark:text-fresh-300 dark:ring-fresh-900/50">
          <Check size={15} strokeWidth={2.4} className="shrink-0" />
          <span>{params.notice}</span>
        </div>
      )}

      <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-4 no-scrollbar">
        {/* Media embutida y redondeada: no toca los bordes ni la cabecera, así
            la pantalla se lee como una ficha y no como una web. */}
        {product.photo ? (
          <img
            src={product.photo}
            alt={product.name}
            className="h-44 w-full shrink-0 rounded-2xl object-cover shadow-card ring-1 ring-gray-900/5"
          />
        ) : (
          <div
            className={`relative flex h-44 shrink-0 items-center justify-center overflow-hidden rounded-2xl ${cat.color}`}
          >
            {/* Icono al agua: llena el espacio sin convertirse en el asunto. */}
            <cat.Icon
              size={190}
              strokeWidth={0.7}
              className="absolute -right-10 -bottom-12 opacity-[0.13]"
              aria-hidden="true"
            />
            <cat.Icon size={54} strokeWidth={1.2} className="relative" aria-hidden="true" />
          </div>
        )}

        <div className="flex shrink-0 flex-col gap-2.5">
          <h2 className="font-display text-[26px] font-semibold leading-[1.2] tracking-[-0.03em] text-gray-900 dark:text-gray-50">
            {product.name}
          </h2>
          {/* La categoría es metadato (neutro) y la urgencia es la señal (con color). */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-[10.5px] font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
              {translateCategory(product.category, settings.language)}
            </span>
            <span
              className={`rounded-lg px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.08em] ${meta.chip}`}
            >
              {urgencyLabel}
            </span>
          </div>
        </div>

        {/* El aviso reutiliza el chip del nivel de urgencia para mantener coherencia. */}
        <div className={`flex shrink-0 items-center gap-2.5 rounded-2xl px-4 py-3.5 ${meta.chip}`}>
          {isOk ? (
            <CheckCircle2 size={17} className="shrink-0" strokeWidth={2} />
          ) : (
            <AlertCircle size={17} className="shrink-0" strokeWidth={2} />
          )}
          <span className="text-[13px] font-semibold">
            {isOk ? t('detail.fresh') : expiryText(days, settings.language)}
          </span>
        </div>

        {/* Ficha técnica: una sola tarjeta con filas separadas por un filo. */}
        <div className="shrink-0 overflow-hidden rounded-2xl bg-white px-4 shadow-card ring-1 ring-gray-900/5 dark:bg-gray-900 dark:ring-white/5">
          {rows.map(({ id, label, value }, i) => (
            <div
              key={id}
              className={`flex min-h-[52px] items-center justify-between gap-3 py-2.5 ${
                i < rows.length - 1 ? 'border-b border-gray-900/[0.06] dark:border-white/[0.06]' : ''
              }`}
            >
              <span className="text-[13px] text-gray-500 dark:text-gray-400">{label}</span>
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
                <span
                  className={`text-right text-[13.5px] font-semibold text-gray-900 dark:text-gray-100 ${
                    id === 'remaining' ? 'tabular' : ''
                  }`}
                >
                  {value}
                </span>
              )}
            </div>
          ))}
        </div>

        {product.notes && (
          <div className="shrink-0 rounded-2xl bg-white px-4 py-3.5 shadow-card ring-1 ring-gray-900/5 dark:bg-gray-900 dark:ring-white/5">
            <span className="eyebrow mb-2 block">{t('detail.notes')}</span>
            <p className="text-[13.5px] leading-relaxed text-gray-700 dark:text-gray-300">{product.notes}</p>
          </div>
        )}

        <div className="mt-auto flex shrink-0 flex-col gap-2.5 pt-2">
          <BtnOutline
            label={t('detail.consumed')}
            icon={<ShoppingBag size={15} strokeWidth={2} />}
            onClick={() => setConsumeOpen(true)}
          />
          <div className="flex gap-2.5">
            <div className="flex-1">
              <BtnOutline
                label={t('detail.edit')}
                icon={<Pencil size={15} strokeWidth={2} />}
                onClick={() => onNav('add', { productId: product.id })}
              />
            </div>
            <div className="flex-1">
              <BtnOutline
                label={t('detail.delete')}
                danger
                icon={<Trash2 size={15} strokeWidth={2} />}
                onClick={() => setConfirmOpen(true)}
              />
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
