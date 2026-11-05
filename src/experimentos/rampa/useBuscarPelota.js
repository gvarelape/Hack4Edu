import { useEffect, useRef, useState } from 'react'
import { cargarDetector, detectarPelota } from './detectorIA'

const MS_PLAN_B = 3000 // a los 3 s se le ofrece al alumno tocar la pelota
const MS_BUSQUEDA = 3000 // tiempo buscando con el modelo ya cargado, para no gastar batería
const MS_ENTRE_INTENTOS = 250 // el detector es lento en móviles baratos: no se pasa en cada fotograma

const esperar = (ms) => new Promise((resolver) => setTimeout(resolver, ms))

// Mientras esté activo, la IA busca la pelota y llama a alEncontrar(deteccion).
// El alumno puede tocar la pelota en cualquier momento: nunca se queda esperando a la IA.
export function useBuscarPelota({ videoRef, activo, alEncontrar }) {
  const alEncontrarRef = useRef(alEncontrar)
  const [planB, setPlanB] = useState(false)

  useEffect(() => {
    alEncontrarRef.current = alEncontrar
  })

  useEffect(() => {
    if (!activo) return undefined
    let cancelada = false
    const temporizador = setTimeout(() => setPlanB(true), MS_PLAN_B)

    const buscar = async () => {
      let detector
      try {
        detector = await cargarDetector()
      } catch {
        if (!cancelada) setPlanB(true)
        return
      }

      const fin = performance.now() + MS_BUSQUEDA
      while (!cancelada && performance.now() < fin) {
        const video = videoRef.current
        if (video?.videoWidth) {
          try {
            const deteccion = detectarPelota(detector, video)
            // Si no vale, se sigue buscando hasta que se acabe el tiempo.
            if (deteccion && alEncontrarRef.current(deteccion)) return
          } catch {
            break
          }
        }
        await esperar(MS_ENTRE_INTENTOS)
      }
      if (!cancelada) setPlanB(true)
    }
    buscar()

    return () => {
      cancelada = true
      clearTimeout(temporizador)
      setPlanB(false)
    }
  }, [activo, videoRef])

  return { planB }
}
