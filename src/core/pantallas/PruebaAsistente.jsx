import { useRef, useState } from 'react'
import * as asistente from '../../asistente'
import { experimentos } from '../../registro'
import Aviso from '../componentes/Aviso'
import Boton from '../componentes/Boton'
import Tarjeta from '../componentes/Tarjeta'
import { formatear } from '../lib/numeros'
import { navegar } from '../lib/rutas'

// PantallaPruebasBusqueda es opcional: con `import *`, si no existe no rompe la compilación.
const { buscarRespuesta, estadoModeloAsistente, PanelAsistente, PantallaPruebasBusqueda } =
  asistente

const preguntas = experimentos.flatMap((experimento) => experimento.preguntas)

export default function PruebaAsistente() {
  const [texto, setTexto] = useState('')
  const [busqueda, setBusqueda] = useState(null)
  const [error, setError] = useState(null)
  // Si llegan desordenadas, solo cuenta la última búsqueda.
  const ultimaRef = useRef(0)

  const buscar = async (evento) => {
    evento?.preventDefault()
    if (texto.trim() === '') return
    const numero = ++ultimaRef.current
    setError(null)
    try {
      const respuesta = await buscarRespuesta(texto, preguntas)
      if (numero === ultimaRef.current) setBusqueda({ texto, ...respuesta })
    } catch (fallo) {
      if (numero === ultimaRef.current) setError(fallo?.message ?? 'Error desconocido')
    }
  }

  return (
    <div className="core-pantalla">
      <h1>Prueba del asistente</h1>
      <p className="core-pantalla-nota">
        {preguntas.length} preguntas de experimentos · Modelo: {estadoModeloAsistente()}
      </p>

      <form className="core-pantalla" onSubmit={buscar}>
        <label className="core-campo">
          <span className="core-campo-etiqueta">Escribe como lo haría un alumno</span>
          <input
            className="core-campo-entrada"
            type="text"
            value={texto}
            onChange={(evento) => setTexto(evento.target.value)}
          />
        </label>
        <Boton onClick={buscar} disabled={texto.trim() === ''}>
          Buscar y ver la confianza
        </Boton>
      </form>

      {error && <Aviso tipo="error">La búsqueda ha fallado: {error}</Aviso>}
      {busqueda && (
        <Tarjeta>
          <p>
            <strong>Confianza: {formatear(busqueda.confianza, 2)}</strong> · "{busqueda.texto}"
          </p>
          <p>
            Mejor: {busqueda.mejor ? `${busqueda.mejor.id}: ${busqueda.mejor.pregunta}` : 'ninguna'}
          </p>
          <p className="core-pantalla-nota">
            Sugerencias:{' '}
            {busqueda.sugerencias.map((sugerencia) => sugerencia.id).join(', ') || 'ninguna'}
          </p>
        </Tarjeta>
      )}

      <h2>Panel del asistente</h2>
      <PanelAsistente preguntas={preguntas} momento="siempre" onCerrar={() => navegar('/')} />
      {PantallaPruebasBusqueda && <PantallaPruebasBusqueda />}

      <Boton variante="secundario" onClick={() => navegar('/')}>
        Volver al inicio
      </Boton>
    </div>
  )
}
