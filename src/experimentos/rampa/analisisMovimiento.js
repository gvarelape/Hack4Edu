// Convierte los puntos seguidos en el vídeo en aceleración y tiempo de bajada. Funciones puras.

export const MINIMO_PUNTOS = 10
const UMBRAL_MOVIMIENTO_CM = 1
const VENTANA_QUIETA_S = 0.25
const UMBRAL_QUIETA_CM = 1.5
const UMBRAL_QUIETA_PX = 5 // el seguimiento tiembla algún píxel: en cm depende de la escala
const SEPARACION_MINIMA_MARCAS = 10 // px: más cerca, un fallo pequeño al tocar estropea la escala
const UMBRAL_SALTO_CM = 3
const MARGEN_LLEGADA_CM = 3 // holgado: el máximo puede caer en un pico de ruido de la parada
const VENTANA_MEDIANA = 5
const VENTANA_VELOCIDAD = 5

function mediana(valores) {
  const ordenados = [...valores].sort((a, b) => a - b)
  return ordenados[Math.floor(ordenados.length / 2)]
}

// Escala en cm por píxel a partir de las dos marcas tocadas y su distancia real.
// Devuelve null si las marcas están demasiado juntas o la distancia no es válida.
export function calcularEscala(marcaA, marcaB, distanciaCm) {
  const separacion = Math.hypot(marcaA.x - marcaB.x, marcaA.y - marcaB.y)
  if (separacion < SEPARACION_MINIMA_MARCAS || !(distanciaCm > 0)) return null
  return distanciaCm / separacion
}

// Quita los saltos sueltos del seguimiento: los puntos lejos de la mediana de sus vecinos.
// Si la bola avanza siempre, cada punto coincide con su mediana, así que un movimiento bueno no se
// toca aunque sea rápido. Sin ventana completa no se puede comprobar, por eso caen los extremos.
export function quitarSaltos(puntos, escala) {
  const radio = Math.floor(VENTANA_MEDIANA / 2)
  const validos = []
  for (let i = radio; i < puntos.length - radio; i++) {
    const ventana = puntos.slice(i - radio, i + radio + 1)
    const x = mediana(ventana.map((p) => p.x))
    const y = mediana(ventana.map((p) => p.y))
    const desvio = Math.hypot(puntos[i].x - x, puntos[i].y - y) * escala
    if (desvio <= UMBRAL_SALTO_CM) validos.push(puntos[i])
  }
  return validos
}

// Busca hacia atrás desde `fin` el último tramo en que la bola estuvo quieta.
// Devuelve { inicio, x, y } con el último punto de ese tramo y la posición de reposo, o null.
function buscarReposo(puntos, fin, escala) {
  const umbralPx = Math.max(UMBRAL_QUIETA_CM / escala, UMBRAL_QUIETA_PX)
  for (let ultimo = fin; ultimo > 0; ultimo--) {
    let primero = ultimo
    while (primero > 0 && puntos[ultimo].t - puntos[primero].t < VENTANA_QUIETA_S) primero--
    if (puntos[ultimo].t - puntos[primero].t < VENTANA_QUIETA_S) return null

    const ventana = puntos.slice(primero, ultimo + 1)
    const x = ventana.map((p) => p.x)
    const y = ventana.map((p) => p.y)
    const rango = Math.hypot(Math.max(...x) - Math.min(...x), Math.max(...y) - Math.min(...y))
    if (rango <= umbralPx) return { inicio: ultimo, x: mediana(x), y: mediana(y) }
  }
  return null
}

// Pasa de { t, x, y } en píxeles a { t, s }, con s en cm desde la posición de reposo y t en
// segundos desde el primer punto en movimiento. Quita el reposo inicial y lo que hay tras llegar abajo.
export function recortar(puntos, escala) {
  if (puntos.length === 0) return []
  const distanciasA = (origen) =>
    puntos.map((p) => Math.hypot(p.x - origen.x, p.y - origen.y) * escala)
  let distancias = distanciasA(puntos[0])

  // Se corta justo antes de llegar al máximo, no en él: si la bola se para abajo, el máximo exacto
  // cae al azar dentro de la parada, y el fotograma de llegada ya no sigue la parábola (ha chocado).
  const maximo = Math.max(...distancias)
  const fin = distancias.findIndex((s) => s >= maximo - MARGEN_LLEGADA_CM) - 1

  // La salida se busca por el último reposo, no por la distancia al primer punto: ese punto puede
  // estar movido (la mano, el temblor) y entonces la bola parece en marcha desde el principio.
  const reposo = buscarReposo(puntos, fin, escala)
  let inicio
  if (reposo) {
    inicio = reposo.inicio
    distancias = distanciasA(reposo)
  } else {
    inicio = fin
    while (inicio >= 0 && distancias[inicio] > UMBRAL_MOVIMIENTO_CM) inicio--
    inicio++
  }
  if (fin < inicio) return []

  const tiempoInicial = puntos[inicio].t
  const tramo = []
  for (let i = inicio; i <= fin; i++) {
    tramo.push({ t: puntos[i].t - tiempoInicial, s: distancias[i] })
  }
  return tramo
}

