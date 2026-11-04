import { useEffect, useSyncExternalStore } from 'react'
import { interpretarRuta } from '../lib/rutas'

function suscribirse(avisar) {
  window.addEventListener('hashchange', avisar)
  return () => window.removeEventListener('hashchange', avisar)
}

export default function useRuta() {
  const hash = useSyncExternalStore(suscribirse, () => window.location.hash)

  // Cada pantalla nueva empieza arriba, aunque la anterior estuviera desplazada.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [hash])

  return interpretarRuta(hash)
}
