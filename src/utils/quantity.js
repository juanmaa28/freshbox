/**
 * La cantidad se guarda como texto libre ("3 latas", "1.5 litros") para no
 * limitar al usuario. Estas funciones extraen el número inicial para poder
 * sumarlo o restarlo, conservando siempre la unidad que escribió.
 */

/** "3 latas" → { amount: 3, unit: 'latas', separator: '.' }. Devuelve null si no hay número. */
export function parseQuantity(text) {
  // La expresión regular separa el número inicial de la unidad escrita por
  // el usuario; si el texto no empieza por un número, no se puede ajustar.
  const match = String(text ?? '')
    .trim()
    .match(/^(\d+(?:[.,]\d+)?)\s*(.*)$/)
  if (!match) return null

  const [, rawNumber, unit] = match
  return {
    amount: Number(rawNumber.replace(',', '.')),
    unit: unit.trim(),
    // Se recuerda el separador para devolver el decimal como lo escribió el usuario.
    separator: rawNumber.includes(',') ? ',' : '.',
  }
}

/** Reconstruye el texto: formatQuantity(4, 'latas') → "4 latas". */
export function formatQuantity(amount, unit, separator = '.') {
  // Se redondea para evitar arrastrar errores de coma flotante.
  const rounded = Math.round(amount * 100) / 100
  // Mantiene la unidad y recupera coma o punto según el separador original.
  const text = Number.isInteger(rounded) ? String(rounded) : String(rounded).replace('.', separator)
  return unit ? `${text} ${unit}` : text
}
