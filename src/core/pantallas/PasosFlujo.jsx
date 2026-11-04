import { useState } from 'react'
import Aviso from '../componentes/Aviso'
import Boton from '../componentes/Boton'
import Cargando from '../componentes/Cargando'
import DibujoExperimento from '../componentes/DibujoExperimento'
import ListaMarcable from '../componentes/ListaMarcable'
import LogoKanga from '../componentes/LogoKanga'
import { claveCiencia } from '../lib/ciencias'
import { t } from '../lib/idioma'
import { navegar } from '../lib/rutas'
import VistaResultado from './VistaResultado'

// Las acciones van siempre abajo, donde llega el pulgar.
function Accion({ children }) {
  return <div className="core-flujo-accion">{children}</div>
}

export function PasoPresentacion({ experimento, onContinuar }) {
  const { id, ciencia, titulo, pregunta, materiales, seguridad } = experimento
  return (
    <>
      <h1>{titulo}</h1>
      <div className={`core-flujo-portada core-ciencia-${claveCiencia(ciencia)}`}>
        <p className="core-pregunta">{pregunta}</p>
        <DibujoExperimento id={id} titulo={titulo} />
      </div>
      {materiales.length > 0 && (
        <>
          <h2>Qué necesitas</h2>
          <ListaMarcable elementos={materiales} />
        </>
      )}
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
      <Accion>
        <Boton onClick={onContinuar}>Empezar</Boton>
      </Accion>
    </>
  )
}

const INICIOS_FRASE = ['Creo que… ', 'porque… ']

export function PasoHipotesis({ pregunta, hipotesis, onCambiar, onContinuar }) {
  // La frase se escribe en el idioma de la app, igual que el texto del botón.
  const anadir = (inicio) => {
    const separador = hipotesis && !hipotesis.endsWith(' ') ? ' ' : ''
    const frase = t(inicio.trim()).replace(/…$/, '')
    onCambiar(`${hipotesis}${separador}${frase} `)
  }
  return (
    <>
      <h1>Tu hipótesis</h1>
      <p className="core-pregunta">{pregunta}</p>
      <label className="core-campo">
        <span className="core-campo-etiqueta">¿Qué crees que va a pasar y por qué?</span>
        <textarea
          className="core-renglones"
          placeholder="Creo que… porque…"
          value={hipotesis}
          onChange={(evento) => onCambiar(evento.target.value)}
        />
      </label>
      <div className="core-inicios-frase">
        {INICIOS_FRASE.map((inicio) => (
          <button key={inicio} type="button" onClick={() => anadir(inicio)}>
            {inicio.trim()}
          </button>
        ))}
      </div>
      <Accion>
        <Boton onClick={onContinuar} disabled={hipotesis.trim() === ''}>
          Continuar
        </Boton>
      </Accion>
    </>
  )
}

export function PasoSimulacion({ Simulacion, onContinuar }) {
  return (
    <>
      <h1>Simúlalo antes de medir</h1>
      <Simulacion onContinuar={onContinuar} />
      <Accion>
        <Boton variante="secundario" onClick={() => onContinuar(null)}>
          Saltar este paso
        </Boton>
      </Accion>
    </>
  )
}

export function PasoMontaje({ instrucciones, onContinuar }) {
  return (
    <>
      <h1>Prepara el montaje</h1>
      <ListaMarcable elementos={instrucciones} numerada />
      <Accion>
        <Boton onClick={onContinuar}>Ya está listo</Boton>
      </Accion>
    </>
  )
}

export function PasoResultados({ resultado, preguntas, onContinuar }) {
  return (
    <>
      <h1>Resultados</h1>
      <VistaResultado resultado={resultado} preguntas={preguntas} />
      <Accion>
        <Boton onClick={onContinuar}>Continuar</Boton>
      </Accion>
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
            className="core-renglones"
            value={respuestas[i]}
            onChange={(evento) => cambiar(i, evento.target.value)}
          />
        </label>
      ))}
      <Accion>
        <Boton onClick={() => onContinuar(respuestas)}>Guardar en mi cuaderno</Boton>
      </Accion>
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
        <Accion>
          <Boton onClick={onReintentar}>Reintentar</Boton>
        </Accion>
      </>
    )
  }
  return (
    <>
      <div className="core-celebracion">
        <span className="core-celebracion-logo">
          <LogoKanga />
        </span>
        <h1 className="core-celebracion-sello core-sello">¡Experimento guardado!</h1>
        <p>Ya lo tienes en tu cuaderno.</p>
      </div>
      {almacenTemporal && (
        <Aviso tipo="error">
          Este navegador no permite guardar: tus experimentos se perderán al cerrar.
        </Aviso>
      )}
      <Accion>
        <Boton onClick={() => navegar(`/cuaderno/${encodeURIComponent(registroId)}`)}>
          Ver en el cuaderno
        </Boton>
        <Boton variante="secundario" onClick={() => navegar('/')}>
          Volver al inicio
        </Boton>
      </Accion>
    </>
  )
}
