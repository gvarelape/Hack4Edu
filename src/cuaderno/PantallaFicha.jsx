import { useEffect, useState } from 'react'
import {
  Aviso,
  Boton,
  Cargando,
  Confirmacion,
  EtiquetaCiencia,
  Grafica,
  Tabla,
  Tarjeta,
  ValorDestacado,
} from '../core'
import { borrarRegistro, obtenerRegistro } from './almacen.js'
import { datosCiencia, formatearFecha } from './formatoCuaderno.js'
import './cuaderno.css'

function Seccion({ titulo, children }) {
  return (
    <section className="cuaderno-seccion">
      <h2>{titulo}</h2>
      {children}
    </section>
  )
}

function Resultados({ resultado }) {
  const [destacado, ...resto] = resultado.valores ?? []
  return (
    <Seccion titulo="Resultados">
      {destacado && <ValorDestacado valor={destacado} grande />}
      {resto.length > 0 && (
        <div className="cuaderno-valores">
          {resto.map((valor, i) => (
            <ValorDestacado key={i} valor={valor} />
          ))}
        </div>
      )}
      {resultado.resumen && <p className="cuaderno-texto-lineas">{resultado.resumen}</p>}
      {resultado.comparacion && (
        <p className="cuaderno-nota cuaderno-texto-lineas">{resultado.comparacion}</p>
      )}
      {resultado.tabla && (
        <Tarjeta>
          <Tabla tabla={resultado.tabla} />
        </Tarjeta>
      )}
      {resultado.grafica && (
        <Tarjeta>
          <Grafica grafica={resultado.grafica} />
        </Tarjeta>
      )}
    </Seccion>
  )
}

function Explicaciones({ explicaciones }) {
  if (!explicaciones?.length) return null
  return (
    <Seccion titulo="¿Por qué ha salido así?">
      {explicaciones.map((explicacion, i) => (
        <div key={i} className="cuaderno-explicacion">
          <h3>{explicacion.titulo}</h3>
          <p>{explicacion.texto}</p>
        </div>
      ))}
    </Seccion>
  )
}

function Reflexion({ respuestas }) {
  if (!respuestas?.length) return null
  return (
    <Seccion titulo="Reflexión">
      <dl className="cuaderno-reflexion">
        {respuestas.map((item, i) => (
          <div key={i}>
            <dt>{item.pregunta}</dt>
            <dd className={item.respuesta ? undefined : 'cuaderno-sin-respuesta'}>
              {item.respuesta || 'Sin responder'}
            </dd>
          </div>
        ))}
      </dl>
    </Seccion>
  )
}

export default function PantallaFicha({ id, onVolver }) {
  // undefined: cargando · null: no existe · objeto: el registro
  const [registro, setRegistro] = useState(undefined)
  const [confirmando, setConfirmando] = useState(false)
  const [borrando, setBorrando] = useState(false)
  const [errorBorrar, setErrorBorrar] = useState(false)

  useEffect(() => {
    let activa = true
    obtenerRegistro(id).then((encontrado) => {
      if (activa) setRegistro(encontrado)
    })
    return () => {
      activa = false
    }
  }, [id])

  const borrar = async () => {
    setConfirmando(false)
    setBorrando(true)
    setErrorBorrar(false)
    const borrado = await borrarRegistro(id)
    if (borrado) {
      onVolver()
      return
    }
    setBorrando(false)
    setErrorBorrar(true)
  }

  if (registro === undefined) return <Cargando texto="Abriendo tu experimento…" />

  if (registro === null) {
    return (
      <div className="core-pantalla cuaderno-pantalla">
        <h1>No encontramos este experimento</h1>
        <Aviso tipo="info">
          Puede que lo hayas borrado. Vuelve al cuaderno para ver los que tienes.
        </Aviso>
        <Boton onClick={onVolver}>Volver al cuaderno</Boton>
      </div>
    )
  }

  const { clase } = datosCiencia(registro.ciencia)

  return (
    <article className={`core-pantalla cuaderno-pantalla cuaderno-ficha core-ciencia-${clase}`}>
      <header className="cuaderno-ficha-cabecera">
        <EtiquetaCiencia ciencia={registro.ciencia} />
        <h1 className="cuaderno-ficha-titulo">{registro.titulo}</h1>
        <p className="core-pantalla-nota">{formatearFecha(registro.fecha)}</p>
      </header>

      {registro.hipotesis && (
        <Seccion titulo="Mi hipótesis">
          <p className="cuaderno-nota">{registro.hipotesis}</p>
        </Seccion>
      )}

      {registro.prediccion?.texto && (
        <Seccion titulo="Mi predicción">
          <p className="cuaderno-nota">{registro.prediccion.texto}</p>
        </Seccion>
      )}

      {registro.resultado && <Resultados resultado={registro.resultado} />}
      <Explicaciones explicaciones={registro.resultado?.explicaciones} />
      <Reflexion respuestas={registro.respuestas} />

      <div className="cuaderno-acciones">
        {errorBorrar && <Aviso tipo="error">No hemos podido borrarlo. Vuelve a intentarlo.</Aviso>}
        <Boton variante="peligro" onClick={() => setConfirmando(true)} disabled={borrando}>
          {borrando ? 'Borrando…' : 'Borrar'}
        </Boton>
        <Boton variante="secundario" onClick={onVolver}>
          Volver
        </Boton>
      </div>

      <Confirmacion
        abierta={confirmando}
        texto="¿Seguro que quieres borrar este experimento? No se puede recuperar."
        textoAceptar="Sí, borrar"
        onAceptar={borrar}
        onCancelar={() => setConfirmando(false)}
      />
    </article>
  )
}
