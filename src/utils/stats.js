import { daysLeft } from './dates'

/**
 * Estado de un producto dentro de la despensa.
 * Es la única definición de los grupos: la usan las estadísticas, el filtro de
 * Inicio y el perfil, así que los números nunca se contradicen entre pantallas.
 */
export function bucketOf(days) {
  if (days < 0) return 'expired'
  if (days <= 7) return 'soon'
  return 'fresh'
}

/** Cuenta los productos de cada grupo: { total, expired, soon, fresh }. */
export function pantryStats(products) {
  const stats = { total: products.length, expired: 0, soon: 0, fresh: 0 }
  // Cada iteración calcula los días restantes del producto y aumenta el
  // contador del grupo correspondiente: vencido, próximo o fresco.
  for (const product of products) {
    stats[bucketOf(daysLeft(product.expiryDate))] += 1
  }
  return stats
}
