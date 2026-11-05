// Calcula en el ordenador los vectores del banco de preguntas: npm run embeddings.
// Hay que volver a ejecutarlo cuando cambie una pregunta o una variante, en cualquier idioma.
import { writeFileSync } from 'node:fs'
import { env, pipeline } from '@huggingface/transformers'
import { huellaPregunta } from '../busqueda/huellaPregunta.js'
import { codificarVectores } from '../busqueda/similitudEmbeddings.js'
import { bancoCompleto } from './bancoCompleto.mjs'

const CARPETA = new URL('../../../public/modelos/asistente/', import.meta.url)

env.allowRemoteModels = false
env.localModelPath = CARPETA.pathname

const modelo = await pipeline('feature-extraction', 'e5', { dtype: 'int8', device: 'cpu' })
const preguntas = {}
let frases = 0

for (const pregunta of await bancoCompleto()) {
  const textos = [pregunta.pregunta, ...pregunta.variantes]
  const vectores = []
  for (const texto of textos) {
    const salida = await modelo(`query: ${texto}`, { pooling: 'mean', normalize: true })
    vectores.push(Array.from(salida.data))
    frases++
  }
  preguntas[huellaPregunta(pregunta)] = codificarVectores(vectores)
}

writeFileSync(new URL('embeddings.json', CARPETA), JSON.stringify({ preguntas }))
process.stdout.write(`${Object.keys(preguntas).length} preguntas y ${frases} frases.\n`)
