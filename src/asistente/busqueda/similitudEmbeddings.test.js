import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { test } from 'node:test'
import { bancoCompleto } from '../herramientas/bancoCompleto.mjs'
import { huellaPregunta } from './huellaPregunta.js'
import {
  codificarVectores,
  decodificarVectores,
  DIMENSIONES,
  puntuarPreguntas,
  reajustarCoseno,
  similitudConVectores,
} from './similitudEmbeddings.js'

const vector = (indice) => Array.from({ length: DIMENSIONES }, (_, i) => (i === indice ? 1 : 0))

test('el coseno se reajusta de 0,80-1 a 0-1', () => {
  assert.equal(reajustarCoseno(0.5), 0)
  assert.ok(Math.abs(reajustarCoseno(0.9) - 0.5) < 1e-9)
  assert.equal(reajustarCoseno(1.2), 1)
})

test('los vectores sobreviven a guardarlos, con valores negativos', () => {
  const bytes = decodificarVectores(codificarVectores([vector(3).map((v) => -v), vector(5)]))
  assert.equal(bytes.length, 2 * DIMENSIONES)
  assert.equal(bytes[3], -127)
  assert.equal(bytes[DIMENSIONES + 5], 127)
})

test('una pregunta vale lo que su frase más parecida', () => {
  const bytes = decodificarVectores(codificarVectores([vector(1), vector(2)]))
  assert.equal(similitudConVectores(vector(2), bytes), 1)
  assert.equal(similitudConVectores(vector(9), bytes), 0)
})

test('una pregunta sin vector se queda fuera, y sin ninguno no se puntúa nada', () => {
  const vectores = new Map([['a', decodificarVectores(codificarVectores([vector(0)]))]])
  assert.deepEqual(
    puntuarPreguntas(
      vector(0),
      [
        ['p', 'a'],
        ['q', 'b'],
      ],
      vectores,
    ),
    [['p', 1]],
  )
  assert.equal(puntuarPreguntas(vector(0), [['q', 'b']], vectores), null)
})

test('la huella cambia si cambia una variante', () => {
  const pregunta = { id: 'p', pregunta: '¿Qué?', variantes: ['uno'] }
  assert.notEqual(huellaPregunta(pregunta), huellaPregunta({ ...pregunta, variantes: ['dos'] }))
})

test('embeddings.json está al día con todos los bancos (si falla: npm run embeddings)', async () => {
  const ruta = new URL('../../../public/modelos/asistente/embeddings.json', import.meta.url)
  assert.ok(existsSync(ruta))
  const { preguntas } = JSON.parse(readFileSync(ruta, 'utf8'))
  const faltan = (await bancoCompleto()).filter((p) => !preguntas[huellaPregunta(p)])
  assert.deepEqual(
    faltan.map((p) => p.id),
    [],
  )
})
