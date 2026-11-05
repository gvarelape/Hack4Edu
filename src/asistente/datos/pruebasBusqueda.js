// Banco de pruebas de la búsqueda (ASISTENTE.md): preguntas escritas como las haría un alumno,
// con el id de la respuesta correcta, o null si lo correcto es "no lo sé, pregúntale a tu profe".
// Están escritas sin mirar las variantes del banco, con faltas y sin tildes, como en la realidad.
// PENDIENTE: sumar preguntas de hermanos, primos o amigos, que se parecen más a las reales.

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

  // --- Rampa ---
  { texto: 'que es la gravedad', esperado: 'rampa-gravedad' },
  { texto: 'xq la pelota va cada vez mas rapido', esperado: 'rampa-aceleracion' },
  { texto: 'por que la grafica sale curva y no recta', esperado: 'rampa-grafica-curva' },
  { texto: 'una pelota que pesa mas cae antes?', esperado: 'rampa-galileo' },
  { texto: 'en la luna caeria igual', esperado: 'rampa-otros-planetas' },
  { texto: 'que pelota es mejor para la rampa', esperado: 'rampa-que-pelota' },
  { texto: 'donde coloco el movil para grabar', esperado: 'rampa-donde-movil' },
  { texto: 'no me encuentra la bola', esperado: 'rampa-no-encuentra' },
  { texto: 'por que me da 6 y no 9,8', esperado: 'rampa-error-grande' },
  { texto: 'la pelota se sale por un lado', esperado: 'rampa-se-desvia' },
  { texto: 'como sabe el movil donde esta la pelota', esperado: 'rampa-como-sigue' },
  { texto: 'que es el rozamiento', esperado: 'rampa-rozamiento' },

  // --- Botellas ---
  { texto: 'que es el sonido', esperado: 'botellas-que-es-sonido' },
  { texto: 'que son los hz', esperado: 'botellas-hercio' },
  { texto: 'cual es la diferencia entre grave y agudo', esperado: 'botellas-grave-agudo' },
  { texto: 'por que pita la botella cuando soplo', esperado: 'botellas-por-que-suena' },
  { texto: 'que botella cojo', esperado: 'botellas-que-botella' },
  { texto: 'como tengo que soplar para que suene', esperado: 'botellas-como-soplar' },
  { texto: 'hay mucho ruido en la clase', esperado: 'botellas-ruido' },
  { texto: 'el sonido viaja por el espacio', esperado: 'botellas-agua-vacio' },
  { texto: 'por que con helio la voz sale rara', esperado: 'botellas-helio' },
  { texto: 'que sonidos puede oir una persona', esperado: 'botellas-oido' },
  { texto: 'a que velocidad va el sonido', esperado: 'botellas-velocidad-sonido' },
  { texto: 'y si le doy golpes a la botella con una cuchara', esperado: 'botellas-golpear' },

  // --- Generales añadidas con la app nueva ---
  { texto: 'como empiezo un experimento', esperado: 'general-como-empezar' },
  { texto: 'quiero la app en ingles', esperado: 'general-idioma' },
  { texto: 'como se activa la busqueda inteligente', esperado: 'general-busqueda-inteligente' },
  { texto: 'que significa m/s²', esperado: 'rampa-aceleracion' },
  { texto: 'tengo que escribir siempre las unidades?', esperado: 'general-unidades' },

  // --- Más que no debería responder ---
  { texto: 'cual es la capital de francia', esperado: null },
  { texto: 'como se hace una tortilla', esperado: null },
]
