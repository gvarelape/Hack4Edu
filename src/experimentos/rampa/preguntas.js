// Banco de preguntas del asistente para el experimento de la rampa (CONTRATO.md, punto 5).
// Las respuestas las revisa el equipo: el asistente nunca genera texto.

export const preguntas = [
  // --- Ciencia ---
  {
    id: 'rampa-gravedad',
    pregunta: '¿Qué es la gravedad?',
    variantes: [
      'qué es la gravedad',
      'qué significa la g',
      'por qué se caen las cosas',
      'qué es el 9,8',
      'qué mide g',
    ],
    respuesta:
      'La gravedad es la fuerza con la que la Tierra atrae a todo hacia su centro. Por eso las cosas caen al soltarlas. Cerca del suelo, lo que cae libremente gana unos 9,8 m/s de velocidad cada segundo: ese número es g, el que intentas medir. En la rampa, la pelota acelera menos, porque solo una parte de la gravedad la empuja cuesta abajo.',
    momento: 'siempre',
    relacionadas: ['rampa-aceleracion', 'rampa-otros-planetas'],
  },
  {
    id: 'rampa-aceleracion',
    pregunta: '¿Qué significa que algo acelere?',
    variantes: [
      'qué es la aceleración',
      'qué significa acelerar',
      'qué quiere decir m/s²',
      'es lo mismo aceleración que velocidad',
    ],
    respuesta:
      'La aceleración dice cuánto cambia la velocidad en cada segundo. Si un coche pasa de 10 a 12 m/s en un segundo, su aceleración es de 2 m/s². La velocidad dice lo rápido que vas, y la aceleración, lo rápido que cambia eso.',
    momento: 'siempre',
    relacionadas: ['rampa-gravedad', 'rampa-tiempo-cuadrado'],
  },
  {
    id: 'rampa-tiempo-cuadrado',
    pregunta: '¿Por qué la pelota recorre cada vez más distancia en cada segundo?',
    variantes: [
      'por qué t al cuadrado',
      'por qué la fórmula lleva un cuadrado',
      'qué significa s = ½ a t²',
      'por qué recorre más distancia cada segundo',
    ],
    respuesta:
      'Porque sale parada y acelera siempre igual, así que va cada vez más rápido y cada segundo recorre más que el anterior. Si baja el doble de tiempo, no recorre el doble, sino cuatro veces más. Eso es lo que resume la fórmula s = ½ · a · t².',
    momento: 'siempre',
    relacionadas: ['rampa-grafica-curva', 'rampa-aceleracion'],
  },
  {
    id: 'rampa-grafica-curva',
    pregunta: '¿Por qué la gráfica de la pelota tiene forma de curva?',
    variantes: [
      'por qué la gráfica es curva',
      'por qué no sale una línea recta',
      'qué significa la forma de la gráfica',
      'qué son los puntos y la línea de la gráfica',
    ],
    respuesta:
      'Una recta significaría que la bola recorre siempre lo mismo en cada segundo, a velocidad constante. Pero va cada vez más rápido, así que la línea se empina. Los puntos son lo que has medido y la línea es la curva que mejor pasa por ellos.',
    momento: 'resultados',
    relacionadas: ['rampa-tiempo-cuadrado', 'general-grafica'],
  },
  {
    id: 'rampa-plano-inclinado',
    pregunta: '¿Qué es un plano inclinado?',
    variantes: [
      'qué es un plano inclinado',
      'por qué se usa una rampa',
      'por qué no dejar caer la pelota sin más',
      'por qué baja más despacio en la rampa',
      'para qué hace falta una rampa',
      'para qué necesito una cuesta',
    ],
    respuesta:
      'Es una superficie en cuesta, como tu rampa. La gravedad sigue siendo la misma, pero solo una parte empuja a la bola cuesta abajo. Así baja más despacio y la cámara puede seguirla bien. Galileo usó este mismo truco hace unos 400 años.',
    momento: 'antes',
    relacionadas: ['rampa-seno', 'rampa-galileo'],
  },
  {
    id: 'rampa-seno',
    pregunta: '¿Cómo sabemos lo inclinada que está la rampa?',
    variantes: [
      'qué es el seno',
      'qué es sin θ',
      'por qué divido la altura entre el largo',
      'cómo calculo el seno',
      'necesito un transportador',
      'para qué sirven la altura y el largo',
    ],
    respuesta:
      'El seno es un número que dice lo empinada que es una cuesta. En tu rampa se calcula dividiendo la altura entre el largo: con 20 cm de altura y 100 cm de largo, sale 0,2. Por eso no necesitas transportador. Cuanto mayor es, más parte de la gravedad empuja a la bola.',
    momento: 'antes',
    relacionadas: ['rampa-plano-inclinado', 'rampa-inclinacion'],
  },
  {
    id: 'rampa-rodadura',
    pregunta: '¿Por qué la pelota acelera menos cuando rueda?',
    variantes: [
      'por qué no me sale 9,8 sin contar la rodadura',
      'por qué la g me sale más pequeña',
      'qué es la rodadura',
      'por qué baja más despacio al rodar',
      'por qué va más lenta la pelota al girar',
      'qué significa g sin contar la rodadura',
    ],
    respuesta:
      'Porque la bola hace dos cosas a la vez: baja y gira. Parte de la energía que gana al bajar se usa en hacerla girar, así que le queda menos para avanzar. Si rueda sin resbalar, una bola maciza acelera solo 5/7 de lo que aceleraría sin girar. Por eso, sin contar ese giro (la rodadura), sale una g de unos 7 m/s²; contándolo, sale cerca de 9,8.',
    momento: 'resultados',
    relacionadas: ['rampa-maciza-hueca', 'rampa-rozamiento'],
  },
  {
    id: 'rampa-maciza-hueca',
    pregunta: '¿Baja igual una pelota maciza que una hueca?',
    variantes: [
      'qué diferencia hay entre bola maciza y hueca',
      'por qué tengo que elegir el tipo de bola',
      'qué pasa con una pelota de ping pong',
      'cuál baja antes la maciza o la hueca',
      'qué pasa si elijo mal el tipo de bola',
    ],
    respuesta:
      'En una bola hueca, casi toda la masa está lejos del centro, y cuesta más hacerla girar. Por eso gasta más energía en girar y baja más despacio. Rodando sin resbalar, una bola hueca de pared fina, como una de ping-pong, acelera 3/5 de lo que aceleraría sin girar, y una maciza, 5/7. Si eliges mal el tipo de bola, la g te saldrá algo equivocada.',
    momento: 'siempre',
    relacionadas: ['rampa-rodadura', 'rampa-que-pelota'],
  },
  {
    id: 'rampa-rozamiento',
    pregunta: '¿Cómo afecta el rozamiento al movimiento de la pelota?',
    variantes: [
      'qué es el rozamiento',
      'el rozamiento frena la bola',
      'qué pasa si no hubiera rozamiento',
      'qué significa sin rozamiento en la simulación',
    ],
    respuesta:
      'El rozamiento es la fuerza que aparece cuando dos superficies se tocan. Aquí es curioso: permite que la bola gire sin resbalar y, si rueda bien, casi no le quita energía. Sin rozamiento, la bola resbalaría sin girar y bajaría más rápido. Eso es lo que muestra la opción "sin rozamiento" de la simulación.',
    momento: 'siempre',
    relacionadas: ['rampa-rodadura'],
  },
  {
    id: 'rampa-galileo',
    pregunta: '¿Una pelota más pesada baja más rápido?',
    variantes: [
      'importa lo que pesa la pelota',
      'una pelota más pesada baja más rápido',
      'qué descubrió Galileo',
      'por qué la masa no importa',
      'si pesa más baja más rápido',
    ],
    respuesta:
      'Una bola más pesada recibe más fuerza de la gravedad, pero también cuesta más moverla, y las dos cosas se compensan. Por eso dos bolas macizas bajan igual aunque pesen distinto. Galileo lo estudió con rampas, porque en caída libre todo va demasiado rápido para medirlo a ojo. En la vida diaria, solo el aire estropea un poco esta regla.',
    momento: 'siempre',
    relacionadas: ['rampa-plano-inclinado', 'rampa-maciza-hueca'],
  },
  {
    id: 'rampa-otros-planetas',
    pregunta: '¿La gravedad es igual en la Luna y en otros planetas?',
    variantes: [
      'cuánto vale la gravedad en la Luna',
      'cómo sería en Marte',
      'gravedad en Marte',
      'cuál es la gravedad de otros planetas',
      'por qué g cambia de un planeta a otro',
      'qué pasaría en la Luna',
    ],
    respuesta:
      'No: depende de la masa y del tamaño de cada astro. En la Luna, g es de unos 1,6 m/s²; en Marte, unos 3,7; y en Júpiter, unos 25. En la Luna, la pelota tardaría aproximadamente 2,5 veces más en bajar la misma rampa.',
    momento: 'siempre',
    relacionadas: ['rampa-gravedad'],
  },
  {
    id: 'rampa-energia',
    pregunta: '¿De dónde saca la pelota la energía para moverse?',
    variantes: [
      'qué tiene que ver la energía',
      'de dónde saca la velocidad',
      'qué es la energía potencial',
      'por qué se mueve sola la pelota',
    ],
    respuesta:
      'Cuando subes la bola, guarda energía por estar en alto: es la energía potencial. Al bajar, esa energía se convierte en movimiento hacia delante y en giro. Cuanto más alta está la salida, más energía tiene para gastar.',
    momento: 'siempre',
    relacionadas: ['rampa-rodadura', 'rampa-maciza-hueca'],
  },

  // --- Montaje ---
  {
    id: 'rampa-que-pelota',
    pregunta: '¿Qué pelota uso?',
    variantes: [
      'qué pelota es mejor',
      'qué bola uso',
      'sirve una canica',
      'de qué color tiene que ser la pelota',
      'sirve una pelota de tenis',
    ],
    respuesta:
      'Mejor una maciza, de goma o una canica grande, porque rueda recto. Que tenga un color vivo y distinto del fondo y de la cinta, para que la cámara no la confunda. Evita las blandas y las muy peludas, porque pierden energía al rodar.',
    momento: 'antes',
    relacionadas: ['rampa-maciza-hueca', 'rampa-no-encuentra'],
  },
  {
    id: 'rampa-inclinacion',
    pregunta: '¿Cuánto tengo que inclinar la rampa?',
    variantes: [
      'cuánta inclinación necesito',
      'cómo de alta hago la rampa',
      'qué pasa si la rampa está muy inclinada',
      'qué pasa con más inclinación',
      'qué es un palmo',
      'cuánto levanto el libro',
    ],
    respuesta:
      'Poca: más o menos un palmo de altura por cada metro de largo. Con menos, el rozamiento pesa demasiado; con más, la bola va muy rápido y la cámara capta pocos puntos. Si la empinas mucho, además, la bola puede resbalar en lugar de rodar.',
    momento: 'antes',
    relacionadas: ['rampa-seno', 'rampa-pocos-puntos'],
  },
  {
    id: 'rampa-superficie',
    pregunta: '¿Cómo tiene que ser la rampa?',
    variantes: [
      'qué uso para hacer la rampa',
      'sirve un libro como rampa',
      'puedo hacer un canal para la pelota',
      'qué hago si la rampa se dobla',
      'para qué sirve el tope',
    ],
    respuesta:
      'Tiene que ser plana, lisa y rígida, como una tabla o un libro grande. Si se dobla, la cuesta cambia y la medida sale mal. Mejor sin canal: en un canal, la bola gira distinto y baja más despacio de lo que dice la fórmula. Pon un tope al final para que se pare al llegar abajo.',
    momento: 'antes',
    relacionadas: ['rampa-se-desvia', 'rampa-inclinacion'],
  },
  {
    id: 'rampa-marcas',
    pregunta: '¿Para qué sirven las marcas de cinta que pongo en la rampa?',
    variantes: [
      'para qué sirve la cinta',
      'por qué tengo que tocar las cintas',
      'qué distancia pongo entre las marcas',
      'cómo sabe la app cuánto mide algo',
      'de qué color tiene que ser la cinta',
      'para qué pongo los trozos de celo',
    ],
    respuesta:
      'La cámara solo ve puntitos de imagen, llamados píxeles, y no sabe cuánto miden. Las dos cintas le enseñan cuántos centímetros hay en cierto número de píxeles. Sepáralas bastante, unos 30 cm, y mide bien esa distancia. Usa un color distinto al de la pelota.',
    momento: 'antes',
    relacionadas: ['rampa-error-grande', 'rampa-donde-movil'],
  },
  {
    id: 'rampa-donde-movil',
    pregunta: '¿Dónde pongo el móvil?',
    variantes: [
      'dónde coloco el móvil',
      'a qué distancia pongo la cámara',
      'puedo sujetar el móvil con la mano',
      'cómo pongo el móvil',
      'en horizontal o en vertical',
    ],
    respuesta:
      'Apóyalo de lado, en horizontal, a 1 o 2 metros, mirando de frente a la rampa. Se tiene que ver entera. No lo sujetes con la mano, porque si se mueve, parece que se mueve la bola. Durante la medida no lo gires, o tendrás que marcar las cintas otra vez.',
    momento: 'antes',
    relacionadas: ['rampa-marcas', 'rampa-error-grande'],
  },

  // --- Problemas al medir ---
  {
    id: 'rampa-no-encuentra',
    pregunta: 'No encuentra la pelota, ¿qué hago?',
    variantes: [
      'no encuentra la pelota',
      'no detecta la bola',
      'me dice que ese color está por toda la imagen',
      'me dice que hay algo más grande de ese color',
      'hay poca luz',
    ],
    respuesta:
      'Tócala justo en el centro. Si sigue sin encontrarla, busca más luz y un fondo liso de otro color. Quita de la imagen cualquier cosa del mismo color que la pelota. Una pelota de color vivo también ayuda mucho.',
    momento: 'durante',
    relacionadas: ['rampa-que-pelota', 'rampa-punto-salta'],
  },
  {
    id: 'rampa-punto-salta',
    pregunta: 'El círculo se va a otro sitio, ¿qué hago?',
    variantes: [
      'el punto salta',
      'el círculo se va a otro sitio',
      'el punto se va a otro lado',
      'no sigue bien a la pelota',
      'se pierde la pelota',
      'para qué sirve la sensibilidad',
    ],
    respuesta:
      'Es que ve algo parecido a la pelota por la imagen. Quita ese objeto o cambia el fondo. También puedes mover la barra de sensibilidad: hacia un lado acepta solo colores muy parecidos, y hacia el otro, más variados. Pruébala hasta que el círculo siga a la pelota y nada más.',
    momento: 'durante',
    relacionadas: ['rampa-no-encuentra', 'rampa-como-sigue'],
  },
  {
    id: 'rampa-error-grande',
    pregunta: '¿Por qué me ha salido tan lejos de 9,8?',
    variantes: [
      'me sale una g rarísima',
      'me ha salido fatal',
      'me ha salido 20 y no sé por qué',
      'por qué me sale muy mal',
      'por qué me da un error tan grande',
      'qué he hecho mal',
    ],
    respuesta:
      'El 9,8 es un valor de referencia, y es normal que tu medida no salga exacta. Si te sale muy lejos, casi siempre es algo del montaje, y se arregla fácil. Revisa que has tocado bien las cintas y escrito bien su distancia, la altura y el largo. Comprueba también que el móvil no se ha movido, que la rampa no se dobla, que el círculo ha seguido a la pelota y que elegiste bien el tipo de bola. ¡Repítelo con calma!',
    momento: 'resultados',
    relacionadas: ['rampa-marcas', 'general-error-medida'],
  },
  {
    id: 'rampa-buena-medida',
    pregunta: '¿Cómo puedo conseguir una medida más precisa?',
    variantes: [
      'por qué me ha salido tan bien',
      'qué hace que la medida sea buena',
      'es normal que salga casi 9,8',
      'cómo sé si mi medida es buena',
    ],
    respuesta:
      'Usa una rampa recta y rígida, deja el móvil bien quieto y toca bien las marcas. También ayuda que la pelota ruede sin desviarse y que haya buena luz. Si te sale cerca de 9,8, tu montaje está funcionando. Repite la medida para comprobar que no ha sido casualidad.',
    momento: 'resultados',
    relacionadas: ['general-repetir-medidas', 'rampa-error-grande'],
  },
  {
    id: 'rampa-pocos-puntos',
    pregunta: '¿Por qué hay tan pocos puntos?',
    variantes: [
      'por qué tengo pocos puntos',
      'por qué me dice que repita la medida',
      'cuántos puntos necesito',
      'qué significan los puntos de la gráfica',
      'por qué va a saltos',
      'solo me salen 4 puntitos',
    ],
    respuesta:
      'Cada punto es una foto de la bola, y el móvil solo hace unas 30 por segundo. Si la bola baja muy rápido o la cámara la pierde, salen pocos. Prueba con una rampa más larga y menos inclinada, y acerca un poco el móvil. Necesitas al menos 10 puntos, y mejor más de 20.',
    momento: 'resultados',
    relacionadas: ['rampa-inclinacion', 'rampa-no-encuentra'],
  },
  {
    id: 'rampa-se-desvia',
    pregunta: 'La pelota se desvía de la rampa, ¿qué hago?',
    variantes: [
      'la pelota se sale de la rampa',
      'la bola se tuerce',
      'la pelota no baja recta',
      'la pelota se cae por un lado',
      'la pelota no se mueve',
      'se me va para un lado',
    ],
    respuesta:
      'Comprueba que la rampa no está ladeada y suelta la bola sin empujarla, abriendo los dedos. Si se tuerce mucho, repite la medida, porque el resultado saldría peor. Una rampa más ancha también ayuda. Si no llega a moverse, súbela un poco más.',
    momento: 'durante',
    relacionadas: ['rampa-superficie', 'rampa-que-pelota'],
  },

  // --- Cómo funciona la app ---
  {
    id: 'rampa-como-sigue',
    pregunta: '¿Cómo sabe la app dónde está la pelota?',
    variantes: [
      'cómo sigue la app a la pelota',
      'cómo sabe dónde está la bola',
      'cómo funciona el seguimiento',
      'qué es el círculo que sale en la pelota',
    ],
    respuesta:
      'Primero aprende el color de tu pelota, con la IA o cuando la tocas. Luego mira cada imagen del vídeo, unas 30 por segundo, y busca la mancha más grande de ese color. El centro de esa mancha es su posición, y el círculo te la señala. Con las posiciones y el tiempo de cada imagen, dibuja la gráfica y calcula la aceleración.',
    momento: 'durante',
    relacionadas: ['rampa-ia', 'rampa-punto-salta'],
  },
  {
    id: 'rampa-ia',
    pregunta: '¿Qué hace la IA en este experimento?',
    variantes: [
      'qué hace la inteligencia artificial',
      'dónde está la IA',
      'cómo reconoce la pelota',
      'qué pasa si la IA no encuentra la pelota',
      'por qué tengo que tocar la pelota',
    ],
    respuesta:
      'Al empezar, una IA ya entrenada mira la imagen y busca algo que parezca una pelota. Si la encuentra, aprende su color, y a partir de ahí la app la sigue por ese color. Solo conoce unos 80 tipos de objetos y a veces falla. Si no la encuentra, la tocas tú y todo sigue funcionando igual.',
    momento: 'durante',
    relacionadas: ['rampa-como-sigue', 'rampa-sin-internet'],
  },
  {
    id: 'rampa-sin-internet',
    pregunta: '¿Hace falta internet para medir?',
    variantes: [
      'necesito internet para el experimento',
      'la IA necesita internet',
      'la app necesita internet para medir',
      'se envía mi vídeo a algún sitio',
      'se guarda el vídeo',
      'cuánto ocupa lo que se descarga',
    ],
    respuesta:
      'No: todo se calcula dentro de tu móvil, también la IA. Solo conviene preparar la app una vez, con wifi, tocando "Preparar para usar sin internet" en Ajustes; descarga unos 15 MB. El vídeo no se guarda ni se envía a ningún sitio: solo se usan los números que salen de él.',
    momento: 'siempre',
    relacionadas: ['rampa-ia', 'general-privacidad', 'general-sin-internet'],
  },
]
