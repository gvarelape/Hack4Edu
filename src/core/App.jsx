import { lazy, Suspense, useEffect, useRef } from 'react'
import { experimentos } from '../registro'
import Aviso from './componentes/Aviso'
import Boton from './componentes/Boton'
import Cargando from './componentes/Cargando'
import useRuta from './hooks/useRuta'
import { animar, CURVA, DURACION } from './lib/movimiento'
import { navegar } from './lib/rutas'
import Inicio from './pantallas/Inicio'

// Cada pantalla se descarga al abrirla: el móvil solo carga de inicio lo que va a enseñar.
const Ajustes = lazy(() => import('./pantallas/Ajustes'))
const FlujoExperimento = lazy(() => import('./pantallas/FlujoExperimento'))
const Prueba = lazy(() => import('./pantallas/Prueba'))
const PantallaCuaderno = lazy(() =>
  import('../cuaderno').then((modulo) => ({ default: modulo.PantallaCuaderno })),
)
const PantallaFicha = lazy(() =>
  import('../cuaderno').then((modulo) => ({ default: modulo.PantallaFicha })),
)

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

function Pantalla({ ruta }) {
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

export default function App() {
  const ruta = useRuta()
  const contenedorRef = useRef(null)
  const primeraRef = useRef(true)
  const clave = `${ruta.pantalla}/${ruta.id ?? ''}`

  // Cambio breve de escala y posición entre pantallas. Es una mejora: sin ella, todo funciona.
  useEffect(() => {
    if (primeraRef.current) {
      primeraRef.current = false
      return undefined
    }
    const animacion = animar(
      contenedorRef.current,
      [
        { opacity: 0, transform: 'translateY(8px) scale(0.985)' },
        { opacity: 1, transform: 'none' },
      ],
      { duration: DURACION.rapida, easing: CURVA.salida },
    )
    return () => animacion?.cancel()
  }, [clave])

  return (
    <main ref={contenedorRef}>
      <Suspense fallback={<Cargando />}>
        <Pantalla ruta={ruta} />
      </Suspense>
    </main>
  )
}
