import { useRef, useState } from 'react'
import { Pencil, LogOut, User } from 'lucide-react'
import { usePantry } from '../context/PantryContext'
import { daysLeft } from '../utils/dates'
import AppHeader from '../components/AppHeader'
import { Field, BtnPrimary } from '../components/FormFields'

export default function Profile({ onNav }) {
  const { user, updateUser, logout, products, settings, t } = usePantry()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: user?.name ?? '', email: user?.email ?? '', phone: user?.phone ?? '' })
  const fileRef = useRef(null)

  if (!user) return null

  const memberDate = new Date(user.memberSince + 'T00:00:00')
  const memberLocale = settings.language === 'English' ? 'en-US' : 'es-ES'
  const alertCount = products.filter((p) => daysLeft(p.expiryDate) <= 3).length
  const freshCount = products.filter((p) => daysLeft(p.expiryDate) > 5).length

  const stats = [
    { label: t('profile.products'), val: products.length },
    { label: t('profile.alerts'), val: alertCount },
    { label: t('profile.fresh'), val: freshCount },
  ]

  const infoRows = [
    { label: t('profile.fullName'), value: user.name },
    { label: t('profile.email'), value: user.email },
    { label: t('profile.phone'), value: user.phone || t('common.dash') },
    { label: t('profile.member'), value: memberDate.toLocaleDateString(memberLocale, { month: 'long', year: 'numeric' }) },
    { label: t('profile.plan'), value: user.plan },
  ]

  const handleAvatar = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => updateUser({ avatar: reader.result })
    reader.readAsDataURL(file)
  }

  const saveEdit = (e) => {
    e.preventDefault()
    updateUser({ name: form.name.trim() || user.name, email: form.email.trim() || user.email, phone: form.phone.trim() })
    setEditing(false)
  }

  return (
    <div className="w-full h-full flex flex-col bg-gray-50 dark:bg-gray-950">
      <AppHeader title={t('profile.title')} showBack onBack={() => onNav('settings')} />

      <div className="flex flex-col items-center py-6 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 gap-3 shrink-0">
        <div className="relative">
          {user.avatar ? (
            <img src={user.avatar} alt="Avatar" className="w-20 h-20 rounded-full object-cover" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-fresh-100 dark:bg-fresh-900/40 flex items-center justify-center">
              <User size={34} className="text-fresh-600 dark:text-fresh-400" strokeWidth={1.5} />
            </div>
          )}
          <button
            onClick={() => fileRef.current?.click()}
            className="absolute bottom-0 right-0 w-6 h-6 bg-fresh-600 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900"
            aria-label={t('profile.changePhoto')}
          >
            <Pencil size={10} className="text-white" />
          </button>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatar} className="hidden" />
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-base font-bold text-gray-900 dark:text-gray-50">{user.name}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">{user.email}</span>
        </div>
        <div className="flex divide-x divide-gray-200 dark:divide-gray-700 mt-1">
          {stats.map(({ label, val }) => (
            <div key={label} className="flex flex-col items-center px-5">
              <span className="text-base font-bold text-gray-900 dark:text-gray-50">{val}</span>
              <span className="text-[10px] text-gray-400 font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 py-4 flex flex-col gap-4 flex-1 overflow-y-auto no-scrollbar">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
            {t('profile.personal')}
          </span>
          {!editing && (
            <button onClick={() => setEditing(true)}>
              <span className="text-[11px] text-fresh-600 dark:text-fresh-400 font-semibold underline underline-offset-2">
                {t('profile.edit')}
              </span>
            </button>
          )}
        </div>

        {editing ? (
          <form onSubmit={saveEdit} className="flex flex-col gap-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
            <Field label={t('profile.fullName')} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Field label={t('profile.email')} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <Field label={t('profile.phone')} placeholder="+57 300 000 0000" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <div className="flex gap-2 mt-1">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="flex-1 h-10 rounded-lg border border-gray-300 dark:border-gray-700 text-sm font-semibold text-gray-600 dark:text-gray-300"
              >
                {t('profile.cancel')}
              </button>
              <div className="flex-1">
                <BtnPrimary type="submit" label={t('profile.save')} />
              </div>
            </div>
          </form>
        ) : (
          <div className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-lg overflow-hidden">
            {infoRows.map(({ label, value }, i) => (
              <div
                key={label}
                className={`flex justify-between items-center px-4 py-3 ${
                  i < infoRows.length - 1 ? 'border-b border-gray-100 dark:border-gray-800' : ''
                }`}
              >
                <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 text-right">{value}</span>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => {
            logout()
            onNav('login')
          }}
          className="mt-auto w-full h-11 border-2 border-red-200 dark:border-red-900 rounded-lg flex items-center justify-center gap-2 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
        >
          <LogOut size={15} className="text-red-500" />
          <span className="text-sm font-semibold text-red-500">{t('profile.logout')}</span>
        </button>
      </div>
    </div>
  )
}
