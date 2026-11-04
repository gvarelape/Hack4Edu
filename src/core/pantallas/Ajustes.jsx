import Boton from '../componentes/Boton'
import { navegar } from '../lib/rutas'

// PROVISIONAL: se construye en el prompt 10.
export default function Ajustes() {
  return (
    <div className="core-pantalla">
      <h1>Ajustes</h1>
      <p>En construcción</p>
      <Boton variante="secundario" onClick={() => navegar('/')}>
        Volver al inicio
      </Boton>
    </div>
  )
}
