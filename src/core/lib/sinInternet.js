// Cache que define vite.config.js para /modelos/.
const CACHE_MODELOS = 'modelos'

// Lista = service worker activo, modelo del asistente descargado y todos los recursos en caché.
export async function estaListaSinInternet(recursos, estadoAsistente) {
  if (!('serviceWorker' in navigator) || !('caches' in window)) return false
  if (estadoAsistente !== 'listo') return false
  try {
    const registro = await navigator.serviceWorker.getRegistration()
    if (!registro?.active) return false
    const encontrados = await Promise.all(
      recursos.map((ruta) => caches.match(ruta, { cacheName: CACHE_MODELOS })),
    )
    return encontrados.every(Boolean)
  } catch {
    return false
  }
}
