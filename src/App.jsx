import { useEffect, useState } from 'react'
import { PantryProvider, usePantry } from './context/PantryContext'
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

function AppShell() {
  const { user } = usePantry()
  const [route, setRoute] = useState({ id: 'splash', params: null })

  // Splash → Login u Home según sesión guardada
  useEffect(() => {
    if (route.id !== 'splash') return
    const t = setTimeout(() => {
      setRoute({ id: user ? 'home' : 'login', params: null })
    }, 2200)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.id])

  const navigate = (id, params = null) => setRoute({ id, params })

  const Screen = SCREENS[route.id] ?? Home

  return (
    <div className="min-h-dvh w-full flex items-center justify-center bg-gray-200 dark:bg-[#0a0f0d] md:py-8">
      {/* Móvil: pantalla completa · Escritorio: marco de teléfono 375×812 */}
      <div className="relative w-full h-dvh md:w-[375px] md:h-[812px] md:max-h-[92dvh] bg-white dark:bg-gray-950 overflow-hidden md:rounded-[40px] md:border-[3px] md:border-fresh-800 dark:md:border-fresh-900 md:shadow-2xl">
        <div key={route.id} className="w-full h-full animate-screen-in">
          <Screen onNav={navigate} params={route.params} />
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <PantryProvider>
      <AppShell />
    </PantryProvider>
  )
}
