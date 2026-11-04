import { claveCiencia } from '../lib/ciencias'

// Un sello de tinta en el color de la ciencia.
export default function EtiquetaCiencia({ ciencia }) {
  return (
    <span className={`core-etiqueta-ciencia core-ciencia-${claveCiencia(ciencia)}`}>{ciencia}</span>
  )
}
