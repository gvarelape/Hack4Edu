import { useCallback, useEffect, useRef, useState } from 'react'

const DURACION_SEGUNDOS = 1
const VOLUMEN = 0.3
const FUNDIDO_SEGUNDOS = 0.03 // evita el chasquido al empezar y al acabar

// Reproduce un tono con Web Audio. No guarda ni graba nada.
export function useTonoBotella() {
  const contextoRef = useRef(null)
  const osciladorRef = useRef(null)
  const [sonando, setSonando] = useState(false)
  const [error, setError] = useState(null)

  const sonar = useCallback((frecuencia) => {
    const ClaseContexto = window.AudioContext ?? window.webkitAudioContext
    if (!ClaseContexto) {
      setError('Este navegador no puede hacer sonar la botella, pero puedes ver la frecuencia.')
      return
    }

    // Se crea durante el toque: iOS solo deja arrancar el audio en ese momento.
    contextoRef.current ??= new ClaseContexto()
    const contexto = contextoRef.current
    contexto.resume().catch(() => {})

    if (osciladorRef.current) {
      osciladorRef.current.onended = null
      osciladorRef.current.stop()
    }

    const inicio = contexto.currentTime
    const fin = inicio + DURACION_SEGUNDOS
    const volumen = contexto.createGain()
    volumen.gain.setValueAtTime(0, inicio)
    volumen.gain.linearRampToValueAtTime(VOLUMEN, inicio + FUNDIDO_SEGUNDOS)
    volumen.gain.setValueAtTime(VOLUMEN, fin - FUNDIDO_SEGUNDOS)
    volumen.gain.linearRampToValueAtTime(0, fin)
    volumen.connect(contexto.destination)

    const oscilador = contexto.createOscillator()
    oscilador.frequency.value = frecuencia
    oscilador.connect(volumen)
    oscilador.onended = () => {
      osciladorRef.current = null
      setSonando(false)
    }
    oscilador.start(inicio)
    oscilador.stop(fin)
    osciladorRef.current = oscilador
    setSonando(true)
  }, [])

  useEffect(
    () => () => {
      if (osciladorRef.current) osciladorRef.current.onended = null
      contextoRef.current?.close().catch(() => {})
      contextoRef.current = null
    },
    [],
  )

  return { sonar, sonando, error }
}
