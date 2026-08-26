// Etiquetas en caja baja: la jerarquía la da el color, no las mayúsculas.
const labelCls = 'text-[12px] font-medium text-gray-500 dark:text-gray-400'

// Los campos son superficies rellenas, no cajas con borde: menos ruido y el
// foco se nota de verdad (el fondo se aclara y aparece el anillo verde).
const inputCls =
  'h-12 w-full rounded-xl bg-gray-50 px-3.5 text-[15px] text-gray-900 ring-1 ring-gray-900/[0.07] transition-[background-color,box-shadow] placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-fresh-600 dark:bg-gray-900 dark:text-gray-100 dark:ring-white/[0.07] dark:focus:bg-gray-900 dark:focus:ring-fresh-500'

const errorCls = 'ring-danger-300 focus:ring-danger-500 dark:ring-danger-700'

// Campo de texto controlado que muestra el error debajo del input.
export function Field({ label, error, ...inputProps }) {
  return (
    <div className="flex w-full flex-col gap-1.5">
      {label && <label className={labelCls}>{label}</label>}
      <input className={`${inputCls} ${error ? errorCls : ''}`} {...inputProps} />
      {error && <span className="text-[11.5px] font-medium text-danger-500">{error}</span>}
    </div>
  )
}

export function TextArea({ label, ...props }) {
  return (
    <div className="flex w-full flex-col gap-1.5">
      {label && <label className={labelCls}>{label}</label>}
      <textarea
        className="w-full resize-none rounded-xl bg-gray-50 px-3.5 py-3 text-[15px] text-gray-900 ring-1 ring-gray-900/[0.07] transition-[background-color,box-shadow] placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-fresh-600 dark:bg-gray-900 dark:text-gray-100 dark:ring-white/[0.07] dark:focus:ring-fresh-500"
        rows={3}
        {...props}
      />
    </div>
  )
}

export function BtnPrimary({ label, ...props }) {
  return (
    <button
      // El filo blanco superior simula la luz cenital sobre un botón físico.
      className="press flex h-12 w-full items-center justify-center rounded-xl bg-fresh-700 shadow-[inset_0_1px_0_rgb(255_255_255/0.16),0_2px_8px_rgb(13_60_40/0.24)] hover:bg-fresh-600 hover:shadow-float focus:outline-none focus-visible:ring-2 focus-visible:ring-fresh-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-45 disabled:shadow-none"
      {...props}
    >
      <span className="text-[15px] font-semibold tracking-[-0.01em] text-white">{label}</span>
    </button>
  )
}

export function BtnOutline({ label, icon, danger, ...props }) {
  return (
    <button
      className={`press flex h-12 w-full items-center justify-center gap-2 rounded-xl ring-1 focus:outline-none focus-visible:ring-2 ${
        danger
          ? 'bg-danger-50 text-danger-600 ring-danger-100 hover:bg-danger-100 dark:bg-danger-700/10 dark:text-danger-300 dark:ring-danger-700/30 dark:hover:bg-danger-700/20'
          : 'bg-gray-50 text-gray-700 ring-gray-900/[0.07] hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:ring-white/[0.07] dark:hover:bg-gray-800'
      }`}
      {...props}
    >
      {icon}
      <span className="text-[14.5px] font-semibold tracking-[-0.01em]">{label}</span>
    </button>
  )
}

export function Toggle({ value, onChange }) {
  // El switch recibe su valor desde el padre y notifica cada cambio mediante onChange.
  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      className={`flex h-[26px] w-[44px] shrink-0 items-center rounded-full p-[3px] transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-fresh-600 focus-visible:ring-offset-2 ${
        value ? 'bg-fresh-600' : 'bg-gray-300 dark:bg-gray-700'
      }`}
    >
      {/* El pomo viaja con una curva con resorte: se siente mecánico, no lineal. */}
      <span
        className={`h-5 w-5 rounded-full bg-white shadow-[0_1px_3px_rgb(23_33_26/0.3)] transition-transform duration-300 ease-[cubic-bezier(0.34,1.4,0.5,1)] ${
          value ? 'translate-x-[18px]' : 'translate-x-0'
        }`}
      />
    </button>
  )
}
