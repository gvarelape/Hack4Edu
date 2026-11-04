// Ejecutar con: node --test src/experimentos/rampa/
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { validarResultado } from '../../core/utilidades.js'
import { analizarMovimiento } from './analisisMovimiento.js'
import { crearResultado } from './crearResultado.js'
import { generarExplicaciones } from './explicaciones.js'
import { aceleracionTeorica, G_REFERENCIA } from './fisica.js'
import { generarDatosSinteticos } from './datos/sinteticos.js'

const ESCALA = 0.1
const MONTAJE = { altura: 25, largo: 100, tipoBola: 'maciza' }
const PREDICCION = { texto: 'Predijo que tardaría 1,2 s', valor: 1.2 }

function medir(opciones = {}) {
  const aceleracion = opciones.aceleracion ?? aceleracionTeorica(0.25, 'maciza')
  return analizarMovimiento(generarDatosSinteticos({ ...opciones, aceleracion }), ESCALA)
}

function ids(explicaciones) {
  return explicaciones.map((e) => e.preguntaId)
}

const BASE = { gSinRodadura: 7, errorPorcentaje: 2, puntosValidos: 30, tiempoBajada: 1 }

test('crearResultado: cumple el contrato según el validador del core', () => {
  for (const prediccion of [null, PREDICCION, { texto: 'Creo que irá rápido.', valor: null }]) {
    const { errores, avisos } = validarResultado(crearResultado(medir(), MONTAJE, prediccion), {
      prediccion,
    })
    assert.deepEqual(errores, [])
    assert.deepEqual(avisos, [])
  }
})

test('crearResultado: los valores salen en el orden y con los números correctos', () => {
  const { valores } = crearResultado(medir(), MONTAJE, null)
  assert.deepEqual(
    valores.map((v) => v.etiqueta),
    [
      'g estimada',
      'Aceleración',
      'g sin contar la rodadura',
      'Error respecto a 9,81',
      'Tiempo de bajada',
    ],
  )
  assert.ok(Math.abs(valores[0].valor - G_REFERENCIA) < 0.3)
  assert.ok(Math.abs(valores[1].valor - 1.75) < 0.05)
  assert.ok(Math.abs(valores[2].valor - 7) < 0.2)
  assert.ok(valores[3].valor < 3)
  assert.ok(Math.abs(valores[4].valor - 1.07) < 0.06)
  for (const { valor } of valores) assert.equal(typeof valor, 'number')
})

test('crearResultado: la bola hueca usa su propio factor', () => {
  const aceleracion = aceleracionTeorica(0.25, 'hueca')
  const { valores } = crearResultado(
    medir({ aceleracion }),
    { ...MONTAJE, tipoBola: 'hueca' },
    null,
  )
  assert.ok(Math.abs(valores[0].valor - G_REFERENCIA) < 0.3)
})

test('crearResultado: la comparación usa coma decimal y es null sin predicción', () => {
  const analisis = medir()
  assert.equal(crearResultado(analisis, MONTAJE, null).comparacion, null)
  assert.match(
    crearResultado(analisis, MONTAJE, PREDICCION).comparacion,
    /^Predijiste 1,2 s y ha tardado 1,\d\d s\.$/,
  )
})

test('crearResultado: la gráfica junta puntos medidos y curva de 40 puntos', () => {
  const analisis = medir()
  const { series } = crearResultado(analisis, MONTAJE, null).grafica
  assert.equal(series[0].rol, 'medido')
  assert.equal(series[0].puntos.length, analisis.tramo.length)
  assert.equal(series[1].rol, 'teorico')
  assert.equal(series[1].puntos.length, 40)
  // La curva tiene que pasar cerca de los puntos medidos.
  const ultimoMedido = series[0].puntos.at(-1)
  const ultimoCurva = series[1].puntos.at(-1)
  assert.ok(Math.abs(ultimoMedido.x - ultimoCurva.x) < 1e-9)
  assert.ok(Math.abs(ultimoMedido.y - ultimoCurva.y) < 1)
})

