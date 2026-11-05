import { claveCiencia } from '../lib/ciencias'

export default function EtiquetaCiencia({ ciencia }) {
  return (
    <span className={`core-etiqueta-ciencia core-ciencia-${claveCiencia(ciencia)}`}>{ciencia}</span>
  )
}
