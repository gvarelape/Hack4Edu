import { formatear } from '../../core'
import { colorPorPh, posicionEnEscala } from './vasoVirtual.js'

const CASILLAS = Array.from({ length: 14 }, (_, i) => i + 1)

// Escala de pH del 1 al 14 con los colores de la lombarda y una flecha en el pH actual.
export default function EscalaPh({ ph }) {
  return (
    <div className="ph-escala" role="img" aria-label={`Escala de pH. Ahora: ${formatear(ph, 1)}`}>
      <div className="ph-escala-flechas">
        {ph !== null && (
          <span className="ph-escala-flecha" style={{ left: `${posicionEnEscala(ph)}%` }}>
            ▼
          </span>
        )}
      </div>
      <div className="ph-escala-casillas">
        {CASILLAS.map((n) => (
          <span key={n} className="ph-escala-casilla" style={{ backgroundColor: colorPorPh(n) }} />
        ))}
      </div>
      <div className="ph-escala-numeros" aria-hidden="true">
        {CASILLAS.map((n) => (
          <span key={n}>{n}</span>
        ))}
      </div>
      <div className="ph-escala-leyenda" aria-hidden="true">
        <span>Ácido</span>
        <span>Neutro</span>
        <span>Básico</span>
      </div>
    </div>
  )
}
