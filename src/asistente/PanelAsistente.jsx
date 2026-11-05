// Panel "Pregunta a Kanga" (ASISTENTE.md y CONTRATO.md, punto 9).
// No guarda nada: al cerrarlo, la conversación se pierde.
import { useEffect, useMemo, useRef, useState } from 'react'
import { Cargando } from '../core'
import {
  UMBRAL_DUDAR,
  buscarRespuesta,
  preguntasSugeridas,
  unirConGenerales,
} from './busqueda/buscarRespuesta.js'
import { prepararModeloAsistente } from './busqueda/busquedaSignificado.js'
import './asistente.css'

function Chips({ preguntas, onElegir }) {
  if (preguntas.length === 0) return null
  return (
    <ul className="asistente-chips">
      {preguntas.map((pregunta) => (
        <li key={pregunta.id}>
          <button type="button" className="asistente-chip" onClick={() => onElegir(pregunta)}>
            {pregunta.pregunta}
          </button>
        </li>
      ))}
    </ul>
  )
}

function Contenido({ vista, sugeridas, todas, onElegir }) {
  if (vista.tipo === 'respuesta') {
    const relacionadas = (vista.pregunta.relacionadas ?? [])
      .map((id) => todas.find((pregunta) => pregunta.id === id))
      .filter(Boolean)
    return (
      <div className="asistente-respuesta" aria-live="polite">
        {vista.preguntado && (
          <p className="asistente-preguntado">Has preguntado: «{vista.preguntado}»</p>
        )}
        <p className="asistente-entendido">{vista.pregunta.pregunta}</p>
        <p>{vista.pregunta.respuesta}</p>
        {relacionadas.length > 0 && (
          <>
            <p className="asistente-subtitulo">También te puede interesar</p>
            <Chips preguntas={relacionadas} onElegir={onElegir} />
          </>
        )}
      </div>
    )
  }
  if (vista.tipo === 'dudas') {
    return (
      <div className="asistente-respuesta" aria-live="polite">
        <p className="asistente-preguntado">Has preguntado: «{vista.preguntado}»</p>
        <p className="asistente-subtitulo">¿Quieres decir…?</p>
        <Chips preguntas={vista.opciones} onElegir={onElegir} />
      </div>
    )
  }
  if (vista.tipo === 'no-se') {
    return (
      <div className="asistente-respuesta" aria-live="polite">
        <p className="asistente-preguntado">Has preguntado: «{vista.preguntado}»</p>
        <p>No tengo una respuesta para eso. Pregúntale a tu profe 🙂</p>
        <p className="asistente-subtitulo">Quizá te sirva</p>
        <Chips preguntas={vista.sugerencias} onElegir={onElegir} />
      </div>
    )
  }
  return (
    <div className="asistente-respuesta">
      <p>¿Qué quieres saber? Toca una pregunta o escribe la tuya.</p>
      <Chips preguntas={sugeridas} onElegir={onElegir} />
    </div>
  )
}

export default function PanelAsistente({
  preguntas,
  momento = 'siempre',
  preguntaInicialId,
  onCerrar,
}) {
  const todas = useMemo(() => unirConGenerales(preguntas), [preguntas])
  const sugeridas = useMemo(() => preguntasSugeridas(todas, momento), [todas, momento])
  const [vista, setVista] = useState(() => {
    const inicial = todas.find((pregunta) => pregunta.id === preguntaInicialId)
    return inicial ? { tipo: 'respuesta', pregunta: inicial } : { tipo: 'inicio' }
  })
  const [texto, setTexto] = useState('')
  const [buscando, setBuscando] = useState(false)
  const panelRef = useRef(null)
  const contenidoRef = useRef(null)
  // Si llegan desordenadas, solo cuenta la última búsqueda.
  const ultimaRef = useRef(0)

  // Lleva el foco al panel al abrirlo y lo devuelve donde estaba al cerrarlo.
  useEffect(() => {
    const anterior = document.activeElement
    panelRef.current?.focus()
    return () => anterior?.focus?.()
  }, [])

  useEffect(() => {
    contenidoRef.current?.scrollTo?.({ top: 0 })
  }, [vista])

  const elegir = (pregunta) => setVista({ tipo: 'respuesta', pregunta })

  const enviar = async (evento) => {
    evento.preventDefault()
    const preguntado = texto.trim()
    if (preguntado === '') return
    const numero = ++ultimaRef.current
    // Con el nivel 2, la primera búsqueda puede tardar unos segundos mientras carga el modelo.
    setBuscando(preguntado)
    setTexto('')
    let encontrado = { mejor: null, sugerencias: sugeridas, confianza: 0 }
    try {
      encontrado = await buscarRespuesta(preguntado, preguntas, { momento })
    } catch {
      // buscarRespuesta no debería fallar; si pasa, se sugieren preguntas del momento.
    }
    if (numero !== ultimaRef.current) return
    setBuscando(false)
    const { mejor, sugerencias: opciones, confianza } = encontrado
    if (mejor) setVista({ tipo: 'respuesta', pregunta: mejor, preguntado })
    else if (confianza >= UMBRAL_DUDAR) setVista({ tipo: 'dudas', opciones, preguntado })
    else setVista({ tipo: 'no-se', sugerencias: opciones, preguntado })
  }

  return (
    <div
      className="asistente-velo"
      onClick={(evento) => evento.target === evento.currentTarget && onCerrar?.()}
      onKeyDown={(evento) => evento.key === 'Escape' && onCerrar?.()}
    >
      <div
        ref={panelRef}
        className="asistente-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="asistente-titulo"
        tabIndex={-1}
      >
        <header className="asistente-cabecera">
          <h2 id="asistente-titulo">Pregunta a Kanga</h2>
          <button type="button" className="asistente-cerrar" onClick={onCerrar}>
            Cerrar
          </button>
        </header>

        <div ref={contenidoRef} className="asistente-contenido">
          {buscando ? (
            <div className="asistente-respuesta" aria-live="polite">
              <p className="asistente-preguntado">Has preguntado: «{buscando}»</p>
              <Cargando texto="Buscando la respuesta…" />
            </div>
          ) : (
            <Contenido vista={vista} sugeridas={sugeridas} todas={todas} onElegir={elegir} />
          )}
          {!buscando && vista.tipo !== 'inicio' && (
            <button
              type="button"
              className="asistente-enlace"
              onClick={() => setVista({ tipo: 'inicio' })}
            >
              Ver otras preguntas
            </button>
          )}
        </div>

        <form className="asistente-formulario" onSubmit={enviar}>
          <input
            className="asistente-campo"
            type="text"
            value={texto}
            onChange={(evento) => setTexto(evento.target.value)}
            // Si el nivel 2 está activado, empieza a cargar el modelo mientras el alumno escribe.
            onFocus={prepararModeloAsistente}
            placeholder="Escribe tu pregunta…"
            aria-label="Escribe tu pregunta"
            autoComplete="off"
            enterKeyHint="send"
          />
          <button
            type="submit"
            className="asistente-enviar"
            disabled={buscando || texto.trim() === ''}
          >
            {buscando ? 'Buscando…' : 'Enviar'}
          </button>
        </form>
      </div>
    </div>
  )
}
