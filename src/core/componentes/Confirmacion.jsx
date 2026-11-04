import { useEffect, useRef } from 'react'
import Boton from './Boton'

export default function Confirmacion({
  abierta,
  texto,
  textoAceptar = 'Aceptar',
  onAceptar,
  onCancelar,
}) {
  const ventanaRef = useRef(null)

  // Lleva el foco a la ventana al abrirla y lo devuelve donde estaba al cerrarla.
  useEffect(() => {
    if (!abierta) return undefined
    const elementoAnterior = document.activeElement
    ventanaRef.current?.focus()
    return () => elementoAnterior?.focus?.()
  }, [abierta])

  if (!abierta) return null

  const pulsarTecla = (evento) => {
    if (evento.key === 'Escape') onCancelar?.()
  }

  return (
    <div className="core-velo" onKeyDown={pulsarTecla}>
      <div
        ref={ventanaRef}
        className="core-confirmacion"
        role="alertdialog"
        aria-modal="true"
        aria-label={texto}
        tabIndex={-1}
      >
        <p>{texto}</p>
        <div className="core-confirmacion-botones">
          <Boton onClick={onAceptar}>{textoAceptar}</Boton>
          <Boton variante="secundario" onClick={onCancelar}>
            Cancelar
          </Boton>
        </div>
      </div>
    </div>
  )
}
