// Banco de pruebas de la búsqueda (ASISTENTE.md): preguntas escritas como las haría un alumno,
// con el id de la respuesta correcta, o null si lo correcto es "no lo sé, pregúntale a tu profe".
// Están escritas sin mirar las variantes del banco, con faltas y sin tildes, como en la realidad.
// PENDIENTE: llegar a 60 con preguntas de hermanos, primos o amigos, y añadir rampa y botellas
// cuando tengan su banco de preguntas.

export const pruebasBusqueda = [
  // --- pH ---
  { texto: 'que es eso del ph', esperado: 'ph-que-es' },
  { texto: 'para q sirve medir el ph', esperado: 'ph-que-es' },
  { texto: 'xq el limon es acido', esperado: 'ph-acido' },
  { texto: 'que es una sustancia basica', esperado: 'ph-base' },
  { texto: 'que es un indicador de ph', esperado: 'ph-indicador' },
  { texto: 'por que la col morada cambia de color', esperado: 'ph-lombarda-color' },
  { texto: 'como preparo el agua de lombarda', esperado: 'ph-preparar-lombarda' },
  { texto: 'cuanto tiempo aguanta el agua de lombarda en la nevera', esperado: 'ph-cuanto-dura' },
  { texto: 'cuanto vinagre echo en el vaso', esperado: 'ph-cantidad' },
  { texto: 'para que pongo un papel blanco detras', esperado: 'ph-folio-blanco' },
  { texto: 'el numero del ph no para de cambiar', esperado: 'ph-salta' },
  { texto: 'por que el agua del grifo no me da 7', esperado: 'ph-agua-no-neutra' },
  { texto: 'el vinagre y el limon me salen casi igual', esperado: 'ph-color-engana' },
  { texto: 'como hago para que mida mejor', esperado: 'ph-calibrar' },
  { texto: 'puedo probar con lejia', esperado: 'ph-lejia' },
  { texto: 'me ha caido vinagre en el ojo', esperado: 'ph-salpica' },
  { texto: 'la coca cola es acida?', esperado: 'ph-refrescos' },
  { texto: 'que pasa si junto vinagre y bicarbonato', esperado: 'ph-neutralizacion' },
  { texto: 'hay mas plantas que cambien de color', esperado: 'ph-otros-indicadores' },
  { texto: 'con la luz de la clase sale otro ph', esperado: 'ph-otra-luz' },

  // --- Generales ---
  { texto: 'q pongo en la hipotesis', esperado: 'general-hipotesis' },
  { texto: 'hipotesis y prediccion es lo mismo?', esperado: 'general-hipotesis-prediccion' },
  { texto: 'no me ha salido lo que dije al principio', esperado: 'general-hipotesis-falsa' },
  { texto: 'por que tengo que medirlo tantas veces', esperado: 'general-repetir-medidas' },
  { texto: 'por que no sale el resultado exacto', esperado: 'general-error-medida' },
  { texto: 'como se calcula el promedio', esperado: 'general-media' },
  { texto: 'que es la raya roja de la grafica', esperado: 'general-grafica' },
  { texto: 'como me descargo kanga', esperado: 'general-instalar' },
  { texto: 'se puede usar en el pueblo sin cobertura', esperado: 'general-sin-internet' },
  { texto: 'donde estan los experimentos que hice ayer', esperado: 'general-donde-guarda' },
  { texto: 'como le paso los resultados a la profesora', esperado: 'general-mandar-profe' },
  { texto: 'alguien puede ver mis resultados', esperado: 'general-privacidad' },
  { texto: 'la camara se ve negra', esperado: 'general-camara' },
  { texto: 'el micro no me pilla', esperado: 'general-microfono' },
  { texto: 'la app se queda pillada', esperado: 'general-lenta' },
  { texto: 'borre mi experimento sin querer', esperado: 'general-borrado' },
  { texto: 'me haces los deberes de lengua', esperado: 'general-otros-temas' },
  { texto: 'me siento solo en el insti', esperado: 'general-ayuda-personal' },

  // --- No debería responder: no hay respuesta en el banco ---
  { texto: 'por que el cielo es azul', esperado: null },
  { texto: 'cuantos planetas hay', esperado: null },
  { texto: 'quien invento la bombilla', esperado: null },
  { texto: 'asdfgh', esperado: null },
]
