import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import experimento from './index.js'

const CAMPOS = [
  'id',
  'titulo',
  'ciencia',
  'descripcion',
  'pregunta',
  'materiales',
  'instrucciones',
  'seguridad',
  'reflexion',
  'preguntas',
  'recursos',
  'Simulacion',
  'Medicion',
]

test('index: tiene exactamente los campos del contrato', () => {
  assert.deepEqual(Object.keys(experimento).sort(), [...CAMPOS].sort())
  assert.equal(experimento.id, 'rampa')
  assert.equal(experimento.ciencia, 'Física')
})

test('index: los textos están rellenos', () => {
  for (const campo of ['titulo', 'descripcion', 'pregunta']) {
    assert.ok(experimento[campo].trim().length > 0, campo)
  }
  for (const campo of ['materiales', 'instrucciones']) {
    assert.ok(experimento[campo].length > 0, campo)
    for (const texto of experimento[campo]) assert.ok(texto.trim().length > 0, campo)
  }
  assert.ok(Array.isArray(experimento.seguridad))
  assert.ok(experimento.reflexion.length >= 2 && experimento.reflexion.length <= 3)
})

test('index: las pantallas se cargan bajo demanda', () => {
  // Un componente de lazy es un objeto; uno importado directamente sería una función.
  assert.equal(typeof experimento.Simulacion, 'object')
  assert.equal(typeof experimento.Medicion, 'object')
})

test('index: los recursos existen en public y son rutas locales', () => {
  assert.ok(experimento.recursos.length > 0)
  for (const ruta of experimento.recursos) {
    assert.ok(ruta.startsWith('/modelos/rampa/'), ruta)
    assert.ok(existsSync(new URL(`../../../public${ruta}`, import.meta.url)), `falta ${ruta}`)
  }
})
