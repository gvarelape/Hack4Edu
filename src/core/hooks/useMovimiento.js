import { useSyncExternalStore } from 'react'
import { nivelActual, suscribirseMovimiento } from '../lib/movimiento'

export default function useMovimiento() {
  return useSyncExternalStore(suscribirseMovimiento, nivelActual)
}
