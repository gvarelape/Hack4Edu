import { test } from 'node:test'
import assert from 'node:assert/strict'
import { generarExplicaciones } from './explicaciones.js'
import { preguntas } from './preguntas.js'

const MOMENTOS = ['antes', 'durante', 'resultados', 'siempre']
const ids = new Set(preguntas.map((p) => p.id))
const frases = (texto) => texto.split(/(?<=[.!?])\s+/).length

test('banco: tiene entre 20 y 30 preguntas con ids únicos que empiezan por rampa-', () => {
  assert.ok(preguntas.length >= 20 && preguntas.length <= 30, `${preguntas.length} preguntas`)
  assert.equal(ids.size, preguntas.length)
  for (const { id } of preguntas) assert.ok(id.startsWith('rampa-'), id)
})

test('banco: cada pregunta cumple el formato del contrato', () => {
  for (const { id, pregunta, variantes, respuesta, momento } of preguntas) {
    assert.ok(pregunta.trim().length > 0, id)
    assert.ok(
      variantes.length >= 3 && variantes.length <= 6,
      `${id}: ${variantes.length} variantes`,
    )
    assert.ok(
      frases(respuesta) >= 2 && frases(respuesta) <= 5,
      `${id}: ${frases(respuesta)} frases`,
    )
    assert.ok(MOMENTOS.includes(momento), id)
  }
})

test('banco: no repite una variante en dos preguntas', () => {
  const vistas = new Map()
  for (const { id, variantes } of preguntas) {
    for (const variante of variantes) {
      assert.ok(!vistas.has(variante), `"${variante}" en ${id} y ${vistas.get(variante)}`)
      vistas.set(variante, id)
    }
  }
})

test('banco: las preguntas relacionadas existen', () => {
  for (const { id, relacionadas = [] } of preguntas) {
    for (const otra of relacionadas) {
      assert.ok(otra.startsWith('general-') || ids.has(otra), `${id} enlaza con ${otra}`)
      assert.notEqual(otra, id)
    }
  }
})

test('banco: cada explicación enlaza con una pregunta que existe', () => {
  const usados = new Set()
  for (const gSinRodadura of [3, 7]) {
    for (const errorPorcentaje of [2, 15, 30]) {
      for (const puntosValidos of [12, 30]) {
        const lista = generarExplicaciones({
          gSinRodadura,
          errorPorcentaje,
          puntosValidos,
          tiempoBajada: 1,
          prediccion: null,
        })
        lista.forEach((e) => usados.add(e.preguntaId))
      }
    }
  }
  for (const id of usados) {
    assert.ok(id.startsWith('general-') || ids.has(id), `falta ${id}`)
  }
  for (const id of ['rampa-rodadura', 'rampa-error-grande', 'rampa-buena-medida']) {
    assert.ok(usados.has(id), `no se ha probado ${id}`)
  }
})
