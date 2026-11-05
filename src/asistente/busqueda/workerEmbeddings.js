// Web Worker del nivel 2: carga el modelo sin congelar la pantalla y puntúa las preguntas.
import { env, pipeline } from '@huggingface/transformers'
import { decodificarVectores, puntuarPreguntas } from './similitudEmbeddings.js'

const RUTA = '/modelos/asistente/'

// Nada de internet: todo sale de public/modelos/asistente/.
env.allowRemoteModels = false
env.allowLocalModels = true
env.localModelPath = RUTA
env.useBrowserCache = false
env.backends.onnx.wasm.wasmPaths = `${RUTA}wasm/`
env.backends.onnx.wasm.numThreads = 1

let listo = null

async function cargar() {
  const [modelo, respuesta] = await Promise.all([
    pipeline('feature-extraction', 'e5', { dtype: 'int8', device: 'wasm' }),
    fetch(`${RUTA}embeddings.json`),
  ])
  if (!respuesta.ok) throw new Error('Faltan los vectores del banco')
  const { preguntas } = await respuesta.json()
  const vectores = new Map(
    Object.entries(preguntas).map(([huella, base64]) => [huella, decodificarVectores(base64)]),
  )
  return { modelo, vectores }
}

self.onmessage = async ({ data }) => {
  try {
    listo ??= cargar()
    const { modelo, vectores } = await listo.catch((fallo) => {
      listo = null // la siguiente pregunta lo vuelve a intentar
      throw fallo
    })
    if (data.tipo === 'cargar') {
      self.postMessage({ id: data.id, puntos: null })
      return
    }
    // `e5` espera este prefijo en las frases que compara.
    const salida = await modelo(`query: ${data.texto}`, { pooling: 'mean', normalize: true })
    self.postMessage({
      id: data.id,
      puntos: puntuarPreguntas(salida.data, data.preguntas, vectores),
    })
  } catch {
    self.postMessage({ id: data.id, fallo: true })
  }
}
