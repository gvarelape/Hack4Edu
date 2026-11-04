import { idiomaActual, preguntasGeneralesCargadas, traducirPregunta } from './idioma.js'

const traducidas = new WeakMap()

// El banco para el asistente, en el idioma actual. Las generales van traducidas también:
// el asistente se queda con la primera versión que recibe de cada id.
export function preguntasParaAsistente(preguntas) {
  if (idiomaActual() === 'es') return preguntas
  if (!traducidas.has(preguntas)) {
    traducidas.set(preguntas, [...preguntas, ...preguntasGeneralesCargadas()].map(traducirPregunta))
  }
  return traducidas.get(preguntas)
}
