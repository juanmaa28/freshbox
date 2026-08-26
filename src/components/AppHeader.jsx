import { ChevronLeft } from 'lucide-react'
import logoSrc from '../assets/freshbox-logo.jpeg'
import { usePantry } from '../context/PantryContext'

// Encabezado compartido: puede mostrar título, regreso y contenido adicional.
// El título va en la tipografía de marca y el borde inferior es un filo de 1px
// translúcido en lugar de una línea gris sólida.
export default function AppHeader({ title = 'FreshBox', showBack = false, onBack, right }) {
  const { t } = usePantry()
  return (
    <header className="flex h-[60px] shrink-0 items-center gap-2.5 border-b border-gray-900/[0.07] bg-white/85 px-4 backdrop-blur-xl dark:border-white/[0.06] dark:bg-gray-900/85">
      {showBack && (
        <button
          onClick={onBack}
          className="press -ml-1.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          aria-label={t('common.back')}
        >
          <ChevronLeft size={19} strokeWidth={2} />
        </button>
      )}
      <h1 className="flex-1 truncate font-display text-[19px] font-semibold tracking-[-0.02em] text-gray-900 dark:text-gray-50">
        {title}
      </h1>
      <img
        src={logoSrc}
        alt=""
        aria-hidden="true"
        className="h-9 w-9 shrink-0 rounded-full object-contain mix-blend-multiply dark:bg-white/90 dark:mix-blend-normal"
      />
      {right}
    </header>
  )
}
