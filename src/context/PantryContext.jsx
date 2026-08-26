import { createContext, useContext, useEffect, useState } from 'react'
import { useAuthStore } from '../store/authStore'
import { createTranslator } from '../utils/i18n'
import { parseQuantity, formatQuantity } from '../utils/quantity'

const PantryContext = createContext(null)

// Claves usadas por localStorage para mantener la información sin servidor.
// La sesión y las cuentas viven en `src/store/authStore.js` (Zustand).
const LS_KEYS = {
  products: 'freshbox_products',
  settings: 'freshbox_settings',
  searches: 'freshbox_recent_searches',
}

const DEFAULT_SETTINGS = {
  pushNotifications: true,
  emailAlerts: false,
  darkMode: false,
  language: 'Español',
}

// Lee datos guardados y usa un valor alternativo si no existen o están dañados.
function load(key, fallback) {
  // Intenta leer y convertir el JSON guardado; si falta o está corrupto,
  // devuelve el valor inicial para que la aplicación pueda arrancar.
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

/**
 * La despensa se guarda como { idDeUsuario: productos[] }: cada cuenta tiene la
 * suya, así que al registrarse se empieza con la despensa vacía y nadie ve los
 * productos de otra persona.
 */
function cargarDespensas() {
  const guardado = load(LS_KEYS.products, {})
  // El formato anterior era un único array compartido por todas las cuentas.
  if (!guardado || typeof guardado !== 'object' || Array.isArray(guardado)) return {}
  return guardado
}

// Referencia estable: evita re-renderizar a los consumidores en cada pasada.
const DESPENSA_VACIA = []

export function PantryProvider({ children }) {
  // La despensa depende de quién tenga la sesión abierta.
  const userId = useAuthStore((estado) => estado.currentUserId)
  const [despensas, setDespensas] = useState(cargarDespensas)
  const [settings, setSettings] = useState(() => ({ ...DEFAULT_SETTINGS, ...load(LS_KEYS.settings, {}) }))
  const [recentSearches, setRecentSearches] = useState(() => load(LS_KEYS.searches, []))
  // El traductor se reconstruye cuando cambia el idioma seleccionado.
  const t = createTranslator(settings.language)

  // Una cuenta sin entrada todavía (recién registrada) no tiene productos.
  const products = (userId && despensas[userId]) || DESPENSA_VACIA

  /**
   * Aplica un cambio solo sobre la despensa de la sesión activa.
   * Mantiene la firma de un `setState`, así que el resto de acciones no cambia.
   */
  const setProducts = (updater) => {
    if (!userId) return
    setDespensas((prev) => {
      const actuales = prev[userId] ?? DESPENSA_VACIA
      return {
        ...prev,
        [userId]: typeof updater === 'function' ? updater(actuales) : updater,
      }
    })
  }

  // Cada efecto sincroniza un estado con el almacenamiento local.
  useEffect(() => {
    // Serializa todas las despensas por usuario cada vez que cambia el estado.
    localStorage.setItem(LS_KEYS.products, JSON.stringify(despensas))
  }, [despensas])

  useEffect(() => {
    // Guarda idioma, tema y preferencias de alertas para restaurarlos al volver.
    localStorage.setItem(LS_KEYS.settings, JSON.stringify(settings))
  }, [settings])

  useEffect(() => {
    // Persiste el historial completo para conservarlo entre sesiones.
    localStorage.setItem(LS_KEYS.searches, JSON.stringify(recentSearches))
  }, [recentSearches])

  useEffect(() => {
    // Activa o retira la clase global que Tailwind usa para el tema oscuro.
    document.documentElement.classList.toggle('dark', settings.darkMode)
  }, [settings.darkMode])

  const addProduct = (data) => {
    // randomUUID evita colisiones si se agregan productos muy rápidamente.
    const id = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`
    const product = { ...data, id: `p-${id}` }
    setProducts((prev) => [...prev, product])
    return product
  }

  const updateProduct = (id, data) => {
    // Recorre los productos de la cuenta y fusiona datos solo en el ID indicado.
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)))
  }

  const deleteProduct = (id) => {
    // Filtra el producto seleccionado y conserva todos los demás sin mutarlos.
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  // El nuevo valor se calcula dentro del actualizador para no perder toques
  // rápidos seguidos: cada ajuste parte de la cantidad más reciente.
  const adjustQuantity = (id, delta) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p
        const parsed = parseQuantity(p.quantity)
        if (!parsed) return p
        const amount = Math.max(1, parsed.amount + delta)
        return { ...p, quantity: formatQuantity(amount, parsed.unit, parsed.separator) }
      })
    )
  }

  const clearProducts = () => setProducts([])

  const updateSetting = (key, value) => {
    // Copia las preferencias anteriores y reemplaza únicamente la opción editada.
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const addRecentSearch = (term) => {
    // Se normaliza el texto, se quitan duplicados y se conservan solo cinco búsquedas.
    const clean = term.trim()
    if (!clean) return
    setRecentSearches((prev) => [clean, ...prev.filter((t) => t.toLowerCase() !== clean.toLowerCase())].slice(0, 5))
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem(LS_KEYS.searches)
  }

  const removeRecentSearch = (term) => {
    // Recorre el historial y elimina únicamente la búsqueda que coincide
    // exactamente con el término seleccionado.
    setRecentSearches((prev) => prev.filter((item) => item !== term))
  }

  const value = {
    products,
    addProduct,
    updateProduct,
    adjustQuantity,
    deleteProduct,
    clearProducts,
    settings,
    updateSetting,
    t,
    recentSearches,
    addRecentSearch,
    clearRecentSearches,
    removeRecentSearch,
  }

  return <PantryContext.Provider value={value}>{children}</PantryContext.Provider>
}

export function usePantry() {
  const ctx = useContext(PantryContext)
  if (!ctx) throw new Error('usePantry debe usarse dentro de PantryProvider')
  return ctx
}
