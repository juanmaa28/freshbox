import { usePantry } from '../context/PantryContext'

export default function ConfirmDialog({ open, title, message, confirmLabel, onConfirm, onCancel }) {
  const { t } = usePantry()
  if (!open) return null
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center px-8 bg-black/40">
      <div className="w-full bg-white dark:bg-gray-900 rounded-2xl p-5 flex flex-col gap-3 shadow-xl animate-screen-in">
        <span className="text-base font-bold text-gray-900 dark:text-gray-50">{title}</span>
        <p className="text-sm text-gray-500 dark:text-gray-400">{message}</p>
        <div className="flex gap-2 mt-2">
          <button
            onClick={onCancel}
            className="flex-1 h-10 rounded-lg border border-gray-300 dark:border-gray-700 text-sm font-semibold text-gray-600 dark:text-gray-300"
          >
            {t('add.cancel')}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 h-10 rounded-lg bg-red-500 hover:bg-red-600 text-sm font-semibold text-white"
          >
            {confirmLabel ?? t('detail.delete')}
          </button>
        </div>
      </div>
    </div>
  )
}
