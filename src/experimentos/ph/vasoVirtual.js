// Modelo del vaso virtual de la simulación.

export const PH_INICIAL = 7

// Cada gota acerca el pH un poco al de la sustancia pura, sin pasarse nunca de él:
// por mucho vinagre que eches, no baja de su propio pH.
const PH_VINAGRE = 2.5
const PH_BICARBONATO = 8.5
const FUERZA_GOTA = 0.25

export function echarGota(ph, sustancia) {
  const limite = sustancia === 'vinagre' ? PH_VINAGRE : PH_BICARBONATO
  return ph + (limite - ph) * FUERZA_GOTA
}

// Colores aproximados del agua de lombarda según el pH.
const COLORES_LOMBARDA = [
  { ph: 1, r: 200, g: 30, b: 50 },
  { ph: 3, r: 220, g: 50, b: 110 },
  { ph: 5, r: 150, g: 60, b: 160 },
  { ph: 7, r: 110, g: 70, b: 170 },
  { ph: 8, r: 50, g: 90, b: 190 },
  { ph: 9.5, r: 30, g: 150, b: 150 },
  { ph: 11.5, r: 50, g: 160, b: 70 },
  { ph: 13.5, r: 220, g: 200, b: 40 },
]

export function colorPorPh(ph) {
  const tabla = COLORES_LOMBARDA
  const p = Math.min(tabla[tabla.length - 1].ph, Math.max(tabla[0].ph, ph))
  let i = 0
  while (i < tabla.length - 2 && p > tabla[i + 1].ph) i++
  const a = tabla[i]
  const b = tabla[i + 1]
  const t = (p - a.ph) / (b.ph - a.ph)
  const mezcla = (x, y) => Math.round(x + t * (y - x))
  return `rgb(${mezcla(a.r, b.r)}, ${mezcla(a.g, b.g)}, ${mezcla(a.b, b.b)})`
}

// Posición (0–100 %) de un pH en la escala de 14 casillas: el pH 1 cae en el centro de la primera.
export function posicionEnEscala(ph) {
  const p = Math.min(14, Math.max(1, ph))
  return ((p - 0.5) / 14) * 100
}
