// Traduce el hash de la URL a la pantalla que toca.
function decodificar(texto) {
  try {
    return decodeURIComponent(texto)
  } catch {
    return texto
  }
}

export function interpretarRuta(hash) {
  const partes = String(hash ?? '')
    .replace(/^#\/?/, '')
    .split('/')
    .filter(Boolean)
    .map(decodificar)
  const [primera, id, sobrante] = partes
  const noEncontrada = { pantalla: 'no-encontrada' }

  if (sobrante !== undefined) return noEncontrada
  if (primera === undefined) return { pantalla: 'inicio' }
  if (primera === 'cuaderno') return id ? { pantalla: 'ficha', id } : { pantalla: 'cuaderno' }
  if (primera === 'experimento' && id) return { pantalla: 'experimento', id }
  if (primera === 'prueba' && id) return { pantalla: 'prueba', id }
  if (primera === 'ajustes' && !id) return { pantalla: 'ajustes' }
  return noEncontrada
}

export function navegar(ruta) {
  window.location.hash = ruta
}

let hashConfirmado = null
let bloqueador = null

// Mientras haya bloqueador, ningún cambio de ruta (ni el botón Atrás) saca de la pantalla actual.
export function escucharCambiosDeRuta(avisar) {
  hashConfirmado ??= window.location.hash
  const alCambiar = () => {
    const destino = window.location.hash
    if (bloqueador && destino !== hashConfirmado) {
      window.history.pushState(null, '', hashConfirmado || '#/')
      bloqueador(destino)
      return
    }
    hashConfirmado = destino
    avisar()
  }
  window.addEventListener('hashchange', alCambiar)
  return () => window.removeEventListener('hashchange', alCambiar)
}

export function bloquearSalida(alIntentarSalir) {
  bloqueador = alIntentarSalir
  return () => {
    if (bloqueador === alIntentarSalir) bloqueador = null
  }
}
