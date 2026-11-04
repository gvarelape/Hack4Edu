import { useEffect, useState } from 'react'
import { BotonAsistente, estadoModeloAsistente } from '../../asistente'
import { experimentos } from '../../registro'
import Aviso from '../componentes/Aviso'
import Boton from '../componentes/Boton'
import EtiquetaCiencia from '../componentes/EtiquetaCiencia'
import { claveCiencia } from '../lib/ciencias'
import { navegar } from '../lib/rutas'
import { estaListaSinInternet } from '../lib/sinInternet'

const preguntas = experimentos.flatMap((experimento) => experimento.preguntas)
const recursos = experimentos.flatMap((experimento) => experimento.recursos)

function IconoAjustes() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="3" />
      <circle cx="12" cy="12" r="7" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9 7 7M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1" />
    </svg>
  )
}

export default function Inicio() {
  const [lista, setLista] = useState(true)

  useEffect(() => {
    let vigente = true
    estaListaSinInternet(recursos, estadoModeloAsistente()).then((resultado) => {
      if (vigente) setLista(resultado)
    })
    return () => {
      vigente = false
    }
  }, [])

  return (
    <div className="core-pantalla core-inicio">
      <header className="core-inicio-cabecera">
        {/* PROVISIONAL: se cambia por logo.svg cuando Nicolás cierre el logo. */}
        <img className="core-inicio-logo" src="/iconos/icon-192.png" alt="" />
        <h1 className="core-inicio-nombre">Kanga</h1>
        <a className="core-inicio-ajustes" href="#/ajustes" aria-label="Ajustes">
          <IconoAjustes />
        </a>
      </header>

      {!lista && (
        <Aviso tipo="info">
          Prepara Kanga para poder usarla sin internet. Conviene hacerlo con wifi.
          <a className="core-inicio-aviso-enlace" href="#/ajustes">
            Ir a Ajustes
          </a>
        </Aviso>
      )}

      {experimentos.map((experimento) => (
        <a
          key={experimento.id}
          className={`core-tarjeta-experimento core-ciencia-${claveCiencia(experimento.ciencia)}`}
          href={`#/experimento/${experimento.id}`}
        >
          <EtiquetaCiencia ciencia={experimento.ciencia} />
          <h2>{experimento.titulo}</h2>
          <p>{experimento.descripcion}</p>
        </a>
      ))}

      <Boton variante="secundario" onClick={() => navegar('/cuaderno')}>
        Mi cuaderno
      </Boton>

      <BotonAsistente preguntas={preguntas} momento="siempre" />
    </div>
  )
}
