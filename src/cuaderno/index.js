// Lo público del cuaderno (CONTRATO.md, punto 8).
export {
  guardarRegistro,
  obtenerRegistros,
  obtenerRegistro,
  borrarRegistro,
  cargarRegistrosEjemplo,
  esAlmacenTemporal,
} from './almacen.js'

export { default as PantallaCuaderno } from './PantallaCuaderno.jsx'
export { default as PantallaFicha } from './PantallaFicha.jsx'
