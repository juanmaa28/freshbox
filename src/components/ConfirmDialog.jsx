import { usePantry } from '../context/PantryContext'

// Diálogo genérico para confirmar acciones que no se pueden deshacer.
export default function ConfirmDialog({ open, title, message, confirmLabel, onConfirm, onCancel }) {
  const { t } = usePantry()
  if (!open) return null
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center px-8 bg-gray-950/50 backdrop-blur-[2px]">
      <div className="w-full bg-white dark:bg-gray-900 rounded-2xl p-5 flex flex-col gap-2.5 shadow-raised animate-screen-in">
        <span className="text-base font-bold text-gray-900 dark:text-gray-50">{title}</span>
        <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">{message}</p>
        <div className="flex gap-2 mt-3">
          <button
            onClick={onCancel}
            className="flex-1 h-11 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            {t('add.cancel')}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 h-11 rounded-xl bg-red-600 hover:bg-red-700 text-sm font-semibold text-white shadow-card transition-colors"
          >
            {confirmLabel ?? t('detail.delete')}
          </button>
        </div>
      </div>
    </div>
  )
}
