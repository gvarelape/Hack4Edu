import { useCallback, useEffect, useRef, useState } from 'react'
import {
  mensajeArchivoNoValido,
  mensajeErrorSensor,
  mensajeNavegadorNoCompatible,
  mensajeSensorCortado,
} from '../lib/erroresSensor'

const TAMANO_FFT = 8192

// Sin filtros: la cancelación de eco y la supresión de ruido deforman la nota que se quiere medir.
const RESTRICCIONES = {
  video: false,
  audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
}

async function leerBytes(archivo) {
  if (archivo instanceof Blob) return archivo.arrayBuffer()
  const respuesta = await fetch(archivo)
  if (!respuesta.ok) throw new Error('No se ha podido descargar el archivo')
  return respuesta.arrayBuffer()
}

export default function useMicrofono() {
  const recursoRef = useRef(null)
  // Cada iniciar o parar invalida lo anterior, por si el micrófono tarda en responder.
  const sesionRef = useRef(0)
  const [analizador, setAnalizador] = useState(null)
  const [frecuenciaMuestreo, setFrecuenciaMuestreo] = useState(null)
  const [activo, setActivo] = useState(false)
  const [error, setError] = useState(null)

  const liberar = useCallback(() => {
    const recurso = recursoRef.current
    recursoRef.current = null
    if (!recurso) return
    recurso.stream?.getTracks().forEach((pista) => {
      pista.onended = null
      pista.stop()
    })
    try {
      recurso.fuente?.stop?.()
    } catch {
      // La fuente de un archivo falla si ya había terminado: no hay nada que parar.
    }
    recurso.contexto.close().catch(() => {})
  }, [])

  const parar = useCallback(() => {
    sesionRef.current++
    liberar()
    setAnalizador(null)
    setFrecuenciaMuestreo(null)
    setActivo(false)
  }, [liberar])

  const iniciar = useCallback(
    async ({ archivo } = {}) => {
      const sesion = ++sesionRef.current
      const sigueVigente = () => sesion === sesionRef.current
      liberar()
      setAnalizador(null)
      setActivo(false)
      setError(null)

      const ClaseContexto = window.AudioContext ?? window.webkitAudioContext
      if (!ClaseContexto || (!archivo && !navigator.mediaDevices?.getUserMedia)) {
        setError(mensajeNavegadorNoCompatible('microfono'))
        return false
      }

      // Se crea antes de esperar a nada: iOS solo deja arrancar el audio durante el toque.
      const contexto = new ClaseContexto()
      recursoRef.current = { contexto }
      contexto.resume().catch(() => {})

      try {
        const nodoAnalizador = contexto.createAnalyser()
        nodoAnalizador.fftSize = TAMANO_FFT
        // Volumen 0 hacia la salida: mantiene vivo el audio en todos los navegadores, sin oírse.
        const silencio = contexto.createGain()
        silencio.gain.value = 0
        nodoAnalizador.connect(silencio)
        silencio.connect(contexto.destination)

        if (archivo) {
          const bytes = await leerBytes(archivo)
          const audio = await contexto.decodeAudioData(bytes)
          if (!sigueVigente()) return false
          const fuente = contexto.createBufferSource()
          fuente.buffer = audio
          fuente.connect(nodoAnalizador)
          fuente.start()
          recursoRef.current.fuente = fuente
        } else {
          const stream = await navigator.mediaDevices.getUserMedia(RESTRICCIONES)
          if (!sigueVigente()) {
            stream.getTracks().forEach((pista) => pista.stop())
            return false
          }
          recursoRef.current.stream = stream
          stream.getTracks().forEach((pista) => {
            pista.onended = () => {
              parar()
              setError(mensajeSensorCortado('microfono'))
            }
          })
          contexto.createMediaStreamSource(stream).connect(nodoAnalizador)
        }

        setAnalizador(nodoAnalizador)
        setFrecuenciaMuestreo(contexto.sampleRate)
        setActivo(true)
        return true
      } catch (fallo) {
        if (sigueVigente()) {
          liberar()
          setError(
            archivo ? mensajeArchivoNoValido('audio') : mensajeErrorSensor(fallo, 'microfono'),
          )
        }
        return false
      }
    },
    [liberar, parar],
  )

  useEffect(
    () => () => {
      sesionRef.current++
      liberar()
    },
    [liberar],
  )

  return { analizador, frecuenciaMuestreo, activo, error, iniciar, parar }
}
