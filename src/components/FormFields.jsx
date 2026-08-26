const labelCls =
  'text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-[0.06em]'
const inputCls =
  'h-11 w-full border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 px-3.5 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-fresh-500/40 focus:border-fresh-500'

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
        className="w-full border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 px-3.5 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-fresh-500/40 focus:border-fresh-500 resize-none"
        rows={2}
        {...props}
      />
    </div>
  )
}

export function BtnPrimary({ label, ...props }) {
  return (
    <button
      className="w-full h-11 bg-fresh-600 hover:bg-fresh-700 active:bg-fresh-800 flex items-center justify-center rounded-xl shadow-card transition-colors disabled:opacity-50 disabled:shadow-none"
      {...props}
    >
      <span className="text-sm font-semibold text-white tracking-[-0.01em]">{label}</span>
    </button>
  )
}

export function BtnOutline({ label, icon, danger, ...props }) {
  return (
    <button
      className={`w-full h-11 border flex items-center justify-center gap-1.5 rounded-xl transition-colors ${
        danger
          ? 'border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/40'
          : 'border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800'
      }`}
      {...props}
    >
      {icon}
      <span className="text-sm font-semibold tracking-[-0.01em]">{label}</span>
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
