// Sigue la pelota por su color. Funciones puras: reciben un ImageData (o { data, width, height }).

export const ANCHO_REDUCIDO = 160 // ancho al que se reduce cada fotograma antes de buscar
export const TOLERANCIA_INICIAL = 60
const MINIMO_PIXELES = 8
const PESO_LUZ = 0.5 // el brillo cuenta menos que el tono, para no perder la bola en las sombras
const FRACCION_MAXIMA_PELOTA = 0.15 // una pelota no ocupa tanto: será la rampa o la pared
const DISTANCIA_MAXIMA_TOQUE = 15 // px entre el toque y la mancha encontrada
const BRILLO_MINIMO = 40 // de 0 a 255

// Color medio de un cuadrado alrededor de (x, y), recortado a la imagen. Devuelve { r, g, b } o null.
export function colorMedio(imagen, x, y, radio = 2) {
  const { data, width, height } = imagen
  const centroX = Math.floor(x)
  const centroY = Math.floor(y)
  if (centroX < 0 || centroY < 0 || centroX >= width || centroY >= height) return null

  let r = 0
  let g = 0
  let b = 0
  let cantidad = 0
  for (
    let fila = Math.max(0, centroY - radio);
    fila <= Math.min(height - 1, centroY + radio);
    fila++
  ) {
    for (
      let col = Math.max(0, centroX - radio);
      col <= Math.min(width - 1, centroX + radio);
      col++
    ) {
      const i = (fila * width + col) * 4
      r += data[i]
      g += data[i + 1]
      b += data[i + 2]
      cantidad++
    }
  }
  return { r: r / cantidad, g: g / cantidad, b: b / cantidad }
}

// Marca los píxeles cercanos al color. Compara brillo y tono por separado (como YCbCr).
function marcarPixeles({ data, width, height }, color, tolerancia) {
  const marcados = new Uint8Array(width * height)
  const limite = tolerancia * tolerancia
  for (let p = 0; p < marcados.length; p++) {
    const i = p * 4
    const difR = data[i] - color.r
    const difG = data[i + 1] - color.g
    const difB = data[i + 2] - color.b
    const difLuz = 0.299 * difR + 0.587 * difG + 0.114 * difB
    const luz = PESO_LUZ * difLuz
    const tonoR = difR - difLuz
    const tonoB = difB - difLuz
    if (luz * luz + tonoR * tonoR + tonoB * tonoB <= limite) marcados[p] = 1
  }
  return marcados
}

// Devuelve el centro de la mancha más grande del color como { x, y, pixeles }, o null si es
// demasiado pequeña. Solo la más grande: así otro objeto del mismo color no arrastra el punto.
// x e y van en píxeles de esta imagen, no del vídeo original.
export function encontrarPorColor(imagen, color, tolerancia = TOLERANCIA_INICIAL) {
  const { width, height } = imagen
  const marcados = marcarPixeles(imagen, color, tolerancia)
  const pila = new Int32Array(marcados.length)
  let mejor = null

  for (let semilla = 0; semilla < marcados.length; semilla++) {
    if (!marcados[semilla]) continue

    let sumaX = 0
    let sumaY = 0
    let pixeles = 0
    let cima = 0
    pila[cima++] = semilla
    marcados[semilla] = 0

    while (cima > 0) {
      const p = pila[--cima]
      const col = p % width
      const fila = (p - col) / width
      sumaX += col
      sumaY += fila
      pixeles++

      for (let f = Math.max(0, fila - 1); f <= Math.min(height - 1, fila + 1); f++) {
        for (let c = Math.max(0, col - 1); c <= Math.min(width - 1, col + 1); c++) {
          const vecino = f * width + c
          if (marcados[vecino]) {
            marcados[vecino] = 0
            pila[cima++] = vecino
          }
        }
      }
    }

    if (!mejor || pixeles > mejor.pixeles) {
      // +0,5: el centro geométrico del píxel, para que cuadre al escalar a la imagen original.
      mejor = { x: sumaX / pixeles + 0.5, y: sumaY / pixeles + 0.5, pixeles }
    }
  }

  return mejor && mejor.pixeles >= MINIMO_PIXELES ? mejor : null
}

// Tamaño de la imagen reducida, con la proporción del vídeo.
export function tamanoReducido(anchoVideo, altoVideo) {
  return {
    ancho: ANCHO_REDUCIDO,
    alto: Math.max(1, Math.round((ANCHO_REDUCIDO * altoVideo) / anchoVideo)),
  }
}

// Brillo medio de la imagen, de 0 a 255.
export function brilloMedio({ data }) {
  let suma = 0
  for (let i = 0; i < data.length; i += 4) {
    suma += 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
  }
  return data.length > 0 ? suma / (data.length / 4) : 0
}

// Comprueba si lo que ha tocado el alumno puede ser la pelota.
// Devuelve { color, pelota, pocaLuz, problema }, con problema null si todo va bien
// o 'no-encontrada', 'color-comun' u 'otro-objeto'.
export function comprobarEleccion(imagen, x, y, tolerancia = TOLERANCIA_INICIAL) {
  const color = colorMedio(imagen, x, y, 1)
  const pelota = color && encontrarPorColor(imagen, color, tolerancia)
  const pocaLuz = brilloMedio(imagen) < BRILLO_MINIMO

  let problema = null
  if (!pelota) problema = 'no-encontrada'
  else if (pelota.pixeles > imagen.width * imagen.height * FRACCION_MAXIMA_PELOTA) {
    problema = 'color-comun'
  } else if (Math.hypot(pelota.x - x, pelota.y - y) > DISTANCIA_MAXIMA_TOQUE) {
    problema = 'otro-objeto'
  }
  return { color, pelota, pocaLuz, problema }
}
