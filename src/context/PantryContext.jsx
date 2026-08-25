import { createContext, useContext, useEffect, useState } from 'react'
import { seedProducts } from '../data/seed'

const PantryContext = createContext(null)

const LS_KEYS = {
  products: 'freshbox_products',
  user: 'freshbox_user',
  settings: 'freshbox_settings',
  searches: 'freshbox_recent_searches',
}

const DEFAULT_SETTINGS = {
  pushNotifications: true,
  emailAlerts: false,
  darkMode: false,
  language: 'Español',
}

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function PantryProvider({ children }) {
  const [products, setProducts] = useState(() => load(LS_KEYS.products, null) ?? seedProducts())
  const [user, setUser] = useState(() => load(LS_KEYS.user, null))
  const [settings, setSettings] = useState(() => ({ ...DEFAULT_SETTINGS, ...load(LS_KEYS.settings, {}) }))
  const [recentSearches, setRecentSearches] = useState(() => load(LS_KEYS.searches, []))

  useEffect(() => {
    localStorage.setItem(LS_KEYS.products, JSON.stringify(products))
  }, [products])

  useEffect(() => {
    if (user) localStorage.setItem(LS_KEYS.user, JSON.stringify(user))
    else localStorage.removeItem(LS_KEYS.user)
  }, [user])

  useEffect(() => {
    localStorage.setItem(LS_KEYS.settings, JSON.stringify(settings))
  }, [settings])

  useEffect(() => {
    localStorage.setItem(LS_KEYS.searches, JSON.stringify(recentSearches))
  }, [recentSearches])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', settings.darkMode)
  }, [settings.darkMode])

  const addProduct = (data) => {
    const id = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`
    const product = { ...data, id: `p-${id}` }
    setProducts((prev) => [...prev, product])
    return product
  }

  const updateProduct = (id, data) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)))
  }

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const login = (email, name) => {
    setUser({
      name: name || email.split('@')[0],
      email,
      phone: '',
      memberSince: new Date().toISOString().slice(0, 10),
      plan: 'Free',
      avatar: null,
    })
  }

  const updateUser = (data) => {
    setUser((prev) => (prev ? { ...prev, ...data } : prev))
  }

  const logout = () => setUser(null)

  const addRecentSearch = (term) => {
    const clean = term.trim()
    if (!clean) return
    setRecentSearches((prev) => [clean, ...prev.filter((t) => t.toLowerCase() !== clean.toLowerCase())].slice(0, 5))
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem(LS_KEYS.searches)
  }

  const removeRecentSearch = (term) => {
    setRecentSearches((prev) => prev.filter((item) => item !== term))
  }

  const value = {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    user,
    login,
    logout,
    updateUser,
    settings,
    updateSetting,
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
