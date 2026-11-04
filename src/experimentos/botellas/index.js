// PROVISIONAL: lo creó el core para que la app compile. Lo sustituye su dueño.
import { createElement, lazy } from 'react'

const Medicion = lazy(() => import('./Medicion'))

const EnConstruccion = () => createElement('p', null, 'En construcción')

export default {
  id: 'botellas',
  titulo: 'La música de las botellas',
  ciencia: 'Sonido',
  descripcion: 'Mide la velocidad del sonido soplando una botella',
  pregunta: '¿Cómo cambia el sonido de una botella al llenarla de agua?',
  materiales: [],
  instrucciones: [],
  seguridad: [],
  reflexion: [],
  preguntas: [],
  recursos: [],
  Simulacion: EnConstruccion,
  Medicion,
}
