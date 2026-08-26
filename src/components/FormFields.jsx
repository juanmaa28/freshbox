const labelCls = 'text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide'
const inputCls =
  'h-10 w-full border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 px-3 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-fresh-500 focus:border-fresh-500'

// Campo de texto controlado que muestra el error debajo del input.
export function Field({ label, error, ...inputProps }) {
  return (
    <div className="w-full flex flex-col gap-1">
      {label && <label className={labelCls}>{label}</label>}
      <input className={`${inputCls} ${error ? 'border-red-400 focus:ring-red-400 focus:border-red-400' : ''}`} {...inputProps} />
      {error && <span className="text-[11px] text-red-500">{error}</span>}
    </div>
  )
}

export function SelectField({ label, error, children, ...selectProps }) {
  return (
    <div className="w-full flex flex-col gap-1">
      {label && <label className={labelCls}>{label}</label>}
      <select
        className={`${inputCls} appearance-none ${error ? 'border-red-400' : ''}`}
        {...selectProps}
      >
        {children}
      </select>
      {error && <span className="text-[11px] text-red-500">{error}</span>}
    </div>
  )
}

export function TextArea({ label, ...props }) {
  return (
    <div className="w-full flex flex-col gap-1">
      {label && <label className={labelCls}>{label}</label>}
      <textarea
        className="w-full border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-fresh-500 focus:border-fresh-500 resize-none"
        rows={2}
        {...props}
      />
    </div>
  )
}

export function BtnPrimary({ label, ...props }) {
  return (
    <button
      className="w-full h-11 bg-fresh-600 hover:bg-fresh-700 active:bg-fresh-800 flex items-center justify-center rounded-lg transition-colors disabled:opacity-50"
      {...props}
    >
      <span className="text-sm font-semibold text-white tracking-wide">{label}</span>
    </button>
  )
}

export function BtnOutline({ label, icon, danger, ...props }) {
  return (
    <button
      className={`w-full h-11 border-2 flex items-center justify-center gap-1.5 rounded-lg transition-colors ${
        danger
          ? 'border-red-200 text-red-500 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950/40'
          : 'border-fresh-600 text-fresh-700 hover:bg-fresh-50 dark:text-fresh-400 dark:hover:bg-fresh-900/20'
      }`}
      {...props}
    >
      {icon}
      <span className="text-sm font-semibold">{label}</span>
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
      className={`w-10 h-6 rounded-full flex items-center px-1 transition-colors shrink-0 ${
        value ? 'bg-fresh-600' : 'bg-gray-200 dark:bg-gray-700'
      }`}
    >
      <div
        className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${value ? 'translate-x-4' : ''}`}
      />
    </button>
  )
}
