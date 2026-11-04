// Detección del tono de la botella a partir del espectro del micrófono.

export const FRECUENCIA_MINIMA = 80 // Hz
export const FRECUENCIA_MAXIMA = 2000 // Hz
export const UMBRAL_DB = -70
export const VENTANA_SEGUNDOS = 1
export const MUESTRAS_MINIMAS = 5
export const DISPERSION_MAXIMA = 0.03 // 3 %
export const DURACION_MINIMA = 0.5 // s: un golpe o una palabra suelta duran menos
export const HUECO_MAXIMO = 0.15 // s: un hueco mayor significa que el sonido se ha cortado

// Se reutiliza para no crear un array en cada fotograma: importa en móviles baratos.
let espectro = null

export function frecuenciaDominante(analizador, frecuenciaMuestreo) {
  if (!espectro || espectro.length !== analizador.frequencyBinCount) {
    espectro = new Float32Array(analizador.frequencyBinCount)
  }
  // Con el suavizado por defecto, un golpe deja una estela que parece un tono estable.
  analizador.smoothingTimeConstant = 0
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

// Lecturas seguidas hasta ahora, sin cortes. Si el sonido ya ha parado, no queda ninguna.
function tramoContinuo(historial, ahora) {
  const recientes = recortarHistorial(historial, ahora)
  let inicio = recientes.length
  let siguiente = ahora
  while (inicio > 0 && siguiente - recientes[inicio - 1].tiempo <= HUECO_MAXIMO) {
    inicio--
    siguiente = recientes[inicio].tiempo
  }
  return recientes.slice(inicio)
}

// Decide si hay un tono estable sonando ahora. `frecuencia` es la mediana de las lecturas,
// o null si no hay ninguna; solo se puede registrar cuando `estable` es true.
export function lecturaEstable(historial, ahora) {
  const tramo = tramoContinuo(historial, ahora)
  if (tramo.length === 0) {
    return { estable: false, frecuencia: null, dispersion: null, muestras: 0, duracion: 0 }
  }

  const frecuencias = tramo.map(({ frecuencia }) => frecuencia)
  const frecuencia = mediana(frecuencias)
  const dispersion = dispersionRelativa(frecuencias, frecuencia)
  const duracion = ahora - tramo[0].tiempo
  return {
    estable:
      frecuencias.length >= MUESTRAS_MINIMAS &&
      duracion >= DURACION_MINIMA &&
      dispersion < DISPERSION_MAXIMA,
    frecuencia,
    dispersion,
    muestras: frecuencias.length,
    duracion,
  }
}

// De 0 a 1, para la barrita: sube mientras el sonido dura y baja cuando el tono varía.
export function nivelEstabilidad({ frecuencia, dispersion, duracion }) {
  if (frecuencia === null) return 0
  const porDuracion = Math.min(1, duracion / DURACION_MINIMA)
  const porDispersion = Math.max(0, 1 - dispersion / (2 * DISPERSION_MAXIMA))
  return porDuracion * porDispersion
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
