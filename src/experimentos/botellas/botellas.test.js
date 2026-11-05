// Pruebas de la lógica de botellas: npm test.
import assert from 'node:assert/strict'
import { test } from 'node:test'
import { validarResultado } from '../../core/utilidades.js'
import {
  buscarPico,
  lecturaEstable,
  mediana,
  nivelEstabilidad,
  recortarHistorial,
} from './analisisAudio.js'
import { alturaAire, anadirPunto, crearPrediccion } from './botellaVirtual.js'
import { crearResultado } from './crearResultado.js'
import { frecuenciaTeorica, tendenciaAlLlenar, velocidadSonido } from './modelo.js'

const cerca = (valor, esperado, margen) =>
  assert.ok(Math.abs(valor - esperado) <= margen, `${valor} no está cerca de ${esperado}`)

// Tubo ideal con corrección de extremo: f = v / (4 · (L + d)).
const medidasIdeales = (v = 343, d = 0, alturas = [8, 12, 16, 20]) =>
  alturas.map((alturaCm) => ({ alturaCm, frecuencia: v / (4 * ((alturaCm + d) / 100)) }))

// Espectro plano en -100 dB con un pico alrededor de una frecuencia.
function espectroConPico(hz, { muestreo = 48000, bandas = 4096, db = -30 } = {}) {
  const valores = new Float32Array(bandas).fill(-100)
  const banda = Math.round(hz / (muestreo / (2 * bandas)))
  valores[banda - 1] = db - 6
  valores[banda] = db
  valores[banda + 1] = db - 6
  return valores
}

const lecturas = (frecuencias, paso = 0.05, fin = 1) =>
  frecuencias.map((frecuencia, i) => ({
    tiempo: fin - (frecuencias.length - 1 - i) * paso,
    frecuencia,
  }))

test('frecuenciaTeorica: sigue f = v / 4L y rechaza alturas imposibles', () => {
  cerca(frecuenciaTeorica(25), 343, 0.001)
  assert.equal(frecuenciaTeorica(0), null)
  assert.equal(frecuenciaTeorica(-3), null)
})

test('velocidadSonido: recupera la velocidad real con medidas ideales', () => {
  cerca(velocidadSonido(medidasIdeales()), 343, 0.001)
})

test('velocidadSonido: la corrección de extremo no estropea el resultado', () => {
  cerca(velocidadSonido(medidasIdeales(343, 1.5)), 343, 0.001)
})

test('velocidadSonido: da un valor razonable con medidas reales con ruido', () => {
  const medidas = [
    { alturaCm: 8, frecuencia: 1065 },
    { alturaCm: 12, frecuencia: 720 },
    { alturaCm: 16, frecuencia: 530 },
    { alturaCm: 20, frecuencia: 432 },
  ]
  cerca(velocidadSonido(medidas), 346, 10)
})

test('velocidadSonido: devuelve null si las medidas no permiten calcularla', () => {
  assert.equal(velocidadSonido([]), null)
  assert.equal(velocidadSonido([{ alturaCm: 10, frecuencia: 800 }]), null)
  assert.equal(
    velocidadSonido([
      { alturaCm: 10, frecuencia: 800 },
      { alturaCm: 10, frecuencia: 810 },
    ]),
    null,
  )
  // Más aire y sonido más agudo: pendiente negativa, no hay velocidad posible.
  assert.equal(
    velocidadSonido([
      { alturaCm: 10, frecuencia: 400 },
      { alturaCm: 20, frecuencia: 800 },
    ]),
    null,
  )
})

test('tendenciaAlLlenar: distingue agudo, grave e igual', () => {
  assert.equal(tendenciaAlLlenar(medidasIdeales()), 'más agudo')
  assert.equal(
    tendenciaAlLlenar([
      { alturaCm: 10, frecuencia: 400 },
      { alturaCm: 20, frecuencia: 800 },
    ]),
    'más grave',
  )
  assert.equal(
    tendenciaAlLlenar([
      { alturaCm: 10, frecuencia: 800 },
      { alturaCm: 20, frecuencia: 802 },
    ]),
    'igual',
  )
  assert.equal(tendenciaAlLlenar([{ alturaCm: 10, frecuencia: 800 }]), null)
})

test('buscarPico: encuentra el tono de la botella con precisión', () => {
  cerca(buscarPico(espectroConPico(686), 48000), 686, 6)
})

test('buscarPico: se queda con el pico más alto', () => {
  const valores = espectroConPico(500, { db: -50 })
  const fuerte = espectroConPico(1000, { db: -30 })
  fuerte.forEach((db, i) => {
    if (db > -100) valores[i] = db
  })
  cerca(buscarPico(valores, 48000), 1000, 6)
})

