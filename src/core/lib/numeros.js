const PATRON_NUMERO = /^[+-]?(\d+([.,]\d*)?|[.,]\d+)$/

// Acepta coma o punto decimal. Devuelve null si el texto no es un número.
export function leerNumero(texto) {
  if (typeof texto === 'number') return Number.isFinite(texto) ? texto : null
  if (typeof texto !== 'string') return null
  const limpio = texto.trim()
  if (!PATRON_NUMERO.test(limpio)) return null
  return Number(limpio.replace(',', '.'))
}

// Sin decimales indicados, muestra hasta 2 y quita los ceros que sobran: 9.6 → "9,6".
export function formatear(numero, decimales) {
  if (!Number.isFinite(numero)) return '–'
  const redondeado = numero.toFixed(decimales ?? 2)
  const texto = decimales === undefined ? String(Number(redondeado)) : redondeado
  // Evita "-0,00" cuando el redondeo deja un cero negativo.
  const sinCeroNegativo = Number(texto) === 0 ? texto.replace('-', '') : texto
  return sinCeroNegativo.replace('.', ',')
}
