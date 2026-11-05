// Encuentra la pelota con el detector de objetos de MediaPipe, dentro del móvil y sin internet.
// La librería se importa al cargar, no antes: pesa mucho y solo hace falta en esta medición.
// Versión fijada a 0.10.35: desde la 1.0, MediaPipe envía datos de uso a Google sin opción de
// desactivarlo, y de esta app no sale ningún dato.

import { CARPETA_WASM, RUTA_MODELO } from './recursosDetector.js'

const CATEGORIA_PELOTA = 'sports ball'
// Baja a propósito: lo que encuentra pasa después por la comprobación de color, y el alumno lo ve.
const CONFIANZA_MINIMA = 0.15
const FRACCION_RECORTE = 0.6 // cada recorte se solapa con el vecino, para no partir la pelota

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

// Pasa el centro de una detección de píxeles del vídeo a los de la imagen reducida.
export function centroEnImagen(deteccion, anchoVideo, anchoImagen) {
  const factor = anchoImagen / anchoVideo
  return { x: deteccion.x * factor, y: deteccion.y * factor }
}

// Busca la pelota en una imagen o vídeo, en sus propios píxeles. Devuelve lo mismo que elegirPelota.
export function detectarPelota(detector, fuente) {
  // MediaPipe exige que el tiempo siempre aumente.
  ultimoTiempo = Math.max(performance.now(), ultimoTiempo + 1)
  return elegirPelota(detector.detectForVideo(fuente, ultimoTiempo).detections)
}

// Zonas donde buscar: la imagen entera y una rejilla de 2×2. El modelo reduce cada imagen a 320 px,
// y a 1 o 2 metros la pelota se queda en muy pocos píxeles: en un recorte se ve más grande.
export function zonasBusqueda(ancho, alto) {
  const anchoRecorte = Math.round(ancho * FRACCION_RECORTE)
  const altoRecorte = Math.round(alto * FRACCION_RECORTE)
  const derecha = ancho - anchoRecorte
  const abajo = alto - altoRecorte
  const recorte = (x, y) => ({ x, y, ancho: anchoRecorte, alto: altoRecorte })
  return [
    { x: 0, y: 0, ancho, alto },
    recorte(0, 0),
    recorte(derecha, 0),
    recorte(0, abajo),
    recorte(derecha, abajo),
  ]
}

// Pasa una detección hecha en un recorte a las coordenadas de la imagen entera.
export function aImagenEntera(pelota, zona) {
  return pelota && { ...pelota, x: pelota.x + zona.x, y: pelota.y + zona.y }
}

let lienzoRecorte = null

// Busca la pelota en una sola zona del vídeo. Devuelve coordenadas de la imagen entera.
export function detectarEnZona(detector, video, zona) {
  if (zona.ancho === video.videoWidth && zona.alto === video.videoHeight) {
    return detectarPelota(detector, video)
  }
  lienzoRecorte ??= document.createElement('canvas')
  lienzoRecorte.width = zona.ancho
  lienzoRecorte.height = zona.alto
  lienzoRecorte
    .getContext('2d')
    .drawImage(video, zona.x, zona.y, zona.ancho, zona.alto, 0, 0, zona.ancho, zona.alto)
  return aImagenEntera(detectarPelota(detector, lienzoRecorte), zona)
}