// Eliminación gaussiana con pivote parcial. Devuelve null si el sistema no tiene solución única.
function resolverSistema(matriz, vector) {
  const n = vector.length
  const filas = matriz.map((fila, i) => [...fila, vector[i]])

  for (let col = 0; col < n; col++) {
    let pivote = col
    for (let f = col + 1; f < n; f++) {
      if (Math.abs(filas[f][col]) > Math.abs(filas[pivote][col])) pivote = f
    }
    if (Math.abs(filas[pivote][col]) < 1e-12) return null
    ;[filas[col], filas[pivote]] = [filas[pivote], filas[col]]

    for (let f = col + 1; f < n; f++) {
      const factor = filas[f][col] / filas[col][col]
      for (let c = col; c <= n; c++) filas[f][c] -= factor * filas[col][c]
    }
  }

  const solucion = new Array(n)
  for (let f = n - 1; f >= 0; f--) {
    let suma = filas[f][n]
    for (let c = f + 1; c < n; c++) suma -= filas[f][c] * solucion[c]
    solucion[f] = suma / filas[f][f]
  }
  return solucion
}

// Ajusta s = s₀ + v₀·t + ½·a·t² por mínimos cuadrados (ecuaciones normales).
// Devuelve { s0, v0, a } en las unidades de los puntos, o null si no se puede ajustar.
export function ajusteCuadratico(puntos) {
  if (puntos.length < 3) return null

  const sumasT = [0, 0, 0, 0, 0] // Σt⁰ … Σt⁴
  const sumasS = [0, 0, 0] // Σs·t⁰ … Σs·t²
  for (const { t, s } of puntos) {
    let potencia = 1
    for (let k = 0; k <= 4; k++) {
      sumasT[k] += potencia
      if (k <= 2) sumasS[k] += s * potencia
      potencia *= t
    }
  }

  const coeficientes = resolverSistema(
    [
      [sumasT[0], sumasT[1], sumasT[2]],
      [sumasT[1], sumasT[2], sumasT[3]],
      [sumasT[2], sumasT[3], sumasT[4]],
    ],
    sumasS,
  )
  if (!coeficientes) return null

  const [s0, v0, mediaA] = coeficientes
  return { s0, v0, a: 2 * mediaA }
}

// Derivada centrada de { t, s } suavizada con una media móvil. Devuelve { t, v }.
export function velocidades(puntos) {
  const brutas = []
  for (let i = 1; i < puntos.length - 1; i++) {
    const intervalo = puntos[i + 1].t - puntos[i - 1].t
    if (intervalo > 0) {
      brutas.push({ t: puntos[i].t, v: (puntos[i + 1].s - puntos[i - 1].s) / intervalo })
    }
  }

  const radio = Math.floor(VENTANA_VELOCIDAD / 2)
  return brutas.map((punto, i) => {
    const ventana = brutas.slice(Math.max(0, i - radio), i + radio + 1)
    return { t: punto.t, v: ventana.reduce((suma, p) => suma + p.v, 0) / ventana.length }
  })
}

// Análisis completo. puntos: { t, x, y } en segundos y píxeles. escala: cm por píxel.
// Si no se puede medir devuelve { valido: false, motivo, puntosValidos },
// con motivo 'tiempo-parado', 'pocos-puntos' o 'sin-aceleracion'.
export function analizarMovimiento(puntos, escala) {
  // Si el navegador no da el tiempo del vídeo, el problema no es de la medida del alumno.
  if (puntos.length >= 2 && puntos[puntos.length - 1].t <= puntos[0].t) {
    return { valido: false, motivo: 'tiempo-parado', puntosValidos: 0 }
  }

  const tramo = recortar(quitarSaltos(puntos, escala), escala)
  const puntosValidos = tramo.length
  if (puntosValidos < MINIMO_PUNTOS) {
    return { valido: false, motivo: 'pocos-puntos', puntosValidos }
  }

  const ajuste = ajusteCuadratico(tramo)
  if (!ajuste || !(ajuste.a > 0)) {
    return { valido: false, motivo: 'sin-aceleracion', puntosValidos }
  }

  // El tramo empieza con la bola ya en marcha: el tiempo que le faltaba desde el reposo sale del ajuste.
  const tiempoAntesDelTramo = Math.max(0, ajuste.v0 / ajuste.a)

  return {
    valido: true,
    puntosValidos,
    tramo, // { t (s), s (cm) }
    ajuste, // { s0 (cm), v0 (cm/s), a (cm/s²) }
    aceleracion: ajuste.a / 100, // m/s²
    tiempoBajada: tramo[puntosValidos - 1].t + tiempoAntesDelTramo, // s
    velocidades: velocidades(tramo), // { t (s), v (cm/s) }
  }
}
