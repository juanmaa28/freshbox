import { daysFromNowISO } from '../utils/dates'

/** Productos de ejemplo (fechas relativas a hoy para que la demo siempre tenga alertas). */
export function seedProducts() {
  const items = [
    { name: 'Leche entera 1L', category: 'lacteos', bought: -3, expires: 0, quantity: '1 litro', location: 'Nevera · Estante 2' },
    { name: 'Yogur natural 500g', category: 'lacteos', bought: -4, expires: 1, quantity: '500 g', location: 'Nevera · Puerta' },
    { name: 'Pechuga de pollo', category: 'carnes', bought: -1, expires: 2, quantity: '600 g', location: 'Nevera · Cajón inferior' },
    { name: 'Espinacas bolsa', category: 'verduras', bought: -2, expires: 3, quantity: '1 bolsa', location: 'Nevera · Cajón verduras' },
    { name: 'Queso manchego', category: 'lacteos', bought: -6, expires: 5, quantity: '250 g', location: 'Nevera · Estante 1' },
    { name: 'Zumo de naranja', category: 'bebidas', bought: -2, expires: 6, quantity: '1.5 litros', location: 'Nevera · Puerta' },
    { name: 'Tomates cherry', category: 'verduras', bought: -1, expires: 7, quantity: '300 g', location: 'Despensa · Frutero' },
    { name: 'Manzanas rojas', category: 'frutas', bought: -3, expires: 9, quantity: '6 unidades', location: 'Despensa · Frutero' },
    { name: 'Atún en lata', category: 'enlatados', bought: -20, expires: 180, quantity: '3 latas', location: 'Despensa · Estante 3' },
    { name: 'Avena en hojuelas', category: 'cereales', bought: -10, expires: 90, quantity: '500 g', location: 'Despensa · Estante 2' },
    { name: 'Croquetas congeladas', category: 'congelados', bought: -15, expires: 60, quantity: '1 kg', location: 'Congelador' },
  ]
  return items.map((it, i) => ({
    id: `seed-${i}`,
    name: it.name,
    category: it.category,
    purchaseDate: daysFromNowISO(it.bought),
    expiryDate: daysFromNowISO(it.expires),
    quantity: it.quantity,
    location: it.location,
    notes: '',
    photo: null,
  }))
}
