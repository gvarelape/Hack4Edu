// Lo público del cuaderno (CONTRATO.md, punto 8).
import { createElement } from 'react'

export {
  guardarRegistro,
  obtenerRegistros,
  obtenerRegistro,
  borrarRegistro,
  cargarRegistrosEjemplo,
} from './almacen.js'

export { default as PantallaCuaderno } from './PantallaCuaderno.jsx'

// PROVISIONAL: se sustituye por PantallaFicha.jsx (prompt 4).
const EnConstruccion = () => createElement('p', null, 'En construcción')
export const PantallaFicha = EnConstruccion
