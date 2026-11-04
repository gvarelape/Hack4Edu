// Traduce el hash de la URL (CONTRATO.md, punto 10) a la pantalla que toca.
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
