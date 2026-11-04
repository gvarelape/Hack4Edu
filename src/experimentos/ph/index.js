// PROVISIONAL: lo creó el core para que la app compile. Lo sustituye su dueño.
import { createElement } from 'react'

const EnConstruccion = () => createElement('p', null, 'En construcción')

export default {
  id: 'ph',
  titulo: 'Indicador de pH con lombarda',
  ciencia: 'Química',
  descripcion: 'Descubre qué sustancias de tu casa son ácidas',
  pregunta: '¿Qué sustancias de tu casa son ácidas y cuáles son básicas?',
  materiales: [],
  instrucciones: [],
  seguridad: [],
  reflexion: [],
  preguntas: [],
  recursos: [],
  Simulacion: EnConstruccion,
  Medicion: EnConstruccion,
}
