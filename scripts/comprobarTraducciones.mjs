// Lista los textos de la app que aún no están en los diccionarios: npm run traducciones.
// Uso: node scripts/comprobarTraducciones.mjs [carpeta ...]
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

const NO_ES_TEXTO =
  /^(core|ph|rampa|botellas|cuaderno|asistente)-|^[a-z]+([-_:.][a-z0-9]+)+$|^(rgb|var|translate|scale|M\d|#|https?:)|^[\d\s.,:%()/-]+$/
// Los bancos de preguntas se traducen aparte; lo demás no se muestra al alumno.
const OMITIR =
  /(test|sinteticos|registrosEjemplo|pruebasBusqueda|traducciones|validarResultado|preguntas|sinonimos|normalizar|busquedaPalabras|evaluarPruebas|\.mjs$)/

function archivos(carpeta) {
  return readdirSync(carpeta).flatMap((nombre) => {
    const ruta = join(carpeta, nombre)
    if (statSync(ruta).isDirectory()) return archivos(ruta)
    return /\.(jsx?|mjs)$/.test(nombre) && !OMITIR.test(ruta) ? [ruta] : []
  })
}

export function extraerTextos(fuente, esJsx) {
  const limpio = fuente.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')
  const textos = new Set()
  for (const [, , t] of limpio.matchAll(/(['"`])((?:(?!\1)[^\\\n]|\\.)*)\1/g)) textos.add(t)
  if (esJsx) for (const [, t] of limpio.matchAll(/>\s*([^<>{}\n][^<>{}]*?)\s*</g)) textos.add(t)
  return [...textos]
    .map((t) => t.replace(/\\(['"`])/g, '$1').trim())
    .filter(
      (t) =>
        /\p{L}{2,}/u.test(t) && (/\s/.test(t) || /[áéíóúñ¿¡]/i.test(t) || /^[A-ZÁÉÍÓÚÑ]/.test(t)),
    )
    .filter(
      (t) =>
        !NO_ES_TEXTO.test(t) &&
        !/^[a-z]+[A-Z]/.test(t) &&
        !/[=;{}<>]/.test(t.replace(/\$\{[^}]*\}/g, '')),
    )
}

export function textosDe(carpetas) {
  const todos = new Map()
  for (const carpeta of carpetas) {
    if (!existsSync(carpeta)) continue
    for (const ruta of archivos(carpeta)) {
      for (const t of extraerTextos(readFileSync(ruta, 'utf8'), ruta.endsWith('jsx'))) {
        if (!todos.has(t)) todos.set(t, ruta)
      }
    }
  }
  return todos
}

if (process.argv[1]?.endsWith('comprobarTraducciones.mjs')) {
  const carpetas = process.argv.slice(2).length ? process.argv.slice(2) : ['src']
  const { textos } = await import(new URL('../src/core/traducciones/textos.js', import.meta.url))
  const conocidos = new Set(textos.map(([original]) => original.replace(/\s+/g, ' ').trim()))
  // ${...} en el código equivale a {0}, {1}… en el diccionario.
  const comoFila = (t) => {
    let n = 0
    return t.replace(/\$\{[^}]*\}+/g, () => `{${n++}}`).replace(/\s+/g, ' ')
  }
  const todos = textosDe(carpetas)
  const faltan = [...todos].filter(([t]) => !conocidos.has(comoFila(t)))
  faltan.forEach(([t, ruta]) => console.log(`${ruta}: ${t}`))

  // Los bancos de preguntas se traducen por id.
  const raiz = new URL('../', import.meta.url).pathname
  const bancos = readdirSync(join(raiz, 'src/experimentos')).map(
    (parte) => `src/experimentos/${parte}/preguntas.js`,
  )
  for (const idioma of ['en', 'fr']) {
    const { preguntas } = await import(
      new URL(`../src/core/traducciones/preguntas-${idioma}.js`, import.meta.url)
    )
    for (const banco of bancos.filter((ruta) => existsSync(join(raiz, ruta)))) {
      const modulo = await import(new URL(`../${banco}`, import.meta.url))
      const sin = modulo.preguntas.filter((pregunta) => !preguntas[pregunta.id])
      if (sin.length > 0) console.log(`${banco}: ${sin.length} preguntas sin traducir al ${idioma}`)
    }
  }
  console.log(`\n${todos.size - faltan.length} de ${todos.size} textos traducidos.`)
}
