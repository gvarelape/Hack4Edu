// Nivel 1: búsqueda por palabras con BM25 y tolerancia a faltas de ortografía.
import { palabrasClave } from './normalizar.js'

const K1 = 1.2
const B = 0.75
// Una palabra corregida por una falta cuenta un poco menos que una escrita bien.
const PESO_CORREGIDA = 0.8

/** Distancia de edición (Levenshtein), parando en cuanto supera el máximo. */
export function distanciaEdicion(a, b, maximo = Infinity) {
  if (Math.abs(a.length - b.length) > maximo) return maximo + 1
  let anterior = Array.from({ length: b.length + 1 }, (_, j) => j)
  for (let i = 1; i <= a.length; i++) {
    const actual = [i]
    let menor = i
    for (let j = 1; j <= b.length; j++) {
      const coste = a[i - 1] === b[j - 1] ? 0 : 1
      actual[j] = Math.min(anterior[j] + 1, actual[j - 1] + 1, anterior[j - 1] + coste)
      menor = Math.min(menor, actual[j])
    }
    if (menor > maximo) return maximo + 1
    anterior = actual
  }
  return anterior[b.length]
}

/**
 * Prepara las preguntas para buscar rápido. Cada pregunta del banco aporta varios "documentos":
 * su pregunta y cada una de sus variantes.
 */
export function crearIndice(preguntas) {
  const documentos = []
  const frecuenciaDocumentos = new Map()
  for (const pregunta of preguntas) {
    for (const frase of [pregunta.pregunta, ...(pregunta.variantes ?? [])]) {
      const palabras = palabrasClave(frase)
      if (palabras.length === 0) continue
      const cuenta = new Map()
      for (const palabra of palabras) cuenta.set(palabra, (cuenta.get(palabra) ?? 0) + 1)
      documentos.push({ pregunta, cuenta, largo: palabras.length })
      for (const palabra of cuenta.keys()) {
        frecuenciaDocumentos.set(palabra, (frecuenciaDocumentos.get(palabra) ?? 0) + 1)
      }
    }
  }
  const total = documentos.length
  const largoMedio = documentos.reduce((suma, d) => suma + d.largo, 0) / Math.max(total, 1)
  const idf = new Map()
  for (const [palabra, df] of frecuenciaDocumentos) {
    idf.set(palabra, Math.log(1 + (total - df + 0.5) / (df + 0.5)))
  }
  // Las palabras que no salen en el banco pesan como las más raras.
  const idfDesconocida = Math.log(1 + (total + 0.5) / 0.5)
  return { documentos, idf, idfDesconocida, largoMedio, vocabulario: [...idf.keys()] }
}

// Busca la palabra del banco más parecida: distancia 1, o 2 si es larga (más de 7 letras).
function corregir(palabra, indice) {
  const maximo = palabra.length > 7 ? 2 : 1
  if (palabra.length <= 3) return null
  let mejor = null
  let mejorDistancia = maximo + 1
  for (const candidata of indice.vocabulario) {
    const distancia = distanciaEdicion(palabra, candidata, maximo)
    if (distancia < mejorDistancia) {
      mejor = candidata
      mejorDistancia = distancia
    }
  }
  return mejor
}

/** Palabras clave de la consulta, con su peso y su palabra del banco (o null si no está). */
function prepararConsulta(texto, indice) {
  return palabrasClave(texto).map((palabra) => {
    if (indice.idf.has(palabra)) return { palabra, peso: 1 }
    const corregida = corregir(palabra, indice)
    return corregida ? { palabra: corregida, peso: PESO_CORREGIDA } : { palabra: null, peso: 0 }
  })
}

function bm25(cuenta, largo, terminos, indice) {
  let puntos = 0
  for (const { palabra, peso } of terminos) {
    const veces = palabra ? (cuenta.get(palabra) ?? 0) : 0
    if (veces === 0) continue
    const saturacion = (veces * (K1 + 1)) / (veces + K1 * (1 - B + (B * largo) / indice.largoMedio))
    puntos += peso * indice.idf.get(palabra) * saturacion
  }
  return puntos
}

// Puntuación de 0 a 1 de un documento: cuánto de él cubre la consulta y cuánto de la consulta
// cubre él. Así una frase con muchas palabras ajenas al banco no sale con confianza alta.
function puntuarDocumento(documento, terminos, pesoConsulta, indice) {
  const propios = [...documento.cuenta.keys()].map((palabra) => ({ palabra, peso: 1 }))
  const maximo = bm25(documento.cuenta, documento.largo, propios, indice)
  if (maximo === 0 || pesoConsulta === 0) return 0
  const coberturaDocumento = bm25(documento.cuenta, documento.largo, terminos, indice) / maximo

  let encontradas = 0
  for (const { palabra, peso } of terminos) {
    if (palabra && documento.cuenta.has(palabra)) encontradas += peso * indice.idf.get(palabra)
  }
  const coberturaConsulta = encontradas / pesoConsulta
  return Math.min(1, Math.sqrt(coberturaDocumento * coberturaConsulta))
}

/**
 * Puntúa cada pregunta del banco de 0 a 1 para el texto del alumno.
 * Devuelve un Map de id a puntuación (la mejor entre su pregunta y sus variantes).
 */
export function puntuarPorPalabras(texto, indice) {
  const terminos = prepararConsulta(texto, indice)
  const pesoConsulta = terminos.reduce(
    (suma, { palabra }) => suma + (palabra ? indice.idf.get(palabra) : indice.idfDesconocida),
    0,
  )
  const puntuaciones = new Map()
  for (const documento of indice.documentos) {
    const puntos = puntuarDocumento(documento, terminos, pesoConsulta, indice)
    const id = documento.pregunta.id
    if (puntos > (puntuaciones.get(id) ?? 0)) puntuaciones.set(id, puntos)
  }
  return puntuaciones
}
