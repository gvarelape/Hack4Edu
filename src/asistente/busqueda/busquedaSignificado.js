// Nivel 2 del asistente: busca por significado con un modelo dentro del móvil. Es opcional:
// se descarga desde Ajustes y, si no está o falla, buscarRespuesta sigue solo con el nivel 1.
import { huellaPregunta } from './huellaPregunta.js'

const CACHE = 'modelos'
const RUTA = '/modelos/asistente/'
const ARCHIVOS = [
  `${RUTA}e5/config.json`,
  `${RUTA}e5/tokenizer_config.json`,
  `${RUTA}e5/tokenizer.json`,
  `${RUTA}e5/onnx/model_int8.onnx`,
  `${RUTA}wasm/ort-wasm-simd-threaded.mjs`,
  `${RUTA}wasm/ort-wasm-simd-threaded.wasm`,
  `${RUTA}embeddings.json`,
]
// Si la app se cierra de golpe mientras carga el modelo, esta marca sigue ahí al volver a abrirla:
// el móvil no tiene memoria para él y no se vuelve a intentar hasta activarlo otra vez.
const MARCA_CARGANDO = `${RUTA}.cargando`
const MS_ESPERA_MAXIMA = 2500 // nunca se hace esperar más al alumno: responde el nivel 1
const MS_LIBERAR_MEMORIA = 60000

let estado = 'no-descargado'
let comprobacion = null
let worker = null
let cargaWorker = null
let temporizador = null
let siguienteId = 1
const pendientes = new Map()
const huellas = new WeakMap()

const hayCache = () => typeof caches !== 'undefined'

/** Mira qué hay en el móvil. Devuelve una Promise con el estado. Se llama al abrir Ajustes. */
export function comprobarModeloAsistente() {
  if (!hayCache()) return Promise.resolve(estado)
  comprobacion ??= (async () => {
    try {
      const cache = await caches.open(CACHE)
      const encontrados = await Promise.all(ARCHIVOS.map((ruta) => cache.match(ruta)))
      const completo = encontrados.every(Boolean)
      const seCerro = Boolean(await cache.match(MARCA_CARGANDO))
      if (estado !== 'descargando') {
        estado = seCerro ? 'error' : completo ? 'listo' : 'no-descargado'
      }
    } catch {
      estado = 'no-descargado'
    }
    return estado
  })()
  return comprobacion
}

export function estadoModeloAsistente() {
  return estado
}

/** Descarga el modelo. Llama a onProgreso con un número de 0 a 1. Lanza un error si falla. */
export async function descargarModeloAsistente(onProgreso) {
  estado = 'descargando'
  try {
    const { default: rutaWorker } = await import('./rutaWorker.js')
    const { descargarRecurso } = await import('../../core/lib/sinInternet.js')
    const archivos = [rutaWorker, ...ARCHIVOS]
    for (const [i, ruta] of archivos.entries()) {
      await descargarRecurso(ruta, (fraccion) => {
        onProgreso?.((i + (fraccion ?? 0)) / archivos.length)
      })
    }
    await (await caches.open(CACHE)).delete(MARCA_CARGANDO)
    estado = 'listo'
    comprobacion = Promise.resolve(estado)
    onProgreso?.(1)
  } catch (fallo) {
    estado = 'error'
    comprobacion = null
    throw fallo
  }
}

function cerrarWorker() {
  clearTimeout(temporizador)
  worker?.terminate()
  worker = null
  cargaWorker = null
  for (const resolver of pendientes.values()) resolver(null)
  pendientes.clear()
}

async function abrirWorker() {
  const { default: rutaWorker } = await import('./rutaWorker.js')
  const nuevo = new Worker(rutaWorker, { type: 'module' })
  nuevo.onmessage = ({ data }) => {
    const resolver = pendientes.get(data.id)
    pendientes.delete(data.id)
    resolver?.(data.fallo ? null : data.puntos)
  }
  nuevo.onerror = () => {
    estado = 'error'
    cerrarWorker()
  }
  worker = nuevo
}

function pedir(mensaje) {
  return new Promise((resolver) => {
    const id = siguienteId++
    pendientes.set(id, resolver)
    worker.postMessage({ ...mensaje, id })
  })
}

// La primera vez carga el modelo con la marca puesta, y la quita si ha ido bien.
function asegurarWorker() {
  cargaWorker ??= (async () => {
    const cache = await caches.open(CACHE)
    await cache.put(MARCA_CARGANDO, new Response(''))
    await abrirWorker()
    await pedir({ tipo: 'cargar' })
    if (worker) await cache.delete(MARCA_CARGANDO)
  })()
  return cargaWorker
}

function huellasDe(preguntas) {
  if (!huellas.has(preguntas)) {
    huellas.set(
      preguntas,
      preguntas.map((pregunta) => [pregunta.id, huellaPregunta(pregunta)]),
    )
  }
  return huellas.get(preguntas)
}

/**
 * Similitud por significado de cada pregunta con el texto del alumno.
 * Devuelve una Promise con un Map<id, similitud 0–1>, o null si ahora no se puede usar el modelo.
 */
export async function puntuarPorSignificado(texto, preguntas) {
  if ((await comprobarModeloAsistente()) !== 'listo') return null
  clearTimeout(temporizador)
  temporizador = setTimeout(cerrarWorker, MS_LIBERAR_MEMORIA)

  const consulta = asegurarWorker()
    .then(() =>
      worker ? pedir({ tipo: 'puntuar', texto, preguntas: huellasDe(preguntas) }) : null,
    )
    .catch(() => null)
  const espera = new Promise((resolver) => setTimeout(resolver, MS_ESPERA_MAXIMA, null))
  const puntos = await Promise.race([consulta, espera])
  return puntos ? new Map(puntos) : null
}
