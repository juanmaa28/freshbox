import { Milk, Leaf, Apple, Beef, Archive, Coffee, Wheat, Snowflake } from 'lucide-react'

export const CATEGORIES = [
  { id: 'lacteos', label: 'Lácteos', Icon: Milk, color: 'bg-sky-100 text-sky-600 dark:bg-sky-900/40 dark:text-sky-400' },
  { id: 'verduras', label: 'Verduras', Icon: Leaf, color: 'bg-fresh-100 text-fresh-600 dark:bg-fresh-900/40 dark:text-fresh-400' },
  { id: 'frutas', label: 'Frutas', Icon: Apple, color: 'bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400' },
  { id: 'carnes', label: 'Carnes', Icon: Beef, color: 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400' },
  { id: 'enlatados', label: 'Enlatados', Icon: Archive, color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400' },
  { id: 'bebidas', label: 'Bebidas', Icon: Coffee, color: 'bg-violet-100 text-violet-600 dark:bg-violet-900/40 dark:text-violet-400' },
  { id: 'cereales', label: 'Cereales', Icon: Wheat, color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/40 dark:text-yellow-400' },
  { id: 'congelados', label: 'Congelados', Icon: Snowflake, color: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/40 dark:text-cyan-400' },
]

export function categoryById(id) {
  return CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[0]
}
