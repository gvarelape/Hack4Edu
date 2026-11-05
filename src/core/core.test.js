// Pruebas de la lógica pura del core: npm test.
import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  formatear,
  leerNumero,
  normalizarTexto,
  validarPrediccion,
  validarResultado,
} from './utilidades.js'
import { interpretarRuta } from './lib/rutas.js'
import { calcularEscala } from './lib/escalaGrafica.js'
import { crearRelojFotogramas } from './lib/relojFotogramas.js'

const resultado = () => ({
  resumen: 'Conclusiones.',
  valores: [{ etiqueta: 'g estimada', valor: 9.62, unidad: 'm/s²' }],
  comparacion: null,
  explicaciones: [],
  tabla: null,
  grafica: {
    ejeX: 'Tiempo (s)',
    ejeY: 'Distancia (cm)',
    series: [{ nombre: 'Medido', tipo: 'puntos', rol: 'medido', puntos: [{ x: 0, y: 0 }] }],
  },
})

test('leerNumero acepta coma y punto, y rechaza lo que no es un número', () => {
  assert.equal(leerNumero('3,5'), 3.5)
  assert.equal(leerNumero(' 3.5 '), 3.5)
  for (const malo of ['', 'abc', '1.000,5', '1e3', null]) assert.equal(leerNumero(malo), null)
})

test('formatear usa coma decimal y no enseña valores rotos', () => {
  assert.equal(formatear(9.81, 2), '9,81')
  assert.equal(formatear(-0.001, 2), '0,00')
  assert.equal(formatear(NaN, 2), '–')
})

test('normalizarTexto quita tildes, mayúsculas y signos', () => {
  assert.equal(normalizarTexto('¿Por qué NO me sale 9,8?'), 'por que no me sale 9 8')
})

test('validarResultado rechaza un botón de Tabla: no se puede guardar en el cuaderno', () => {
  const resultado = {
    resumen: 'Resumen',
    valores: [{ etiqueta: 'v', valor: 1, unidad: 'm/s' }],
    comparacion: null,
    explicaciones: [],
    tabla: { columnas: ['Acción'], filas: [[{ boton: 'Borrar', onClick() {} }]] },
    grafica: null,
  }
  assert.ok(validarResultado(resultado).errores.some((error) => error.includes('tabla.filas')))
})

test('validarResultado acepta un resultado correcto', () => {
  assert.deepEqual(validarResultado(resultado()), { errores: [], avisos: [] })
})

test('validarResultado detecta lo que incumple el contrato', () => {
  const casos = [
    (r) => delete r.resumen,
    (r) => (r.valores = []),
    (r) => (r.valores[0].valor = '9,62'),
    (r) => delete r.explicaciones,
    (r) => (r.grafica.series[0].rol = 'real'),
    (r) => (r.grafica.series[0].puntos = Array(301).fill({ x: 1, y: 1 })),
  ]
  for (const romper of casos) {
    const roto = resultado()
    romper(roto)
    assert.ok(validarResultado(roto).errores.length > 0, String(romper))
  }
})

test('si hay predicción, el resultado tiene que compararla', () => {
  const { errores } = validarResultado(resultado(), { prediccion: { texto: 'a', valor: 1 } })
  assert.ok(errores.some((error) => error.includes('predicción')))
})

test('validarPrediccion pide texto y valor', () => {
  assert.equal(validarPrediccion({ texto: 'a', valor: null }).errores.length, 0)
  assert.equal(validarPrediccion({ texto: '', valor: 1 }).errores.length, 1)
})

test('interpretarRuta entiende las rutas del contrato', () => {
  assert.deepEqual(interpretarRuta('#/'), { pantalla: 'inicio' })
  assert.deepEqual(interpretarRuta('#/experimento/ph'), { pantalla: 'experimento', id: 'ph' })
  assert.deepEqual(interpretarRuta('#/cuaderno/a1'), { pantalla: 'ficha', id: 'a1' })
  assert.deepEqual(interpretarRuta('#/nada'), { pantalla: 'no-encontrada' })
})

test('la escala de la gráfica contiene todos los datos', () => {
  const { minimo, maximo } = calcularEscala([180, 742], 6)
  assert.ok(minimo <= 180 && maximo >= 742)
})

// Pasa una serie de fotogramas por el reloj, cada 33 ms de reloj del navegador.
function tiemposDe(esDirecto, datosDe, fotogramas = 40) {
  const reloj = crearRelojFotogramas(esDirecto)
  return Array.from({ length: fotogramas }, (_, i) => reloj(1000 + i * 33, datosDe(i)))
}

test('con mediaTime correcto, el reloj devuelve mediaTime', () => {
  const tiempos = tiemposDe(true, (i) => ({ mediaTime: 5 + i / 30, presentationTime: i }))
  assert.equal(tiempos[0], 5)
  assert.ok(Math.abs(tiempos[30] - 6) < 1e-9)
})

test('iPhone: si mediaTime no avanza, usa presentationTime y sigue en segundos', () => {
  const tiempos = tiemposDe(true, (i) => ({ mediaTime: 0, presentationTime: 9000 + i * 33 }))
  assert.ok(Math.abs(tiempos[39] - tiempos[9] - 30 * 0.033) < 1e-9)
  for (let i = 4; i < tiempos.length; i++) assert.ok(tiempos[i] > tiempos[i - 1])
})

test('si tampoco avanza presentationTime, usa el reloj del fotograma', () => {
  const tiempos = tiemposDe(true, () => ({ mediaTime: 0, presentationTime: 0 }))
  assert.ok(Math.abs(tiempos[39] - tiempos[19] - 20 * 0.033) < 1e-9)
})

test('si falta presentationTime, también usa el reloj del fotograma', () => {
  const tiempos = tiemposDe(true, () => ({ mediaTime: 0 }))
  assert.ok(Math.abs(tiempos[39] - tiempos[19] - 20 * 0.033) < 1e-9)
})

test('un vídeo de archivo se fía siempre de mediaTime, aunque se repita al saltar', () => {
  const tiempos = tiemposDe(false, (i) => ({ mediaTime: i < 5 ? 0 : (i - 5) / 30 }))
  assert.equal(tiempos[4], 0)
  assert.ok(Math.abs(tiempos[35] - 1) < 1e-9)
})
