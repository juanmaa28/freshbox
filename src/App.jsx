import { useEffect, useState } from 'react'
import { PantryProvider } from './context/PantryContext'
import { useCurrentUser } from './store/authStore'
import Splash from './screens/Splash'
import Login from './screens/Login'
import Home from './screens/Home'
import AddItem from './screens/AddItem'
import Detail from './screens/Detail'
import Categories from './screens/Categories'
import SearchScreen from './screens/SearchScreen'
import Notifications from './screens/Notifications'
import Settings from './screens/Settings'
import Profile from './screens/Profile'
import BottomNav from './components/BottomNav'

const SCREENS = {
  splash: Splash,
  login: Login,
  home: Home,
  add: AddItem,
  detail: Detail,
  categories: Categories,
  search: SearchScreen,
  notifications: Notifications,
  settings: Settings,
  profile: Profile,
}

// Rutas que muestran la navegación inferior. La barra se monta una sola vez en
// el marco (fuera del <main> con `key`), así sobrevive a los cambios de pantalla
// y su indicador puede viajar de una sección a otra en vez de renacer en su
// sitio: una transición CSS necesita un elemento que permanezca y cambie.
const NAV_ROUTES = ['home', 'categories', 'search', 'notifications', 'settings']

// AppShell controla la pantalla actual y centraliza la navegación de la app.
function AppShell() {
  const user = useCurrentUser()
  const [route, setRoute] = useState({ id: 'splash', params: null })

  // Después del Splash, una sesión guardada lleva al usuario a Home.
  useEffect(() => {
    if (route.id !== 'splash') return
    const t = setTimeout(() => {
      setRoute({ id: user ? 'home' : 'login', params: null })
    }, 2200)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.id])

  // params permite enviar datos entre pantallas, por ejemplo el ID de un producto.
  const navigate = (id, params = null) => setRoute({ id, params })

  const Screen = SCREENS[route.id] ?? Home

  return (
    <div className="app-shell relative min-h-dvh w-full flex items-center justify-center overflow-hidden md:py-10">
      {/* Ambiente de escritorio: dos halos verdes muy tenues sobre el lienzo hueso.
          En móvil queda oculto detrás de la pantalla, así que no cuesta nada. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden md:block bg-[radial-gradient(60%_50%_at_50%_-5%,rgba(29,107,76,0.16),transparent_65%),radial-gradient(45%_45%_at_85%_100%,rgba(29,107,76,0.10),transparent_70%)] dark:bg-[radial-gradient(60%_50%_at_50%_-5%,rgba(46,133,97,0.16),transparent_65%),radial-gradient(45%_45%_at_85%_100%,rgba(21,86,62,0.18),transparent_70%)]"
      />

      {/* Móvil: pantalla completa · Escritorio: chasis de teléfono 375×812 */}
      <div className="relative w-full h-dvh md:w-[375px] md:h-[812px] md:max-h-[92dvh] md:rounded-[52px] md:bg-gray-900 md:p-[9px] md:shadow-frame md:ring-1 md:ring-white/10 dark:md:bg-gray-800">
        <div className="app-device-screen relative w-full h-full bg-white dark:bg-gray-950 overflow-hidden md:rounded-[44px]">
          {/* Isla dinámica: solo un detalle de realismo en el marco de escritorio. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-2 left-1/2 z-50 hidden h-[26px] w-[96px] -translate-x-1/2 rounded-full bg-gray-900 md:block dark:bg-black"
          />
          <main key={route.id} className="w-full h-full animate-screen-in">
            <Screen onNav={navigate} params={route.params} />
          </main>
          {NAV_ROUTES.includes(route.id) && <BottomNav active={route.id} onNav={navigate} />}
        </div>
      </div>
    </div>
  )
}

export default function App() {
  // El provider hace disponibles los datos globales para todas las pantallas.
  return (
    <PantryProvider>
      <AppShell />
    </PantryProvider>
  )
}
