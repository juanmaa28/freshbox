import { useState } from 'react'
import { Bell, Mail, Moon, Globe, User, Shield, Package, FileText, LogOut, ChevronRight, X } from 'lucide-react'
import { usePantry } from '../context/PantryContext'
import AppHeader from '../components/AppHeader'
import BottomNav from '../components/BottomNav'
import { Toggle } from '../components/FormFields'

function InfoModal({ open, title, children, onClose }) {
  if (!open) return null
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center px-6 bg-black/40">
      <div className="w-full bg-white dark:bg-gray-900 rounded-2xl p-5 flex flex-col gap-3 shadow-xl animate-screen-in max-h-[70%] overflow-y-auto no-scrollbar">
        <div className="flex items-center justify-between">
          <span className="text-base font-bold text-gray-900 dark:text-gray-50">{title}</span>
          <button onClick={onClose} aria-label="Cerrar">
            <X size={18} className="text-gray-400" />
          </button>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400 flex flex-col gap-2">{children}</div>
      </div>
    </div>
  )
}

export default function Settings({ onNav }) {
  const { settings, updateSetting, logout } = usePantry()
  const [modal, setModal] = useState(null)

  const sections = [
    {
      title: 'Preferencias',
      items: [
        { label: 'Notificaciones push', Icon: Bell, type: 'toggle', key: 'pushNotifications' },
        { label: 'Alertas por email', Icon: Mail, type: 'toggle', key: 'emailAlerts' },
        { label: 'Tema oscuro', Icon: Moon, type: 'toggle', key: 'darkMode' },
        { label: 'Idioma', Icon: Globe, type: 'link', value: settings.language },
      ],
    },
    {
      title: 'Cuenta',
      items: [
        { label: 'Mi perfil', Icon: User, type: 'link', onPress: () => onNav('profile') },
        { label: 'Privacidad', Icon: Shield, type: 'link', onPress: () => setModal('privacy') },
      ],
    },
    {
      title: 'Información',
      items: [
        { label: 'Acerca de FreshBox', Icon: Package, type: 'link', onPress: () => setModal('about') },
        { label: 'Términos de uso', Icon: FileText, type: 'link', onPress: () => setModal('terms') },
      ],
    },
  ]

  return (
    <div className="w-full h-full flex flex-col bg-gray-50 dark:bg-gray-950 relative">
      <AppHeader title="Ajustes" />
      <div className="flex-1 overflow-y-auto no-scrollbar py-4 flex flex-col gap-5">
        {sections.map(({ title, items }) => (
          <div key={title}>
            <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest px-4 mb-1.5 block">
              {title}
            </span>
            <div className="border-t border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
              {items.map(({ label, Icon, type, key, value, onPress }, i) => {
                const rowCls = `w-full flex items-center gap-3 px-4 py-3.5 ${
                  i < items.length - 1 ? 'border-b border-gray-100 dark:border-gray-800' : ''
                }`
                const inner = (
                  <>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-fresh-50 dark:bg-fresh-900/20">
                      <Icon size={15} className="text-fresh-600 dark:text-fresh-400" strokeWidth={1.75} />
                    </div>
                    <span className="text-sm text-gray-900 dark:text-gray-100 flex-1 text-left font-medium">{label}</span>
                    {type === 'toggle' ? (
                      <Toggle value={settings[key]} onChange={(v) => updateSetting(key, v)} />
                    ) : (
                      <div className="flex items-center gap-1">
                        {value && <span className="text-xs text-gray-400">{value}</span>}
                        <ChevronRight size={14} className="text-gray-300 dark:text-gray-600" />
                      </div>
                    )}
                  </>
                )
                return type === 'toggle' ? (
                  <div key={label} className={rowCls}>
                    {inner}
                  </div>
                ) : (
                  <button key={label} onClick={() => onPress?.()} className={rowCls}>
                    {inner}
                  </button>
                )
              })}
            </div>
          </div>
        ))}

        <div className="px-4 pb-2">
          <button
            onClick={() => {
              logout()
              onNav('login')
            }}
            className="w-full h-11 border-2 border-red-200 dark:border-red-900 rounded-lg flex items-center justify-center gap-2 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
          >
            <LogOut size={15} className="text-red-500" />
            <span className="text-sm font-semibold text-red-500">Cerrar sesión</span>
          </button>
        </div>
      </div>

      <InfoModal open={modal === 'about'} title="Acerca de FreshBox" onClose={() => setModal(null)}>
        <p>FreshBox v1.0.0 — Frescura que no se te olvida.</p>
        <p>
          App para el control de vencimientos en la despensa: registra tus compras, mira qué vence pronto y recibe
          alertas antes de que se dañe la comida.
        </p>
        <p>Desarrollada por David De La Cuesta y Juan Manuel Arias · Curso Aplicaciones Móviles.</p>
      </InfoModal>
      <InfoModal open={modal === 'terms'} title="Términos de uso" onClose={() => setModal(null)}>
        <p>Proyecto académico sin fines comerciales. Los datos se guardan únicamente en tu dispositivo.</p>
      </InfoModal>
      <InfoModal open={modal === 'privacy'} title="Privacidad" onClose={() => setModal(null)}>
        <p>
          FreshBox no envía tu información a ningún servidor: productos, fotos y ajustes se almacenan localmente en tu
          navegador.
        </p>
      </InfoModal>

      <BottomNav active="settings" onNav={onNav} />
    </div>
  )
}