test('buscarPico: ignora lo que no es un tono', () => {
  assert.equal(buscarPico(new Float32Array(4096).fill(-100), 48000), null)
  assert.equal(buscarPico(espectroConPico(500, { db: -90 }), 48000), null)
  assert.equal(buscarPico(espectroConPico(40), 48000), null)
  assert.equal(buscarPico(espectroConPico(5000), 48000), null)
})

test('lecturaEstable: un soplido largo y estable se puede registrar', () => {
  const lectura = lecturaEstable(lecturas(Array(15).fill(700)), 1)
  assert.equal(lectura.estable, true)
  assert.equal(lectura.frecuencia, 700)
  assert.equal(nivelEstabilidad(lectura), 1)
})

test('lecturaEstable: un golpe o una palabra suelta no bastan', () => {
  const lectura = lecturaEstable(lecturas(Array(6).fill(700)), 1)
  assert.equal(lectura.estable, false)
  assert.ok(nivelEstabilidad(lectura) < 1)
})

test('lecturaEstable: un tono que cambia no se puede registrar', () => {
  const lectura = lecturaEstable(lecturas([500, 600, 700, 800, 900, 1000, 1100, 1200, 1300]), 1)
  assert.equal(lectura.estable, false)
})

test('lecturaEstable: un salto suelto a un armónico no invalida el soplido', () => {
  const frecuencias = Array(15).fill(700)
  frecuencias[7] = 1400
  const lectura = lecturaEstable(lecturas(frecuencias), 1)
  assert.equal(lectura.estable, true)
  assert.equal(lectura.frecuencia, 700)
})

test('lecturaEstable: si el sonido ha parado, no queda lectura', () => {
  const lectura = lecturaEstable(lecturas(Array(15).fill(700), 0.05, 1), 1.5)
  assert.equal(lectura.frecuencia, null)
  assert.equal(lectura.estable, false)
  assert.equal(nivelEstabilidad(lectura), 0)
})

test('recortarHistorial: olvida lo viejo y lo anterior a reiniciar el reloj', () => {
  const historial = [
    { tiempo: 0, frecuencia: 1 },
    { tiempo: 4.5, frecuencia: 2 },
    { tiempo: 9, frecuencia: 3 },
  ]
  assert.deepEqual(recortarHistorial(historial, 5), [{ tiempo: 4.5, frecuencia: 2 }])
})

test('mediana: con listas pares e impares, sin cambiar la original', () => {
  const valores = [3, 1, 2]
  assert.equal(mediana(valores), 2)
  assert.deepEqual(valores, [3, 1, 2])
  assert.equal(mediana([1, 2, 3, 4]), 2.5)
})

test('la botella virtual: aire, puntos sin repetir y predicción que se puede leer', () => {
  assert.equal(alturaAire(5), 25)
  const puntos = anadirPunto(anadirPunto([], 20, 400), 10, 800)
  assert.deepEqual(
    puntos.map(({ x }) => x),
    [10, 20],
  )
  assert.equal(anadirPunto(puntos, 10, 900), puntos)
  assert.match(crearPrediccion('más agudo').texto, /agudo/)
})

test('crearResultado: cumple el contrato con y sin predicción', () => {
  const prediccion = crearPrediccion('más agudo')
  for (const [medidas, pred] of [
    [medidasIdeales(), null],
    [medidasIdeales(), prediccion],
    [medidasIdeales(320), prediccion],
    [[{ alturaCm: 10, frecuencia: 800 }], null],
  ]) {
    const { errores } = validarResultado(crearResultado(medidas, pred), { prediccion: pred })
    assert.deepEqual(errores, [])
  }
})

test('crearResultado: destaca la velocidad y compara con la predicción', () => {
  const resultado = crearResultado(medidasIdeales(), crearPrediccion('más grave'))
  assert.equal(resultado.valores[0].valor, 343)
  assert.equal(resultado.valores[0].unidad, 'm/s')
  assert.equal(resultado.valores[1].valor, 0)
  assert.ok(resultado.comparacion)
})

test('crearResultado: sin velocidad posible lo dice y no se inventa un número', () => {
  const resultado = crearResultado([{ alturaCm: 10, frecuencia: 800 }], null)
  assert.equal(resultado.valores[0].etiqueta, 'Medidas')
  assert.match(resultado.resumen, /no se puede calcular/)
})

test('crearResultado: no cambia el orden de las medidas originales', () => {
  const medidas = medidasIdeales().reverse()
  const copia = structuredClone(medidas)
  crearResultado(medidas, null)
  assert.deepEqual(medidas, copia)
})
