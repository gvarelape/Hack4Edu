// Elige la mejor respuesta del banco y decide si responder, dudar o mandar al profe (ASISTENTE.md).
import { preguntasGenerales } from '../preguntasGenerales.js'
import { crearIndice, puntuarPorPalabras } from './busquedaPalabras.js'
import { puntuarPorSignificado } from './busquedaSignificado.js'

export const UMBRAL_RESPONDER = 0.6
export const UMBRAL_DUDAR = 0.4
const EMPUJON_MOMENTO = 0.05
const PESO_SIGNIFICADO = 0.7
const MAXIMO_SUGERENCIAS = 3

/** Las preguntas del experimento más las generales, sin repetir ids. */
export function unirConGenerales(preguntas = []) {
  const vistas = new Set()
  const todas = []
  for (const pregunta of [...preguntas, ...preguntasGenerales]) {
    if (!pregunta?.id || vistas.has(pregunta.id)) continue
    vistas.add(pregunta.id)
    todas.push(pregunta)
  }
  return todas
}

/** Preguntas para sugerir en un momento del flujo: primero las de ese momento, luego las de siempre. */
export function preguntasSugeridas(preguntas, momento = 'siempre', cantidad = 4) {
  const delMomento = preguntas.filter((p) => p.momento === momento)
  const deSiempre = preguntas.filter((p) => p.momento === 'siempre' && p.momento !== momento)
  // Primero las del experimento: las generales van al final de la lista.
  return [...delMomento, ...deSiempre].slice(0, cantidad)
}

// El índice se construye una vez por cada lista de preguntas.
const indices = new WeakMap()
function indiceDe(preguntas) {
  if (!indices.has(preguntas)) indices.set(preguntas, crearIndice(preguntas))
  return indices.get(preguntas)
}

// Las listas que llegan del core suelen ser siempre la misma: se recuerda su unión con las generales.
const uniones = new WeakMap()
function todasLasPreguntas(preguntas) {
  if (!Array.isArray(preguntas)) return unirConGenerales([])
  if (!uniones.has(preguntas)) uniones.set(preguntas, unirConGenerales(preguntas))
  return uniones.get(preguntas)
}

async function significadoSeguro(texto, preguntas) {
  try {
    return await puntuarPorSignificado(texto, preguntas)
  } catch {
    return null
  }
}

/**
 * Busca la respuesta para el texto del alumno (CONTRATO.md, punto 9).
 * opciones.momento da un pequeño empujón a las preguntas del paso actual.
 * Devuelve { mejor, sugerencias, confianza }:
 * - confianza ≥ 0,60: mejor es la respuesta y sugerencias, otras parecidas.
 * - entre 0,40 y 0,60: mejor es null y sugerencias, las 3 mejores ("¿Quieres decir…?").
 * - < 0,40: mejor es null y sugerencias, preguntas del momento actual.
 */
export async function buscarRespuesta(texto, preguntas, { momento } = {}) {
  const todas = todasLasPreguntas(preguntas)
  if (typeof texto !== 'string' || texto.trim() === '') {
    return { mejor: null, sugerencias: preguntasSugeridas(todas, momento), confianza: 0 }
  }

  const palabras = puntuarPorPalabras(texto, indiceDe(todas))
  const significado = await significadoSeguro(texto, todas)

  const puntuadas = todas
    .map((pregunta) => {
      const nivel1 = palabras.get(pregunta.id) ?? 0
      let puntos = significado
        ? PESO_SIGNIFICADO * (significado.get(pregunta.id) ?? 0) + (1 - PESO_SIGNIFICADO) * nivel1
        : nivel1
      if (momento && pregunta.momento === momento && puntos > 0) puntos += EMPUJON_MOMENTO
      return { pregunta, puntos: Math.min(1, puntos) }
    })
    .sort((a, b) => b.puntos - a.puntos)

  const confianza = puntuadas[0]?.puntos ?? 0
  const parecidas = puntuadas.filter((p) => p.puntos > 0).map((p) => p.pregunta)

  if (confianza >= UMBRAL_RESPONDER) {
    return {
      mejor: parecidas[0],
      sugerencias: parecidas.slice(1, MAXIMO_SUGERENCIAS + 1),
      confianza,
    }
  }
  if (confianza >= UMBRAL_DUDAR) {
    return { mejor: null, sugerencias: parecidas.slice(0, MAXIMO_SUGERENCIAS), confianza }
  }
  return { mejor: null, sugerencias: preguntasSugeridas(todas, momento), confianza }
}
