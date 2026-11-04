import Boton from '../componentes/Boton'
import { navegar } from '../lib/rutas'

// PROVISIONAL: se construye en el prompt 9.
export default function FlujoExperimento({ experimento }) {
  return (
    <div className="core-pantalla">
      <h1>{experimento.titulo}</h1>
      <p>En construcción</p>
      <Boton variante="secundario" onClick={() => navegar('/')}>
        Volver al inicio
      </Boton>
    </div>
  )
}
