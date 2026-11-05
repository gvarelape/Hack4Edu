// Modelo del tubo cerrado por abajo: f = v / (4 · L).

export const VELOCIDAD_REFERENCIA = 343 // m/s, a unos 20 °C
const CAMBIO_MINIMO = 0.03 // por debajo de un 3 % no se distingue de la variación de un soplido

// Frecuencia que predice el modelo, o null si la altura no es válida.
export function frecuenciaTeorica(alturaCm) {
  if (!(alturaCm > 0)) return null
  return VELOCIDAD_REFERENCIA / (4 * (alturaCm / 100))
}

// Recta por mínimos cuadrados. Devuelve null si no se puede trazar una sola recta.
export function regresionLineal(xs, ys) {
  const n = xs.length
  if (n < 2 || n !== ys.length) return null

  const mediaX = xs.reduce((suma, x) => suma + x, 0) / n
  const mediaY = ys.reduce((suma, y) => suma + y, 0) / n

  let covarianza = 0
  let varianzaX = 0
  for (let i = 0; i < n; i++) {
    covarianza += (xs[i] - mediaX) * (ys[i] - mediaY)
    varianzaX += (xs[i] - mediaX) ** 2
  }
  if (varianzaX === 0) return null

  const pendiente = covarianza / varianzaX
  return { pendiente, ordenada: mediaY - pendiente * mediaX }
}

// Velocidad del sonido en m/s. Con la corrección de extremo d, el aire vibra como un tubo algo
// más largo: 1/f = 4 · (L + d) / v. Es una recta en L de pendiente 4/v, así que v = 4 / pendiente,
// y d no estropea el resultado como pasaría al ajustar f frente a 1/L.
// medidas: [{ alturaCm, frecuencia }]. Devuelve null si las medidas no permiten calcularla:
// menos de 2 alturas distintas, o una pendiente que no sea positiva.
export function velocidadSonido(medidas) {
  const validas = medidas.filter(({ alturaCm, frecuencia }) => alturaCm > 0 && frecuencia > 0)
  const alturasMetros = validas.map(({ alturaCm }) => alturaCm / 100)
  const periodos = validas.map(({ frecuencia }) => 1 / frecuencia)

  const recta = regresionLineal(alturasMetros, periodos)
  if (!recta || recta.pendiente <= 0) return null
  return 4 / recta.pendiente
}

// Cómo cambia el tono al añadir agua, es decir, al quitar aire: 'más agudo', 'más grave' o 'igual'.
// Devuelve null si no hay alturas distintas para comparar.
export function tendenciaAlLlenar(medidas) {
  const alturas = medidas.map(({ alturaCm }) => alturaCm)
  const frecuencias = medidas.map(({ frecuencia }) => frecuencia)
  const recta = regresionLineal(alturas, frecuencias)
  if (!recta) return null

  const rango = Math.max(...alturas) - Math.min(...alturas)
  const media = frecuencias.reduce((suma, f) => suma + f, 0) / frecuencias.length
  if (Math.abs(recta.pendiente * rango) / media < CAMBIO_MINIMO) return 'igual'
  return recta.pendiente < 0 ? 'más agudo' : 'más grave'
}
