import { useState } from 'react'
import { PanelAsistente } from '../componentes/AsistenteDiferido'
import Grafica from '../componentes/Grafica'
import Tabla from '../componentes/Tabla'
import ValorDestacado from '../componentes/ValorDestacado'

// Primero el dato, luego qué significa, y al final los números para quien quiera verlos.
export default function VistaResultado({ resultado, preguntas, momento = 'resultados' }) {
  const [preguntaId, setPreguntaId] = useState(null)
  const { valores, resumen, comparacion, explicaciones, tabla, grafica } = resultado
  const [destacado, ...resto] = valores

  return (
    <div className="core-pantalla">
      <div className="core-resultado-heroe">
        <ValorDestacado valor={destacado} grande />
      </div>
      {resto.length > 0 && (
        <div className="core-resultado-valores">
          {resto.map((valor, i) => (
            <ValorDestacado key={i} valor={valor} />
          ))}
        </div>
      )}
      <p className="core-resultado-resumen">{resumen}</p>
      {comparacion && <p className="core-resultado-comparacion">{comparacion}</p>}

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

      {grafica && (
        <div className="core-resultado-hoja">
          <Grafica grafica={grafica} />
        </div>
      )}
      {tabla && (
        <details className="core-resultado-datos">
          <summary>Ver todos los datos</summary>
          <Tabla tabla={tabla} />
        </details>
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
