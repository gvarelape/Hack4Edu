// Banco de preguntas del asistente para el experimento de pH (CONTRATO.md, punto 5).
// Las respuestas las revisa el equipo: el asistente nunca genera texto.

export const preguntas = [
  // --- Ciencia ---
  {
    id: 'ph-que-es',
    pregunta: '¿Qué es el pH?',
    variantes: ['qué es el ph', 'qué significa ph', 'para qué sirve el ph', 'qué mide el ph', 'el ph qué es'],
    respuesta:
      'El pH es un número que dice lo ácida o lo básica que es una sustancia. La escala va del 0 al 14: por debajo de 7 es ácida, el 7 es neutro y por encima de 7 es básica. Cada número que bajas es 10 veces más ácido: un pH 3 es diez veces más ácido que un pH 4.',
    momento: 'siempre',
    relacionadas: ['ph-acido', 'ph-base']
  },
  {
    id: 'ph-acido',
    pregunta: '¿Qué hace que algo sea ácido?',
    variantes: ['qué es un ácido', 'por qué el limón es ácido', 'qué tienen los ácidos', 'por qué algo es ácido', 'qué hace ácido al vinagre'],
    respuesta:
      'Un ácido es una sustancia que, al mezclarse con agua, suelta unas partículas diminutas llamadas iones de hidrógeno. Cuantas más suelta, más bajo es su pH. Muchos ácidos saben agrios, como el limón o el vinagre, ¡pero nunca pruebes sustancias para saber si son ácidas!',
    momento: 'siempre',
    relacionadas: ['ph-base', 'ph-neutralizacion']
  },
  {
    id: 'ph-base',
    pregunta: '¿Qué es una base?',
    variantes: ['qué es una base', 'qué significa básico', 'qué es algo alcalino', 'por qué el jabón es básico', 'qué es lo contrario de ácido'],
    respuesta:
      'Una base es lo contrario de un ácido: en el agua atrapa los iones de hidrógeno en lugar de soltarlos. Por eso tiene un pH mayor que 7. También se llaman sustancias alcalinas. El bicarbonato, el jabón y muchos productos de limpieza son básicos.',
    momento: 'siempre',
    relacionadas: ['ph-acido', 'ph-neutralizacion']
  },
  {
    id: 'ph-indicador',
    pregunta: '¿Qué es un indicador?',
    variantes: ['qué es un indicador', 'qué es un indicador de ph', 'para qué sirve la lombarda', 'cómo sabe la lombarda el ph'],
    respuesta:
      'Un indicador es una sustancia que cambia de color según el pH. Así podemos "ver" si algo es ácido o básico sin aparatos. El agua de lombarda es un indicador natural: se pone roja con los ácidos y verde con las bases.',
    momento: 'antes',
    relacionadas: ['ph-antocianinas', 'ph-otros-indicadores']
  },
  {
    id: 'ph-antocianinas',
    pregunta: '¿Qué son las antocianinas?',
    variantes: ['qué son las antocianinas', 'qué tiene la lombarda dentro', 'qué pigmento tiene la lombarda', 'por qué la lombarda es morada'],
    respuesta:
      'Las antocianinas son los pigmentos que dan el color morado a la lombarda. También están en los arándanos, las moras, las uvas negras y muchos pétalos de flores. Son las responsables de que el agua de lombarda cambie de color.',
    momento: 'antes',
    relacionadas: ['ph-lombarda-color', 'ph-otros-indicadores']
  },
  {
    id: 'ph-lombarda-color',
    pregunta: '¿Por qué la lombarda cambia de color?',
    variantes: ['por qué cambia de color', 'por qué se pone roja', 'por qué se pone verde', 'cómo cambia de color la lombarda', 'por qué el vinagre la pone rosa'],
    respuesta:
      'Las antocianinas cambian un poco su forma según cuántos iones de hidrógeno haya a su alrededor. Con cada forma absorben la luz de una manera distinta, así que las vemos de otro color. En ácido se ven rojas o rosas, en neutro moradas y en básico azules, verdes y hasta amarillas.',
    momento: 'durante',
    relacionadas: ['ph-antocianinas', 'ph-indicador']
  },
  {
    id: 'ph-cuerpo-cocina',
    pregunta: '¿Dónde hay ácidos y bases en mi casa y en mi cuerpo?',
    variantes: ['qué cosas son ácidas en casa', 'hay ácidos en el cuerpo', 'el estómago es ácido', 'qué comidas son ácidas', 'ejemplos de bases'],
    respuesta:
      'En la cocina son ácidos el limón, el vinagre, el tomate y el yogur. Son básicos el bicarbonato y la clara de huevo. En tu cuerpo, el estómago tiene un jugo muy ácido (pH entre 1 y 3) que ayuda a deshacer la comida. La sangre, en cambio, es un poco básica: su pH está siempre cerca de 7,4.',
    momento: 'siempre',
    relacionadas: ['ph-piel', 'ph-refrescos']
  },
  {
    id: 'ph-neutralizacion',
    pregunta: '¿Qué pasa si mezclo un ácido y una base?',
    variantes: ['qué pasa si mezclo vinagre y bicarbonato', 'por qué salen burbujas', 'qué es neutralizar', 'se anulan el ácido y la base', 'mezclar ácido con base'],
    respuesta:
      'El ácido y la base reaccionan y se "compensan": a esto se le llama neutralización. El resultado se acerca a pH 7. Si mezclas vinagre y bicarbonato, además salen burbujas, porque se forma un gas, el dióxido de carbono. Puedes verlo en el vaso de lombarda: el color vuelve hacia el morado.',
    momento: 'siempre',
    relacionadas: ['ph-acido', 'ph-base']
  },
  {
    id: 'ph-agua-neutra',
    pregunta: '¿Por qué el agua es neutra?',
    variantes: ['por qué el agua tiene ph 7', 'el agua es ácida o básica', 'por qué el agua es neutra', 'qué ph tiene el agua'],
    respuesta:
      'En el agua pura hay exactamente las mismas partículas ácidas que básicas, así que se equilibran y su pH es 7. Por eso se dice que es neutra. El agua que bebemos no es del todo pura, y por eso su pH puede ser algo distinto.',
    momento: 'antes',
    relacionadas: ['ph-agua-no-neutra']
  },

  // --- Montaje ---
  {
    id: 'ph-preparar-lombarda',
    pregunta: '¿Cómo se hace el agua de lombarda?',
    variantes: ['cómo hago el agua de lombarda', 'cómo se prepara la lombarda', 'receta agua de lombarda', 'cuánto tiempo hiervo la lombarda', 'cómo saco el color de la lombarda'],
    respuesta:
      'Trocea media lombarda, ponla en una olla con agua y hiérvela unos 15 minutos. Luego cuela el agua y deja que se enfríe: tiene que quedar de color morado oscuro. Hazlo siempre con un adulto, porque hay que usar el fuego y el agua quema.',
    momento: 'antes',
    relacionadas: ['ph-cuanto-dura', 'ph-cantidad']
  },
  {
    id: 'ph-cuanto-dura',
    pregunta: '¿Cuánto dura el agua de lombarda?',
    variantes: ['cuánto dura el agua de lombarda', 'se pone mala la lombarda', 'puedo guardar el agua de lombarda', 'sirve la lombarda de ayer'],
    respuesta:
      'Guardada en la nevera en un bote cerrado aguanta varios días. Si huele mal o ha cambiado de color sin echarle nada, tírala y prepara otra. También puedes congelarla en una cubitera y descongelar solo los cubitos que necesites.',
    momento: 'antes',
    relacionadas: ['ph-preparar-lombarda']
  },
  {
    id: 'ph-folio-blanco',
    pregunta: '¿Para qué sirve el folio blanco?',
    variantes: ['para qué es el folio blanco', 'por qué un papel blanco detrás', 'hace falta el folio', 'qué fondo pongo detrás del vaso'],
    respuesta:
      'El folio blanco hace que el color que ve la cámara sea solo el del líquido, sin mezclarse con lo que hay detrás. Además, ayuda al móvil a ajustar bien los colores. Sin él, una mesa de madera o una pared de color pueden cambiar la medida.',
    momento: 'antes',
    relacionadas: ['ph-otra-luz']
  },
  {
    id: 'ph-cantidad',
    pregunta: '¿Cuánta sustancia tengo que echar?',
    variantes: ['cuánto vinagre echo', 'cuánta lombarda pongo en el vaso', 'cuánto bicarbonato hay que poner', 'qué cantidad echo en cada vaso'],
    respuesta:
      'Pon más o menos un dedo de agua de lombarda en cada vaso. Luego añade una cucharadita de la sustancia, o un chorrito si es líquida, y remueve. Lo importante es echar la misma cantidad en todos los vasos, para que la comparación sea justa.',
    momento: 'antes',
    relacionadas: ['ph-sin-color']
  },

  // --- Problemas al medir ---
  {
    id: 'ph-salta',
    pregunta: '¿Por qué el pH cambia todo el rato?',
    variantes: ['el ph salta mucho', 'el número no para de cambiar', 'por qué no se queda quieto el ph', 'cada vez sale un ph distinto', 'la medida baila'],
    respuesta:
      'La cámara ve el color de nuevo varias veces por segundo, y cualquier sombra o reflejo lo cambia un poco. Sujeta el móvil quieto, deja el vaso apoyado y espera un par de segundos. Al pulsar "Guardar muestra", Kanga hace la media del último segundo, así que el valor guardado es más estable.',
    momento: 'durante',
    relacionadas: ['ph-otra-luz', 'ph-sin-color']
  },
  {
    id: 'ph-sin-color',
    pregunta: '¿Por qué me dice que no ve un color claro?',
    variantes: ['me sale sin color claro', 'no detecta el color', 'dice que busque más luz', 'no me da el ph', 'sale acerca el vaso'],
    respuesta:
      'Kanga avisa cuando el color es demasiado gris o está muy oscuro, porque así daría un pH falso. Comprueba que el recuadro queda dentro del líquido y no en el borde del vaso. Busca más luz y, si el líquido es muy clarito, echa más agua de lombarda.',
    momento: 'durante',
    relacionadas: ['ph-folio-blanco', 'ph-cantidad']
  },
  {
    id: 'ph-agua-no-neutra',
    pregunta: '¿Por qué el agua no ha salido neutra?',
    variantes: ['el agua no me sale 7', 'por qué el agua sale ácida', 'por qué el agua sale básica', 'el agua del grifo no es neutra', 'me sale mal el agua'],
    respuesta:
      'El agua pura tiene pH 7, pero el agua del grifo lleva minerales disueltos que pueden subir o bajar un poco su pH. Además, la luz y lo concentrada que esté la lombarda cambian el color que ve la cámara. Si el agua te sale entre 6 y 8, la medida va bien.',
    momento: 'resultados',
    relacionadas: ['ph-agua-neutra', 'ph-calibrar']
  },
  {
    id: 'ph-otra-luz',
    pregunta: '¿Por qué con otra luz me sale un pH distinto?',
    variantes: ['con otra luz sale distinto', 'en clase sale diferente que en casa', 'la luz cambia el ph', 'con la lámpara sale otro color', 'por qué al lado de la ventana cambia'],
    respuesta:
      'El pH del líquido no cambia, pero el color que ve la cámara sí. Una bombilla amarillenta, un fluorescente o la luz del sol tiñen el vaso de forma distinta, y el móvil corrige los colores a su manera. Mide siempre con la misma luz y, si puedes, calibra antes de empezar.',
    momento: 'durante',
    relacionadas: ['ph-calibrar', 'ph-folio-blanco']
  },
  {
    id: 'ph-color-engana',
    pregunta: '¿Por qué dos sustancias salen casi iguales?',
    variantes: ['por qué salen casi iguales', 'dos cosas me dan el mismo ph', 'no distingue el vinagre del limón', 'el color engaña', 'por qué salen parecidas'],
    respuesta:
      'Cuando dos sustancias tienen un pH parecido, sus colores también lo son, y un pequeño cambio de luz pesa más que la diferencia real. La cámara estima el pH por el color, así que tiene un margen de error. Para afinar, calibra con sustancias de pH conocido y mide todo con la misma luz.',
    momento: 'resultados',
    relacionadas: ['ph-calibrar', 'ph-otra-luz']
  },
  {
    id: 'ph-calibrar',
    pregunta: '¿Cómo puedo medir con más precisión?',
    variantes: ['cómo mido mejor', 'para qué sirve calibrar', 'qué es calibrar', 'cómo hago que sea más exacto', 'cómo afino la medida'],
    respuesta:
      'Pulsa "Calibrar" y mide sustancias de las que ya sabes el pH, como agua (7), vinagre (unos 3) o bicarbonato (unos 8,5). Kanga guarda esos colores y los usa para comparar con lo que mides después. Así aprende con la luz y la cámara de tu clase y acierta más.',
    momento: 'durante',
    relacionadas: ['ph-como-aprende']
  },
  {
    id: 'ph-como-aprende',
    pregunta: '¿Cómo aprende Kanga a medir el pH?',
    variantes: ['cómo aprende la app', 'dónde está la inteligencia artificial', 'cómo sabe kanga el ph', 'usa ia para el ph', 'qué hace la app con mis muestras'],
    respuesta:
      'Kanga usa un método de inteligencia artificial muy sencillo, llamado "vecinos más cercanos". Compara el color que ves con muestras de pH conocido, busca las 3 que más se parecen y hace la media de su pH. Cuantas más muestras buenas tiene, mejor acierta. Todo se hace dentro del móvil, sin internet.',
    momento: 'siempre',
    relacionadas: ['ph-calibrar']
  },

  // --- Seguridad ---
  {
    id: 'ph-lejia',
    pregunta: '¿Por qué no puedo usar lejía ni amoniaco?',
    variantes: ['puedo usar lejía', 'por qué no se usa amoniaco', 'qué pasa si mido lejía', 'puedo probar con productos de limpieza', 'por qué no el desatascador'],
    respuesta:
      'La lejía, el amoniaco y los desatascadores son bases muy fuertes que queman la piel y los ojos. Además, si se mezclan con otros productos, como un ácido o entre ellos, pueden soltar gases tóxicos. Por eso en este experimento solo usamos cosas de cocina y de aseo.',
    momento: 'siempre',
    relacionadas: ['ph-salpica']
  },
  {
    id: 'ph-salpica',
    pregunta: '¿Qué hago si me salpica?',
    variantes: ['me ha salpicado', 'me ha caído en el ojo', 'qué hago si me cae en la piel', 'me ha entrado vinagre en el ojo', 'se me ha derramado'],
    respuesta:
      'Lávate enseguida con mucha agua del grifo durante varios minutos. Si te ha entrado en los ojos, acláralos con agua abundante unos 15 minutos sin frotar. Avisa siempre a tu profe o a un adulto, aunque parezca que no ha pasado nada.',
    momento: 'siempre',
    relacionadas: ['ph-lejia']
  },

  // --- Curiosidades ---
  {
    id: 'ph-otros-indicadores',
    pregunta: '¿Hay otros indicadores naturales?',
    variantes: ['hay más indicadores', 'qué más cambia de color', 'sirve el té como indicador', 'la cúrcuma cambia de color', 'puedo usar flores'],
    respuesta:
      '¡Sí! Los pétalos de rosa roja, el hibisco, los arándanos y las moras tienen antocianinas, como la lombarda. La cúrcuma es amarilla, pero se vuelve rojiza con las bases. Y el té negro se aclara un poco si le echas limón.',
    momento: 'resultados',
    relacionadas: ['ph-indicador', 'ph-antocianinas']
  },
  {
    id: 'ph-piel',
    pregunta: '¿Qué pH tiene la piel?',
    variantes: ['la piel es ácida', 'qué ph tiene la piel', 'por qué hay jabones de ph neutro', 'el jabón es malo para la piel'],
    respuesta:
      'La piel es un poco ácida: su pH está más o menos entre 4,5 y 5,5. Esa capa ácida la protege de algunos microbios. Por eso hay geles de baño suaves con un pH parecido al de la piel, mientras que muchos jabones de pastilla son básicos.',
    momento: 'resultados',
    relacionadas: ['ph-cuerpo-cocina']
  },
  {
    id: 'ph-refrescos',
    pregunta: '¿Los refrescos son ácidos?',
    variantes: ['la coca cola es ácida', 'qué ph tiene un refresco', 'los refrescos son ácidos', 'por qué los refrescos estropean los dientes'],
    respuesta:
      'Sí, y bastante. Los refrescos de cola tienen un pH de alrededor de 2,5, parecido al del limón, porque llevan ácidos añadidos. Por eso, si se toman muy a menudo, pueden dañar el esmalte de los dientes.',
    momento: 'resultados',
    relacionadas: ['ph-cuerpo-cocina', 'ph-acido']
  }
]
