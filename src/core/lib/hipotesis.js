// Comprueba la hipótesis del alumno.
import { normalizarTexto } from './texto.js'

export const PALABRAS_MINIMAS = 3

// Coincide con la frase entera, no con un trozo de otra palabra.
const patronFrase = (frase) => new RegExp(`(^| )${normalizarTexto(frase)}(?= |$)`, 'g')

/** Si el texto ya contiene ese inicio de frase, aunque lo haya escrito el alumno. */
export function inicioUsado(texto, frase) {
  return patronFrase(frase).test(normalizarTexto(texto))
}

/** Cuántas palabras ha puesto el alumno además de los inicios de frase. */
export function contarPalabrasPropias(texto, frases) {
  const propio = frases.reduce(
    (resto, frase) => resto.replace(patronFrase(frase), ' '),
    normalizarTexto(texto),
  )
  return propio.split(/\s+/).filter(Boolean).length
}

export function hipotesisCompleta(texto, frases) {
  return contarPalabrasPropias(texto, frases) >= PALABRAS_MINIMAS
}
