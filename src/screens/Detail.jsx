import { useState } from 'react'
import { Trash2, AlertCircle, CheckCircle2, Pencil, Check } from 'lucide-react'
import { usePantry } from '../context/PantryContext'
import { categoryById } from '../data/categories'
import { daysLeft, urgencyOf, URGENCY_META, expiryText, formatDate } from '../utils/dates'
import AppHeader from '../components/AppHeader'
import ConfirmDialog from '../components/ConfirmDialog'
import { BtnOutline } from '../components/FormFields'

export default function Detail({ onNav, params }) {
  const { products, deleteProduct } = usePantry()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const product = products.find((p) => p.id === params?.productId)

  if (!product) {
    return (
      <div className="w-full h-full flex flex-col bg-white dark:bg-gray-950">
        <AppHeader title="Detalle" showBack onBack={() => onNav('home')} />
        <div className="flex-1 flex items-center justify-center px-8 text-center">
          <p className="text-sm text-gray-400">Este producto ya no existe.</p>
        </div>
      </div>
    )
  }

  const cat = categoryById(product.category)
  const days = daysLeft(product.expiryDate)
  const urgency = urgencyOf(days)
  const meta = URGENCY_META[urgency]
  const isOk = urgency === 'low'

  const rows = [
    { label: 'Fecha de compra', value: formatDate(product.purchaseDate) },
    { label: 'Fecha de vencimiento', value: formatDate(product.expiryDate) },
    { label: 'Días restantes', value: days < 0 ? 'Vencido' : `${days} ${days === 1 ? 'día' : 'días'}` },
    { label: 'Cantidad', value: product.quantity || '—' },
    { label: 'Ubicación', value: product.location || '—' },
  ]

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-gray-950 relative">
      <AppHeader title="Detalle" showBack onBack={() => onNav('home')} />

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
              <span className="text-[10px] font-semibold">{cat.label}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${meta.dot}`} />
              <span className={`text-[10px] font-semibold ${meta.text}`}>{meta.label}</span>
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
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block mb-1">Notas</span>
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
            {isOk ? 'Este producto está fresco' : expiryText(days)}
          </span>
        </div>

        <div className="flex gap-3 mt-auto pb-2">
          <div className="flex-1">
            <BtnOutline
              label="Editar"
              icon={<Pencil size={14} />}
              onClick={() => onNav('add', { productId: product.id })}
            />
          </div>
          <div className="flex-1">
            <BtnOutline label="Eliminar" danger icon={<Trash2 size={14} />} onClick={() => setConfirmOpen(true)} />
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="¿Eliminar producto?"
        message={`"${product.name}" se eliminará de tu despensa. Esta acción no se puede deshacer.`}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          deleteProduct(product.id)
          onNav('home')
        }}
      />
    </div>
  )
}
