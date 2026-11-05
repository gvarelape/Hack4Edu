// Pruebas de la lógica pura del pH: npm test.
import assert from 'node:assert/strict'
import { test } from 'node:test'
import { validarResultado } from '../../core/utilidades.js'
import { lecturaValida, rgbAHsv } from './analisisColor.js'
import { crearResultado } from './crearResultado.js'
import { estimarPh, estimarPhPorTabla, pesoTabla, tipoPh } from './estimarPh.js'
import { compararOrden, agruparPorSustancia, textoPrediccion } from './ordenSustancias.js'
import { preguntas } from './preguntas.js'
import { colorPorPh, echarGota } from './vasoVirtual.js'

// Color aproximado del agua de lombarda con un pH dado, como { r, g, b }.
function lombarda(ph) {
  const [r, g, b] = colorPorPh(ph).match(/\d+/g).map(Number)
  return { r, g, b }
}

const calibracionClase = [
  { sustancia: 'Agua', ...lombarda(7), ph: 7 },
  { sustancia: 'Vinagre', ...lombarda(3), ph: 3 },
  { sustancia: 'Bicarbonato', ...lombarda(8.5), ph: 8.5 },
]

test('tipoPh: límites de ácida, neutra y básica', () => {
  assert.equal(tipoPh(6.4), 'ácida')
  assert.equal(tipoPh(6.5), 'neutra')
  assert.equal(tipoPh(7.5), 'neutra')
  assert.equal(tipoPh(7.6), 'básica')
})

test('tabla: rojo es ácido, morado neutro y verde básico', () => {
  assert.equal(tipoPh(estimarPhPorTabla(lombarda(2))), 'ácida')
  assert.equal(tipoPh(estimarPhPorTabla(lombarda(7))), 'neutra')
  assert.equal(tipoPh(estimarPhPorTabla(lombarda(12))), 'básica')
})

test('con menos de 3 muestras se usa la tabla', () => {
  const { metodo } = estimarPh(lombarda(7), calibracionClase.slice(0, 2))
  assert.equal(metodo, 'tabla')
})

test('calibrado: un color igual al de una muestra da su pH', () => {
  const { ph, metodo } = estimarPh(lombarda(7), calibracionClase)
  assert.equal(metodo, 'knn')
  assert.ok(Math.abs(ph - 7) < 0.3, `salió ${ph}`)
})

test('calibrado: un verde muy básico no sale ácido (fallo encontrado por Gabriel)', () => {
  for (const phReal of [11, 12, 13]) {
    const { ph } = estimarPh(lombarda(phReal), calibracionClase)
    assert.equal(tipoPh(ph), 'básica', `pH ${phReal} salió ${ph}`)
    assert.ok(ph > 9, `pH ${phReal} salió ${ph}`)
  }
})

test('calibrado: un rojo muy ácido no sale básico', () => {
  const { ph } = estimarPh(lombarda(1.5), calibracionClase)
  assert.equal(tipoPh(ph), 'ácida', `salió ${ph}`)
})

test('pesoTabla: 0 sobre una muestra y 1 lejos de todas', () => {
  assert.equal(pesoTabla(lombarda(7), calibracionClase), 0)
  assert.equal(pesoTabla(lombarda(13), calibracionClase), 1)
})

test('lecturaValida: avisa con poca luz o sin color', () => {
  assert.equal(lecturaValida(rgbAHsv({ r: 20, g: 10, b: 30 })).motivo, 'poca-luz')
  assert.equal(lecturaValida(rgbAHsv({ r: 128, g: 128, b: 128 })).motivo, 'sin-color')
  assert.equal(lecturaValida(rgbAHsv(lombarda(7))).valida, true)
})

test('vaso virtual: el vinagre baja el pH sin pasar de 2,5 y el bicarbonato lo sube', () => {
  let ph = 7
  for (let i = 0; i < 50; i++) ph = echarGota(ph, 'vinagre')
  assert.ok(ph >= 2.5 && ph < 3)
  assert.ok(echarGota(7, 'bicarbonato') > 7)
})

test('compararOrden: detecta las sustancias que cambian de sitio', () => {
  const sustancias = agruparPorSustancia([
    { sustancia: 'Vinagre', ph: 3 },
    { sustancia: 'agua', ph: 7 },
    { sustancia: 'Bicarbonato', ph: 8.5 },
  ])
  const bien = compararOrden(sustancias, ['Vinagre', 'Agua', 'Bicarbonato'])
  assert.equal(bien.coincide, true)
  const mal = compararOrden(sustancias, ['Vinagre', 'Bicarbonato', 'Agua'])
  assert.deepEqual(mal.cambiadas, ['Bicarbonato', 'Agua'])
})

test('crearResultado cumple el contrato con y sin predicción', () => {
  const muestras = calibracionClase.map((m, i) => ({ id: i, ...m }))
  const ids = preguntas.map((p) => p.id)
  for (const prediccion of [null, { texto: textoPrediccion(['Vinagre', 'Agua']), valor: null }]) {
    const resultado = crearResultado({ muestras, prediccion })
    const { errores } = validarResultado(resultado, { prediccion, preguntas })
    assert.deepEqual(errores, [])
    for (const e of resultado.explicaciones) {
      if (!e.preguntaId.startsWith('general-')) assert.ok(ids.includes(e.preguntaId), e.preguntaId)
    }
  }
})

test('preguntas: ids únicos con prefijo ph- y entre 3 y 6 variantes', () => {
  const ids = preguntas.map((p) => p.id)
  assert.equal(new Set(ids).size, ids.length)
  for (const p of preguntas) {
    assert.ok(p.id.startsWith('ph-'), p.id)
    assert.ok(p.variantes.length >= 3 && p.variantes.length <= 6, p.id)
  }
})
