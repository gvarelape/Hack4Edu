// Ejecutar con: node --test src/experimentos/rampa/
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { ANCHO_REDUCIDO, colorMedio, encontrarPorColor } from './seguimientoColor.js'
import { analizarMovimiento } from './analisisMovimiento.js'

const ALTO = 90
const MADERA = { r: 170, g: 130, b: 90 }
const BLANCO = { r: 235, g: 235, b: 235 }
const ROJO = { r: 220, g: 40, b: 40 }
const NARANJA = { r: 240, g: 120, b: 30 }

function crearImagen(fondo, ancho = ANCHO_REDUCIDO, alto = ALTO) {
  const data = new Uint8ClampedArray(ancho * alto * 4)
  for (let i = 0; i < data.length; i += 4) {
    data[i] = fondo.r
    data[i + 1] = fondo.g
    data[i + 2] = fondo.b
    data[i + 3] = 255
  }
  return { data, width: ancho, height: alto }
}

function pintarCirculo(imagen, x, y, radio, color) {
  const { data, width, height } = imagen
  for (let f = 0; f < height; f++) {
    for (let c = 0; c < width; c++) {
      if (Math.hypot(c + 0.5 - x, f + 0.5 - y) <= radio) {
        const i = (f * width + c) * 4
        data[i] = color.r
        data[i + 1] = color.g
        data[i + 2] = color.b
      }
    }
  }
}

function oscurecer(color, factor) {
  return { r: color.r * factor, g: color.g * factor, b: color.b * factor }
}

function cerca(real, esperado, margen) {
  assert.ok(Math.abs(real - esperado) <= margen, `${real} frente a ${esperado}`)
}

test('colorMedio: devuelve el color de la zona y null fuera de la imagen', () => {
  const imagen = crearImagen(MADERA)
  pintarCirculo(imagen, 80, 45, 6, ROJO)
  assert.deepEqual(colorMedio(imagen, 80, 45), ROJO)
  assert.equal(colorMedio(imagen, -1, 45), null)
  assert.equal(colorMedio(imagen, 80, ALTO), null)
})

test('colorMedio: en una esquina usa solo los píxeles que existen', () => {
  assert.deepEqual(colorMedio(crearImagen(MADERA), 0, 0), MADERA)
})

test('encontrarPorColor: encuentra el centro de la pelota', () => {
  const imagen = crearImagen(MADERA)
  pintarCirculo(imagen, 50.5, 30.5, 4, ROJO)
  const pelota = encontrarPorColor(imagen, ROJO)
  cerca(pelota.x, 50.5, 0.01)
  cerca(pelota.y, 30.5, 0.01)
  assert.ok(pelota.pixeles >= 40)
})

test('encontrarPorColor: distingue el color de la bola de fondos habituales', () => {
  for (const fondo of [MADERA, BLANCO]) {
    for (const bola of [ROJO, NARANJA]) {
      const imagen = crearImagen(fondo)
      pintarCirculo(imagen, 80, 45, 4, bola)
      const pelota = encontrarPorColor(imagen, bola)
      assert.ok(pelota.pixeles < 100, 'no debe marcar el fondo')
    }
  }
})

test('encontrarPorColor: sigue a la bola cuando pasa por una sombra', () => {
  const imagen = crearImagen(MADERA)
  pintarCirculo(imagen, 80, 45, 4, oscurecer(ROJO, 0.7))
  const pelota = encontrarPorColor(imagen, ROJO)
  assert.ok(pelota)
  cerca(pelota.x, 80, 0.1)
})

test('encontrarPorColor: devuelve null si no hay nada o la mancha es muy pequeña', () => {
  assert.equal(encontrarPorColor(crearImagen(MADERA), ROJO), null)

  const imagen = crearImagen(MADERA)
  pintarCirculo(imagen, 80, 45, 1, ROJO)
  assert.equal(encontrarPorColor(imagen, ROJO), null)
})

test('encontrarPorColor: otro objeto más pequeño del mismo color no arrastra el punto', () => {
  const imagen = crearImagen(MADERA)
  pintarCirculo(imagen, 30, 30, 5, ROJO)
  pintarCirculo(imagen, 140, 80, 3, ROJO)
  const pelota = encontrarPorColor(imagen, ROJO)
  cerca(pelota.x, 30, 0.1)
  cerca(pelota.y, 30, 0.1)
})

test('encontrarPorColor: la tolerancia decide qué se considera del mismo color', () => {
  const imagen = crearImagen(MADERA)
  pintarCirculo(imagen, 80, 45, 4, oscurecer(ROJO, 0.5))
  assert.equal(encontrarPorColor(imagen, ROJO, 10), null)
  assert.ok(encontrarPorColor(imagen, ROJO, 90))
})

test('encontrarPorColor: funciona con la bola tocando el borde de la imagen', () => {
  const imagen = crearImagen(MADERA)
  pintarCirculo(imagen, 0, 0, 5, ROJO)
  assert.ok(encontrarPorColor(imagen, ROJO))

  const imagenFinal = crearImagen(MADERA)
  pintarCirculo(imagenFinal, ANCHO_REDUCIDO, ALTO, 5, ROJO)
  assert.ok(encontrarPorColor(imagenFinal, ROJO))
})

test('de la imagen a la aceleración: el seguimiento a 160 px permite medir', () => {
  const aceleracion = 1.72 // m/s²
  const escala = 0.7 // cm por píxel: 100 cm ocupan unos 143 px de los 160
  const largo = 100 // cm
  const fps = 30
  const reposo = 0.5
  const total = reposo + Math.sqrt((2 * largo) / (aceleracion * 100)) + 0.5
  const color = colorMedioDeReferencia()

  const puntos = []
  for (let i = 0; i < total * fps; i++) {
    const t = i / fps
    const enMarcha = Math.max(0, t - reposo)
    const s = Math.min(largo, 0.5 * aceleracion * 100 * enMarcha * enMarcha) / escala
    const imagen = crearImagen(MADERA)
    // Bola de 5 cm: unos 7 px de diámetro.
    pintarCirculo(imagen, 8 + s * Math.cos(0.17), 20 + s * Math.sin(0.17), 3.5, ROJO)
    const pelota = encontrarPorColor(imagen, color)
    assert.ok(pelota, `fotograma ${i} sin pelota`)
    puntos.push({ t, x: pelota.x, y: pelota.y })
  }

  const analisis = analizarMovimiento(puntos, escala)
  assert.equal(analisis.valido, true)
  cerca(analisis.aceleracion, aceleracion, aceleracion * 0.03)
})

// El color aprendido sale de la propia imagen, como cuando el alumno toca la pelota.
function colorMedioDeReferencia() {
  const imagen = crearImagen(MADERA)
  pintarCirculo(imagen, 40, 40, 3.5, ROJO)
  return colorMedio(imagen, 40, 40, 1)
}
