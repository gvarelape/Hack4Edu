// Convierte una frase en una lista de palabras clave.
import { normalizarTexto } from '../../core/utilidades.js'
import { EXPRESIONES, sinonimoPrincipal } from './sinonimos.js'

// Palabras vacías: se quitan porque no dicen de qué trata la pregunta.
const PALABRAS_VACIAS = new Set(
  (
    'a al algo algun alguna alguno algunos ante antes asi aun aunque bien cada con contra cual cuales ' +
    'de del desde donde dos e el ella ellas ello ellos en entre era eres es esa ese eso esta estan ' +
    'estas este esto estos estoy fue ha han has hay he hace hacer hago hasta la las le les lo los ' +
    'me mas mi mia mis mucho muy nada ni nos nosotros o os otra otro para pero poco por pues que ' +
    'quien se sea ser si sin sobre su sus tambien te ti tiene tienen tengo todo todos tu tus un una ' +
    'uno unos usted vez y ya yo puedo puede pueden debo hago oye vale porfa favor hola'
  ).split(' '),
)

// "no" no es una palabra vacía: "¿por qué el agua NO es neutra?" pregunta otra cosa.

// Abreviaturas de chat, para que "xq" y "q" se entiendan como "por qué" y "qué".
const ABREVIATURAS = [
  [/\b(xq|pq|porq|xk|pk)\b/g, 'por que'],
  [/\b(q|k|ke)\b/g, 'que'],
  [/\btb\b/g, 'tambien'],
  [/\bx\b/g, 'por'],
]

// Interrogativas que cambian el sentido: se conservan como una sola palabra.
const INTERROGATIVAS = [
  [/\bpor que\b/g, 'porque'],
  [/\bque (es|son|significa|quiere decir)\b/g, 'que_es'],
  [/\bcuant[oa]s?\b/g, 'cuanto'],
]

// Terminaciones que se recortan, de la más larga a la más corta.
const TERMINACIONES = [
  'amente',
  'mente',
  'ciones',
  'siones',
  'cion',
  'sion',
  'idades',
  'idad',
  'es',
  's',
]

/** Raíz sencilla: "botellas" → "botell", "ácidos" → "acid", "mediciones" → "medi". */
export function raiz(palabra) {
  if (palabra.length <= 3 || /\d/.test(palabra) || palabra.includes('_')) return palabra
  let resultado = palabra
  for (const terminacion of TERMINACIONES) {
    if (resultado.endsWith(terminacion) && resultado.length - terminacion.length >= 3) {
      resultado = resultado.slice(0, -terminacion.length)
      break
    }
  }
  // Quita la vocal final para que coincidan masculino y femenino ("rápido" y "rápida").
  if (resultado.length > 4 && /[aeo]$/.test(resultado)) resultado = resultado.slice(0, -1)
  return resultado
}

function unirExpresiones(texto) {
  let resultado = ` ${texto} `
  for (const expresion of EXPRESIONES) {
    resultado = resultado.replaceAll(` ${expresion} `, ` ${sinonimoPrincipal(expresion)} `)
  }
  return resultado.trim()
}

/** Frase → palabras clave normalizadas, sin vacías, con sinónimos y raíces. */
export function palabrasClave(frase) {
  let texto = normalizarTexto(frase)
  for (const [patron, sustituto] of [...ABREVIATURAS, ...INTERROGATIVAS]) {
    texto = texto.replace(patron, sustituto)
  }
  texto = unirExpresiones(texto)

  const palabras = []
  for (const palabra of texto.split(' ')) {
    if (palabra === '' || PALABRAS_VACIAS.has(palabra)) continue
    palabras.push(raiz(sinonimoPrincipal(palabra)))
  }
  return palabras
}
