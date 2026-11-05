import { formatear } from './numeros'

// La misma caché que define vite.config.js para /modelos/.
const CACHE_MODELOS = 'modelos'

const estaEnCache = async (ruta) => Boolean(await caches.match(ruta, { cacheName: CACHE_MODELOS }))

export const haySoporteSinInternet = () => 'serviceWorker' in navigator && 'caches' in window

// Lista = service worker activo y todos los recursos en caché. El modelo del asistente es opcional.
export async function estaListaSinInternet(recursos) {
  if (!haySoporteSinInternet()) return false
  try {
    const registro = await navigator.serviceWorker.getRegistration()
    if (!registro?.active) return false
    const encontrados = await Promise.all(recursos.map(estaEnCache))
    return encontrados.every(Boolean)
  } catch {
    return false
  }
}

export async function estanEnCache(recursos) {
  try {
    const encontrados = await Promise.all(recursos.map(estaEnCache))
    return encontrados.every(Boolean)
  } catch {
    return false
  }
}

const leerLargo = (respuesta) => {
  const largo = Number(respuesta.headers.get('content-length'))
  return largo > 0 ? largo : null
}

// Tamaño aproximado de un archivo, sin descargarlo. null si no se puede saber.
export async function consultarTamano(ruta) {
  try {
    const enCache = await caches.match(ruta, { cacheName: CACHE_MODELOS })
    if (enCache) return leerLargo(enCache)
    const respuesta = await fetch(ruta, { method: 'HEAD' })
    return respuesta.ok ? leerLargo(respuesta) : null
  } catch {
    return null
  }
}

// `onFraccion` recibe de 0 a 1, o null si el servidor no dice cuánto ocupa.
export async function descargarRecurso(ruta, onFraccion) {
  if (await estaEnCache(ruta)) {
    onFraccion?.(1)
    return
  }
  const respuesta = await fetch(ruta)
  const tipo = respuesta.headers.get('content-type') ?? ''
  // Un servidor puede responder con la página de la app si el archivo no existe.
  if (!respuesta.ok || tipo.includes('text/html')) {
    const error = new Error(`Falta ${ruta}`)
    error.name = 'RecursoNoDisponible'
    throw error
  }

  const cache = await caches.open(CACHE_MODELOS)
  // Se clona antes de leer: una respuesta que ya se está leyendo no se puede copiar.
  const copia = respuesta.clone()
  const lector = respuesta.body?.getReader()
  // Si no se puede guardar (sin espacio, por ejemplo), no sigue descargando para nada.
  let falloAlGuardar = null
  const guardado = cache.put(ruta, copia).catch((fallo) => {
    falloAlGuardar = fallo
    return lector?.cancel()
  })
  // Con la cabecera de compresión, el largo no coincide con los bytes que se leen.
  const total = respuesta.headers.get('content-encoding') ? null : leerLargo(respuesta)
  let recibidos = 0
  while (lector) {
    const { done, value } = await lector.read()
    if (done) break
    recibidos += value.length
    onFraccion?.(total ? Math.min(recibidos / total, 1) : null)
  }
  await guardado
  if (falloAlGuardar) throw falloAlGuardar
  onFraccion?.(1)
}

export function mensajeErrorDescarga(error) {
  if (error?.name === 'QuotaExceededError') {
    return 'No queda espacio en el móvil. Libera un poco y vuelve a intentarlo.'
  }
  if (error?.name === 'RecursoNoDisponible') {
    return 'Este archivo no está disponible ahora mismo. Inténtalo más tarde.'
  }
  return 'No hemos podido descargarlo. Revisa tu conexión y vuelve a intentarlo.'
}

export function formatearTamano(bytes) {
  if (!Number.isFinite(bytes)) return null
  const megas = bytes / (1024 * 1024)
  if (megas < 1) return `${formatear(Math.max(Math.round(bytes / 1024), 1), 0)} KB`
  return `${formatear(megas, megas < 10 ? 1 : 0)} MB`
}
