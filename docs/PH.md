# Experimento pH con lombarda · Karlos

> **Para la IA:** estás ayudando a **Karlos**. Solo puedes tocar `src/experimentos/ph/`. Lee también `REGLAS.md` y `CONTRATO.md`.

## Objetivo

El alumno descubre qué sustancias de su casa son **ácidas, neutras o básicas** usando un indicador natural, el agua de cocer lombarda, y la cámara del móvil como **medidor de color**.

**Qué aprende:** qué es el pH, que existen indicadores naturales, a clasificar sustancias y a entender que una medida tiene un margen de error.

**Por qué es el primero de la demo:** es el más visual y se entiende en dos segundos.

## Datos del objeto experimento

> Los textos los escribe Karlos siguiendo la guía de tono de `DISENO.md`, y Nicolás los revisa.

- **id:** `'ph'` · **ciencia:** `'Química'`
- **titulo:** Indicador de pH con lombarda
- **descripcion:** Descubre qué sustancias de tu casa son ácidas
- **pregunta:** ¿Qué sustancias de tu casa son ácidas y cuáles son básicas?
- **materiales:**
  - Agua de haber cocido lombarda (morada).
  - Vasos transparentes.
  - Vinagre, limón, agua, bicarbonato, jabón de manos…
  - Un folio blanco.
- **instrucciones:**
  1. Echa un poco de agua de lombarda en cada vaso.
  2. Añade a cada vaso una sustancia distinta y remueve.
  3. Pon el folio blanco detrás del vaso y busca una zona con buena luz.
  4. Apunta la cámara para que el recuadro quede dentro del líquido.
- **seguridad:**
  - No uses lejía, amoniaco ni desatascadores.
  - No mezcles productos de limpieza.
  - No bebas las mezclas.
- **reflexion:**
  - ¿Se cumplió tu hipótesis? ¿Qué sustancia te sorprendió más?
  - ¿Qué tienen en común las sustancias ácidas?
  - ¿Por qué crees que el color no es exactamente igual en todas las fotos?
- **preguntas:** el banco de `preguntas.js` (ver "Asistente").
- **recursos:** `[]`

## La ciencia

La lombarda tiene unos pigmentos, las **antocianinas**, que cambian de color según el pH:

| pH | Color aproximado | Ejemplos |
|---|---|---|
| 1–2 | Rojo | Limón, refresco de cola |
| 3–4 | Rosa / rojo violáceo | Vinagre |
| 5–6 | Violeta | |
| 7 | Morado / azul violáceo | Agua |
| 8 | Azul | Bicarbonato |
| 9–10 | Verde azulado | Jabón |
| 11–12 | Verde | Detergente de lavadora |
| 13–14 | Amarillo | (No lo usamos: son productos peligrosos) |

Es una **estimación**: el color que ve la cámara depende de la luz, del balance de blancos del móvil y de lo concentrada que esté la lombarda. Por eso se usa un folio blanco de fondo y por eso conviene **calibrar** el sistema.

## Cómo funciona por dentro

1. **Leer el color:** cada 200 ms se copia el fotograma de la cámara a un canvas pequeño (160 × 120) y se calcula el **color medio de un recuadro central** de unos 20 × 20 píxeles.
2. **Pasar a HSV:** de RGB a tono, saturación y brillo. Lo que más dice del pH es el **tono**.
3. **Descartar lecturas malas:**
   - Saturación por debajo de 0,15: el color es demasiado gris, así que no hay indicador o la luz es mala.
   - Brillo demasiado bajo: está demasiado oscuro.

   En los dos casos se avisa al alumno.
4. **Estimar el pH.** Hay dos métodos:
   - **Método base (tabla):** interpolación lineal en una tabla tono → pH. Los rojos (tono de 0 a 40°) se tratan como de 360 a 400° para que la escala sea continua. Tabla inicial, que hay que ajustar con las fotos reales:

     | Tono | 400 | 360 | 330 | 290 | 265 | 230 | 190 | 130 | 60 |
     |---|---|---|---|---|---|---|---|---|---|
     | pH | 1 | 2 | 4 | 6 | 7 | 8 | 9,5 | 11 | 13 |

   - **Método IA (clasificador k-NN):** se compara el color medido con **muestras de pH conocido** y se promedia el pH de las **k = 3 más parecidas** (distancia en el espacio de color, mejor en HSV o Lab que en RGB). "Entrenar" un k-NN es solo **guardar ejemplos**: no hace falta ningún ordenador potente y ocupa unos pocos KB. Las muestras van en `src/experimentos/ph/datos/calibracion.json`. Si hay menos de 6 muestras, se usa el método base.
