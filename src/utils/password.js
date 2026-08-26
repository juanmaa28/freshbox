/**
 * Hasheo de contraseñas para el inicio de sesión local.
 *
 * Las cuentas viven solo en este dispositivo, pero aun así la contraseña nunca
 * se guarda en texto plano: se almacena su derivación PBKDF2 junto a una sal
 * aleatoria distinta por cuenta. Así, dos personas con la misma contraseña
 * producen hashes diferentes y el valor guardado no permite recuperarla.
 *
 * PBKDF2 viene incluido en Web Crypto, así que no hace falta ninguna librería
 * externa ni conexión a internet.
 */

const ITERACIONES = 150000
const LONGITUD_BYTES = 32

/** Web Crypto solo existe en contextos seguros (https, localhost, Capacitor). */
function tieneWebCrypto() {
  return typeof globalThis.crypto?.subtle?.deriveBits === 'function'
}

function aHex(bytes) {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
}

function desdeHex(hex) {
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < bytes.length; i += 1) {
    bytes[i] = Number.parseInt(hex.slice(i * 2, i * 2 + 2), 16)
  }
  return bytes
}

async function derivarPBKDF2(password, salt, iteraciones) {
  const clave = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  )
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: iteraciones, hash: 'SHA-256' },
    clave,
    LONGITUD_BYTES * 8
  )
  return new Uint8Array(bits)
}

/**
 * Respaldo para contextos sin Web Crypto (por ejemplo, abrir el HTML con
 * `file://`). Es mucho más débil que PBKDF2 y solo evita el texto plano; el
 * campo `algo` queda registrado para saber con qué método se creó cada cuenta.
 */
function derivarRespaldo(password, saltHex, iteraciones) {
  let h1 = 0x811c9dc5
  let h2 = 0x01000193
  const texto = `${saltHex}:${password}`
  for (let vuelta = 0; vuelta < iteraciones; vuelta += 1) {
    for (let i = 0; i < texto.length; i += 1) {
      const c = texto.charCodeAt(i) + vuelta
      h1 = Math.imul(h1 ^ c, 0x01000193) >>> 0
      h2 = Math.imul(h2 + c, 0x85ebca6b) >>> 0
    }
  }
  return `${h1.toString(16).padStart(8, '0')}${h2.toString(16).padStart(8, '0')}`
}

/** Genera { algo, salt, iterations, hash } para guardar junto a la cuenta. */
export async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const saltHex = aHex(salt)

  if (!tieneWebCrypto()) {
    return {
      algo: 'fallback-v1',
      salt: saltHex,
      iterations: 1000,
      hash: derivarRespaldo(password, saltHex, 1000),
    }
  }

  return {
    algo: 'pbkdf2-sha256',
    salt: saltHex,
    iterations: ITERACIONES,
    hash: aHex(await derivarPBKDF2(password, salt, ITERACIONES)),
  }
}

/** Compara en tiempo constante: no revela cuántos caracteres coincidieron. */
function igualSeguro(a, b) {
  if (a.length !== b.length) return false
  let distinto = 0
  for (let i = 0; i < a.length; i += 1) {
    distinto |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return distinto === 0
}

/** Comprueba una contraseña contra el registro guardado. */
export async function verifyPassword(password, registro) {
  if (!registro?.hash || !registro?.salt) return false

  const calculado =
    registro.algo === 'pbkdf2-sha256'
      ? aHex(await derivarPBKDF2(password, desdeHex(registro.salt), registro.iterations))
      : derivarRespaldo(password, registro.salt, registro.iterations)

  return igualSeguro(calculado, registro.hash)
}
