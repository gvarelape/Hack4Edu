// PROVISIONAL: faltan los textos.
import { lazy } from 'react'
import { preguntas } from './preguntas.js'

const Simulacion = lazy(() => import('./Simulacion'))
const Medicion = lazy(() => import('./Medicion'))

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
  preguntas,
  recursos: [],
  Simulacion,
  Medicion,
}
