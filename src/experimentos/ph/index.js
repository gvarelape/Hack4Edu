import { createElement, lazy } from 'react'
import { preguntas } from './preguntas.js'

// Las pantallas se cargan solo al abrir el experimento, para que la app inicial pese menos.
const Simulacion = lazy(() => import('./Simulacion.jsx'))

// PROVISIONAL: hasta que exista Medicion.jsx; entonces será lazy(() => import('./Medicion.jsx')).
const Medicion = () => createElement('p', null, 'En construcción')

export default {
  id: 'ph',
  titulo: 'Indicador de pH con lombarda',
  ciencia: 'Química',
  descripcion: 'Descubre qué sustancias de tu casa son ácidas',
  pregunta: '¿Qué sustancias de tu casa son ácidas y cuáles son básicas?',
  materiales: [
    'Agua de haber cocido lombarda (morada).',
    'Vasos transparentes.',
    'Vinagre, limón, agua, bicarbonato, jabón de manos…',
    'Un folio blanco.',
  ],
  instrucciones: [
    'Echa un poco de agua de lombarda en cada vaso.',
    'Añade a cada vaso una sustancia distinta y remueve.',
    'Pon el folio blanco detrás del vaso y busca una zona con buena luz.',
    'Apunta la cámara para que el recuadro quede dentro del líquido.',
  ],
  seguridad: [
    'No uses lejía, amoniaco ni desatascadores.',
    'No mezcles productos de limpieza.',
    'No bebas las mezclas.',
  ],
  reflexion: [
    '¿Se cumplió tu hipótesis? ¿Qué sustancia te sorprendió más?',
    '¿Qué tienen en común las sustancias ácidas?',
    '¿Por qué crees que el color no es exactamente igual en todas las fotos?',
  ],
  preguntas,
  recursos: [],
  Simulacion,
  Medicion,
}
