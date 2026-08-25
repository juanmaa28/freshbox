import { ChevronLeft } from 'lucide-react'
import logoSrc from '../assets/freshbox-logo.jpeg'
import { usePantry } from '../context/PantryContext'

export default function AppHeader({ title = 'FreshBox', showBack = false, onBack, right }) {
  const { t } = usePantry()
  return (
    <header className="h-12 flex items-center px-4 border-b border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800 shrink-0 gap-2">
      {showBack && (
        <button onClick={onBack} className="-ml-1 p-1 shrink-0" aria-label={t('common.back')}>
          <ChevronLeft size={20} className="text-gray-700 dark:text-gray-300" />
        </button>
      )}
      <span className="text-base font-bold text-gray-900 dark:text-gray-50 flex-1 truncate">{title}</span>
      <img
        src={logoSrc}
        alt="FreshBox"
        className="object-contain shrink-0 w-9 h-9 rounded-full mix-blend-multiply dark:mix-blend-normal dark:rounded-full dark:bg-white/90"
      />
      {right}
    </header>
  )
}
