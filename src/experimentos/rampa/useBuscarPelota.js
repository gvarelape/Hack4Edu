import { useEffect, useRef, useState } from 'react'
import { cargarDetector, detectarEnZona, zonasBusqueda } from './detectorIA'

const MS_PLAN_B = 3000 // a los 3 s se le ofrece al alumno tocar la pelota
const MS_BUSQUEDA = 3000 // tiempo buscando con el modelo ya cargado, para no gastar batería
const MS_ENTRE_INTENTOS = 150 // una zona cada vez: el detector es lento en móviles baratos

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
      // Aunque se acabe el tiempo, se termina la vuelta: en un móvil lento también mira toda la imagen.
      for (
        let intento = 0;
        !cancelada && (performance.now() < fin || intento % 5 !== 0);
        intento++
      ) {
        const video = videoRef.current
        if (video?.videoWidth) {
          const zonas = zonasBusqueda(video.videoWidth, video.videoHeight)
          try {
            const deteccion = detectarEnZona(detector, video, zonas[intento % zonas.length])
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
