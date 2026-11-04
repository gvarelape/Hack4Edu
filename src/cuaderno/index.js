// Lo público del cuaderno (CONTRATO.md, punto 8).
import { createElement } from 'react'

export {
  guardarRegistro,
  obtenerRegistros,
  obtenerRegistro,
  borrarRegistro,
  cargarRegistrosEjemplo,
} from './almacen.js'

// PROVISIONAL: se sustituyen por PantallaCuaderno.jsx y PantallaFicha.jsx (prompts 3 y 4).
const EnConstruccion = () => createElement('p', null, 'En construcción')
export const PantallaCuaderno = EnConstruccion
export const PantallaFicha = EnConstruccion
