import { useEffect, useRef, useState } from 'react'
import { colorMedio, lecturaValida, promedioColores, rgbAHsv } from './analisisColor.js'
import { estimarPh } from './estimarPh.js'

// Cada 200 ms se copia el fotograma a un canvas pequeño y se lee el recuadro central.
const INTERVALO_MS = 200
const ANCHO = 160
const ALTO = 120
export const LADO_RECUADRO = 20
// La lectura que se muestra (y la que se guarda) es la media del último segundo: así no parpadea.
const VENTANA_MS = 1000

// Devuelve la lectura en directo:
// { valida: true, rgb, ph, metodo } o { valida: false, mensaje } o null si aún no hay fotograma.
export default function useLecturaColor(videoRef, activa, muestras) {
  const muestrasRef = useRef(muestras)
  const [lectura, setLectura] = useState(null)

  useEffect(() => {
    muestrasRef.current = muestras
  })

  useEffect(() => {
    if (!activa) return undefined
    const canvas = document.createElement('canvas')
    canvas.width = ANCHO
    canvas.height = ALTO
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    let historial = []

    const id = setInterval(() => {
      const video = videoRef.current
      if (!video || video.readyState < 2 || !video.videoWidth) return

      ctx.drawImage(video, 0, 0, ANCHO, ALTO)
      const x = (ANCHO - LADO_RECUADRO) / 2
      const y = (ALTO - LADO_RECUADRO) / 2
      const rgb = colorMedio(ctx, x, y, LADO_RECUADRO, LADO_RECUADRO)
      const validez = lecturaValida(rgbAHsv(rgb))

      const ahora = performance.now()
      historial = historial.filter((h) => ahora - h.tiempo <= VENTANA_MS)
      if (validez.valida) historial.push({ tiempo: ahora, rgb })
      else historial = []

      const estable = promedioColores(historial.map((h) => h.rgb))
      setLectura(
        estable
          ? { valida: true, rgb: estable, ...estimarPh(estable, muestrasRef.current) }
          : { valida: false, mensaje: validez.mensaje },
      )
    }, INTERVALO_MS)

    return () => clearInterval(id)
  }, [activa, videoRef])

  return activa ? lectura : null
}
