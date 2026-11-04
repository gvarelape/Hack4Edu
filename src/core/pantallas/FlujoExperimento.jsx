import { useEffect, useState } from 'react'
import { BotonAsistente } from '../../asistente'
import { guardarRegistro } from '../../cuaderno'
import Confirmacion from '../componentes/Confirmacion'
import useBloqueoSalida from '../hooks/useBloqueoSalida'
import { crearIdRegistro, crearRegistro } from '../lib/registro'
import {
  PasoGuardar,
  PasoHipotesis,
  PasoMontaje,
  PasoPresentacion,
  PasoReflexion,
  PasoResultados,
  PasoSimulacion,
} from './PasosFlujo'

const PASOS = [
  'Presentación',
  'Hipótesis',
  'Simulación',
  'Montaje',
  'Medición',
  'Resultados',
  'Reflexión',
  'Guardar',
]

function momentoDelPaso(paso) {
  if (paso <= 4) return 'antes'
  return paso === 5 ? 'durante' : 'resultados'
}

function BarraProgreso({ paso }) {
  return (
    <div
      className="core-flujo-progreso"
      role="progressbar"
      aria-label={`Paso ${paso} de ${PASOS.length}: ${PASOS[paso - 1]}`}
      aria-valuemin={1}
      aria-valuemax={PASOS.length}
      aria-valuenow={paso}
    >
      {PASOS.map((nombre, i) => (
        <span
          key={nombre}
          className={`core-flujo-segmento${i < paso ? ' core-flujo-segmento-hecho' : ''}`}
        />
      ))}
    </div>
  )
}

export default function FlujoExperimento({ experimento }) {
  const { pregunta, instrucciones, reflexion, preguntas, Simulacion, Medicion } = experimento
  const [paso, setPaso] = useState(1)
  const [hipotesis, setHipotesis] = useState('')
  const [prediccion, setPrediccion] = useState(null)
  const [resultado, setResultado] = useState(null)
  const [registro, setRegistro] = useState(null)
  const [estadoGuardado, setEstadoGuardado] = useState(null)

  const hayTrabajoSinGuardar =
    estadoGuardado !== 'guardado' && (paso > 1 || hipotesis.trim() !== '')
  const salida = useBloqueoSalida(hayTrabajoSinGuardar)
  const siguiente = () => setPaso((actual) => actual + 1)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [paso])

  const guardar = async (registroAGuardar) => {
    setEstadoGuardado('guardando')
    try {
      // El cuaderno avisa de un fallo devolviendo false, sin lanzar ningún error.
      const guardado = await guardarRegistro(registroAGuardar)
      setEstadoGuardado(guardado === false ? 'error' : 'guardado')
    } catch {
      setEstadoGuardado('error')
    }
  }

  const terminarReflexion = (respuestas) => {
    const nuevo = crearRegistro({
      experimento,
      hipotesis,
      prediccion,
      resultado,
      respuestas,
      id: crearIdRegistro(),
      fecha: new Date().toISOString(),
    })
    setRegistro(nuevo)
    siguiente()
    guardar(nuevo)
  }

  return (
    <div className="core-pantalla core-flujo">
      <div className="core-flujo-cabecera">
        <span className="core-pantalla-nota">
          Paso {paso} de {PASOS.length}: {PASOS[paso - 1]}
        </span>
        <button type="button" className="core-enlace" onClick={() => salida.pedirSalida('/')}>
          Salir
        </button>
      </div>
      <BarraProgreso paso={paso} />

      {paso === 1 && <PasoPresentacion experimento={experimento} onContinuar={siguiente} />}
      {paso === 2 && (
        <PasoHipotesis
          pregunta={pregunta}
          hipotesis={hipotesis}
          onCambiar={setHipotesis}
          onContinuar={siguiente}
        />
      )}
      {paso === 3 && (
        <PasoSimulacion
          Simulacion={Simulacion}
          onContinuar={(entregada) => {
            setPrediccion(entregada)
            siguiente()
          }}
        />
      )}
      {paso === 4 && <PasoMontaje instrucciones={instrucciones} onContinuar={siguiente} />}
      {paso === 5 && (
        <Medicion
          prediccion={prediccion}
          modoPrueba={false}
          onTerminar={(entregado) => {
            setResultado(entregado)
            siguiente()
          }}
          onCancelar={() => setPaso(4)}
        />
      )}
      {paso === 6 && (
        <PasoResultados resultado={resultado} preguntas={preguntas} onContinuar={siguiente} />
      )}
      {paso === 7 && <PasoReflexion reflexion={reflexion} onContinuar={terminarReflexion} />}
      {paso === 8 && (
        <PasoGuardar
          estado={estadoGuardado}
          registroId={registro.id}
          onReintentar={() => guardar(registro)}
        />
      )}

      <BotonAsistente preguntas={preguntas} momento={momentoDelPaso(paso)} />
      <Confirmacion
        abierta={salida.confirmando}
        texto="¿Seguro que quieres salir? Perderás lo que llevas hecho en este experimento."
        textoAceptar="Salir"
        onAceptar={salida.confirmarSalida}
        onCancelar={salida.cancelarSalida}
      />
    </div>
  )
}
