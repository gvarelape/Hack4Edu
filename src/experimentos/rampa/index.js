// PROVISIONAL: faltan las preguntas y la simulación (prompts 7 y 8 de RAMPA.md).
import { createElement, lazy } from 'react'
import { RECURSOS_DETECTOR } from './recursosDetector.js'

const Medicion = lazy(() => import('./Medicion'))

const EnConstruccion = () => createElement('p', null, 'En construcción')

export default {
  id: 'rampa',
  titulo: 'Pelota en una rampa',
  ciencia: 'Física',
  descripcion: 'Mide la gravedad con una pelota y un libro',
  pregunta: '¿Cómo cambia la velocidad de una pelota mientras baja por una rampa?',
  materiales: [
    'Una pelota de color llamativo (mejor maciza: de goma o una canica grande).',
    'Una tabla o un libro grande para hacer la rampa.',
    'Una regla o cinta métrica.',
    'Cinta adhesiva de un color distinto al de la pelota, para marcar dos puntos.',
    'Algo que haga de tope al final de la rampa, como un libro.',
    'Algo para apoyar el móvil.',
  ],
  instrucciones: [
    'Haz una rampa poco inclinada, más o menos un palmo de altura en un metro de largo.',
    'Mide la altura y el largo de la rampa.',
    'Pega dos trozos de cinta en la rampa a una distancia que conozcas, por ejemplo 30 cm.',
    'Pon el tope justo al final de la rampa, para que la pelota se pare al llegar abajo.',
    'Apoya el móvil de lado, a 1 o 2 metros, de forma que se vea la rampa entera.',
    'Busca un fondo liso y buena luz.',
  ],
  seguridad: [],
  reflexion: [
    '¿La pelota recorre la misma distancia en cada segundo? ¿Qué te dice la forma de la gráfica?',
    '¿Te sale una gravedad menor que 9,8 si no tienes en cuenta que la bola rueda? ¿Por qué rodar "roba" aceleración?',
    '¿Qué crees que pasaría con más inclinación o con una pelota hueca?',
  ],
  preguntas: [],
  recursos: RECURSOS_DETECTOR,
  Simulacion: EnConstruccion,
  Medicion,
}
