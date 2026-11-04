import { useState } from 'react'
import { PanelAsistente } from '../../asistente'
import Grafica from '../componentes/Grafica'
import Tabla from '../componentes/Tabla'
import Tarjeta from '../componentes/Tarjeta'
import ValorDestacado from '../componentes/ValorDestacado'

// Pantalla de resultados: el paso 6 del flujo y el dibujo del modo prueba.
export default function VistaResultado({ resultado, preguntas, momento = 'resultados' }) {
  const [preguntaId, setPreguntaId] = useState(null)
  const { valores, resumen, comparacion, explicaciones, tabla, grafica } = resultado
  const [destacado, ...resto] = valores

  return (
    <div className="core-pantalla">
      <ValorDestacado valor={destacado} grande />
      {resto.map((valor, i) => (
        <ValorDestacado key={i} valor={valor} />
      ))}
      <p className="core-resultado-resumen">{resumen}</p>
      {comparacion && <p className="core-resultado-resumen">{comparacion}</p>}

      {explicaciones.length > 0 && (
        <section className="core-pantalla">
          <h2>¿Por qué ha salido así?</h2>
          {explicaciones.map((explicacion, i) => (
            <div key={i} className="core-explicacion">
              <h3>{explicacion.titulo}</h3>
              <p>{explicacion.texto}</p>
              {explicacion.preguntaId && (
                <button
                  type="button"
                  className="core-enlace"
                  onClick={() => setPreguntaId(explicacion.preguntaId)}
                >
                  Saber más
                </button>
              )}
            </div>
          ))}
        </section>
      )}

      {tabla && (
        <Tarjeta>
          <Tabla tabla={tabla} />
        </Tarjeta>
      )}
      {grafica && (
        <Tarjeta>
          <Grafica grafica={grafica} />
        </Tarjeta>
      )}

      {preguntaId && (
        <PanelAsistente
          key={preguntaId}
          preguntas={preguntas}
          momento={momento}
          preguntaInicialId={preguntaId}
          onCerrar={() => setPreguntaId(null)}
        />
      )}
    </div>
  )
}
