import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { hashPassword, verifyPassword } from '../utils/password'

/**
 * Sesión y cuentas de FreshBox, guardadas solo en este dispositivo.
 *
 * No hay servidor: el registro y el inicio de sesión se resuelven contra
 * `localStorage`, así que la aplicación funciona sin conexión.
 *
 * El estado separa dos cosas a propósito:
 *   - `accounts`     datos de perfil, seguros de mostrar en la interfaz.
 *   - `credentials`  sal y hash de cada contraseña, que nunca salen de aquí.
 *
 * Gracias a esa separación, el objeto de usuario que reciben las pantallas no
 * contiene ningún dato sensible.
 */

const normalizarCorreo = (correo) => correo.trim().toLowerCase()

// Crea un identificador estable para la cuenta y usa un respaldo cuando el
// navegador o el WebView no ofrecen randomUUID.
const nuevoId = () =>
  globalThis.crypto?.randomUUID?.() ?? `u-${Date.now()}-${Math.random().toString(36).slice(2)}`

export const useAuthStore = create()(
  persist(
    (set, get) => ({
      accounts: [],
      credentials: {},
      currentUserId: null,

      /** Crea una cuenta y deja la sesión iniciada. */
      register: async ({ name, email, password }) => {
        // Normaliza el correo antes de buscar duplicados, de modo que las
        // mayúsculas no permitan registrar dos cuentas equivalentes.
        const correo = normalizarCorreo(email)

        if (get().accounts.some((cuenta) => cuenta.email === correo)) {
          return { ok: false, error: 'emailTaken' }
        }

        const id = nuevoId()
        const cuenta = {
          id,
          name: name.trim(),
          email: correo,
          phone: '',
          memberSince: new Date().toISOString().slice(0, 10),
          plan: 'Free',
          avatar: null,
        }

        // El hasheo se resuelve antes del `set`, que es síncrono.
        const registro = await hashPassword(password)

        // Agrega la cuenta, sus credenciales derivadas y la sesión activa en
        // una sola actualización del store persistido.
        set((estado) => ({
          accounts: [...estado.accounts, cuenta],
          credentials: { ...estado.credentials, [id]: registro },
          currentUserId: id,
        }))

        return { ok: true }
      },

      /** Valida las credenciales contra la cuenta guardada. */
      login: async ({ email, password }) => {
        // Busca la cuenta por correo normalizado y obtiene su registro de hash;
        // si no existe, verifyPassword recibe null y devuelve false.
        const correo = normalizarCorreo(email)
        const cuenta = get().accounts.find((c) => c.email === correo)
        const registro = cuenta ? get().credentials[cuenta.id] : null

        // Se comprueba igual aunque la cuenta no exista, para no revelar por
        // el tiempo de respuesta si el correo está registrado o no.
        const valido = await verifyPassword(password, registro)

        if (!cuenta || !valido) return { ok: false, error: 'invalidCredentials' }

        set({ currentUserId: cuenta.id })
        return { ok: true }
      },

      // El cierre de sesión solo elimina el ID activo; las cuentas permanecen
      // guardadas para permitir volver a iniciar sesión en este dispositivo.
      logout: () => set({ currentUserId: null }),

      /** Actualiza el perfil de la sesión activa (nombre, teléfono, avatar…). */
      updateProfile: (datos) =>
        set((estado) => ({
          accounts: estado.accounts.map((cuenta) =>
            cuenta.id === estado.currentUserId ? { ...cuenta, ...datos } : cuenta
          ),
        })),
    }),
    {
      name: 'freshbox_auth',
      version: 1,
    }
  )
)

/**
 * Usuario de la sesión activa, o `null`.
 * `find` devuelve la referencia guardada en el array, así que el componente
 * solo se vuelve a renderizar cuando esa cuenta cambia de verdad.
 */
export const useCurrentUser = () =>
  useAuthStore((estado) => estado.accounts.find((c) => c.id === estado.currentUserId) ?? null)
