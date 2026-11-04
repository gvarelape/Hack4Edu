import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { iniciarMovimiento } from './lib/movimiento'
import PantallaFallo from './pantallas/PantallaFallo'

// Si una pantalla falla al dibujarse, el alumno ve qué hacer en lugar de una página en blanco.
export function arrancar(contenedor, contenido) {
  const raiz = createRoot(contenedor, {
    onUncaughtError: (error) => {
      setTimeout(() => raiz.render(<PantallaFallo error={error} />))
    },
  })
  raiz.render(<StrictMode>{contenido}</StrictMode>)
  iniciarMovimiento()
}
