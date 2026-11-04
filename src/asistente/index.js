// PROVISIONAL: lo creó el core para que la app compile. Lo sustituye su dueño.
import { createElement } from 'react'

const EnConstruccion = () => createElement('p', null, 'En construcción')

export const BotonAsistente = EnConstruccion
export const PanelAsistente = EnConstruccion
export const buscarRespuesta = async () => ({ mejor: null, sugerencias: [], confianza: 0 })
export const estadoModeloAsistente = () => 'no-descargado'
export const descargarModeloAsistente = async () => {}
