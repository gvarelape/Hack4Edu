import { useEffect, useState } from 'react'
import { Aviso, Boton, BotonAtras, Cargando, EtiquetaCiencia, ValorDestacado } from '../core'
import { esAlmacenTemporal, obtenerRegistros } from './almacen.js'
import { datosCiencia, partesFecha, textoCantidad, valorDestacado } from './formatoCuaderno.js'
import './cuaderno.css'

function EntradaRegistro({ registro, reciente, onAbrir }) {
  const { clase } = datosCiencia(registro.ciencia)
  const fecha = partesFecha(registro.fecha)
  const valor = valorDestacado(registro)

  return (
    <li className={`cuaderno-entrada core-ciencia-${clase}`}>
      <button type="button" className="cuaderno-entrada-boton" onClick={() => onAbrir(registro.id)}>
        {fecha && (
          <span className="cuaderno-entrada-fecha">
            <span className="cuaderno-entrada-dia">{fecha.dia}</span>
            <span className="cuaderno-entrada-mes">
              {fecha.mes}
              {fecha.anio && ` ${fecha.anio}`}
            </span>
            <span className="cuaderno-entrada-hora">{fecha.hora}</span>
          </span>
        )}
        <span className="cuaderno-entrada-texto">
          <span
            className={reciente ? 'cuaderno-entrada-sello core-sello' : 'cuaderno-entrada-sello'}
          >
            <EtiquetaCiencia ciencia={registro.ciencia} />
          </span>
          <span className="cuaderno-entrada-titulo">{registro.titulo}</span>
          {valor && <ValorDestacado valor={valor} />}
        </span>
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
      <BotonAtras onClick={onVolver} />
      <h1>Mi cuaderno de laboratorio</h1>

      {temporal && (
        <Aviso tipo="error">
          Este navegador no permite guardar: tus experimentos se perderán al cerrar.
        </Aviso>
      )}

      {registros.length === 0 ? (
        <>
          <div className="cuaderno-vacio">
            <p className="cuaderno-vacio-titulo">Aún no has hecho ningún experimento</p>
            <p>Cuando termines uno, aparecerá aquí con tus resultados. ¡Anímate a probar!</p>
          </div>
          {/* Con el cuaderno vacío, la salida tiene que verse bien. */}
          <Boton onClick={onVolver}>Volver al inicio</Boton>
        </>
      ) : (
        <>
          <p className="core-pantalla-nota">{textoCantidad(registros.length)}</p>
          <ol className="cuaderno-lista">
            {registros.map((registro, posicion) => (
              <EntradaRegistro
                key={registro.id}
                registro={registro}
                reciente={posicion === 0}
                onAbrir={onAbrir}
              />
            ))}
          </ol>
        </>
      )}
    </div>
  )
}
