// Ejecutar con: node --test src/experimentos/rampa/
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { detectarPelota, elegirPelota } from './detectorIA.js'
import { RECURSOS_DETECTOR } from './recursosDetector.js'

function deteccion(categoryName, score, originX = 10, originY = 20, width = 40, height = 60) {
  return { boundingBox: { originX, originY, width, height }, categories: [{ categoryName, score }] }
}

test('elegirPelota: devuelve el centro del recuadro y su tamaño', () => {
  assert.deepEqual(elegirPelota([deteccion('sports ball', 0.8)]), {
    x: 30,
    y: 50,
    ancho: 40,
    alto: 60,
    confianza: 0.8,
  })
})

test('elegirPelota: se queda con la más probable', () => {
  const pelota = elegirPelota([
    deteccion('sports ball', 0.4, 0),
    deteccion('sports ball', 0.9, 100),
    deteccion('sports ball', 0.5, 200),
  ])
  assert.equal(pelota.confianza, 0.9)
  assert.equal(pelota.x, 120)
})

test('elegirPelota: ignora otras categorías y detecciones sin recuadro', () => {
  assert.equal(elegirPelota([deteccion('person', 0.99)]), null)
  assert.equal(elegirPelota([{ categories: [{ categoryName: 'sports ball', score: 0.9 }] }]), null)
  assert.equal(elegirPelota([]), null)
})

test('detectarPelota: el tiempo que recibe MediaPipe siempre aumenta', () => {
  const tiempos = []
  const detector = {
    detectForVideo: (_video, tiempo) => {
      tiempos.push(tiempo)
      return { detections: [] }
    },
  }
  for (let i = 0; i < 50; i++) detectarPelota(detector, null)
  for (let i = 1; i < tiempos.length; i++) assert.ok(tiempos[i] > tiempos[i - 1])
})

test('recursos: son rutas locales, nunca de internet', () => {
  for (const ruta of RECURSOS_DETECTOR) assert.ok(ruta.startsWith('/modelos/rampa/'), ruta)
})
