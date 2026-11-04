import { useCallback, useEffect, useRef, useState } from 'react'
import {
  mensajeArchivoNoValido,
  mensajeErrorSensor,
  mensajeNavegadorNoCompatible,
  mensajeSensorCortado,
} from '../lib/erroresSensor'

// 720p: suficiente para seguir una pelota o leer un color, sin ahogar a un móvil barato.
const RESTRICCIONES = {
  audio: false,
  video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } },
}

export default function useCamara() {
  const videoRef = useRef(null)
  const recursoRef = useRef(null)
  // Cada iniciar o parar invalida lo anterior, por si la cámara tarda en responder.
  const sesionRef = useRef(0)
  const [activa, setActiva] = useState(false)
  const [error, setError] = useState(null)

  const liberar = useCallback(() => {
    const recurso = recursoRef.current
    recursoRef.current = null
    recurso?.stream?.getTracks().forEach((pista) => {
      pista.onended = null
      pista.stop()
    })
    if (recurso?.urlCreada) URL.revokeObjectURL(recurso.urlCreada)

    const video = videoRef.current
    if (video) {
      video.onerror = null
      video.pause()
      video.srcObject = null
      video.removeAttribute('src')
      video.load()
    }
  }, [])

  const parar = useCallback(() => {
    sesionRef.current++
    liberar()
    setActiva(false)
  }, [liberar])

  // El <video> puede montarse después de abrir la cámara, si se pinta solo cuando está activa.
  const conectarVideo = useCallback(() => {
    const video = videoRef.current
    const recurso = recursoRef.current
    if (!video || !recurso) return
    video.muted = true
    video.playsInline = true
    if (recurso.stream) {
      if (video.srcObject !== recurso.stream) video.srcObject = recurso.stream
    } else if (video.getAttribute('src') !== recurso.url) {
      video.onerror = () => {
        parar()
        setError(mensajeArchivoNoValido('vídeo'))
      }
      video.src = recurso.url
    }
    video.play().catch(() => {})
  }, [parar])

  const iniciar = useCallback(
    async ({ archivo } = {}) => {
      const sesion = ++sesionRef.current
      liberar()
      setActiva(false)
      setError(null)

      if (archivo) {
        const urlCreada = archivo instanceof Blob ? URL.createObjectURL(archivo) : null
        recursoRef.current = { url: urlCreada ?? archivo, urlCreada }
      } else {
        if (!navigator.mediaDevices?.getUserMedia) {
          setError(mensajeNavegadorNoCompatible('camara'))
          return false
        }
        let stream
        try {
          stream = await navigator.mediaDevices.getUserMedia(RESTRICCIONES)
        } catch (fallo) {
          if (sesion === sesionRef.current) setError(mensajeErrorSensor(fallo, 'camara'))
          return false
        }
        if (sesion !== sesionRef.current) {
          stream.getTracks().forEach((pista) => pista.stop())
          return false
        }
        stream.getTracks().forEach((pista) => {
          pista.onended = () => {
            parar()
            setError(mensajeSensorCortado('camara'))
          }
        })
        recursoRef.current = { stream }
      }

      conectarVideo()
      setActiva(true)
      return true
    },
    [conectarVideo, liberar, parar],
  )

  useEffect(() => {
    if (activa) conectarVideo()
  }, [activa, conectarVideo])

  // iOS congela el vídeo al salir de la app: lo reanuda al volver.
  useEffect(() => {
    if (!activa) return undefined
    const alVolver = () => {
      if (document.visibilityState === 'visible') videoRef.current?.play().catch(() => {})
    }
    document.addEventListener('visibilitychange', alVolver)
    return () => document.removeEventListener('visibilitychange', alVolver)
  }, [activa])

  useEffect(
    () => () => {
      sesionRef.current++
      liberar()
    },
    [liberar],
  )

  return { videoRef, activa, error, iniciar, parar }
}
