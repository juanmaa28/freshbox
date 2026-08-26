import { useState } from 'react'
import { usePantry } from '../context/PantryContext'
import { Field, BtnPrimary, BtnOutline } from '../components/FormFields'
import logoSrc from '../assets/freshbox-logo.jpeg'

export default function Login({ onNav }) {
  const { login, t } = usePantry()
  // mode cambia entre el formulario de acceso y el de registro.
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})

  // La validación evita crear sesiones con datos incompletos.
  const validate = () => {
    const errs = {}
    if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = t('login.emailError')
    if (password.length < 4) errs.password = t('login.passwordError')
    if (mode === 'register' && !name.trim()) errs.name = t('login.nameError')
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e) => {
    // Se evita el envío tradicional y se crea la sesión dentro de React.
    e.preventDefault()
    if (!validate()) return
    login(email, mode === 'register' ? name.trim() : '')
    onNav('home')
  }

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-gray-950 overflow-y-auto no-scrollbar">
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-center px-7 gap-7 py-8">
        <div className="flex flex-col items-center gap-2">
          <img
            src={logoSrc}
            alt="FreshBox"
            className="object-contain w-[110px] h-[110px] mix-blend-multiply dark:mix-blend-normal dark:rounded-2xl dark:bg-white/90"
          />
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-50">FreshBox</h2>
          <p className="text-xs text-gray-400 text-center">
            {mode === 'login' ? t('login.subtitle') : t('login.registerSubtitle')}
          </p>
        </div>

        <div className="flex flex-col gap-4">
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
            placeholder="nombre@correo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
          />
          <Field
            label={t('login.password')}
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />
          {mode === 'login' && (
            <div className="flex justify-end -mt-1">
              <span className="text-xs text-gray-500 dark:text-gray-400 underline underline-offset-2">
                {t('login.forgot')}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <BtnPrimary type="submit" label={mode === 'login' ? t('login.submit') : t('login.register')} />
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
            <span className="text-xs text-gray-400">o</span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
          </div>
          <BtnOutline
            type="button"
            label={mode === 'login' ? t('login.newAccount') : t('login.haveAccount')}
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login')
              setErrors({})
            }}
          />
        </div>

        <div className="flex justify-center gap-1">
          <span className="text-[10px] text-gray-400">{t('login.accept')}</span>
          <span className="text-[10px] text-gray-600 dark:text-gray-300 underline underline-offset-1">{t('settings.terms')}</span>
        </div>
      </form>
    </div>
  )
}
