import logoSrc from '../assets/freshbox-logo.jpeg'

import { usePantry } from '../context/PantryContext'

// Pantalla breve que presenta la marca mientras se carga la sesión local.
// Es el único momento a pantalla completa en el verde de marca: el logo va
// sobre un azulejo blanco, como el icono de la app sobre el fondo del sistema.
export default function Splash() {
  const { t } = usePantry()
  return (
    <div className="grain glow-hero relative flex h-full w-full flex-col items-center justify-center gap-8 bg-fresh-900">
      <div className="relative z-10 flex flex-col items-center gap-6">
        <div className="flex h-[124px] w-[124px] items-center justify-center rounded-[34px] bg-white shadow-hero ring-1 ring-white/20">
          <img
            src={logoSrc}
            alt="FreshBox"
            className="h-[104px] w-[104px] object-contain mix-blend-multiply"
          />
        </div>
        <div className="flex flex-col items-center gap-2.5">
          <h1 className="font-display text-[34px] font-semibold leading-none tracking-[-0.03em] text-white">
            FreshBox
          </h1>
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-fresh-300/90">
            Frescura que no se te olvida
          </p>
        </div>
      </div>

      <div className="relative z-10 mt-4 flex flex-col items-center gap-3">
        <div className="h-[3px] w-32 overflow-hidden rounded-full bg-white/15">
          <div className="animate-loading-bar h-full w-2/5 rounded-full bg-fresh-300" />
        </div>
        <span className="text-[11px] font-medium text-fresh-100/50">{t('splash.loading')}</span>
      </div>

      <span className="absolute bottom-10 z-10 text-[9.5px] font-medium uppercase tracking-[0.2em] text-fresh-100/30">
        Versión 1.0.0
      </span>
    </div>
  )
}
