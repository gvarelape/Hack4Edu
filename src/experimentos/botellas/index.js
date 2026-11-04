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
  materiales: [
    'Una botella, mejor de vidrio y lo más recta posible.',
    'Agua.',
    'Una regla.',
    'Un sitio sin mucho ruido.',
  ],
  instrucciones: [
    'Echa algo de agua en la botella.',
    'Mide con la regla la altura del aire: desde la superficie del agua hasta la boca de la botella.',
    'Sopla por encima de la boca, de lado, hasta que suene un tono continuo.',
    'Repite con al menos 4 niveles de agua distintos.',
  ],
  seguridad: [],
  reflexion: [
    '¿Con más aire el sonido es más grave o más agudo? ¿Se cumplió tu hipótesis?',
    '¿Por qué crees que la velocidad del sonido que has medido no da exactamente 343 m/s?',
    'Si en vez de soplar golpeas la botella con una cuchara, ¿qué crees que pasará al añadir agua?',
  ],
  preguntas,
  recursos: [],
  Simulacion,
  Medicion,
}
