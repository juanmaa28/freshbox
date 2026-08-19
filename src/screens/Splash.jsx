import logoSrc from '../assets/freshbox-logo.jpeg'

export default function Splash() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-white dark:bg-gray-950 gap-6 relative">
      <div className="flex flex-col items-center gap-3">
        <img
          src={logoSrc}
          alt="FreshBox"
          className="object-contain w-[170px] h-[170px] mix-blend-multiply dark:mix-blend-normal dark:rounded-3xl dark:bg-white/90"
        />
        <div className="flex flex-col items-center gap-0.5">
          <h1 className="text-[28px] font-bold text-gray-900 dark:text-gray-50 tracking-tight">FreshBox</h1>
          <p className="text-xs text-fresh-600 dark:text-fresh-400 tracking-widest uppercase">
            Frescura que no se te olvida
          </p>
        </div>
      </div>
      <div className="flex flex-col items-center gap-2 mt-6">
        <div className="w-36 h-[5px] bg-fresh-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div className="w-2/5 h-full bg-fresh-600 rounded-full animate-loading-bar" />
        </div>
        <span className="text-xs text-gray-400">Cargando...</span>
      </div>
      <div className="absolute bottom-10">
        <span className="text-[10px] text-gray-300 dark:text-gray-600 tracking-widest">VERSIÓN 1.0.0</span>
      </div>
    </div>
  )
}
