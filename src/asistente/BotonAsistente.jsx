// Botón flotante "Pregunta a Kanga". Al pulsarlo abre el panel.
import { useState } from 'react'
import PanelAsistente from './PanelAsistente.jsx'
import './asistente.css'

export default function BotonAsistente({ preguntas, momento = 'siempre' }) {
  const [abierto, setAbierto] = useState(false)

  if (abierto) {
    return (
      <PanelAsistente preguntas={preguntas} momento={momento} onCerrar={() => setAbierto(false)} />
    )
  }
  return (
    <button type="button" className="asistente-boton" onClick={() => setAbierto(true)}>
      Pregunta a Kanga
    </button>
  )
}
