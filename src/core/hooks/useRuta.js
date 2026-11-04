import { useEffect, useSyncExternalStore } from 'react'
import { escucharCambiosDeRuta, interpretarRuta } from '../lib/rutas'

export default function useRuta() {
  const hash = useSyncExternalStore(escucharCambiosDeRuta, () => window.location.hash)

  // Cada pantalla nueva empieza arriba, aunque la anterior estuviera desplazada.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [hash])

  return interpretarRuta(hash)
}
