// Detección del tono de la botella a partir del espectro del micrófono.

export const FRECUENCIA_MINIMA = 80 // Hz
export const FRECUENCIA_MAXIMA = 2000 // Hz
export const UMBRAL_DB = -70
export const VENTANA_SEGUNDOS = 1
export const MUESTRAS_MINIMAS = 5
export const DISPERSION_MAXIMA = 0.03 // 3 %

// Se reutiliza para no crear un array en cada fotograma: importa en móviles baratos.
let espectro = null

export function frecuenciaDominante(analizador, frecuenciaMuestreo) {
  if (!espectro || espectro.length !== analizador.frequencyBinCount) {
    espectro = new Float32Array(analizador.frequencyBinCount)
  }
  analizador.getFloatFrequencyData(espectro)
  return buscarPico(espectro, frecuenciaMuestreo)
}

// Devuelve la frecuencia en Hz del pico más alto de la banda, o null si no hay tono.
export function buscarPico(valoresDb, frecuenciaMuestreo) {
  const hzPorBanda = frecuenciaMuestreo / (2 * valoresDb.length)
  const inicio = Math.max(1, Math.ceil(FRECUENCIA_MINIMA / hzPorBanda))
  const fin = Math.min(valoresDb.length - 2, Math.floor(FRECUENCIA_MAXIMA / hzPorBanda))

  let posicion = -1
  let maximo = -Infinity
  for (let i = inicio; i <= fin; i++) {
    const valor = valoresDb[i]
    // Solo máximos locales: así el retumbar por debajo de 80 Hz no se confunde con un pico.
    if (valor > maximo && valor > valoresDb[i - 1] && valor >= valoresDb[i + 1]) {
      posicion = i
      maximo = valor
    }
  }

  if (posicion === -1 || maximo < UMBRAL_DB) return null
  return (posicion + desplazamientoParabolico(valoresDb, posicion)) * hzPorBanda
}

// Afina la posición del pico entre dos bandas, ajustando una parábola a sus vecinos.
function desplazamientoParabolico(valoresDb, i) {
  const izquierda = valoresDb[i - 1]
  const centro = valoresDb[i]
  const derecha = valoresDb[i + 1]
  const desplazamiento = (0.5 * (izquierda - derecha)) / (izquierda - 2 * centro + derecha)
  return Number.isFinite(desplazamiento) ? desplazamiento : 0
}

// Se queda con las lecturas del último segundo. historial: [{ tiempo, frecuencia }], tiempo en s.
export function recortarHistorial(historial, ahora) {
  return historial.filter(({ tiempo }) => {
    const edad = ahora - tiempo
    return edad >= 0 && edad <= VENTANA_SEGUNDOS // edad < 0: quedó de antes de reiniciar el reloj
  })
}

// Decide si el tono del último segundo es estable. `frecuencia` es la mediana de las lecturas,
// o null si no hay ninguna; solo se puede registrar cuando `estable` es true.
export function lecturaEstable(historial, ahora) {
  const frecuencias = recortarHistorial(historial, ahora).map(({ frecuencia }) => frecuencia)
  if (frecuencias.length === 0) {
    return { estable: false, frecuencia: null, dispersion: null, muestras: 0 }
  }

  const frecuencia = mediana(frecuencias)
  const dispersion = dispersionRelativa(frecuencias, frecuencia)
  return {
    estable: frecuencias.length >= MUESTRAS_MINIMAS && dispersion < DISPERSION_MAXIMA,
    frecuencia,
    dispersion,
    muestras: frecuencias.length,
  }
}

// De 0 a 1, para la barrita: sube con las muestras y baja cuando el tono varía.
export function nivelEstabilidad({ frecuencia, dispersion, muestras }) {
  if (frecuencia === null) return 0
  const porMuestras = Math.min(1, muestras / MUESTRAS_MINIMAS)
  const porDispersion = Math.max(0, 1 - dispersion / (2 * DISPERSION_MAXIMA))
  return porMuestras * porDispersion
}

export function mediana(valores) {
  const ordenados = [...valores].sort((a, b) => a - b)
  const mitad = Math.floor(ordenados.length / 2)
  if (ordenados.length % 2 === 1) return ordenados[mitad]
  return (ordenados[mitad - 1] + ordenados[mitad]) / 2
}

// Desviación mediana relativa: un salto suelto a un armónico no invalida un soplido bueno.
function dispersionRelativa(valores, centro) {
  return mediana(valores.map((valor) => Math.abs(valor - centro))) / centro
}
