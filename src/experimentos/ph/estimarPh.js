// Estimación del pH a partir del color.
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

// Con 3 muestras (la calibración en clase: agua, vinagre y bicarbonato) ya se usa el k-NN.
export const MUESTRAS_MINIMAS_KNN = 3
export const K_POR_DEFECTO = 3
// Con pocas muestras se mezclan solo las 2 más parecidas: si no, todo saldría hacia la media.
const MUESTRAS_PARA_K_COMPLETO = 6
const K_POCAS_MUESTRAS = 2

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
// Cuanto más se parece una muestra, más cuenta (media ponderada por la distancia).
export function estimarPhKnn(rgb, muestras, k = K_POR_DEFECTO) {
  const punto = puntoColor(rgb)
  const vecinas = muestras
    .map((m) => ({ ph: m.ph, d: distancia(punto, puntoColor(m)) }))
    .sort((a, b) => a.d - b.d)
    .slice(0, k)
  let sumaPesos = 0
  let suma = 0
  for (const { ph, d } of vecinas) {
    const peso = 1 / (d + 0.01)
    sumaPesos += peso
    suma += peso * ph
  }
  return limitarPh(suma / sumaPesos)
}

// Distancias de color (en el cilindro HSV) entre las que se pasa del k-NN a la tabla.
// Ajustarlas con las fotos reales si hace falta.
const DISTANCIA_CONOCIDA = 0.1
const DISTANCIA_LEJANA = 0.3

// El k-NN no puede salirse de sus muestras: lejos de ellas manda la tabla.
// Devuelve 0 (color conocido, solo k-NN) a 1 (color lejano, solo tabla).
export function pesoTabla(rgb, muestras) {
  const punto = puntoColor(rgb)
  const cercana = Math.min(...muestras.map((m) => distancia(punto, puntoColor(m))))
  return Math.min(
    1,
    Math.max(0, (cercana - DISTANCIA_CONOCIDA) / (DISTANCIA_LEJANA - DISTANCIA_CONOCIDA)),
  )
}

// Elige el método: k-NN si hay muestras suficientes; si no, la tabla.
// Si el color queda lejos de las muestras, se mezcla con la tabla para no dar un pH absurdo.
export function estimarPh(rgb, muestras = []) {
  if (muestras.length >= MUESTRAS_MINIMAS_KNN) {
    const k = muestras.length >= MUESTRAS_PARA_K_COMPLETO ? K_POR_DEFECTO : K_POCAS_MUESTRAS
    const peso = pesoTabla(rgb, muestras)
    const ph = (1 - peso) * estimarPhKnn(rgb, muestras, k) + peso * estimarPhPorTabla(rgb)
    return { ph, metodo: peso < 1 ? 'knn' : 'tabla' }
  }
  return { ph: estimarPhPorTabla(rgb), metodo: 'tabla' }
}

export function tipoPh(ph) {
  if (ph < 6.5) return 'ácida'
  if (ph <= 7.5) return 'neutra'
  return 'básica'
}
