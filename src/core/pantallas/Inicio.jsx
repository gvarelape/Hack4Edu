import { useEffect, useRef, useState } from 'react'
import { BotonAsistente, estadoModeloAsistente } from '../../asistente'
import { experimentos } from '../../registro'
import DibujoExperimento from '../componentes/DibujoExperimento'
import EtiquetaCiencia from '../componentes/EtiquetaCiencia'
import LogoKanga from '../componentes/LogoKanga'
import useMovimiento from '../hooks/useMovimiento'
import { claveCiencia } from '../lib/ciencias'
import { animar, CURVA, DURACION } from '../lib/movimiento'
import { consultarTamano, estaListaSinInternet, formatearTamano } from '../lib/sinInternet'

const preguntas = experimentos.flatMap((experimento) => experimento.preguntas)
const recursos = experimentos.flatMap((experimento) => experimento.recursos)
const TOQUES_SORPRESA = 3

// El logo y la lista solo se animan la primera vez que se abre la app, sin guardar nada.
let logoYaTrazado = false
let listaYaAnimada = false

export default function Inicio() {
  const nivel = useMovimiento()
  const raizRef = useRef(null)
  const trazoRef = useRef(null)
  const toquesRef = useRef(0)
  const [lista, setLista] = useState(true)
  const [tamano, setTamano] = useState(null)
  const [sorpresa, setSorpresa] = useState(false)

  useEffect(() => {
    let vigente = true
    const comprobar = () =>
      estaListaSinInternet(recursos, estadoModeloAsistente()).then((resultado) => {
        if (vigente) setLista(resultado)
      })
    comprobar()
    // En la primera visita, el service worker se activa después de abrir la pantalla.
    navigator.serviceWorker?.ready.then(comprobar)
    Promise.all(recursos.map(consultarTamano)).then((medidas) => {
      if (vigente && recursos.length > 0 && medidas.every(Number.isFinite)) {
        setTamano(medidas.reduce((a, b) => a + b, 0))
      }
    })
    return () => {
      vigente = false
    }
  }, [])

  useEffect(() => {
    if (nivel !== 'normal') return undefined
    const animaciones = []
    const trazo = trazoRef.current
    if (!logoYaTrazado && trazo) {
      logoYaTrazado = true
      trazo.style.strokeDasharray = '1'
      const animacion = animar(
        trazo,
        [
          { strokeDashoffset: 1, fillOpacity: 0 },
          { strokeDashoffset: 0, fillOpacity: 0, offset: 0.7 },
          { strokeDashoffset: 0, fillOpacity: 1 },
        ],
        { duration: DURACION.lenta },
      )
      const limpiar = () => {
        trazo.style.strokeDasharray = ''
      }
      if (animacion) {
        animacion.onfinish = limpiar
        animacion.oncancel = limpiar
        animaciones.push(animacion)
      } else limpiar()
    }
    if (!listaYaAnimada) {
      listaYaAnimada = true
      raizRef.current?.querySelectorAll('.core-entrada').forEach((entrada, i) => {
        animaciones.push(
          animar(
            entrada,
            [
              { opacity: 0, transform: 'translateY(10px)' },
              { opacity: 1, transform: 'none' },
            ],
            { duration: DURACION.media, delay: i * 50, easing: CURVA.salida, fill: 'backwards' },
          ),
        )
      })
    }
    return () => animaciones.forEach((animacion) => animacion?.cancel())
  }, [nivel])

  const tocarLogo = () => {
    toquesRef.current += 1
    if (toquesRef.current === TOQUES_SORPRESA) setSorpresa(true)
  }

  return (
    <div ref={raizRef} className="core-inicio">
      <header className="core-inicio-cabecera">
        <button type="button" className="core-logo" aria-label="Kanga" onClick={tocarLogo}>
          <LogoKanga trazoRef={trazoRef} />
        </button>
        <h1 className="core-inicio-titulo">Kanga</h1>
        <a className="core-inicio-ajustes" href="#/ajustes">
          Ajustes
        </a>
      </header>

      <div className="core-heroe">
        <p className="core-heroe-lema">
          Haz ciencia de verdad con tu móvil y{' '}
          <span className="core-marcador">lo que tienes en casa</span>.
        </p>
        <a className="core-cuaderno-objeto" href="#/cuaderno">
          <span className="core-cuaderno-etiqueta">Mi cuaderno</span>
        </a>
      </div>

      {sorpresa && (
        <p className="core-nota-oculta core-sello">
          Nota al margen: un canguro casi no puede andar hacia atrás. Tú sí: repite el experimento.
        </p>
      )}

      {!lista && (
        <a className="core-inicio-nota" href="#/ajustes" role="status">
          <span>
            Prepara Kanga para poder usarla sin internet.
            {tamano !== null && ` La descarga ocupa ${formatearTamano(tamano)}.`} Conviene hacerlo
            con wifi.
          </span>
          <strong>Ir a Ajustes →</strong>
        </a>
      )}

      {experimentos.map((experimento, i) => (
        <section
          key={experimento.id}
          className={`core-entrada core-entrada-${i} core-ciencia-${claveCiencia(experimento.ciencia)}`}
        >
          <a className="core-entrada-texto" href={`#/experimento/${experimento.id}`}>
            <EtiquetaCiencia ciencia={experimento.ciencia} />
            <h2 className="core-entrada-titulo">{experimento.titulo}</h2>
            <p>{experimento.descripcion}</p>
            <span className="core-entrada-accion">Empezar →</span>
          </a>
          <DibujoExperimento id={experimento.id} titulo={experimento.titulo} pista={i === 0} />
        </section>
      ))}

      <BotonAsistente preguntas={preguntas} momento="siempre" />
    </div>
  )
}
