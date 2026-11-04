import { useEffect, useState } from 'react'
import { bloquearSalida, navegar } from '../lib/rutas'

const avisarAlCerrar = (evento) => evento.preventDefault()

// Con `activo`, salir de la pantalla pide confirmación: botón Salir, botón Atrás o enlaces.
export default function useBloqueoSalida(activo) {
  const [destino, setDestino] = useState(null)
  const [permitida, setPermitida] = useState(false)

  useEffect(() => {
    if (!activo || permitida) return undefined
    const quitarBloqueo = bloquearSalida(setDestino)
    window.addEventListener('beforeunload', avisarAlCerrar)
    return () => {
      quitarBloqueo()
      window.removeEventListener('beforeunload', avisarAlCerrar)
    }
  }, [activo, permitida])

  // Navega cuando el efecto ya ha quitado el bloqueo.
  useEffect(() => {
    if (permitida) navegar(destino)
  }, [permitida, destino])

  return {
    confirmando: destino !== null && !permitida,
    pedirSalida: (ruta) => (activo ? setDestino(ruta) : navegar(ruta)),
    cancelarSalida: () => setDestino(null),
    confirmarSalida: () => setPermitida(true),
  }
}
