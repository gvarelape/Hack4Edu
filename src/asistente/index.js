// Lo público del asistente (CONTRATO.md, punto 9).
import { createElement } from 'react'

export { estadoModeloAsistente, descargarModeloAsistente } from './busqueda/busquedaSignificado.js'

// PROVISIONAL: se sustituyen por BotonAsistente.jsx, PanelAsistente.jsx y buscarRespuesta.js.
const EnConstruccion = () => createElement('p', null, 'En construcción')

export const BotonAsistente = EnConstruccion
export const PanelAsistente = EnConstruccion
export const buscarRespuesta = async () => ({ mejor: null, sugerencias: [], confianza: 0 })
