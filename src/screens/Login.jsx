import { useState } from 'react'
import { AlertCircle } from 'lucide-react'
import { usePantry } from '../context/PantryContext'
import { useAuthStore } from '../store/authStore'
import { Field, BtnPrimary } from '../components/FormFields'
import logoSrc from '../assets/freshbox-logo.jpeg'

const MODES = ['login', 'register']

export default function Login({ onNav }) {
  const { t } = usePantry()
  // Las acciones se toman una a una: así el componente no se vuelve a
  // renderizar cada vez que cambia cualquier otra parte del store.
  const login = useAuthStore((estado) => estado.login)
  const register = useAuthStore((estado) => estado.register)

  // mode cambia entre el formulario de acceso y el de registro.
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  // Error general del store (credenciales incorrectas, correo ya registrado).
  const [formError, setFormError] = useState(null)
  const [pending, setPending] = useState(false)

  // La validación evita crear sesiones con datos incompletos.
  const validate = () => {
    const errs = {}
    if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = t('login.emailError')
    if (password.length < 4) errs.password = t('login.passwordError')
    if (mode === 'register' && !name.trim()) errs.name = t('login.nameError')
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const cambiarModo = (m) => {
    setMode(m)
    setErrors({})
    setFormError(null)
  }

  const handleSubmit = async (e) => {
    // Se evita el envío tradicional y se resuelve la sesión dentro de React.
    e.preventDefault()
    setFormError(null)
    if (!validate() || pending) return

    setPending(true)
    // Derivar la contraseña tarda unos milisegundos: por eso es asíncrono.
    const resultado =
      mode === 'login'
        ? await login({ email, password })
        : await register({ name, email, password })
    setPending(false)

    if (resultado.ok) {
      onNav('home')
      return
    }
    setFormError(t(`login.${resultado.error}`))
  }

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto bg-white no-scrollbar dark:bg-gray-950">
      <form onSubmit={handleSubmit} className="flex flex-1 flex-col px-7 pb-8 pt-11">
        {/* Encabezado editorial: la marca es un azulejo discreto y el titular
            lleva el peso. Nada centrado, nada de logo gigante. */}
        <div className="flex flex-col gap-5">
          <img
            src={logoSrc}
            alt="FreshBox"
            className="h-12 w-12 rounded-[15px] object-contain mix-blend-multiply dark:bg-white/90 dark:mix-blend-normal"
          />
          <div className="flex flex-col gap-2">
            <h1 className="font-display text-[30px] font-semibold leading-[1.15] tracking-[-0.03em] text-gray-900 dark:text-gray-50">
              {mode === 'login' ? t('login.title') : t('login.registerTitle')}
            </h1>
            <p className="max-w-[17rem] text-[13.5px] leading-relaxed text-gray-500 dark:text-gray-400">
              {mode === 'login' ? t('login.subtitle') : t('login.registerSubtitle')}
            </p>
          </div>
        </div>

        {/* Control segmentado en vez del clásico "o · crear cuenta nueva":
            los dos caminos se ven a la vez y el formulario no cambia de sitio. */}
        <div className="mt-7 grid grid-cols-2 gap-1 rounded-2xl bg-gray-100 p-1 dark:bg-gray-900">
          {MODES.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => cambiarModo(m)}
              aria-pressed={mode === m}
              className={`press h-10 rounded-xl text-[13.5px] font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-fresh-600 ${
                mode === m
                  ? 'bg-white text-gray-900 shadow-card dark:bg-gray-800 dark:text-gray-50'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              {m === 'login' ? t('login.submit') : t('login.register')}
            </button>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-4">
          {mode === 'register' && (
            <Field
              label={t('login.name')}
              placeholder={t('login.namePlaceholder')}
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.name}
            />
          )}
          <Field
            label={t('login.email')}
            type="email"
            autoComplete="email"
            placeholder="nombre@correo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
          />
          <Field
            label={t('login.password')}
            type="password"
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />
          {mode === 'login' && (
            <div className="-mt-1 flex justify-end">
              <button
                type="button"
                className="text-[12.5px] font-medium text-fresh-700 underline-offset-4 hover:underline dark:text-fresh-400"
              >
                {t('login.forgot')}
              </button>
            </div>
          )}
        </div>

        <div className="mt-8 flex flex-col gap-5">
          {/* Aviso de credenciales: va junto al botón, no sobre un campo
              concreto, porque el fallo es de la combinación correo+contraseña. */}
          {formError && (
            <div
              role="alert"
              className="flex items-center gap-2.5 rounded-xl border border-danger-100 bg-danger-50 px-3.5 py-3 dark:border-danger-500/40 dark:bg-danger-500/15"
            >
              <AlertCircle size={16} strokeWidth={2} className="shrink-0 text-danger-500 dark:text-danger-300" />
              <span className="text-[12.5px] font-medium text-danger-700 dark:text-danger-300">{formError}</span>
            </div>
          )}
          <BtnPrimary
            type="submit"
            disabled={pending}
            label={
              pending
                ? t('login.working')
                : mode === 'login'
                  ? t('login.submit')
                  : t('login.register')
            }
          />
          <p className="text-center text-[11px] leading-relaxed text-gray-400">
            {t('login.accept')}{' '}
            <span className="font-medium text-gray-600 underline underline-offset-2 dark:text-gray-300">
              {t('settings.terms')}
            </span>
          </p>
        </div>
      </form>
    </div>
  )
}
