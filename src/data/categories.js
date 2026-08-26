// Importa los iconos que representan visualmente cada tipo de alimento.
import { Milk, Leaf, Apple, Beef, Archive, Coffee, Wheat, Snowflake } from 'lucide-react'

// Catálogo central de categorías disponibles en la despensa.
// Cada objeto combina datos del dominio con la presentación visual.
export const CATEGORIES = [
  // id se guarda en cada producto; label es el texto visible en español.
  { id: 'lacteos', label: 'Lácteos', Icon: Milk, color: 'bg-sky-100 text-sky-600 dark:bg-sky-900/40 dark:text-sky-400' },
  // Las clases color se aplican al fondo y al icono de la tarjeta.
  { id: 'verduras', label: 'Verduras', Icon: Leaf, color: 'bg-fresh-100 text-fresh-600 dark:bg-fresh-900/40 dark:text-fresh-400' },
  { id: 'frutas', label: 'Frutas', Icon: Apple, color: 'bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400' },
  { id: 'carnes', label: 'Carnes', Icon: Beef, color: 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400' },
  { id: 'enlatados', label: 'Enlatados', Icon: Archive, color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400' },
  { id: 'bebidas', label: 'Bebidas', Icon: Coffee, color: 'bg-violet-100 text-violet-600 dark:bg-violet-900/40 dark:text-violet-400' },
  { id: 'cereales', label: 'Cereales', Icon: Wheat, color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/40 dark:text-yellow-400' },
  { id: 'congelados', label: 'Congelados', Icon: Snowflake, color: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/40 dark:text-cyan-400' },
]

// Devuelve la categoría del producto y usa la primera como respaldo.
export function categoryById(id) {
  // find recorre el catálogo hasta encontrar el ID solicitado.
  return CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[0]
}