test('crearResultado: una grabación muy larga no pasa de 300 puntos por serie', () => {
  const tramo = Array.from({ length: 1000 }, (_, i) => ({ t: i / 100, s: i }))
  const analisis = {
    tramo,
    ajuste: { s0: 0, v0: 100, a: 0 },
    aceleracion: 1.75,
    tiempoBajada: 10,
    puntosValidos: 1000,
  }
  const resultado = crearResultado(analisis, MONTAJE, null)
  assert.equal(resultado.grafica.series[0].puntos.length, 300)
  assert.equal(resultado.grafica.series[0].puntos.at(-1).x, tramo.at(-1).t)
  assert.deepEqual(validarResultado(resultado).errores, [])
})

test('explicaciones: cada regla salta en su caso', () => {
  assert.deepEqual(ids(generarExplicaciones(BASE)), ['rampa-rodadura', 'rampa-buena-medida'])
  assert.ok(
    ids(generarExplicaciones({ ...BASE, errorPorcentaje: 25 })).includes('rampa-error-grande'),
  )
  assert.ok(
    ids(generarExplicaciones({ ...BASE, puntosValidos: 19 })).includes('rampa-pocos-puntos'),
  )
  assert.ok(
    ids(generarExplicaciones({ ...BASE, prediccion: { texto: 'x', valor: 2 } })).includes(
      'general-hipotesis-falsa',
    ),
  )
})

test('explicaciones: respeta los límites de las reglas', () => {
  const con = (cambios) => ids(generarExplicaciones({ ...BASE, ...cambios }))
  assert.ok(con({ gSinRodadura: 5 }).includes('rampa-rodadura'))
  assert.ok(con({ gSinRodadura: 8.5 }).includes('rampa-rodadura'))
  assert.ok(!con({ gSinRodadura: 4.9 }).includes('rampa-rodadura'))
  assert.ok(!con({ gSinRodadura: 8.6 }).includes('rampa-rodadura'))
  assert.ok(con({ errorPorcentaje: 10 }).includes('rampa-buena-medida'))
  assert.ok(!con({ errorPorcentaje: 10.1 }).includes('rampa-buena-medida'))
  assert.ok(!con({ errorPorcentaje: 20 }).includes('rampa-error-grande'))
  assert.ok(con({ errorPorcentaje: 20.1 }).includes('rampa-error-grande'))
  assert.ok(!con({ puntosValidos: 20 }).includes('rampa-pocos-puntos'))
})

test('explicaciones: una predicción parecida o sin número no se comenta', () => {
  const con = (prediccion) => ids(generarExplicaciones({ ...BASE, prediccion }))
  assert.ok(!con({ texto: 'x', valor: 1.2 }).includes('general-hipotesis-falsa'))
  assert.ok(!con({ texto: 'x', valor: null }).includes('general-hipotesis-falsa'))
  assert.ok(!con(null).includes('general-hipotesis-falsa'))
})

test('explicaciones: con todo en contra salen 3, de la más a la menos importante', () => {
  const lista = generarExplicaciones({
    gSinRodadura: 6,
    errorPorcentaje: 30,
    puntosValidos: 12,
    tiempoBajada: 1,
    prediccion: { texto: 'x', valor: 3 },
  })
  assert.deepEqual(ids(lista), ['rampa-rodadura', 'rampa-error-grande', 'rampa-pocos-puntos'])
})

test('explicaciones: siempre hay entre 1 y 3, sea cual sea la medida', () => {
  for (let gSinRodadura = 0; gSinRodadura <= 15; gSinRodadura += 0.25) {
    for (let errorPorcentaje = 0; errorPorcentaje <= 60; errorPorcentaje += 2.5) {
      const { length } = generarExplicaciones({ ...BASE, gSinRodadura, errorPorcentaje })
      assert.ok(length >= 1 && length <= 3, `${gSinRodadura}, ${errorPorcentaje}: ${length}`)
    }
  }
})
