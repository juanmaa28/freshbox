import { useRef, useState } from 'react'
import { Pencil, LogOut, User } from 'lucide-react'
import { usePantry } from '../context/PantryContext'
import { useAuthStore, useCurrentUser } from '../store/authStore'
import { pantryStats } from '../utils/stats'
import AppHeader from '../components/AppHeader'
import { Field, BtnPrimary } from '../components/FormFields'

export default function Profile({ onNav }) {
  const { products, settings, t } = usePantry()
  const user = useCurrentUser()
  const updateUser = useAuthStore((estado) => estado.updateProfile)
  const logout = useAuthStore((estado) => estado.logout)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: user?.name ?? '', email: user?.email ?? '', phone: user?.phone ?? '' })
  const fileRef = useRef(null)

  if (!user) return null

  const memberDate = new Date(user.memberSince + 'T00:00:00')
  const memberLocale = settings.language === 'English' ? 'en-US' : 'es-ES'

  // Se usan los mismos grupos que en Inicio para que las cifras no se contradigan.
  const counts = pantryStats(products)
  const stats = [
    { label: t('stats.total'), val: counts.total, tone: 'text-gray-900 dark:text-gray-50' },
    { label: t('stats.expired'), val: counts.expired, tone: 'text-danger-500 dark:text-danger-300' },
    { label: t('stats.soon'), val: counts.soon, tone: 'text-caution-500 dark:text-caution-300' },
    { label: t('stats.fresh'), val: counts.fresh, tone: 'text-fresh-600 dark:text-fresh-400' },
  ]

  const infoRows = [
    { label: t('profile.fullName'), value: user.name },
    { label: t('profile.email'), value: user.email },
    { label: t('profile.phone'), value: user.phone || t('common.dash') },
    { label: t('profile.member'), value: memberDate.toLocaleDateString(memberLocale, { month: 'long', year: 'numeric' }) },
    { label: t('profile.plan'), value: user.plan },
  ]

  const handleAvatar = (e) => {
    // La imagen se guarda localmente como Data URL dentro del perfil.
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => updateUser({ avatar: reader.result })
    reader.readAsDataURL(file)
  }

  const saveEdit = (e) => {
    // Se conservan los datos anteriores cuando un campo se deja vacío.
    e.preventDefault()
    updateUser({ name: form.name.trim() || user.name, email: form.email.trim() || user.email, phone: form.phone.trim() })
    setEditing(false)
  }

  return (
    <div className="flex h-full w-full flex-col bg-gray-50 dark:bg-gray-950">
      <AppHeader title={t('profile.title')} showBack onBack={() => onNav('settings')} />

      <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-4 pb-6 pt-4 no-scrollbar">
        {/* Tarjeta de identidad: avatar cuadrado redondeado (no el círculo de
            siempre), nombre en la tipografía de marca y las cifras dentro. */}
        <div className="flex flex-col items-center gap-4 rounded-3xl bg-white px-5 py-6 shadow-card ring-1 ring-gray-900/5 dark:bg-gray-900 dark:ring-white/5">
          <div className="relative">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="h-[76px] w-[76px] rounded-[24px] object-cover ring-1 ring-gray-900/5"
              />
            ) : (
              <div className="flex h-[76px] w-[76px] items-center justify-center rounded-[24px] bg-fresh-50 text-fresh-600 ring-1 ring-fresh-100 dark:bg-fresh-900/30 dark:text-fresh-400 dark:ring-fresh-900/50">
                <User size={32} strokeWidth={1.5} />
              </div>
            )}
            <button
              onClick={() => fileRef.current?.click()}
              className="press absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-fresh-700 text-white ring-[3px] ring-white hover:bg-fresh-600 dark:ring-gray-900"
              aria-label={t('profile.changePhoto')}
            >
              <Pencil size={11} strokeWidth={2.4} />
            </button>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatar} className="hidden" />
          </div>

          <div className="flex flex-col items-center gap-1 text-center">
            <h2 className="font-display text-[21px] font-semibold leading-[1.3] tracking-[-0.025em] text-gray-900 dark:text-gray-50">
              {user.name}
            </h2>
            <span className="text-[13px] text-gray-500 dark:text-gray-400">{user.email}</span>
          </div>

          <div className="grid w-full grid-cols-4 gap-1 rounded-2xl bg-gray-50 p-2.5 dark:bg-gray-950/60">
            {stats.map(({ label, val, tone }) => (
              <div key={label} className="flex flex-col items-center gap-1.5">
                <span className={`tabular font-display text-[19px] font-semibold leading-none ${tone}`}>
                  {val}
                </span>
                <span className="text-center text-[9px] font-semibold uppercase leading-none tracking-[0.07em] text-gray-400 dark:text-gray-500">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <section className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between px-1">
            <span className="eyebrow">{t('profile.personal')}</span>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="press rounded-md px-1.5 py-0.5 text-[11.5px] font-semibold text-fresh-700 hover:bg-fresh-50 dark:text-fresh-400 dark:hover:bg-fresh-900/25"
              >
                {t('profile.edit')}
              </button>
            )}
          </div>

          {editing ? (
            // Edición en línea, en el mismo sitio que la ficha: sin modal.
            <form
              onSubmit={saveEdit}
              className="flex flex-col gap-3.5 rounded-2xl bg-white p-4 shadow-card ring-1 ring-gray-900/5 dark:bg-gray-900 dark:ring-white/5"
            >
              <Field label={t('profile.fullName')} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <Field label={t('profile.email')} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <Field label={t('profile.phone')} placeholder="+57 300 000 0000" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <div className="mt-1 flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="press h-12 flex-1 rounded-xl bg-gray-50 text-[14.5px] font-semibold text-gray-600 ring-1 ring-gray-900/[0.07] hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:ring-white/[0.07]"
                >
                  {t('profile.cancel')}
                </button>
                <div className="flex-1">
                  <BtnPrimary type="submit" label={t('profile.save')} />
                </div>
              </div>
            </form>
          ) : (
            <div className="overflow-hidden rounded-2xl bg-white px-4 shadow-card ring-1 ring-gray-900/5 dark:bg-gray-900 dark:ring-white/5">
              {infoRows.map(({ label, value }, i) => (
                <div
                  key={label}
                  className={`flex min-h-[50px] items-center justify-between gap-3 py-2.5 ${
                    i < infoRows.length - 1 ? 'border-b border-gray-900/[0.055] dark:border-white/[0.055]' : ''
                  }`}
                >
                  <span className="text-[13px] text-gray-500 dark:text-gray-400">{label}</span>
                  <span className="text-right text-[13.5px] font-semibold text-gray-900 first-letter:uppercase dark:text-gray-100">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        <button
          onClick={() => {
            logout()
            onNav('login')
          }}
          className="press mt-auto flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-danger-50 text-danger-600 ring-1 ring-danger-100 hover:bg-danger-100 dark:bg-danger-700/10 dark:text-danger-300 dark:ring-danger-700/30 dark:hover:bg-danger-700/20"
        >
          <LogOut size={15} strokeWidth={2} />
          <span className="text-[14.5px] font-semibold">{t('profile.logout')}</span>
        </button>
      </div>
    </div>
  )
}
