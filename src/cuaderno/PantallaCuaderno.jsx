import { useEffect, useState } from 'react'
import { Aviso, Boton, Cargando, ValorDestacado } from '../core'
import { esAlmacenTemporal, obtenerRegistros } from './almacen.js'
import EtiquetaCiencia from './EtiquetaCiencia.jsx'
import { datosCiencia, formatearFecha, textoCantidad, valorDestacado } from './formatoCuaderno.js'
import './cuaderno.css'

function TarjetaRegistro({ registro, onAbrir }) {
  const { clase } = datosCiencia(registro.ciencia)
  const valor = valorDestacado(registro)

  return (
    <li>
      <button
        type="button"
        className={`cuaderno-tarjeta cuaderno-borde-${clase}`}
        onClick={() => onAbrir(registro.id)}
      >
        <EtiquetaCiencia ciencia={registro.ciencia} />
        <span className="cuaderno-tarjeta-titulo">{registro.titulo}</span>
        <span className="cuaderno-tarjeta-fecha">{formatearFecha(registro.fecha)}</span>
        {valor && <ValorDestacado valor={valor} />}
      </button>
    </li>
  )
}

export default function PantallaCuaderno({ onAbrir, onVolver }) {
  const [registros, setRegistros] = useState(null)
  const [temporal, setTemporal] = useState(false)

  useEffect(() => {
    let activa = true
    Promise.all([obtenerRegistros(), esAlmacenTemporal()]).then(([lista, enMemoria]) => {
      if (!activa) return
      setRegistros(lista)
      setTemporal(enMemoria)
    })
    return () => {
      activa = false
    }
  }, [])

  if (registros === null) return <Cargando texto="Abriendo tu cuaderno…" />

  return (
    <div className="core-pantalla cuaderno-pantalla">
      <h1>Mi cuaderno de laboratorio</h1>

      {temporal && (
        <Aviso tipo="error">
          Este navegador no permite guardar: tus experimentos se perderán al cerrar.
        </Aviso>
      )}

      {registros.length === 0 ? (
        <div className="cuaderno-vacio">
          <p className="cuaderno-vacio-titulo">Aún no has hecho ningún experimento</p>
          <p>Cuando termines uno, aparecerá aquí con tus resultados. ¡Anímate a probar!</p>
        </div>
      ) : (
        <>
          <p className="core-pantalla-nota">{textoCantidad(registros.length)}</p>
          <ul className="cuaderno-lista">
            {registros.map((registro) => (
              <TarjetaRegistro key={registro.id} registro={registro} onAbrir={onAbrir} />
            ))}
          </ul>
        </>
      )}

      <Boton variante={registros.length === 0 ? 'principal' : 'secundario'} onClick={onVolver}>
        Volver al inicio
      </Boton>
    </div>
  )
}
