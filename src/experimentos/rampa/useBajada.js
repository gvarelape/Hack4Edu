import { useCallback, useEffect, useRef, useState } from 'react'
import { curvaCompleta, distanciaEn } from './simulacionRampa'

const MS_ENTRE_PUNTOS = 100 // la gráfica no se repinta en cada fotograma, en móviles baratos

const quiereMenosMovimiento = () =>
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

// Anima la bajada en tiempo real: alMover(distancia) en cada fotograma, y puntos para la gráfica.
export function useBajada(alMover) {
  const idRef = useRef(null)
  const alMoverRef = useRef(alMover)
  const [puntos, setPuntos] = useState([])
  const [estado, setEstado] = useState('quieta') // 'quieta' | 'bajando' | 'abajo'

  useEffect(() => {
    alMoverRef.current = alMover
  })

  const detener = useCallback(() => {
    if (idRef.current !== null) cancelAnimationFrame(idRef.current)
    idRef.current = null
  }, [])

  useEffect(() => detener, [detener])

  const reiniciar = useCallback(() => {
    detener()
    setPuntos([])
    setEstado('quieta')
  }, [detener])

  const soltar = useCallback(
    (bajada) => {
      detener()
      if (quiereMenosMovimiento()) {
        alMoverRef.current(bajada.largo)
        setPuntos(curvaCompleta(bajada))
        setEstado('abajo')
        return
      }

      setPuntos([{ x: 0, y: 0 }])
      setEstado('bajando')
      let inicio = null
      let ultimoPunto = 0
      const paso = (ahora) => {
        inicio ??= ahora
        const t = (ahora - inicio) / 1000
        if (t >= bajada.duracion) {
          idRef.current = null
          alMoverRef.current(bajada.largo)
          setPuntos((anteriores) => [...anteriores, { x: bajada.duracion, y: bajada.largo }])
          setEstado('abajo')
          return
        }
        const distancia = distanciaEn(t, bajada)
        alMoverRef.current(distancia)
        if (ahora - ultimoPunto >= MS_ENTRE_PUNTOS) {
          ultimoPunto = ahora
          setPuntos((anteriores) => [...anteriores, { x: t, y: distancia }])
        }
        idRef.current = requestAnimationFrame(paso)
      }
      idRef.current = requestAnimationFrame(paso)
    },
    [detener],
  )

  return { puntos, estado, soltar, reiniciar }
}
