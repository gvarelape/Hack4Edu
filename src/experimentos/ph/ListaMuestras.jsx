import { MuestraColor, formatear } from '../../core'
import { tipoPh } from './estimarPh.js'

export default function ListaMuestras({ muestras, onBorrar }) {
  if (muestras.length === 0) {
    return <p className="ph-nota">Todavía no has guardado ninguna muestra.</p>
  }

  return (
    <ul className="ph-muestras">
      {muestras.map((m) => (
        <li key={m.id} className="ph-muestra">
          <MuestraColor color={`rgb(${m.r}, ${m.g}, ${m.b})`} />
          <span className="ph-muestra-texto">
            <strong>{m.sustancia}</strong>
            <span className="ph-muestra-dato">
              pH {formatear(m.ph, 1)} · {tipoPh(m.ph)}
            </span>
          </span>
          <button
            type="button"
            className="ph-boton-icono"
            onClick={() => onBorrar(m.id)}
            aria-label={`Borrar ${m.sustancia}`}
          >
            ✕
          </button>
        </li>
      ))}
    </ul>
  )
}
