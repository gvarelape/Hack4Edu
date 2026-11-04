import { Boton } from '../../core'

export default function PanelGrabando({ puntos, onParar }) {
  return (
    <>
      <h1>¡Suelta la pelota!</h1>
      <p aria-live="polite">Llevo {puntos} puntos. Pulsa "Parar" cuando llegue abajo.</p>
      <Boton variante="peligro" onClick={onParar}>
        Parar
      </Boton>
    </>
  )
}
