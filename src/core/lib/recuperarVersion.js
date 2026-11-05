// Al publicar una versión nueva, un móvil con la app abierta puede pedir archivos que ya no
// existen. Se recarga una vez para coger la versión nueva; si vuelve a fallar enseguida, no se
// insiste, para no entrar en un bucle: sale la pantalla de fallo.
const CLAVE = 'kanga-recarga-version'
const MS_ENTRE_RECARGAS = 10000

export function debeRecargar(ultimaRecarga, ahora) {
  return !ultimaRecarga || ahora - ultimaRecarga > MS_ENTRE_RECARGAS
}

export function iniciarRecuperacionVersion() {
  window.addEventListener('vite:preloadError', (evento) => {
    try {
      const ahora = Date.now()
      if (!debeRecargar(Number(sessionStorage.getItem(CLAVE)), ahora)) return
      sessionStorage.setItem(CLAVE, String(ahora))
    } catch {
      return
    }
    evento.preventDefault()
    window.location.reload()
  })
}
