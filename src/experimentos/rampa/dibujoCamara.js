// Dibuja sobre el vídeo las marcas y el punto de la pelota. Los canvas usan los RGB de tokens.css.
const COLOR_MARCA = 'rgb(250, 232, 170)'
const COLOR_PELOTA = 'rgb(178, 40, 18)'
const COLOR_BORDE_CLARO = 'rgb(253, 250, 242)'
const COLOR_BORDE_OSCURO = 'rgb(28, 24, 18)'
const RADIO_ARO = 14

function circulo(contexto, x, y, radio, relleno, borde, grosor) {
  contexto.beginPath()
  contexto.arc(x, y, radio, 0, Math.PI * 2)
  contexto.fillStyle = relleno
  contexto.fill()
  contexto.lineWidth = grosor
  contexto.strokeStyle = borde
  contexto.stroke()
}

function aro(contexto, x, y, radio, color, grosor) {
  contexto.beginPath()
  contexto.arc(x, y, radio, 0, Math.PI * 2)
  contexto.lineWidth = grosor
  contexto.strokeStyle = color
  contexto.stroke()
}

// marcas y pelota van en píxeles de la imagen reducida, de tamaño ancho × alto.
export function dibujarEscena(lienzo, { marcas, pelota, ancho, alto }) {
  const densidad = window.devicePixelRatio || 1
  const anchoReal = Math.round(lienzo.clientWidth * densidad)
  const altoReal = Math.round(lienzo.clientHeight * densidad)
  if (lienzo.width !== anchoReal) lienzo.width = anchoReal
  if (lienzo.height !== altoReal) lienzo.height = altoReal

  const contexto = lienzo.getContext('2d')
  contexto.clearRect(0, 0, anchoReal, altoReal)
  const enX = (x) => (x / ancho) * anchoReal
  const enY = (y) => (y / alto) * altoReal

  if (marcas.length === 2) {
    contexto.beginPath()
    contexto.moveTo(enX(marcas[0].x), enY(marcas[0].y))
    contexto.lineTo(enX(marcas[1].x), enY(marcas[1].y))
    contexto.lineWidth = 2 * densidad
    contexto.strokeStyle = COLOR_MARCA
    contexto.stroke()
  }
  for (const marca of marcas) {
    circulo(
      contexto,
      enX(marca.x),
      enY(marca.y),
      7 * densidad,
      COLOR_MARCA,
      COLOR_BORDE_OSCURO,
      2 * densidad,
    )
  }
  if (pelota) {
    // Un aro, no un punto: el alumno tiene que ver la pelota dentro para comprobar que la sigue.
    const x = enX(pelota.x)
    const y = enY(pelota.y)
    aro(contexto, x, y, RADIO_ARO * densidad, COLOR_BORDE_CLARO, 5 * densidad)
    aro(contexto, x, y, RADIO_ARO * densidad, COLOR_PELOTA, 2.5 * densidad)
  }
}
