// Reparte un texto en líneas que caben en un ancho, sin cortar palabras. Función pura:
// recibe `medir(texto) → ancho`, así se puede probar sin canvas.

const PUNTOS = '…'

// Una palabra más larga que la línea (rara vez pasa) se parte por letras.
function partirPalabraLarga(palabra, ancho, medir) {
  const trozos = []
  let actual = ''
  for (const letra of palabra) {
    if (actual && medir(actual + letra) > ancho) {
      trozos.push(actual)
      actual = letra
    } else {
      actual += letra
    }
  }
  if (actual) trozos.push(actual)
  return trozos
}

// Acorta la última línea quitando palabras enteras hasta que quepa con "…".
function cerrarConPuntos(linea, ancho, medir) {
  const palabras = linea.split(' ')
  while (palabras.length > 1 && medir(`${palabras.join(' ')}${PUNTOS}`) > ancho) palabras.pop()
  return `${palabras.join(' ').replace(/[\s,.;:]+$/, '')}${PUNTOS}`
}

/**
 * Devuelve las líneas del texto, como mucho `maximoLineas`.
 * Si no cabe entero, la última línea termina en "…". Respeta los saltos de línea del texto.
 */
export function repartirEnLineas(texto, ancho, medir, maximoLineas = Infinity) {
  const lineas = []
  const parrafos = String(texto ?? '')
    .split('\n')
    .map((parrafo) => parrafo.trim())
    .filter(Boolean)

  for (const parrafo of parrafos) {
    let actual = ''
    for (const palabra of parrafo.split(/\s+/)) {
      const piezas = medir(palabra) > ancho ? partirPalabraLarga(palabra, ancho, medir) : [palabra]
      for (const pieza of piezas) {
        const prueba = actual ? `${actual} ${pieza}` : pieza
        if (actual && medir(prueba) > ancho) {
          lineas.push(actual)
          actual = pieza
        } else {
          actual = prueba
        }
      }
    }
    if (actual) lineas.push(actual)
  }

  if (lineas.length <= maximoLineas) return lineas
  const recortadas = lineas.slice(0, maximoLineas)
  recortadas[maximoLineas - 1] = cerrarConPuntos(recortadas[maximoLineas - 1], ancho, medir)
  return recortadas
}
