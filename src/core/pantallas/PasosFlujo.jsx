import { useState } from 'react'
import Aviso from '../componentes/Aviso'
import Boton from '../componentes/Boton'
import Cargando from '../componentes/Cargando'
import { navegar } from '../lib/rutas'
import VistaResultado from './VistaResultado'

export function PasoPresentacion({ experimento, onContinuar }) {
  const { titulo, pregunta, materiales, seguridad } = experimento
  return (
    <>
      <h1>{titulo}</h1>
      <p>{pregunta}</p>
      <h2>Qué necesitas</h2>
      <ul className="core-flujo-lista">
        {materiales.map((material, i) => (
          <li key={i}>{material}</li>
        ))}
      </ul>
      {seguridad.length > 0 && (
        <Aviso tipo="error">
          <strong>Ten cuidado:</strong>
          <ul className="core-flujo-lista">
            {seguridad.map((aviso, i) => (
              <li key={i}>{aviso}</li>
            ))}
          </ul>
        </Aviso>
      )}
      <Boton onClick={onContinuar}>Empezar</Boton>
    </>
  )
}

export function PasoHipotesis({ pregunta, hipotesis, onCambiar, onContinuar }) {
  return (
    <>
      <h1>Tu hipótesis</h1>
      <p>{pregunta}</p>
      <label className="core-campo">
        <span className="core-campo-etiqueta">¿Qué crees que va a pasar y por qué?</span>
        <textarea
          className="core-campo-texto"
          placeholder="Creo que… porque…"
          value={hipotesis}
          onChange={(evento) => onCambiar(evento.target.value)}
        />
      </label>
      <Boton onClick={onContinuar} disabled={hipotesis.trim() === ''}>
        Continuar
      </Boton>
    </>
  )
}

export function PasoSimulacion({ Simulacion, onContinuar }) {
  return (
    <>
      <h1>Simúlalo antes de medir</h1>
      <Simulacion onContinuar={onContinuar} />
      <Boton variante="secundario" onClick={() => onContinuar(null)}>
        Saltar este paso
      </Boton>
    </>
  )
}

export function PasoMontaje({ instrucciones, onContinuar }) {
  return (
    <>
      <h1>Prepara el montaje</h1>
      <ol className="core-flujo-lista">
        {instrucciones.map((instruccion, i) => (
          <li key={i}>{instruccion}</li>
        ))}
      </ol>
      <Boton onClick={onContinuar}>Ya está listo</Boton>
    </>
  )
}

export function PasoResultados({ resultado, preguntas, onContinuar }) {
  return (
    <>
      <h1>Resultados</h1>
      <VistaResultado resultado={resultado} preguntas={preguntas} />
      <Boton onClick={onContinuar}>Continuar</Boton>
    </>
  )
}

export function PasoReflexion({ reflexion, onContinuar }) {
  const [respuestas, setRespuestas] = useState(() => reflexion.map(() => ''))

  const cambiar = (indice, texto) => {
    setRespuestas((actuales) => actuales.map((actual, i) => (i === indice ? texto : actual)))
  }

  return (
    <>
      <h1>Piensa en lo que ha pasado</h1>
      {reflexion.map((pregunta, i) => (
        <label key={i} className="core-campo">
          <span className="core-campo-etiqueta">{pregunta}</span>
          <textarea
            className="core-campo-texto"
            value={respuestas[i]}
            onChange={(evento) => cambiar(i, evento.target.value)}
          />
        </label>
      ))}
      <Boton onClick={() => onContinuar(respuestas)}>Guardar en mi cuaderno</Boton>
    </>
  )
}

export function PasoGuardar({ estado, almacenTemporal, registroId, onReintentar }) {
  if (estado === 'guardando') return <Cargando texto="Guardando en tu cuaderno…" />
  if (estado === 'error') {
    return (
      <>
        <h1>No se ha podido guardar</h1>
        <Aviso tipo="error">
          No hemos podido guardar tu experimento en este móvil. No has perdido nada: vuelve a
          intentarlo.
        </Aviso>
        <Boton onClick={onReintentar}>Reintentar</Boton>
      </>
    )
  }
  return (
    <>
      <h1>¡Experimento guardado!</h1>
      <Aviso tipo="exito">Ya lo tienes en tu cuaderno.</Aviso>
      {almacenTemporal && (
        <Aviso tipo="error">
          Este navegador no permite guardar: tus experimentos se perderán al cerrar.
        </Aviso>
      )}
      <Boton onClick={() => navegar(`/cuaderno/${encodeURIComponent(registroId)}`)}>
        Ver en el cuaderno
      </Boton>
      <Boton variante="secundario" onClick={() => navegar('/')}>
        Volver al inicio
      </Boton>
    </>
  )
}
