import { useEffect, useRef } from 'react'

// Con cámara no hay tiempo de vídeo fiable: se usa el momento de captura. Con archivo, el del vídeo.
function tiempoDelFotograma(video, ahora, datos) {
  return video.srcObject ? (datos.captureTime ?? ahora) / 1000 : datos.mediaTime
}

// `tiempo` son los segundos desde el primer fotograma. Sin `videoRef` (opcional) se usa el reloj.
export default function useBucleFotogramas(callback, activo, videoRef) {
  const callbackRef = useRef(callback)

  useEffect(() => {
    callbackRef.current = callback
  })

  useEffect(() => {
    if (!activo) return undefined
    const video = videoRef?.current ?? null
    let inicio = null
    let ultimo = null

    const emitir = (instante) => {
      if (instante === ultimo) return
      ultimo = instante
      inicio ??= instante
      callbackRef.current({ tiempo: instante - inicio })
    }

    if (video?.requestVideoFrameCallback) {
      let id
      const pasoVideo = (ahora, datos) => {
        id = video.requestVideoFrameCallback(pasoVideo)
        emitir(tiempoDelFotograma(video, ahora, datos))
      }
      id = video.requestVideoFrameCallback(pasoVideo)
      return () => video.cancelVideoFrameCallback(id)
    }

    let id
    const pasoReloj = (ahora) => {
      id = requestAnimationFrame(pasoReloj)
      emitir(video ? video.currentTime : ahora / 1000)
    }
    id = requestAnimationFrame(pasoReloj)
    return () => cancelAnimationFrame(id)
  }, [activo, videoRef])
}
