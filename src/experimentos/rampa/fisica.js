// Física del plano inclinado. En unidades del SI salvo que se indique.

export const G_REFERENCIA = 9.81

// Fracción de g·sinθ que le queda a la bola según cómo baja.
export const FACTOR_BOLA = {
  maciza: 5 / 7,
  hueca: 3 / 5,
  sinRozamiento: 1,
}

// sinθ = altura / largo. Altura y largo en la misma unidad. Devuelve null si la rampa no es posible.
export function senoInclinacion(altura, largo) {
  if (!(altura > 0) || !(largo > 0) || altura > largo) return null
  return altura / largo
}

// a = factor · g · sinθ
export function aceleracionTeorica(seno, tipoBola, g = G_REFERENCIA) {
  return FACTOR_BOLA[tipoBola] * g * seno
}

// g = a / (factor · sinθ). Con tipoBola 'sinRozamiento' da la "g sin contar la rodadura".
export function gEstimada(aceleracion, seno, tipoBola) {
  return aceleracion / (FACTOR_BOLA[tipoBola] * seno)
}

// Tiempo en recorrer la rampa desde el reposo: t = √(2L / a). Largo en metros.
export function tiempoBajada(largoMetros, aceleracion) {
  return Math.sqrt((2 * largoMetros) / aceleracion)
}
