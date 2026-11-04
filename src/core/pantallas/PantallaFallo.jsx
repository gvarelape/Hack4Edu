import Aviso from '../componentes/Aviso'
import Boton from '../componentes/Boton'

function volverAlInicio() {
  window.location.replace('#/')
  window.location.reload()
}

export default function PantallaFallo({ error }) {
  return (
    <div className="core-pantalla">
      <h1>Algo ha fallado</h1>
      <Aviso tipo="error">
        Esta pantalla ha tenido un problema. No es culpa tuya. Vuelve al inicio e inténtalo otra
        vez.
      </Aviso>
      <Boton onClick={volverAlInicio}>Volver al inicio</Boton>
      {error?.message && <p className="core-pantalla-nota">Detalle: {error.message}</p>}
    </div>
  )
}
