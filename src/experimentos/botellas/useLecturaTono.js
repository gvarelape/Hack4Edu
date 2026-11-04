import { useCallback, useRef, useState } from 'react'
import { useBucleFotogramas } from '../../core'
import { frecuenciaDominante, lecturaEstable, recortarHistorial } from './analisisAudio'

const SIN_LECTURA = { estable: false, frecuencia: null, dispersion: null, muestras: 0, duracion: 0 }
const SEGUNDOS_ENTRE_PINTADAS = 0.1 // repintar 60 veces por segundo pesa en móviles baratos

// Analiza el micrófono en cada fotograma y mantiene la lectura del último segundo.
export function useLecturaTono({ analizador, frecuenciaMuestreo, activo }) {
  const historialRef = useRef([])
  const ahoraRef = useRef(0)
  const ultimaPintadaRef = useRef(-Infinity)
  const [lectura, setLectura] = useState(SIN_LECTURA)

  useBucleFotogramas(({ tiempo }) => {
    if (!analizador) return
    const historial = recortarHistorial(historialRef.current, tiempo)
    const frecuencia = frecuenciaDominante(analizador, frecuenciaMuestreo)
    if (frecuencia !== null) historial.push({ tiempo, frecuencia })
    historialRef.current = historial
    ahoraRef.current = tiempo

    // El reloj del bucle vuelve a 0 al reiniciar el micrófono.
    const desdePintada = tiempo - ultimaPintadaRef.current
    if (desdePintada < 0 || desdePintada >= SEGUNDOS_ENTRE_PINTADAS) {
      ultimaPintadaRef.current = tiempo
      setLectura(lecturaEstable(historial, tiempo))
    }
  }, activo)

  // Al pulsar Registrar hace falta lo último, no lo que se pintó hace un momento.
  const leerAhora = useCallback(() => lecturaEstable(historialRef.current, ahoraRef.current), [])

  const reiniciar = useCallback(() => {
    historialRef.current = []
    ultimaPintadaRef.current = -Infinity
    setLectura(SIN_LECTURA)
  }, [])

  return { lectura, leerAhora, reiniciar }
}
