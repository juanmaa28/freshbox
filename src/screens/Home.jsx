import { useRef, useState } from 'react'
import { Search, Plus, PackageOpen } from 'lucide-react'
import { usePantry } from '../context/PantryContext'
import { useCurrentUser } from '../store/authStore'
import { daysLeft } from '../utils/dates'
import { pantryStats, bucketOf } from '../utils/stats'
import { PantryHero, PantryFilter } from '../components/PantryStats'
import ProductCard from '../components/ProductCard'
import logoSrc from '../assets/freshbox-logo.jpeg'

export default function Home({ onNav }) {
  const { products, t } = usePantry()
  const user = useCurrentUser()
  const [bucket, setBucket] = useState('all')
  const [sortBy, setSortBy] = useState('expiry')
  // `stuck` solo sirve para encender el filo de la barra fija cuando el hero ya
  // pasó por debajo; sin él la barra flota sin apoyo visual sobre la lista.
  const [stuck, setStuck] = useState(false)
  const scrollRef = useRef(null)
  const heroRef = useRef(null)

  const handleScroll = () => {
    const top = scrollRef.current?.scrollTop ?? 0
    const heroHeight = heroRef.current?.offsetHeight ?? 0
    setStuck(top >= Math.max(0, heroHeight - 4))
  }

  // Se ordena sin modificar el arreglo original del contexto.
  const sorted = [...products].sort((a, b) =>
    sortBy === 'name' ? a.name.localeCompare(b.name, 'es') : daysLeft(a.expiryDate) - daysLeft(b.expiryDate)
  )
  const stats = pantryStats(products)
  // Las casillas de estadísticas hacen de filtro de la lista.
  const visible = sorted.filter((p) => bucket === 'all' || bucketOf(daysLeft(p.expiryDate)) === bucket)
  // Los grupos ayudan a identificar rápidamente el nivel de urgencia.
  const groups = [
    { label: t('home.expired'), products: visible.filter((p) => daysLeft(p.expiryDate) < 0) },
    { label: t('home.urgent'), products: visible.filter((p) => daysLeft(p.expiryDate) >= 0 && daysLeft(p.expiryDate) <= 3) },
    { label: t('home.week'), products: visible.filter((p) => daysLeft(p.expiryDate) > 3 && daysLeft(p.expiryDate) <= 7) },
    { label: t('home.later'), products: visible.filter((p) => daysLeft(p.expiryDate) > 7) },
  ].filter((group) => group.products.length > 0)

  return (
    <div className="relative flex h-full w-full flex-col bg-gray-50 dark:bg-gray-950">
      {/* Cabecera abierta, sin barra ni línea divisoria: el saludo es el título
          de la pantalla y el hero de abajo aporta el contraste. */}
      <header className="flex shrink-0 items-center justify-between gap-3 px-5 pb-2 pt-4 md:pt-10">
        <div className="flex min-w-0 items-center gap-3">
          <img
            src={logoSrc}
            alt=""
            aria-hidden="true"
            className="h-10 w-10 shrink-0 rounded-[13px] object-contain mix-blend-multiply dark:bg-white/90 dark:mix-blend-normal"
          />
          <div className="flex min-w-0 flex-col">
            <span className="eyebrow">FreshBox</span>
            {/* El saludo lleva un nombre que escribe el usuario: puede traer
                descendentes (j, g, p, q, y) y mayúsculas acentuadas. `truncate`
                recorta al borde de relleno, y Fraunces necesita 1.474 de
                interlineado para que su tinta quepa. En vez de un interlineado
                enorme, va 1.35 más `py-1`: el relleno aporta margen 1:1 y el
                interlineado solo 1:2. Deja ~2.7 px libres abajo y ~3.5 arriba. */}
            <h1 className="truncate py-1 font-display text-[21px] font-semibold leading-[1.35] tracking-[-0.025em] text-gray-900 dark:text-gray-50">
              {user ? t('home.greeting', { name: user.name }) : t('home.heroTitle')}
            </h1>
          </div>
        </div>
        <button
          onClick={() => onNav('search')}
          className="press flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-gray-600 shadow-card ring-1 ring-gray-900/5 hover:text-fresh-700 dark:bg-gray-900 dark:text-gray-300 dark:ring-white/5 dark:hover:text-fresh-400"
          aria-label={t('nav.search')}
        >
          <Search size={17} strokeWidth={1.9} />
        </button>
      </header>

      {/* El hero y la lista comparten un solo scroll: al bajar, el resumen se va
          hacia arriba y deja la pantalla entera para los productos. */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex flex-1 flex-col overflow-y-auto no-scrollbar"
      >
        <div ref={heroRef} className="shrink-0 px-4 pb-3">
          <PantryHero stats={stats} />
        </div>

        {/* Los filtros sí se quedan: son el control de la lista, no contexto. */}
        <div
          className={`sticky top-0 z-20 shrink-0 border-b bg-gray-50/90 px-4 pb-2 pt-1 backdrop-blur-xl transition-colors dark:bg-gray-950/90 ${
            stuck ? 'border-gray-900/[0.07] dark:border-white/[0.07]' : 'border-transparent'
          }`}
        >
          <PantryFilter stats={stats} selected={bucket} onSelect={setBucket} />
          <div className="mt-2 flex items-center justify-between px-1">
            <span className="eyebrow">{bucket === 'all' ? t('home.allPantry') : t(`stats.${bucket}`)}</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="select-clean -mr-1 cursor-pointer rounded-lg bg-transparent py-1 pl-2 text-[11.5px] font-medium text-gray-500 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-fresh-600 dark:text-gray-400 dark:hover:bg-gray-900"
              aria-label={t('home.order')}
            >
              <option value="expiry">{t('home.expiry')}</option>
              <option value="name">{t('home.name')}</option>
            </select>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-2.5 px-4 pb-[104px] pt-2.5">
          {visible.length === 0 ? (
            // Estado vacío compuesto: icono, mensaje y una salida clara.
            <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-fresh-50 text-fresh-600 ring-1 ring-fresh-100 dark:bg-fresh-900/25 dark:text-fresh-400 dark:ring-fresh-900/50">
                <PackageOpen size={28} strokeWidth={1.4} />
              </div>
              <p className="max-w-[15rem] text-[13.5px] leading-relaxed text-gray-500 dark:text-gray-400">
                {products.length === 0
                  ? t('home.empty')
                  : bucket === 'soon'
                    ? t('home.fresh')
                    : t('home.noneInGroup')}
              </p>
              {products.length === 0 && (
                <button
                  onClick={() => onNav('add')}
                  className="press rounded-full bg-fresh-700 px-5 py-2.5 text-[13px] font-semibold text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.16),0_2px_8px_rgb(13_60_40/0.24)] hover:bg-fresh-600"
                >
                  {t('home.add')}
                </button>
              )}
            </div>
          ) : (
            groups.map((group) => (
              <section key={group.label} className="stagger flex flex-col gap-2.5">
                <span className="eyebrow pt-1">{group.label}</span>
                {group.products.map((p) => (
                  <ProductCard key={p.id} product={p} onClick={() => onNav('detail', { productId: p.id })} />
                ))}
              </section>
            ))
          )}
        </div>
      </div>

      {/* El botón flota justo encima de la pastilla de navegación. */}
      <button
        onClick={() => onNav('add')}
        className="press absolute bottom-[92px] right-4 z-40 flex h-14 w-14 items-center justify-center rounded-2xl bg-fresh-700 text-white shadow-float ring-1 ring-white/15 hover:bg-fresh-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-fresh-300"
        aria-label={t('home.add')}
      >
        <Plus size={24} strokeWidth={2.4} />
      </button>

    </div>
  )
}