5. **Clasificar:** por debajo de 6,5 es ácida, de 6,5 a 7,5 neutra y por encima de 7,5 básica.

### Calibración en clase (muy vistoso para el pitch)

Un botón "Calibrar" deja al alumno medir sustancias de pH conocido (agua = 7, vinagre ≈ 3, bicarbonato ≈ 8,5). Esas muestras se añaden **en ese momento** al clasificador, que así **aprende** con la luz y la cámara de esa clase. Las muestras de calibración del alumno viven solo mientras dura el experimento (no se guardan, porque los experimentos no guardan nada).

Argumento de IA: *el sistema aprende del aula donde se usa.*

## Pantallas

### Simulación (`Simulacion`)

- Un **vaso virtual** con agua de lombarda.
- Botones "Añadir una gota de vinagre" y "Añadir una gota de bicarbonato". Cada gota cambia el pH virtual y el líquido cambia de color con la escala de la tabla.
- Debajo, la escala de pH del 1 al 14 con los colores y una flecha en el pH actual.
- **Predicción:** se le pide al alumno que ordene de más ácida a más básica las sustancias que va a medir. Es una lista que puede reordenar (con botones de subir y bajar, que funcionan mejor en móvil que arrastrar), con tres por defecto: vinagre, agua y bicarbonato.
- `onContinuar({ texto: 'Orden predicho: vinagre, agua, bicarbonato', valor: null })`.

### Medición (`Medicion`)

1. Botón "Abrir cámara". El vídeo se ve en grande, con el recuadro central marcado.
2. **Lectura en directo:** el cuadradito con el color medido, el pH estimado en grande y su tipo (ácida, neutra o básica). Si la lectura no es buena, sale el aviso "Acerca el vaso / busca más luz".
3. Campo "Sustancia" y botón **"Guardar muestra"**: guarda el nombre, el color y el pH, haciendo la media de las lecturas del último segundo para que sea más estable.
4. Lista de muestras guardadas, con la opción de borrar cada una.
5. Botón "Calibrar", según la sección anterior.
6. Botón **"Terminar"**, que se activa con al menos 2 muestras.

## Resultado (según `CONTRATO.md`)

- **valores:**
  - Primero, la sustancia más ácida: `{ etiqueta: 'Más ácida: Vinagre', valor: 2.8, unidad: 'pH' }`.
  - Después, la más básica y el número de muestras.
- **resumen:** cuántas ácidas, neutras y básicas ha encontrado, y un aviso de que es una estimación por color.
- **comparacion:** si el orden medido coincide con el orden predicho. Si no coincide, qué sustancias han cambiado de sitio.
- **explicaciones:** según las reglas de abajo.
- **tabla:** columnas `Sustancia`, `Color`, `pH` y `Tipo`.
- **grafica:** gráfica de puntos con el pH de cada muestra, con `x` = número de muestra e `y` = pH, y rol `'medido'`.

## Asistente: explicaciones y preguntas

### Explicaciones automáticas (`explicaciones.js`)

| Si pasa esto… | …título de la explicación | `preguntaId` |
|---|---|---|
| Hay alguna sustancia ácida | ¿Qué hace que algo sea ácido? | `ph-acido` |
| El agua sale fuera de 6,5–7,5 | ¿Por qué el agua no ha salido neutra? (agua del grifo con minerales, luz, lombarda poco diluida) | `ph-agua-no-neutra` |
| Dos sustancias con menos de 0,5 de diferencia | ¿Por qué salen casi iguales? (el color engaña; calibrar) | `ph-color-engana` |
| No se usó calibración | ¿Cómo puedo medir con más precisión? | `ph-calibrar` |
| El orden no coincide con la predicción | ¿Me equivoqué en la hipótesis? (¡así se aprende!) | `general-hipotesis-falsa` |

Máximo 3, de la más importante a la menos.

### Banco de preguntas (`preguntas.js`, 20–30)

