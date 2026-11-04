import { experimentos } from '../../registro'
import Aviso from '../componentes/Aviso'
import Boton from '../componentes/Boton'
import { navegar } from '../lib/rutas'
import PruebaAsistente from './PruebaAsistente'
import PruebaCuaderno from './PruebaCuaderno'
import PruebaExperimento from './PruebaExperimento'

export default function Prueba({ id }) {
  if (id === 'cuaderno') return <PruebaCuaderno />
  if (id === 'asistente') return <PruebaAsistente />

  const experimento = experimentos.find((candidato) => candidato.id === id)
  if (experimento) return <PruebaExperimento experimento={experimento} />

  return (
    <div className="core-pantalla">
      <Aviso tipo="error">No hay ninguna parte llamada "{id}" para probar.</Aviso>
      <Boton variante="secundario" onClick={() => navegar('/')}>
        Volver al inicio
      </Boton>
    </div>
  )
}
