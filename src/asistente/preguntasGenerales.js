// Preguntas generales del asistente (ASISTENTE.md y CONTRATO.md, punto 5).
// Las escribe y revisa el equipo: el asistente nunca genera texto, solo elige entre estas.
// Obligatorias porque las usan las explicaciones: general-hipotesis-falsa, general-error-medida
// y general-repetir-medidas.

export const preguntasGenerales = [
  // --- Método científico ---
  {
    id: 'general-hipotesis',
    pregunta: '¿Qué es una hipótesis?',
    variantes: [
      'qué es una hipótesis',
      'qué tengo que poner en la hipótesis',
      'cómo se escribe una hipótesis',
      'qué significa hipótesis',
      'no sé qué poner en la hipótesis',
      'para qué sirve la hipótesis',
    ],
    respuesta:
      'Una hipótesis es lo que tú crees que va a pasar, y por qué. No hace falta acertar: es una idea que vas a poner a prueba. Por ejemplo: "Creo que la pelota irá cada vez más rápido, porque la gravedad la empuja todo el rato".',
    momento: 'antes',
    relacionadas: ['general-hipotesis-prediccion', 'general-hipotesis-falsa'],
  },
  {
    id: 'general-hipotesis-prediccion',
    pregunta: '¿En qué se diferencian una hipótesis y una predicción?',
    variantes: [
      'diferencia entre hipótesis y predicción',
      'qué es una predicción',
      'no es lo mismo hipótesis que predicción',
      'qué pongo en la predicción',
      'para qué sirve predecir',
      'en qué se parecen hipótesis y predicción',
    ],
    respuesta:
      'La hipótesis es tu idea y su porqué: "creo que más agua hará el sonido más agudo". La predicción es lo que esperas medir en concreto: "sonará a unos 600 Hz". La predicción sirve para comprobar la hipótesis con números.',
    momento: 'antes',
    relacionadas: ['general-hipotesis', 'general-variable'],
  },
  {
    id: 'general-hipotesis-falsa',
    pregunta: '¿Me equivoqué en la hipótesis?',
    variantes: [
      'mi hipótesis estaba mal',
      'no se ha cumplido lo que pensaba',
      'me he equivocado',
      'qué pasa si no acierto',
      'he fallado la predicción',
      'no ha salido lo que yo creía',
    ],
    respuesta:
      'Que tu hipótesis no se cumpla no es un fracaso: ¡es justo como avanza la ciencia! Has descubierto algo que no sabías. Piensa qué te hizo esperar otra cosa y qué ha pasado de verdad. Muchos descubrimientos famosos empezaron con una hipótesis equivocada.',
    momento: 'resultados',
    relacionadas: ['general-hipotesis', 'general-error-medida'],
  },
  {
    id: 'general-variable',
    pregunta: '¿Qué es una variable?',
    variantes: [
      'qué es una variable',
      'qué variables hay en el experimento',
      'qué cambio y qué mido',
      'qué es la variable independiente',
      'qué es la variable dependiente',
      'qué es lo que cambio en el experimento',
    ],
    respuesta:
      'Una variable es algo que puede cambiar en un experimento. Hay una que cambias tú, por ejemplo la cantidad de agua de la botella. Otra que mides, por ejemplo lo agudo que suena. Lo demás intentas dejarlo igual, para saber qué causa el cambio.',
    momento: 'antes',
    relacionadas: ['general-hipotesis-prediccion', 'general-repetir-medidas'],
  },
  {
    id: 'general-repetir-medidas',
    pregunta: '¿Por qué hay que repetir las medidas?',
    variantes: [
      'por qué tengo que medir varias veces',
      'para qué repetir el experimento',
      'con una medida no basta',
      'cuántas veces hay que medir',
      'por qué cada vez sale distinto',
      'vale con medir una sola vez',
    ],
    respuesta:
      'Cada medida tiene pequeños errores: tu mano tiembla, la luz cambia, el móvil tarda un poco más. Si mides varias veces y haces la media, esos errores se compensan y el resultado es más fiable. Los científicos nunca se fían de una sola medida.',
    momento: 'durante',
    relacionadas: ['general-error-medida', 'general-media'],
  },
  {
    id: 'general-error-medida',
    pregunta: '¿Por qué no sale exacto?',
    variantes: [
      'por qué no me sale el número exacto',
      'por qué no da lo que dice el libro',
      'qué es el error de medida',
      'por qué no sale perfecto',
      'qué significa el porcentaje de error',
      'por qué sale un poco distinto',
    ],
    respuesta:
      'Ninguna medida es perfecta, ni siquiera en un laboratorio de verdad. Influyen el móvil, la luz, el ruido o cómo colocas las cosas. El porcentaje de error te dice cuánto te has alejado del valor esperado. Si es menor del 10 %, ¡es una medida muy buena!',
    momento: 'resultados',
    relacionadas: ['general-repetir-medidas', 'general-hipotesis-falsa'],
  },
  {
    id: 'general-media',
    pregunta: '¿Qué es la media?',
    variantes: [
      'cómo se hace la media',
      'qué es el promedio',
      'para qué sirve la media',
      'cómo calculo la media',
      'qué es la media aritmética',
      'sumo y divido',
    ],
    respuesta:
      'La media es el valor "del medio" de varias medidas. Se suman todas y se divide entre cuántas hay. Por ejemplo, si mides 9, 10 y 11, la media es (9 + 10 + 11) ÷ 3 = 10. Así los errores de cada medida se compensan.',
    momento: 'siempre',
    relacionadas: ['general-repetir-medidas'],
  },
  {
    id: 'general-grafica',
    pregunta: '¿Cómo se lee la gráfica?',
    variantes: [
      'no entiendo la gráfica',
      'qué significan los puntos de la gráfica',
      'qué es la línea roja',
      'cómo leo la gráfica',
      'qué quiere decir la curva',
      'qué son los puntos negros',
    ],
    respuesta:
      'Cada punto negro es una medida tuya. La línea roja es lo que dice la teoría, la fórmula. Si tus puntos quedan cerca de la línea, tus medidas encajan con la ciencia. El eje de abajo es lo que cambias y el de la izquierda, lo que mides.',
    momento: 'resultados',
    relacionadas: ['general-error-medida', 'general-simulacion'],
  },
  {
    id: 'general-simulacion',
    pregunta: '¿Para qué sirve la simulación?',
    variantes: [
      'qué es la simulación',
      'para qué es la parte de simular',
      'me puedo saltar la simulación',
      'qué es un modelo científico',
      'para qué sirve simular antes de medir',
      'la simulación es real',
    ],
    respuesta:
      'La simulación es un experimento de mentira dentro del móvil: un modelo que sigue las leyes de la ciencia. Sirve para jugar con los valores y pensar qué pasará antes de medir de verdad. Luego comparas: ¿la realidad se parece al modelo?',
    momento: 'antes',
    relacionadas: ['general-hipotesis-prediccion', 'general-grafica'],
  },

  // --- La app ---
  {
    id: 'general-instalar',
    pregunta: '¿Cómo instalo Kanga en el móvil?',
    variantes: [
      'cómo instalo la app',
      'cómo la pongo en la pantalla de inicio',
      'se puede descargar',
      'cómo la tengo como aplicación',
      'dónde está en la play store',
      'cómo pongo kanga en el móvil',
    ],
    respuesta:
      'No hace falta tienda de aplicaciones. En Android, abre Kanga en Chrome, toca el menú ⋮ y elige "Instalar aplicación" o "Añadir a pantalla de inicio". En iPhone, ábrela en Safari, toca el botón de compartir y elige "Añadir a pantalla de inicio".',
    momento: 'siempre',
    relacionadas: ['general-sin-internet'],
  },
  {
    id: 'general-sin-internet',
    pregunta: '¿Puedo usar Kanga sin internet?',
    variantes: [
      'funciona sin internet',
      'funciona sin wifi',
      'se puede usar sin datos',
      'qué pasa si no tengo conexión',
      'funciona en modo avión',
      'necesito datos para usarla',
    ],
    respuesta:
      'Sí. La primera vez, con wifi, entra en Ajustes y toca "Preparar para usar sin internet". A partir de ahí, Kanga funciona sin conexión, incluso en modo avión. Tus experimentos se guardan en tu móvil.',
    momento: 'siempre',
    relacionadas: ['general-instalar', 'general-donde-guarda'],
  },
  {
    id: 'general-donde-guarda',
    pregunta: '¿Dónde se guardan mis experimentos?',
    variantes: [
      'dónde están mis experimentos',
      'se guarda lo que hago',
      'dónde veo lo que he hecho',
      'cómo veo mis resultados otra vez',
      'dónde está mi cuaderno',
      'se borran mis experimentos al cerrar',
    ],
    respuesta:
      'Se guardan en "Mi cuaderno", dentro de tu móvil. Desde el inicio, toca el cuaderno y verás todos tus experimentos, del más nuevo al más antiguo. Si borras los datos del navegador, se borran también.',
    momento: 'siempre',
    relacionadas: ['general-mandar-profe', 'general-privacidad'],
  },
  {
    id: 'general-mandar-profe',
    pregunta: '¿Cómo le mando mi experimento a mi profe?',
    variantes: [
      'cómo se lo envío al profesor',
      'cómo comparto el experimento',
      'cómo lo mando por whatsapp',
      'cómo entrego el trabajo',
      'puedo enviarlo por correo',
      'cómo le enseño los resultados a mi profe',
    ],
    respuesta:
      'Abre el experimento en "Mi cuaderno" y toca "Compartir con mi profe". Kanga crea una imagen con tus resultados y puedes mandarla por WhatsApp, correo o lo que uses con tu profe. Antes te preguntará tu nombre, si quieres ponerlo.',
    momento: 'resultados',
    relacionadas: ['general-donde-guarda', 'general-privacidad'],
  },
  {
    id: 'general-privacidad',
    pregunta: '¿Quién ve mis datos?',
    variantes: [
      'alguien ve lo que hago',
      'se suben mis datos a internet',
      'es privado',
      'guardan mis fotos o mi voz',
      'la app me graba',
      'quién puede ver mis experimentos',
    ],
    respuesta:
      'Nadie. Tus experimentos se quedan en tu móvil y no se envían a ningún sitio. Kanga no guarda fotos, vídeos ni audio: solo los números y textos de tus resultados. Solo los ve otra persona si tú decides compartirlos.',
    momento: 'siempre',
    relacionadas: ['general-donde-guarda', 'general-mandar-profe'],
  },

  // --- Problemas ---
  {
    id: 'general-camara',
    pregunta: 'No funciona la cámara, ¿qué hago?',
    variantes: [
      'no se abre la cámara',
      'la cámara sale en negro',
      'no me deja usar la cámara',
      'la cámara no va',
      'me pide permiso de cámara',
      'no puedo grabar la pelota',
    ],
    respuesta:
      'Revisa que le has dado permiso. En Android: toca el candado junto a la dirección y activa "Cámara". En iPhone: Ajustes, Safari, Cámara, "Permitir". Cierra otras apps que usen la cámara y vuelve a intentarlo. Si sigue sin ir, pide ayuda a tu profe.',
    momento: 'durante',
    relacionadas: ['general-microfono', 'general-lenta'],
  },
  {
    id: 'general-microfono',
    pregunta: 'No funciona el micrófono, ¿qué hago?',
    variantes: [
      'no me oye',
      'el micrófono no va',
      'no detecta el sonido',
      'me pide permiso de micrófono',
      'no capta nada cuando soplo',
      'no me detecta el soplido',
    ],
    respuesta:
      'Revisa que le has dado permiso. En Android: toca el candado junto a la dirección y activa "Micrófono". En iPhone: Ajustes, Safari, Micrófono, "Permitir". Busca un sitio con poco ruido y acerca el móvil, sin taparlo con la mano.',
    momento: 'durante',
    relacionadas: ['general-camara', 'general-lenta'],
  },
  {
    id: 'general-lenta',
    pregunta: 'La app va lenta, ¿qué hago?',
    variantes: [
      'va muy lento',
      'se queda colgada',
      'se traba',
      'tarda mucho en cargar',
      'se congela la pantalla',
      'la app no responde',
    ],
    respuesta:
      'Cierra las otras apps que tengas abiertas y vuelve a abrir Kanga. En Ajustes puedes poner las animaciones en "Reducido", que gasta menos. Si se ha quedado parada, recarga la página: lo que tienes guardado en el cuaderno no se pierde.',
    momento: 'siempre',
    relacionadas: ['general-camara', 'general-microfono'],
  },
  {
    id: 'general-borrado',
    pregunta: 'He borrado un experimento sin querer, ¿puedo recuperarlo?',
    variantes: [
      'he borrado un experimento',
      'cómo recupero un experimento borrado',
      'se me ha borrado todo',
      'he perdido mis resultados',
      'se puede deshacer el borrado',
      'puedo recuperar un experimento',
    ],
    respuesta:
      'Lo sentimos: un experimento borrado no se puede recuperar, porque solo estaba en tu móvil. Por eso Kanga te pregunta antes de borrar. La buena noticia es que puedes repetirlo, ¡y repetir un experimento también es hacer ciencia!',
    momento: 'siempre',
    relacionadas: ['general-donde-guarda', 'general-repetir-medidas'],
  },

  // --- Fuera de tema ---
  {
    id: 'general-que-es-kanga',
    pregunta: '¿Qué es Kanga?',
    variantes: [
      'qué es esta app',
      'para qué sirve esta aplicación',
      'quién eres',
      'qué puedo hacer aquí',
      'para qué sirve kanga',
      'qué se puede hacer con kanga',
    ],
    respuesta:
      'Kanga es tu laboratorio de bolsillo: haces experimentos de ciencias con la cámara y el micrófono del móvil, sin laboratorio. Yo respondo preguntas sobre los experimentos y la app. Mis respuestas las ha escrito y revisado el equipo de Kanga.',
    momento: 'siempre',
    relacionadas: ['general-sin-internet', 'general-otros-temas'],
  },
  {
    id: 'general-otros-temas',
    pregunta: '¿Me ayudas con otra cosa?',
    variantes: [
      'me ayudas con los deberes de mates',
      'cuéntame un chiste',
      'quién ganó el partido',
      'hazme el trabajo',
      'qué tiempo hace',
      'me ayudas con historia',
    ],
    respuesta:
      'Solo sé de los experimentos de Kanga y de cómo usar la app. Para otras dudas, tu profe es la mejor ayuda. ¿Quieres preguntarme algo sobre tu experimento?',
    momento: 'siempre',
    relacionadas: ['general-que-es-kanga'],
  },
  {
    id: 'general-ayuda-personal',
    pregunta: 'Me pasa algo y necesito ayuda',
    variantes: [
      'estoy triste',
      'tengo un problema',
      'me molestan en clase',
      'no me encuentro bien',
      'necesito hablar con alguien',
      'me encuentro mal',
    ],
    respuesta:
      'Siento que estés así. Yo solo sé de ciencia, pero no tienes que pasarlo solo. Habla con tu profe, con tu familia o con un adulto de confianza: te escucharán y te ayudarán.',
    momento: 'siempre',
    relacionadas: [],
  },

  // --- La app (añadidas con el rediseño y los idiomas) ---
  {
    id: 'general-como-empezar',
    pregunta: '¿Cómo se hace un experimento en Kanga?',
    variantes: [
      'por dónde empiezo',
      'cómo funciona kanga',
      'qué pasos tiene un experimento',
      'cómo se usa la app',
      'qué tengo que hacer primero',
    ],
    respuesta:
      'En el inicio, elige un experimento y toca "Empezar". Kanga te guía paso a paso: primero escribes tu hipótesis, luego puedes probar una simulación, montas el experimento y mides con la cámara o el micrófono. Al final ves los resultados, respondes unas preguntas para pensar y se guarda en tu cuaderno.',
    momento: 'siempre',
    relacionadas: ['general-hipotesis', 'general-donde-guarda'],
  },
  {
    id: 'general-idioma',
    pregunta: '¿Cómo cambio el idioma de Kanga?',
    variantes: [
      'cómo pongo la app en inglés',
      'cambiar el idioma',
      'se puede poner en francés',
      'en qué idiomas está kanga',
    ],
    respuesta:
      'Entra en Ajustes, con la rueda de arriba a la derecha del inicio, y elige el idioma en "Idioma de la app". Kanga está en español, inglés y francés. Lo que tú escribes, como tu hipótesis, se queda tal cual lo escribiste.',
    momento: 'siempre',
    relacionadas: ['general-instalar'],
  },
  {
    id: 'general-busqueda-inteligente',
    pregunta: '¿Qué es la búsqueda inteligente?',
    variantes: [
      'cómo activo la búsqueda inteligente',
      'para qué sirve la búsqueda inteligente',
      'por qué no me entiendes',
    ],
    respuesta:
      'Es una ayuda opcional para que entienda mejor tus preguntas aunque uses otras palabras. Se activa en Ajustes, en "Pregunta a Kanga", y se descarga una sola vez, mejor con wifi. Funciona dentro de tu móvil, sin internet. Si tu móvil tiene poca memoria, no aparece, y te sigo respondiendo igual.',
    momento: 'siempre',
    relacionadas: ['general-sin-internet', 'general-privacidad'],
  },
  {
    id: 'general-unidades',
    pregunta: '¿Por qué hay que poner las unidades?',
    variantes: [
      'qué son las unidades',
      'qué significa m/s',
      'qué es un hercio',
      'para qué sirven los cm y los segundos',
    ],
    respuesta:
      'Un número solo no dice nada: "9,8" puede ser casi cualquier cosa. La unidad dice qué estás midiendo. Por ejemplo, m/s² es aceleración (cuánto aumenta la velocidad cada segundo), m/s es velocidad y Hz (hercios) son las veces que algo vibra en un segundo. Por eso Kanga escribe siempre la unidad al lado del número.',
    momento: 'resultados',
    relacionadas: ['general-error-medida', 'general-grafica'],
  },
]
