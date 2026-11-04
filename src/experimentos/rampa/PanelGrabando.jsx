import { Boton } from '../../core'

export default function PanelGrabando({ puntos, onParar }) {
  return (
    <>
      <h1>¡Suelta la pelota!</h1>
      {/* Un solo texto: el traductor del core no reconoce una frase partida en trozos. */}
      <p aria-live="polite">{`Llevo ${puntos} puntos. Pulsa "Parar" cuando llegue abajo.`}</p>
      <Boton variante="peligro" onClick={onParar}>
        Parar
      </Boton>
    </>
  )
}
