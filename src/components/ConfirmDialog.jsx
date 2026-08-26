import { usePantry } from '../context/PantryContext'

// Diálogo genérico para confirmar acciones que no se pueden deshacer.
export default function ConfirmDialog({ open, title, message, confirmLabel, onConfirm, onCancel }) {
  const { t } = usePantry()
  if (!open) return null
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="absolute inset-0 z-50 flex items-center justify-center bg-gray-950/45 px-7 backdrop-blur-[3px]"
    >
      <div className="animate-screen-in flex w-full flex-col gap-2 rounded-3xl bg-white p-6 shadow-raised ring-1 ring-gray-900/5 dark:bg-gray-900 dark:ring-white/10">
        <h2 className="font-display text-[20px] font-semibold tracking-[-0.02em] text-gray-900 dark:text-gray-50">
          {title}
        </h2>
        <p className="text-[13.5px] leading-relaxed text-gray-500 dark:text-gray-400">{message}</p>
        <div className="mt-4 flex gap-2.5">
          <button
            onClick={onCancel}
            className="press h-12 flex-1 rounded-xl bg-gray-50 text-[14.5px] font-semibold text-gray-700 ring-1 ring-gray-900/[0.07] hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-200 dark:ring-white/[0.07] dark:hover:bg-gray-700"
          >
            {t('add.cancel')}
          </button>
          <button
            onClick={onConfirm}
            className="press h-12 flex-1 rounded-xl bg-danger-600 text-[14.5px] font-semibold text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.16),0_2px_8px_rgb(138_43_30/0.28)] hover:bg-danger-700"
          >
            {confirmLabel ?? t('detail.delete')}
          </button>
        </div>
      </div>
    </div>
  )
}
