import { useCallback, useRef, useState } from 'react'
import { useBucleFotogramas } from '../../core'
import { encontrarPorColor, tamanoReducido } from './seguimientoColor'

const FOTOGRAMAS_ENTRE_AVISOS = 10 // no repintar la pantalla en cada fotograma, en móviles baratos
const ESTADO_INICIAL = { puntos: 0, fotogramas: 0, tiempo: null }

// Reduce cada fotograma, busca la pelota y, mientras graba, guarda sus posiciones.
export function useSeguimiento({ videoRef, activo, color, tolerancia, alFotograma }) {
  const lienzoRef = useRef(null)
  const puntosRef = useRef([])
  const fotogramasRef = useRef(0)
  const grabandoRef = useRef(false)
  const [estado, setEstado] = useState(ESTADO_INICIAL)

  const leerImagen = useCallback(() => {
    const video = videoRef.current
    if (!video?.videoWidth) return null
    const { ancho, alto } = tamanoReducido(video.videoWidth, video.videoHeight)
    lienzoRef.current ??= document.createElement('canvas')
    const lienzo = lienzoRef.current
    if (lienzo.width !== ancho) lienzo.width = ancho
    if (lienzo.height !== alto) lienzo.height = alto
    const contexto = lienzo.getContext('2d', { willReadFrequently: true })
    contexto.drawImage(video, 0, 0, ancho, alto)
    return contexto.getImageData(0, 0, ancho, alto)
  }, [videoRef])

  useBucleFotogramas(
    ({ tiempo }) => {
      const imagen = leerImagen()
      if (!imagen) return
      const pelota = encontrarPorColor(imagen, color, tolerancia)
      if (grabandoRef.current) {
        fotogramasRef.current++
        if (pelota) puntosRef.current.push({ t: tiempo, x: pelota.x, y: pelota.y })
        if (fotogramasRef.current % FOTOGRAMAS_ENTRE_AVISOS === 0) {
          setEstado({
            puntos: puntosRef.current.length,
            fotogramas: fotogramasRef.current,
            tiempo,
          })
        }
      }
      alFotograma(pelota)
    },
    activo && color !== null,
    videoRef,
  )

  const empezar = useCallback(() => {
    puntosRef.current = []
    fotogramasRef.current = 0
    grabandoRef.current = true
    setEstado(ESTADO_INICIAL)
  }, [])

  // Devuelve los puntos grabados.
  const terminar = useCallback(() => {
    grabandoRef.current = false
    const puntos = puntosRef.current
    const ultimo = puntos[puntos.length - 1]
    setEstado({
      puntos: puntos.length,
      fotogramas: fotogramasRef.current,
      tiempo: ultimo ? ultimo.t : null,
    })
    return puntos
  }, [])

  return { estado, leerImagen, empezar, terminar }
}
