import { useEffect, useRef } from 'react'

// Con `videoRef` (opcional), `tiempo` es el tiempo del propio vídeo, en segundos.
// Sin él, son los segundos desde el primer fotograma, medidos con el reloj del navegador.
export default function useBucleFotogramas(callback, activo, videoRef) {
  const callbackRef = useRef(callback)

  useEffect(() => {
    callbackRef.current = callback
  })

  useEffect(() => {
    if (!activo) return undefined
    const video = videoRef?.current ?? null

    if (video?.requestVideoFrameCallback) {
      let id
      const pasoVideo = (_ahora, datos) => {
        id = video.requestVideoFrameCallback(pasoVideo)
        callbackRef.current({ tiempo: datos.mediaTime })
      }
      id = video.requestVideoFrameCallback(pasoVideo)
      return () => video.cancelVideoFrameCallback(id)
    }

    let id
    let inicio = null
    let ultimo = null
    const pasoReloj = (ahora) => {
      id = requestAnimationFrame(pasoReloj)
      inicio ??= ahora
      const tiempo = video ? video.currentTime : (ahora - inicio) / 1000
      // requestAnimationFrame va más rápido que el vídeo: no repite el mismo fotograma.
      if (tiempo === ultimo) return
      ultimo = tiempo
      callbackRef.current({ tiempo })
    }
    id = requestAnimationFrame(pasoReloj)
    return () => cancelAnimationFrame(id)
  }, [activo, videoRef])
}
