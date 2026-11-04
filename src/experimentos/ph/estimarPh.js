// Estimación del pH a partir del color. Funciones puras, sin React.
import { rgbAHsv } from './analisisColor.js'

// Tabla tono → pH (PH.md). Los rojos (0–40°) se tratan como 360–400°.
// Tabla inicial: hay que ajustarla con las fotos reales.
export const TABLA_TONO_PH = [
  { tono: 400, ph: 1 },
  { tono: 360, ph: 2 },
  { tono: 330, ph: 4 },
  { tono: 290, ph: 6 },
  { tono: 265, ph: 7 },
  { tono: 230, ph: 8 },
  { tono: 190, ph: 9.5 },
  { tono: 130, ph: 11 },
  { tono: 60, ph: 13 },
]

export const MUESTRAS_MINIMAS_KNN = 6
export const K_POR_DEFECTO = 3

const limitarPh = (ph) => Math.min(14, Math.max(1, ph))

// Método base: interpolación lineal en la tabla.
export function estimarPhPorTabla(rgb) {
  let { h } = rgbAHsv(rgb)
  if (h <= 40) h += 360

  const tabla = TABLA_TONO_PH
  if (h >= tabla[0].tono) return tabla[0].ph
  if (h <= tabla[tabla.length - 1].tono) return tabla[tabla.length - 1].ph

  for (let i = 0; i < tabla.length - 1; i++) {
    const a = tabla[i]
    const b = tabla[i + 1]
    if (h <= a.tono && h >= b.tono) {
      const t = (a.tono - h) / (a.tono - b.tono)
      return a.ph + t * (b.ph - a.ph)
    }
  }
  return 7
}

// Pasa el color a un cilindro HSV (x, y según tono y saturación; z = brillo)
// para que 359° y 1° queden cerca. El brillo pesa menos: depende mucho de la luz.
function puntoColor(rgb) {
  const { h, s, v } = rgbAHsv(rgb)
  const angulo = (h * Math.PI) / 180
  return { x: s * Math.cos(angulo), y: s * Math.sin(angulo), z: v * 0.5 }
}

function distancia(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z)
}

// Método IA: media del pH de las k muestras de color más parecido.
export function estimarPhKnn(rgb, muestras, k = K_POR_DEFECTO) {
  const punto = puntoColor(rgb)
  const vecinas = muestras
    .map((m) => ({ ph: m.ph, d: distancia(punto, puntoColor(m)) }))
    .sort((a, b) => a.d - b.d)
    .slice(0, k)
  const suma = vecinas.reduce((total, m) => total + m.ph, 0)
  return limitarPh(suma / vecinas.length)
}

// Elige el método: k-NN si hay muestras suficientes; si no, la tabla.
export function estimarPh(rgb, muestras = []) {
  if (muestras.length >= MUESTRAS_MINIMAS_KNN) {
    return { ph: estimarPhKnn(rgb, muestras), metodo: 'knn' }
  }
  return { ph: estimarPhPorTabla(rgb), metodo: 'tabla' }
}

export function tipoPh(ph) {
  if (ph < 6.5) return 'ácida'
  if (ph <= 7.5) return 'neutra'
  return 'básica'
}
