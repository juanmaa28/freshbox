// Importa los iconos que representan visualmente cada tipo de alimento.
import { Milk, Leaf, Apple, Beef, Archive, Coffee, Wheat, Snowflake } from 'lucide-react'

// Catálogo central de categorías disponibles en la despensa.
// Cada objeto combina datos del dominio con la presentación visual.
//
// Los colores no son los tonos de fábrica: son una paleta de despensa
// desaturada (tierras, salvia, ciruela, trigo) con la misma luminosidad, para
// que las ocho categorías se distingan entre sí sin competir con el verde de
// marca ni con el rojo/ámbar que señalan la urgencia.
export const CATEGORIES = [
  // id se guarda en cada producto; label es el texto visible en español.
  // color se aplica al fondo y al icono; tint es el sólido para barras y puntos.
  {
    id: 'lacteos',
    label: 'Lácteos',
    Icon: Milk,
    tint: '#4f6690',
    color: 'bg-[#e8ecf5] text-[#4f6690] dark:bg-[#4f6690]/22 dark:text-[#a9bcda]',
  },
  {
    id: 'verduras',
    label: 'Verduras',
    Icon: Leaf,
    tint: '#4c7350',
    color: 'bg-[#e6efe6] text-[#4c7350] dark:bg-[#4c7350]/22 dark:text-[#a3c9a7]',
  },
  {
    id: 'frutas',
    label: 'Frutas',
    Icon: Apple,
    tint: '#a1564e',
    color: 'bg-[#f6e8e7] text-[#a1564e] dark:bg-[#a1564e]/22 dark:text-[#dfa89f]',
  },
  {
    id: 'carnes',
    label: 'Carnes',
    Icon: Beef,
    tint: '#9b4459',
    color: 'bg-[#f4e7ea] text-[#9b4459] dark:bg-[#9b4459]/22 dark:text-[#dc9daa]',
  },
  {
    id: 'enlatados',
    label: 'Enlatados',
    Icon: Archive,
    tint: '#8a6b3d',
    color: 'bg-[#f2ebe0] text-[#8a6b3d] dark:bg-[#8a6b3d]/22 dark:text-[#d3b686]',
  },
  {
    id: 'bebidas',
    label: 'Bebidas',
    Icon: Coffee,
    tint: '#6b5a86',
    color: 'bg-[#ece9f2] text-[#6b5a86] dark:bg-[#6b5a86]/22 dark:text-[#bdb0d4]',
  },
  {
    id: 'cereales',
    label: 'Cereales',
    Icon: Wheat,
    tint: '#8a7834',
    color: 'bg-[#f4efdd] text-[#8a7834] dark:bg-[#8a7834]/22 dark:text-[#d5c67e]',
  },
  {
    id: 'congelados',
    label: 'Congelados',
    Icon: Snowflake,
    tint: '#3a7176',
    color: 'bg-[#e2eeee] text-[#3a7176] dark:bg-[#3a7176]/22 dark:text-[#95c4c8]',
  },
]

// Devuelve la categoría del producto y usa la primera como respaldo.
export function categoryById(id) {
  // find recorre el catálogo hasta encontrar el ID solicitado.
  return CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[0]
}
