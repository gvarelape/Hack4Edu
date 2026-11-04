// El idioma de la app: español, inglés o francés. Sin React, para poder usarlo también en pruebas.
export const IDIOMAS = { es: 'Español', en: 'English', fr: 'Français' }
const CLAVE = 'kanga-idioma'
const COLUMNA = { en: 1, fr: 2 }
const SEPARADOR_DECIMAL = { es: ',', en: '.', fr: ',' }
// Se cortan frases compuestas para traducir cada parte. Nunca se inventa: si falta, queda en español.
const FIN_DE_FRASE = /(?<=[.!?])\s+/
const LISTA = /^[^.!?:]{1,60} y [^.!?:]{1,30}$/
const UNION = { en: 'and', fr: 'et' }

let idioma = null
let exactos = new Map()
let patrones = []
let bancos = {}
const memoria = new Map()

function detectarIdioma() {
  try {
    const guardado = localStorage.getItem(CLAVE)
    if (guardado in IDIOMAS) return guardado
  } catch {
    // Sin almacenamiento, se usa el idioma del móvil.
  }
  const delMovil = globalThis.navigator?.languages ?? []
  return delMovil.map((codigo) => codigo.slice(0, 2)).find((codigo) => codigo in IDIOMAS) ?? 'es'
}

export function idiomaActual() {
  idioma ??= detectarIdioma()
  return idioma
}

export const separadorDecimal = () => SEPARADOR_DECIMAL[idiomaActual()]

const normalizar = (texto) => texto.replace(/\s+/g, ' ').trim()
const escapar = (texto) => texto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

function preparar(filas, columna) {
  exactos = new Map()
  patrones = []
  for (const fila of filas) {
    const [original, traduccion] = [fila[0], fila[columna]]
    if (!original.includes('{0}')) {
      exactos.set(normalizar(original), traduccion)
      continue
    }
    // Una parte variable no cruza el final de una frase: las frases se traducen por separado.
    const expresion = escapar(normalizar(original)).replace(
      /\\\{\d\\\}/g,
      '((?:(?![.!?](?:\\s|$)).)+?)',
    )
    patrones.push({ regla: new RegExp(`^${expresion}$`, 'su'), original, traduccion })
  }
  // Primero los más concretos, para que uno genérico no se quede con un texto ajeno.
  patrones.sort((a, b) => b.original.length - a.original.length)
}

export async function cargarIdioma() {
  if (idiomaActual() === 'es') return
  if (globalThis.document) document.documentElement.lang = idioma
  try {
    const cargadores = {
      en: () => import('../traducciones/preguntas-en.js'),
      fr: () => import('../traducciones/preguntas-fr.js'),
    }
    const [{ textos }, { preguntas }] = await Promise.all([
      import('../traducciones/textos.js'),
      cargadores[idioma](),
    ])
    preparar(textos, COLUMNA[idioma])
    bancos = preguntas
  } catch {
    // Si no se puede cargar el diccionario, la app sigue funcionando en español.
    exactos = new Map()
    patrones = []
  }
}

export function cambiarIdioma(nuevo) {
  try {
    localStorage.setItem(CLAVE, nuevo)
  } catch {
    // Sin almacenamiento dura hasta recargar, y al recargar vuelve el idioma del móvil.
  }
  idioma = nuevo
  window.location.reload()
}

// Un número guardado en español («1,2») se escribe con el separador del idioma actual.
function parteVariable(parte) {
  const traducida = t(parte)
  if (separadorDecimal() === ',') return traducida
  return /^-?\d+,\d+(\s|$)/.test(traducida) ? traducida.replace(',', '.') : traducida
}

// Traduce frase a frase, probando primero los grupos más largos que estén en el diccionario.
function traducirPorFrases(frases) {
  const resultado = []
  let hayTraduccion = false
  for (let i = 0; i < frases.length;) {
    let hecho = false
    for (let fin = frases.length; fin > i; fin--) {
      const traducida = traducirUnaParte(frases.slice(i, fin).join(' '))
      if (traducida !== null) {
        resultado.push(traducida)
        i = fin
        hecho = true
        hayTraduccion = true
        break
      }
    }
    if (!hecho) {
      resultado.push(frases[i])
      i++
    }
  }
  return hayTraduccion ? resultado.join(' ') : null
}

function traducirUnaParte(texto) {
  if (exactos.has(texto)) return exactos.get(texto)
  for (const { regla, original, traduccion } of patrones) {
    const encontrado = texto.match(regla)
    if (!encontrado) continue
    const posiciones = [...original.matchAll(/\{(\d)\}/g)].map(([, posicion]) => posicion)
    return posiciones.reduce(
      (resultado, posicion, i) =>
        resultado.replace(`{${posicion}}`, parteVariable(encontrado[i + 1])),
      traduccion,
    )
  }
  return null
}

// Traduce un texto. Lo que no está en el diccionario se queda tal cual.
export function t(texto) {
  if (typeof texto !== 'string' || idiomaActual() === 'es' || !/\p{L}/u.test(texto)) return texto
  if (memoria.has(texto)) return memoria.get(texto)
  const limpio = normalizar(texto)
  let resultado = traducirUnaParte(limpio)
  if (resultado === null && texto.trim().includes('\n')) {
    resultado = texto
      .trim()
      .split('\n')
      .map((linea) => t(linea))
      .join('\n')
  } else if (resultado === null) {
    const frases = limpio.split(FIN_DE_FRASE)
    if (frases.length > 1) resultado = traducirPorFrases(frases)
  }
  // Listas de sustancias, como «Vinagre, Agua y Limón».
  if (resultado === null && LISTA.test(limpio)) {
    const partes = limpio.split(/, | y /).map((parte) => t(parte))
    const ultima = partes.pop()
    resultado = `${partes.join(', ')} ${UNION[idioma]} ${ultima}`
  }
  const inicio = texto.match(/^\s*/)[0]
  const fin = texto.match(/\s*$/)[0]
  const final = resultado === null ? texto : `${inicio}${resultado}${fin}`
  memoria.set(texto, final)
  return final
}

// Una pregunta del banco en el idioma actual; si no está traducida, se queda en español.
export function traducirPregunta(pregunta) {
  const fila = bancos[pregunta.id]
  if (!fila) return pregunta
  const [texto, variantes, respuesta] = fila
  return { ...pregunta, pregunta: texto, variantes, respuesta }
}
