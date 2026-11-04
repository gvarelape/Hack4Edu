import { PantallaCuaderno, PantallaFicha } from '../cuaderno'
import { experimentos } from '../registro'
import Aviso from './componentes/Aviso'
import Boton from './componentes/Boton'
import useRuta from './hooks/useRuta'
import { navegar } from './lib/rutas'
import Ajustes from './pantallas/Ajustes'
import FlujoExperimento from './pantallas/FlujoExperimento'
import Inicio from './pantallas/Inicio'
import Prueba from './pantallas/Prueba'

const volverAlInicio = () => navegar('/')

function NoEncontrada({ texto }) {
  return (
    <div className="core-pantalla">
      <Aviso tipo="info">{texto}</Aviso>
      <Boton variante="secundario" onClick={volverAlInicio}>
        Volver al inicio
      </Boton>
    </div>
  )
}

export default function App() {
  const ruta = useRuta()

  switch (ruta.pantalla) {
    case 'inicio':
      return <Inicio />
    case 'experimento': {
      const experimento = experimentos.find((candidato) => candidato.id === ruta.id)
      if (!experimento) return <NoEncontrada texto="No encontramos ese experimento." />
      return <FlujoExperimento key={experimento.id} experimento={experimento} />
    }
    case 'cuaderno':
      return (
        <PantallaCuaderno
          onAbrir={(id) => navegar(`/cuaderno/${encodeURIComponent(id)}`)}
          onVolver={volverAlInicio}
        />
      )
    case 'ficha':
      return <PantallaFicha key={ruta.id} id={ruta.id} onVolver={() => navegar('/cuaderno')} />
    case 'ajustes':
      return <Ajustes />
    case 'prueba':
      return <Prueba key={ruta.id} id={ruta.id} />
    default:
      return <NoEncontrada texto="Esta pantalla no existe." />
  }
}