Temas que tiene que cubrir (con `id` que empiecen por `ph-`):
- **Ciencia:** qué es el pH, qué es un ácido y una base, qué es un indicador, qué son las antocianinas, por qué la lombarda cambia de color, ácidos y bases en el cuerpo y en la cocina, qué pasa al mezclar un ácido y una base (neutralización), por qué el agua es neutra.
- **Montaje:** cómo se hace el agua de lombarda, cuánto dura, por qué el folio blanco, cuánta sustancia echar.
- **Problemas al medir:** el pH salta mucho, sale "sin color claro", el agua no sale neutra, con otra luz sale distinto.
- **Seguridad:** por qué no usar lejía ni amoniaco, qué hacer si salpica.
- **Curiosidades:** otros indicadores naturales (té, cúrcuma, pétalos), el pH de la piel o de los refrescos.

Cada pregunta con 3–6 `variantes` escritas como lo diría un alumno, y respuesta de 2–5 frases.

## Archivos

```
src/experimentos/ph/
├── index.js                 (objeto experimento)
├── Simulacion.jsx
├── Medicion.jsx
├── analisisColor.js         (colorMedio, rgbAHsv, lecturaValida)
├── estimarPh.js             (por tabla, por k-NN, tipoPh)
├── crearResultado.js        (monta el resultado según el contrato)
├── explicaciones.js
├── preguntas.js
├── ph.css
└── datos/
    ├── calibracion.json     (muestras reales: [{ r, g, b, ph, sustancia }])
    └── fotos/               (fotos y vídeo de prueba, solo para desarrollar)
```

## Datos que tiene que llevar Karlos

- [ ] Agua de lombarda: hervir media lombarda troceada en agua unos 15 minutos y colar. Aguanta varios días en la nevera.
- [ ] **Fotos** de vasos con agua, vinagre, limón, bicarbonato, jabón y detergente, con folio blanco detrás, con luz natural y con luz de fluorescente. Hacerlas con el móvil de dos personas distintas.
- [ ] Un **vídeo corto**, de unos 20 segundos, pasando la cámara por los vasos uno a uno. Sirve para probar en `#/prueba/ph` sin montar el experimento cada vez.
- [ ] Apuntar el pH real aproximado de cada sustancia. Si alguien consigue tiras de pH en una farmacia, mucho mejor.

## Prompts en orden

1. "Crea `analisisColor.js` con `colorMedio(ctx, x, y, ancho, alto)`, `rgbAHsv({ r, g, b })` y `lecturaValida(hsv)`, según PH.md. Funciones puras, sin React."
2. "Crea `estimarPh.js` con `estimarPhPorTabla(rgb)`, `estimarPhKnn(rgb, muestras, k)`, `estimarPh(rgb, muestras)`, que elige el método, y `tipoPh(ph)`."
3. "Crea una página provisional dentro de mi carpeta que cargue las fotos de `datos/fotos/` y muestre para cada una el color medio y el pH estimado, para ajustar la tabla y generar `calibracion.json`."
4. "Crea `explicaciones.js` con las reglas de PH.md y `crearResultado.js`, que monte el `resultado` exactamente como dice CONTRATO.md."
5. "Crea `Medicion.jsx` con la cámara (`useCamara` del core), el recuadro central, la lectura en directo, la lista de muestras y el botón Terminar, según PH.md."
6. "Crea `Simulacion.jsx` con el vaso virtual, las gotas, la escala de pH y la predicción ordenable."
7. "Añade la calibración en clase: medir sustancias de pH conocido y añadirlas a las muestras del k-NN."
8. "Ayúdame a escribir `preguntas.js` con 20–30 preguntas sobre los temas de PH.md, en el formato de CONTRATO.md, punto 5. Yo reviso que las respuestas sean correctas." (*Revisad cada respuesta: el asistente las da por buenas.*)
9. "Crea `index.js` con el objeto experimento completo según PH.md."

## Criterios de aceptación

- [ ] Con luz normal y folio blanco: el vinagre sale **ácido**, el bicarbonato **básico** y el agua entre **6 y 8**.
- [ ] La lectura en directo se actualiza al menos 3 veces por segundo y no parpadea de forma exagerada.
- [ ] Si se apunta a algo gris o hay poca luz, avisa en lugar de dar un pH falso.
- [ ] Las explicaciones cambian según lo medido y cada `preguntaId` existe en el banco.
- [ ] Funciona en `#/prueba/ph` y el validador del modo prueba no da errores.
- [ ] Si se deniega el permiso de cámara, sale un mensaje claro.
