import { useState } from 'react'
import { Bell, Mail, Moon, Globe, User, Shield, Package, FileText, LogOut, ChevronRight, X } from 'lucide-react'
import { usePantry } from '../context/PantryContext'
import AppHeader from '../components/AppHeader'
import { Toggle } from '../components/FormFields'
import ConfirmDialog from '../components/ConfirmDialog'

function InfoModal({ open, title, children, onClose }) {
  // Modal reutilizable para mostrar información sin cambiar de pantalla.
  const { t } = usePantry()
  if (!open) return null
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="absolute inset-0 z-50 flex items-center justify-center bg-gray-950/45 px-6 backdrop-blur-[3px]"
    >
      <div className="animate-screen-in flex max-h-[72%] w-full flex-col gap-3 overflow-y-auto rounded-3xl bg-white p-6 shadow-raised ring-1 ring-gray-900/5 no-scrollbar dark:bg-gray-900 dark:ring-white/10">
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-display text-[20px] font-semibold leading-tight tracking-[-0.02em] text-gray-900 dark:text-gray-50">
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label={t('settings.close')}
            className="press -mr-1 -mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X size={17} strokeWidth={2.2} />
          </button>
        </div>
        <div className="flex flex-col gap-2.5 text-[13.5px] leading-relaxed text-gray-500 dark:text-gray-400">
          {children}
        </div>
      </div>
    </div>
  )
}

export default function Settings({ onNav }) {
  const { products, settings, updateSetting, logout, clearProducts, t } = usePantry()
  const [modal, setModal] = useState(null)
  const [clearOpen, setClearOpen] = useState(false)

  // Las filas se describen como datos para reutilizar la misma estructura visual.
  const sections = [
    {
      title: t('settings.preferences'),
      items: [
        { label: t('settings.push'), Icon: Bell, type: 'toggle', key: 'pushNotifications' },
        { label: t('settings.email'), Icon: Mail, type: 'toggle', key: 'emailAlerts' },
        { label: t('settings.dark'), Icon: Moon, type: 'toggle', key: 'darkMode' },
        { label: t('settings.language'), Icon: Globe, type: 'select', key: 'language' },
      ],
    },
    {
      title: t('settings.account'),
      items: [
        { label: t('settings.profile'), Icon: User, type: 'link', onPress: () => onNav('profile') },
        { label: t('settings.privacy'), Icon: Shield, type: 'link', onPress: () => setModal('privacy') },
      ],
    },
    {
      title: t('settings.information'),
      items: [
        { label: t('settings.about'), Icon: Package, type: 'link', onPress: () => setModal('about') },
        { label: t('settings.terms'), Icon: FileText, type: 'link', onPress: () => setModal('terms') },
      ],
    },
  ]

  return (
    <div className="relative flex h-full w-full flex-col bg-gray-50 dark:bg-gray-950">
      <AppHeader title={t('settings.title')} />
      <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-4 pb-[104px] pt-5 no-scrollbar">
        {sections.map(({ title, items }) => (
          <section key={title}>
            <span className="eyebrow mb-2.5 block px-1">{title}</span>
            {/* Cada grupo es una tarjeta redondeada, no una banda a sangre. */}
            <div className="overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-gray-900/5 dark:bg-gray-900 dark:ring-white/5">
              {items.map(({ label, Icon, type, key, onPress }, i) => {
                const rowCls = `flex w-full items-center gap-3 px-4 py-3 ${
                  i < items.length - 1 ? 'border-b border-gray-900/[0.055] dark:border-white/[0.055]' : ''
                }`
                const inner = (
                  <>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] bg-fresh-50 text-fresh-700 dark:bg-fresh-900/30 dark:text-fresh-400">
                      <Icon size={16} strokeWidth={1.85} />
                    </span>
                    <span className="flex-1 text-left text-[14px] font-medium text-gray-900 dark:text-gray-100">
                      {label}
                    </span>
                  </>
                )
                return type === 'toggle' ? (
                  <div key={label} className={rowCls}>
                    {inner}
                    <Toggle value={settings[key]} onChange={(v) => updateSetting(key, v)} />
                  </div>
                ) : type === 'select' ? (
                  <div key={label} className={rowCls}>
                    {inner}
                    <select
                      value={settings[key]}
                      onChange={(e) => updateSetting(key, e.target.value)}
                      className="select-clean -mr-1 cursor-pointer rounded-lg bg-transparent py-1 pl-2 text-[13px] font-medium text-gray-500 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-fresh-600 dark:text-gray-400 dark:hover:bg-gray-800"
                      aria-label={t('settings.language')}
                    >
                      <option>Español</option>
                      <option>English</option>
                    </select>
                  </div>
                ) : (
                  <button
                    key={label}
                    onClick={() => onPress?.()}
                    className={`${rowCls} press hover:bg-gray-50 dark:hover:bg-gray-800/60`}
                  >
                    {inner}
                    <ChevronRight size={16} strokeWidth={2} className="shrink-0 text-gray-300 dark:text-gray-600" />
                  </button>
                )
              })}
            </div>
          </section>
        ))}

        {/* Zona destructiva, separada del resto y en último lugar. */}
        <div className="mt-1 flex flex-col gap-2.5">
          <button
            onClick={() => setClearOpen(true)}
            disabled={products.length === 0}
            className="press flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-warn-50 text-warn-700 ring-1 ring-warn-100 hover:bg-warn-100 disabled:pointer-events-none disabled:opacity-40 dark:bg-warn-500/10 dark:text-warn-300 dark:ring-warn-500/25 dark:hover:bg-warn-500/20"
          >
            <Package size={15} strokeWidth={2} />
            <span className="text-[14.5px] font-semibold">{t('settings.clearPantry')}</span>
          </button>
          <button
            onClick={() => {
              logout()
              onNav('login')
            }}
            className="press flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-danger-50 text-danger-600 ring-1 ring-danger-100 hover:bg-danger-100 dark:bg-danger-700/10 dark:text-danger-300 dark:ring-danger-700/30 dark:hover:bg-danger-700/20"
          >
            <LogOut size={15} strokeWidth={2} />
            <span className="text-[14.5px] font-semibold">{t('settings.logout')}</span>
          </button>
        </div>
      </div>

      <InfoModal open={modal === 'about'} title={t('settings.about')} onClose={() => setModal(null)}>
        <p>{t('settings.aboutText')}</p>
        <p>
          App para el control de vencimientos en la despensa: registra tus compras, mira qué vence pronto y recibe
          alertas antes de que se dañe la comida.
        </p>
        <p>Desarrollada por David De La Cuesta y Juan Manuel Arias · Curso Aplicaciones Móviles.</p>
      </InfoModal>
      <InfoModal open={modal === 'terms'} title={t('settings.terms')} onClose={() => setModal(null)}>
        <p>{t('settings.termsText')}</p>
      </InfoModal>
      <InfoModal open={modal === 'privacy'} title={t('settings.privacy')} onClose={() => setModal(null)}>
        <p>{t('settings.privacyText')}</p>
      </InfoModal>

      <ConfirmDialog
        open={clearOpen}
        title={t('settings.clearTitle')}
        message={t('settings.clearMessage', { count: products.length })}
        onCancel={() => setClearOpen(false)}
        onConfirm={() => {
          clearProducts()
          setClearOpen(false)
        }}
      />

    </div>
  )
}
