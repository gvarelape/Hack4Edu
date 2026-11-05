import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  aImagenEntera,
  centroEnImagen,
  detectarPelota,
  elegirPelota,
  zonasBusqueda,
} from './detectorIA.js'
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

test('centroEnImagen: pasa de píxeles del vídeo a los de la imagen reducida', () => {
  assert.deepEqual(centroEnImagen({ x: 640, y: 360 }, 1280, 160), { x: 80, y: 45 })
})

test('zonasBusqueda: primero la imagen entera y luego los cuatro recortes', () => {
  const zonas = zonasBusqueda(1000, 500)
  assert.equal(zonas.length, 5)
  assert.deepEqual(zonas[0], { x: 0, y: 0, ancho: 1000, alto: 500 })
  for (const zona of zonas.slice(1)) {
    assert.ok(zona.x >= 0 && zona.y >= 0)
    assert.ok(zona.x + zona.ancho <= 1000 && zona.y + zona.alto <= 500)
  }
})

test('zonasBusqueda: los recortes cubren toda la imagen y se solapan en el centro', () => {
  const zonas = zonasBusqueda(1000, 500).slice(1)
  for (let x = 0; x < 1000; x += 50) {
    for (let y = 0; y < 500; y += 50) {
      const dentro = (z) => x >= z.x && x < z.x + z.ancho && y >= z.y && y < z.y + z.alto
      assert.ok(zonas.some(dentro), `${x}, ${y} sin cubrir`)
    }
  }
  // Una pelota en el centro entra entera en todos los recortes.
  for (const z of zonas) {
    assert.ok(z.x <= 450 && z.x + z.ancho >= 550, 'centro en x')
    assert.ok(z.y <= 200 && z.y + z.alto >= 300, 'centro en y')
  }
})

test('aImagenEntera: suma la posición del recorte y deja pasar null', () => {
  const pelota = { x: 10, y: 20, ancho: 5, alto: 5, confianza: 0.5 }
  assert.deepEqual(aImagenEntera(pelota, { x: 100, y: 200 }), { ...pelota, x: 110, y: 220 })
  assert.equal(aImagenEntera(null, { x: 100, y: 200 }), null)
})
