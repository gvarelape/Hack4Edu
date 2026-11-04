import { useState } from 'react'
import Aviso from '../componentes/Aviso'
import Boton from '../componentes/Boton'
import { navegar } from '../lib/rutas'
import { validarPrediccion, validarResultado } from '../lib/validarResultado'
import VistaResultado from './VistaResultado'

const PREDICCION_EJEMPLO = { texto: 'Predicción de ejemplo', valor: 1 }

function enJson(valor) {
  try {
    return JSON.stringify(valor, null, 2)
  } catch (fallo) {
    return `No se puede convertir a JSON: ${fallo.message}`
  }
}

function Validacion({ revision, nombre }) {
  const { errores, avisos } = revision
  return (
    <>
      {errores.length === 0 ? (
        <Aviso tipo="exito">{nombre} cumple el contrato.</Aviso>
      ) : (
        <Aviso tipo="error">
          <strong>
            {nombre} no cumple el contrato ({errores.length}):
          </strong>
          <ul>
            {errores.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </Aviso>
      )}
      {avisos.length > 0 && (
        <Aviso tipo="info">
          <ul>
            {avisos.map((aviso) => (
              <li key={aviso}>{aviso}</li>
            ))}
          </ul>
        </Aviso>
      )}
    </>
  )
}

export default function PruebaExperimento({ experimento }) {
  const { Simulacion, Medicion, preguntas } = experimento
  const [vista, setVista] = useState('menu')
  const [tipoPrediccion, setTipoPrediccion] = useState('ninguna')
  const [prediccionSimulacion, setPrediccionSimulacion] = useState(null)
  const [resultado, setResultado] = useState(null)
  const [cancelada, setCancelada] = useState(false)

  const prediccion =
    tipoPrediccion === 'ejemplo'
      ? PREDICCION_EJEMPLO
      : tipoPrediccion === 'simulacion'
        ? prediccionSimulacion
        : null

  const abrir = (nueva) => {
    setResultado(null)
    setCancelada(false)
    setVista(nueva)
  }

  if (vista === 'simulacion') {
    return (
      <Simulacion
        onContinuar={(entregada) => {
          setPrediccionSimulacion(entregada)
          setTipoPrediccion(entregada ? 'simulacion' : 'ninguna')
          setVista('menu')
        }}
      />
    )
  }

  if (vista === 'medicion') {
    return (
      <Medicion
        prediccion={prediccion}
        modoPrueba
        onTerminar={(entregado) => {
          setResultado({ valor: entregado, prediccion })
          setVista('menu')
        }}
        onCancelar={() => {
          setCancelada(true)
          setVista('menu')
        }}
      />
    )
  }

  const revisionResultado =
    resultado && validarResultado(resultado.valor, { prediccion: resultado.prediccion, preguntas })

  return (
    <div className="core-pantalla">
      <h1>Prueba: {experimento.titulo}</h1>

      <label className="core-campo">
        <span className="core-campo-etiqueta">Predicción para la Medicion</span>
        <select
          className="core-campo-entrada"
          value={tipoPrediccion}
          onChange={(evento) => setTipoPrediccion(evento.target.value)}
        >
          <option value="ninguna">Sin predicción (null)</option>
          <option value="ejemplo">Predicción de ejemplo</option>
          {prediccionSimulacion && <option value="simulacion">La de la Simulacion</option>}
        </select>
      </label>

      <Boton onClick={() => abrir('medicion')}>Abrir Medicion</Boton>
      <Boton variante="secundario" onClick={() => abrir('simulacion')}>
        Abrir Simulacion
      </Boton>

      {cancelada && <Aviso tipo="info">Medición cancelada: no se ha guardado nada.</Aviso>}

      {prediccionSimulacion && (
        <section className="core-pantalla">
          <h2>Predicción de la Simulacion</h2>
          <Validacion revision={validarPrediccion(prediccionSimulacion)} nombre="La predicción" />
          <pre className="core-prueba-json">{enJson(prediccionSimulacion)}</pre>
        </section>
      )}

      {resultado && (
        <section className="core-pantalla">
          <h2>Resultado</h2>
          <Validacion revision={revisionResultado} nombre="El resultado" />
          {revisionResultado.errores.length === 0 ? (
            <VistaResultado resultado={resultado.valor} preguntas={preguntas} />
          ) : (
            <p className="core-pantalla-nota">Corrige los errores para verlo dibujado.</p>
          )}
          <h2>Resultado en JSON</h2>
          <pre className="core-prueba-json">{enJson(resultado.valor)}</pre>
        </section>
      )}

      <Boton variante="secundario" onClick={() => navegar('/')}>
        Volver al inicio
      </Boton>
    </div>
  )
}
