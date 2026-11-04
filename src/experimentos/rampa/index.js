// PROVISIONAL: lo creó el core para que la app compile. Lo sustituye su dueño.
import { createElement } from 'react'
import Medicion from './Medicion'

const EnConstruccion = () => createElement('p', null, 'En construcción')

export default {
  id: 'rampa',
  titulo: 'Pelota en una rampa',
  ciencia: 'Física',
  descripcion: 'Mide la gravedad con una pelota y un libro',
  pregunta: '¿Cómo cambia la velocidad de una pelota mientras baja por una rampa?',
  materiales: [],
  instrucciones: [],
  seguridad: [],
  reflexion: [],
  preguntas: [],
  recursos: [],
  Simulacion: EnConstruccion,
  Medicion,
}
