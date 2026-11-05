import { test } from 'node:test'
import assert from 'node:assert/strict'
import { validarPrediccion } from '../../core/utilidades.js'
import { G_REFERENCIA } from './fisica.js'
import {
  alturaDeRampa,
  crearBajada,
  crearGraficaSimulada,
  crearPrediccion,
  curvaCompleta,
  DIBUJO,
  distanciaEn,
  geometriaRampa,
  LIMITES,
  posicionBola,
  rampaDesdeMedidas,
} from './simulacionRampa.js'

function cerca(real, esperado, margen = 1e-6) {
  assert.ok(Math.abs(real - esperado) <= margen, `${real} frente a ${esperado}`)
}

const RAMPA = { angulo: 30, largo: 100, tipoBola: 'maciza' }

test('crearBajada: usa el factor de cada bola', () => {
  // sin 30° = 0,5
  cerca(crearBajada(RAMPA).aceleracion, (5 / 7) * G_REFERENCIA * 0.5)
  cerca(crearBajada({ ...RAMPA, tipoBola: 'hueca' }).aceleracion, (3 / 5) * G_REFERENCIA * 0.5)
  cerca(crearBajada({ ...RAMPA, tipoBola: 'sinRozamiento' }).aceleracion, G_REFERENCIA * 0.5)
})

test('crearBajada: la que resbala llega antes, y la hueca, la última', () => {
  const tiempo = (tipoBola) => crearBajada({ ...RAMPA, tipoBola }).duracion
  assert.ok(tiempo('sinRozamiento') < tiempo('maciza'))
  assert.ok(tiempo('maciza') < tiempo('hueca'))
})

test('distanciaEn: sale de 0, llega al final en la duración y no se pasa', () => {
  const bajada = crearBajada(RAMPA)
  assert.equal(distanciaEn(0, bajada), 0)
  cerca(distanciaEn(bajada.duracion, bajada), RAMPA.largo)
  assert.equal(distanciaEn(bajada.duracion + 5, bajada), RAMPA.largo)
})

test('distanciaEn: con el doble de tiempo, cuatro veces más distancia', () => {
  const bajada = crearBajada({ ...RAMPA, largo: 1000 })
  cerca(distanciaEn(0.4, bajada), 4 * distanciaEn(0.2, bajada))
})

test('curvaCompleta: va del principio al final de la rampa', () => {
  const bajada = crearBajada(RAMPA)
  const curva = curvaCompleta(bajada)
  assert.equal(curva.length, 40)
  assert.deepEqual(curva[0], { x: 0, y: 0 })
  cerca(curva.at(-1).x, bajada.duracion)
  cerca(curva.at(-1).y, RAMPA.largo)
})

test('crearGraficaSimulada: usa el rol simulado', () => {
  const { series } = crearGraficaSimulada([{ x: 0, y: 0 }])
  assert.equal(series[0].rol, 'simulado')
  assert.equal(series[0].tipo, 'linea')
})

test('alturaDeRampa: 100 cm a 30° suben 50 cm', () => {
  cerca(alturaDeRampa(30, 100), 50)
})

test('geometriaRampa: cabe en el dibujo en todos los extremos', () => {
  const { angulo, largo } = LIMITES
  for (const a of [angulo.minimo, angulo.maximo]) {
    for (const l of [largo.minimo, largo.maximo]) {
      const { inicio, fin } = geometriaRampa({ angulo: a, largo: l })
      assert.ok(inicio.y - 2 * DIBUJO.radioBola > 0, `arriba: ${a}°, ${l} cm`)
      assert.ok(fin.x + DIBUJO.radioBola < DIBUJO.ancho, `derecha: ${a}°, ${l} cm`)
      assert.ok(fin.y < DIBUJO.alto, `abajo: ${a}°, ${l} cm`)
    }
  }
})

test('posicionBola: va apoyada sobre la rampa, de un extremo al otro', () => {
  const { inicio, fin } = geometriaRampa(RAMPA)
  for (const [distancia, punto] of [
    [0, inicio],
    [RAMPA.largo, fin],
  ]) {
    const bola = posicionBola(RAMPA, distancia)
    cerca(Math.hypot(bola.x - punto.x, bola.y - punto.y), DIBUJO.radioBola)
    assert.ok(bola.y < punto.y, 'la bola va por encima de la rampa')
  }
})

test('posicionBola: rueda sin resbalar, salvo sin rozamiento', () => {
  assert.equal(posicionBola(RAMPA, 0).giro, 0)
  const avance = posicionBola(RAMPA, 50)
  const recorrido = Math.hypot(
    avance.x - posicionBola(RAMPA, 0).x,
    avance.y - posicionBola(RAMPA, 0).y,
  )
  // Girar es avanzar: un arco igual al camino recorrido.
  cerca(((avance.giro * Math.PI) / 180) * DIBUJO.radioBola, recorrido)
  assert.equal(posicionBola({ ...RAMPA, tipoBola: 'sinRozamiento' }, 50).giro, 0)
})

test('rampaDesdeMedidas: convierte las medidas sin redondearlas', () => {
  const rampa = rampaDesdeMedidas(20, 100)
  assert.equal(rampa.largo, 100)
  assert.equal(rampa.recortada, false)
  cerca(alturaDeRampa(rampa.angulo, rampa.largo), 20)
  const conDecimales = rampaDesdeMedidas(20, 97)
  assert.equal(conDecimales.largo, 97)
  cerca(alturaDeRampa(conDecimales.angulo, conDecimales.largo), 20)
})

test('rampaDesdeMedidas: avisa si se sale de lo que admite la simulación', () => {
  assert.deepEqual(rampaDesdeMedidas(90, 100), { angulo: 30, largo: 100, recortada: true })
  assert.deepEqual(rampaDesdeMedidas(2, 100), { angulo: 5, largo: 100, recortada: true })
  const larga = rampaDesdeMedidas(60, 300)
  assert.equal(larga.largo, 150)
  assert.equal(larga.recortada, true)
})

test('rampaDesdeMedidas: devuelve null si la rampa no es posible', () => {
  assert.equal(rampaDesdeMedidas(0, 100), null)
  assert.equal(rampaDesdeMedidas(120, 100), null)
  assert.equal(rampaDesdeMedidas(null, null), null)
})

test('crearPrediccion: cumple el contrato y conserva el número', () => {
  const prediccion = crearPrediccion(1.2)
  assert.equal(prediccion.valor, 1.2)
  assert.match(prediccion.texto, /^Predijo que tardaría 1[,.]2 s$/)
  assert.deepEqual(validarPrediccion(prediccion).errores, [])
})
