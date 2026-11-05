// Guarda los registros del cuaderno en el móvil con IndexedDB (idb-keyval).
// Si IndexedDB no funciona (modo incógnito, navegador antiguo), guarda en memoria.
// Ninguna función lanza errores: si algo falla, devuelven false, null o [].
import { createStore, get, set, del, entries } from 'idb-keyval'
import { registrosEjemplo } from './datos/registrosEjemplo.js'

const NOMBRE_BASE_DATOS = 'kanga'
const NOMBRE_ALMACEN = 'cuaderno'
const PREFIJO_REGISTRO = 'registro:'
const CLAVE_PERFIL = 'perfil'
const CLAVE_PRUEBA = 'prueba-de-escritura'
const LARGO_MAXIMO_NOMBRE = 40

// Se prepara una sola vez: { tipo: 'indexeddb', almacen } o { tipo: 'memoria', mapa }.
let preparacion = null

const copiar = (valor) =>
  typeof structuredClone === 'function' ? structuredClone(valor) : JSON.parse(JSON.stringify(valor))

const claveRegistro = (id) => `${PREFIJO_REGISTRO}${id}`

const esRegistroValido = (registro) =>
  registro !== null &&
  typeof registro === 'object' &&
  typeof registro.id === 'string' &&
  registro.id.length > 0

async function probarIndexedDB() {
  if (typeof indexedDB === 'undefined') return null
  try {
    const almacen = createStore(NOMBRE_BASE_DATOS, NOMBRE_ALMACEN)
    await set(CLAVE_PRUEBA, 1, almacen)
    await del(CLAVE_PRUEBA, almacen)
    return almacen
  } catch {
    return null
  }
}

// Pide al navegador que no borre los datos cuando le falte espacio. Si no puede, no pasa nada.
async function pedirGuardadoPersistente() {
  try {
    await navigator?.storage?.persist?.()
  } catch {
    // Sin persistencia los datos se guardan igual.
  }
}

function preparar() {
  if (!preparacion) {
    preparacion = probarIndexedDB().then((almacen) => {
      if (!almacen) return { tipo: 'memoria', mapa: new Map() }
      pedirGuardadoPersistente()
      return { tipo: 'indexeddb', almacen }
    })
  }
  return preparacion
}

async function leer(clave) {
  const destino = await preparar()
  if (destino.tipo === 'memoria') {
    return destino.mapa.has(clave) ? copiar(destino.mapa.get(clave)) : undefined
  }
  return get(clave, destino.almacen)
}

async function escribir(clave, valor) {
  const destino = await preparar()
  if (destino.tipo === 'memoria') destino.mapa.set(clave, copiar(valor))
  else await set(clave, valor, destino.almacen)
}

async function eliminar(clave) {
  const destino = await preparar()
  if (destino.tipo === 'memoria') destino.mapa.delete(clave)
  else await del(clave, destino.almacen)
}

async function leerTodo() {
  const destino = await preparar()
  if (destino.tipo === 'memoria') {
    return [...destino.mapa.entries()].map(([clave, valor]) => [clave, copiar(valor)])
  }
  return entries(destino.almacen)
}

// ---------- Lo que usa el resto de la app ----------

/** true si los datos solo se guardan en memoria y se perderán al cerrar. Para mostrar el Aviso. */
export async function esAlmacenTemporal() {
  const destino = await preparar()
  return destino.tipo === 'memoria'
}

/** Guarda (o sustituye) un registro. Devuelve true si se ha guardado. */
export async function guardarRegistro(registro) {
  if (!esRegistroValido(registro)) return false
  try {
    await escribir(claveRegistro(registro.id), registro)
    return true
  } catch {
    return false
  }
}

export async function obtenerRegistros() {
  try {
    const todo = await leerTodo()
    return todo
      .filter(
        ([clave, valor]) => String(clave).startsWith(PREFIJO_REGISTRO) && esRegistroValido(valor),
      )
      .map(([, valor]) => valor)
      .sort((a, b) => (Date.parse(b.fecha) || 0) - (Date.parse(a.fecha) || 0))
  } catch {
    return []
  }
}

export async function obtenerRegistro(id) {
  if (typeof id !== 'string' || id.length === 0) return null
  try {
    const registro = await leer(claveRegistro(id))
    return esRegistroValido(registro) ? registro : null
  } catch {
    return null
  }
}

/** Borra un registro. Devuelve true si ha ido bien (también si no existía). */
export async function borrarRegistro(id) {
  if (typeof id !== 'string' || id.length === 0) return false
  try {
    await eliminar(claveRegistro(id))
    return true
  } catch {
    return false
  }
}

/** Guarda los registros de ejemplo. Tienen ids fijos, así que no se duplican. */
export async function cargarRegistrosEjemplo() {
  const resultados = await Promise.all(registrosEjemplo.map(guardarRegistro))
  return resultados.every(Boolean)
}

/**
 * Perfil del alumno: { nombre, existe }. El nombre es opcional y puede ser ''.
 * existe es false si todavía no se le ha preguntado (así se pregunta solo la primera vez).
 */
export async function obtenerPerfil() {
  try {
    const perfil = await leer(CLAVE_PERFIL)
    return {
      nombre: typeof perfil?.nombre === 'string' ? perfil.nombre : '',
      existe: perfil !== undefined,
    }
  } catch {
    return { nombre: '', existe: false }
  }
}

/** Guarda el nombre del alumno, sin espacios de sobra y con un largo máximo. */
export async function guardarPerfil({ nombre = '' } = {}) {
  const limpio = String(nombre).trim().replace(/\s+/g, ' ').slice(0, LARGO_MAXIMO_NOMBRE)
  try {
    await escribir(CLAVE_PERFIL, { nombre: limpio })
    return true
  } catch {
    return false
  }
}
