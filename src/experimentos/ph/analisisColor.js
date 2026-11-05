// Para leer el color del líquido.

// Por debajo de estos valores la lectura no sirve para estimar el pH.
export const SATURACION_MINIMA = 0.15
export const BRILLO_MINIMO = 0.15

// Color medio (r, g, b de 0 a 255) de un rectángulo del canvas.
export function colorMedio(ctx, x, y, ancho, alto) {
  const { data } = ctx.getImageData(
    Math.round(x),
    Math.round(y),
    Math.round(ancho),
    Math.round(alto),
  )
  const pixeles = data.length / 4
  if (pixeles === 0) return { r: 0, g: 0, b: 0 }

  let r = 0
  let g = 0
  let b = 0
  for (let i = 0; i < data.length; i += 4) {
    r += data[i]
    g += data[i + 1]
    b += data[i + 2]
  }
  return {
    r: Math.round(r / pixeles),
    g: Math.round(g / pixeles),
    b: Math.round(b / pixeles),
  }
}

// RGB (0–255) a HSV: h en grados (0–360), s y v de 0 a 1.
export function rgbAHsv({ r, g, b }) {
  const rn = r / 255
  const gn = g / 255
  const bn = b / 255
  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  const delta = max - min

  let h = 0
  if (delta !== 0) {
    if (max === rn) h = 60 * (((gn - bn) / delta) % 6)
    else if (max === gn) h = 60 * ((bn - rn) / delta + 2)
    else h = 60 * ((rn - gn) / delta + 4)
  }
  if (h < 0) h += 360

  return { h, s: max === 0 ? 0 : delta / max, v: max }
}

// Dice si el color sirve para estimar el pH y, si no, por qué.
// Se mira primero el brillo: con poca luz la saturación tampoco es fiable.
export function lecturaValida(hsv) {
  if (hsv.v < BRILLO_MINIMO) {
    return { valida: false, motivo: 'poca-luz', mensaje: 'Está muy oscuro. Busca más luz.' }
  }
  if (hsv.s < SATURACION_MINIMA) {
    return {
      valida: false,
      motivo: 'sin-color',
      mensaje: 'No veo un color claro. Acerca el vaso y pon el folio blanco detrás.',
    }
  }
  return { valida: true, motivo: null, mensaje: null }
}

// Media de varios colores { r, g, b }. Sirve para estabilizar la lectura. null si no hay ninguno.
export function promedioColores(colores) {
  if (colores.length === 0) return null
  const suma = colores.reduce(
    (total, c) => ({ r: total.r + c.r, g: total.g + c.g, b: total.b + c.b }),
    { r: 0, g: 0, b: 0 },
  )
  return {
    r: Math.round(suma.r / colores.length),
    g: Math.round(suma.g / colores.length),
    b: Math.round(suma.b / colores.length),
  }
}
