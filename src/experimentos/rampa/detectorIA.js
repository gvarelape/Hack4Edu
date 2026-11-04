// Encuentra la pelota con el detector de objetos de MediaPipe, dentro del móvil y sin internet.
// La librería se importa al cargar, no antes: pesa mucho y solo hace falta en esta medición.
// Versión fijada a 0.10.35: desde la 1.0, MediaPipe envía datos de uso a Google sin opción de
// desactivarlo, y la regla 8 prohíbe que salga nada del móvil.

import { CARPETA_WASM, RUTA_MODELO } from './recursosDetector.js'

const CATEGORIA_PELOTA = 'sports ball'
const CONFIANZA_MINIMA = 0.3

let cargando = null
let ultimoTiempo = 0

async function crearDetector() {
  const { FilesetResolver, ObjectDetector } = await import('@mediapipe/tasks-vision')
  const archivos = await FilesetResolver.forVisionTasks(CARPETA_WASM)
  return ObjectDetector.createFromOptions(archivos, {
    // CPU: la GPU falla en muchos móviles baratos, y aquí no hace falta pasarlo en cada fotograma.
    baseOptions: { modelAssetPath: RUTA_MODELO, delegate: 'CPU' },
    runningMode: 'VIDEO',
    scoreThreshold: CONFIANZA_MINIMA,
    categoryAllowlist: [CATEGORIA_PELOTA],
  })
}

// Devuelve una promesa con el detector. Si falla, se rechaza y se puede volver a intentar.
export function cargarDetector() {
  if (!cargando) {
    cargando = crearDetector().catch((fallo) => {
      cargando = null
      throw fallo
    })
  }
  return cargando
}

// De la lista de detecciones de MediaPipe, se queda con la pelota más probable.
// Devuelve { x, y, ancho, alto, confianza }, con (x, y) en el centro del recuadro, o null.
export function elegirPelota(detecciones) {
  let mejor = null
  for (const { boundingBox, categories } of detecciones) {
    const categoria = categories.find((c) => c.categoryName === CATEGORIA_PELOTA)
    if (boundingBox && categoria && (!mejor || categoria.score > mejor.confianza)) {
      mejor = {
        x: boundingBox.originX + boundingBox.width / 2,
        y: boundingBox.originY + boundingBox.height / 2,
        ancho: boundingBox.width,
        alto: boundingBox.height,
        confianza: categoria.score,
      }
    }
  }
  return mejor
}

// Busca la pelota en un vídeo, en los píxeles del propio vídeo. Devuelve lo mismo que elegirPelota.
export function detectarPelota(detector, video) {
  // MediaPipe exige que el tiempo siempre aumente.
  ultimoTiempo = Math.max(performance.now(), ultimoTiempo + 1)
  return elegirPelota(detector.detectForVideo(video, ultimoTiempo).detections)
}
