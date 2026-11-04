import { experimentos } from '../../registro'
import Boton from '../componentes/Boton'
import { navegar } from '../lib/rutas'

// PROVISIONAL: se sustituye en el prompt 8. Mientras tanto, da acceso a todas las pruebas.
export default function Inicio() {
  return (
    <div className="core-pantalla">
      <h1>Kanga</h1>
      {experimentos.map((experimento) => (
        <Boton key={experimento.id} onClick={() => navegar(`/prueba/${experimento.id}`)}>
          Probar: {experimento.titulo}
        </Boton>
      ))}
      <Boton variante="secundario" onClick={() => navegar('/prueba/cuaderno')}>
        Probar: cuaderno
      </Boton>
      <Boton variante="secundario" onClick={() => navegar('/prueba/asistente')}>
        Probar: asistente
      </Boton>
    </div>
  )
}
