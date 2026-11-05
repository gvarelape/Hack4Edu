# Kanga · Informe técnico para el jurado

**Hack4Edu 2026 · Reto 17: «Un laboratorio de ciencias donde no existe un laboratorio»**

Analizado sobre el commit `c03d498` de `main`, el 5 de noviembre de 2026. Cada afirmación lleva una etiqueta:

- **[Comprobado]**: lo hemos ejecutado o medido. Se indica cómo.
- **[Inferido del código]**: se deduce leyendo el código, pero no se ha ejecutado en un móvil real.
- **[Pendiente de validar]**: no se puede saber solo con el repositorio.

Las mediciones se hicieron en un MacBook con Apple M1 y 16 GB de RAM, macOS 26.5.1, Node 22.23.4, npm 10.9.9 y Google Chrome 156 sin ventana (*headless*). **Un ordenador no es un móvil barato:** donde importa, se indica.

---

## 1. Resumen ejecutivo

Kanga es una aplicación web instalable (PWA) que convierte el móvil del alumno en un pequeño laboratorio. La cámara y el micrófono hacen de instrumentos de medida, y los materiales son de casa: lombarda, una pelota y un libro, una botella con agua. Tiene tres experimentos completos (pH, plano inclinado y velocidad del sonido). Guía al alumno por el método científico (hipótesis, simulación, medida, resultados explicados y reflexión) y guarda cada experimento en un cuaderno dentro del móvil, que se puede enviar al profe como imagen.

Está pensada para alumnos de 12 a 16 años con móviles modestos y mala conexión. La carga inicial pesa unos 157 KB. Después de una primera visita funciona en modo avión. Ningún dato sale del móvil. La IA (detector de la pelota, clasificador de color y asistente de preguntas) se ejecuta en el propio dispositivo y siempre tiene un plan B sin IA. Falta validarla con alumnos reales.

---

## 2. Problema y solución

### Datos con fuente

| Dato | Fuente |
|---|---|
| En el mundo, solo el **40 % de las escuelas de primaria**, el **50 % de las de secundaria obligatoria** y el **65 % de las de bachillerato** tienen conexión a internet. | UNESCO, *Informe de Seguimiento de la Educación en el Mundo 2023: La tecnología en la educación* (julio de 2023). [Resumen](https://www.unesco.org/gem-report/sites/default/files/medias/fichiers/2023/07/Summary_v5.pdf) · [Web del informe](https://gem-report-2023.unesco.org/technology-in-education/) |
| **Dos tercios** de los niños en edad escolar del mundo, **1.300 millones de entre 3 y 17 años**, no tienen internet en casa. En los países de ingresos bajos, menos de **1 de cada 20**. | UNICEF e ITU, *How Many Children and Youth Have Internet Access at Home?* (diciembre de 2020). [Nota de prensa de UNICEF](https://www.unicef.org/press-releases/two-thirds-worlds-school-age-children-have-no-internet-access-home-new-unicef-itu) |

**Sobre laboratorios:** no hemos encontrado un dato mundial fiable de escuelas sin laboratorio. Solo hay estudios de países sueltos, y miden cosas distintas. Por ejemplo, en Tanzania falta cerca del 40 % de los laboratorios que harían falta en secundaria ([The Citizen, 2025](https://www.thecitizen.co.tz/tanzania/news/national/two-in-five-secondary-schools-in-tanzania-lack-science-labs-5393522)). Es un ejemplo de un país, no una cifra mundial.

### Nuestras hipótesis (no demostradas)

- Muchos alumnos sin laboratorio tienen acceso a un móvil propio o familiar. *[Pendiente de validar]*
- Medir con objetos de casa motiva más que leer el experimento en el libro. *[Pendiente de validar]*
- Un profe acepta recibir resultados como imagen por WhatsApp o por correo, sin plataforma. *[Pendiente de validar]*

### Cómo responde la app

| Necesidad | Respuesta de Kanga | Estado |
|---|---|---|
| No hay laboratorio | El móvil mide color, posición en el tiempo y frecuencia | [Comprobado] en código y pruebas; [Pendiente de validar] en aula |
| No hay internet | PWA con *service worker*: tras una visita, todo funciona sin conexión | [Comprobado], sección 6 |
| Móviles modestos | 157 KB al abrir; los modelos de IA solo se descargan si se piden | [Comprobado], sección 6 |
| Privacidad de menores | Sin servidor ni cuentas; los datos se quedan en el móvil | [Comprobado], sección 8 |
| El profe no ve el trabajo | «Compartir con mi profe» genera una imagen PNG y abre el menú de compartir | [Comprobado] en Chrome de escritorio; [Pendiente de validar] envío real por WhatsApp |

---

## 3. Qué funciona hoy

### Flujo principal (igual en los tres experimentos)

`src/core/pantallas/FlujoExperimento.jsx` define **8 pasos**: Presentación, Hipótesis, Simulación, Montaje, Medición, Resultados, Reflexión y Guardar. [Comprobado] con `grep "PASOS = \["`.

- **Hipótesis:** pide al menos 3 palabras propias además de los inicios de frase «Creo que… / porque…» (`src/core/lib/hipotesis.js`). [Comprobado] con 4 pruebas en `npm test`.
- **Resultados:** muestra los valores, una tabla, una gráfica en SVG propio y de 1 a 3 explicaciones «¿Por qué ha salido así?» que dependen de lo medido. [Inferido del código] en `src/core/pantallas/VistaResultado.jsx` y en los `explicaciones.js` de cada experimento; las de la rampa tienen pruebas [Comprobado].

### Los tres experimentos

| Experimento | Sensor | Qué calcula | Plan B sin IA | Pruebas automáticas |
|---|---|---|---|---|
| **pH con lombarda** (Química) | Cámara: color medio de un recuadro | pH estimado con un clasificador k-NN si el alumno calibra con 3 o más muestras; si no, una tabla de tonos | Tabla de tonos | 14 pruebas, con colores de fotos reales de lombarda [Comprobado] |
| **Pelota en una rampa** (Física) | Cámara: posición de la pelota en cada fotograma | Aceleración por mínimos cuadrados; g corregida según el tipo de bola | El alumno toca la pelota en la pantalla y se sigue por color | 87 pruebas [Comprobado] |
| **Música de las botellas** (Sonido) | Micrófono: espectro FFT | Frecuencia del tono y velocidad del sonido por regresión lineal | No usa IA | 21 pruebas [Comprobado] |

### Partes comunes

- **Cuaderno:** guarda, lista, abre, borra (con confirmación) y comparte cada experimento como imagen PNG de 1080 × 1350 (`src/cuaderno/`). [Comprobado] en Chrome con los registros de ejemplo de `#/prueba/cuaderno`.
- **Asistente «Pregunta a Kanga»:** responde con 25 preguntas generales más los bancos de cada experimento (25 de pH, 26 de rampa y 30 de botellas). [Comprobado]. Detalle en la sección 4.
- **Idiomas:** español, inglés y francés (`src/core/traducciones/`). [Comprobado] que la imagen del cuaderno sale traducida al inglés.
- **Modo prueba** para el equipo y el jurado: `#/prueba/ph`, `#/prueba/rampa`, `#/prueba/botellas`, `#/prueba/cuaderno` y `#/prueba/asistente`.
- **Publicada** en https://kanga-five.vercel.app. Responde con 200 [Comprobado con `curl`]. Vercel solo publica la rama `main` (`vercel.json`).

---

## 4. Puntos fuertes

### 1. Funciona sin internet de verdad, y lo pesado es opcional

- **Evidencia:**
  - `vite.config.js` precachea el esqueleto: **36 archivos, 825 KiB sin comprimir** [Comprobado en la salida de `npm run build`].
  - Los modelos de IA quedan fuera (`globIgnores: ['modelos/**', …]`) y se descargan desde Ajustes solo si se piden.
  - En Chrome sin conexión, tras una visita, **cargaron las 8 pantallas probadas** (inicio, cuaderno, ficha, los tres experimentos, Ajustes y la prueba del asistente) y el asistente respondió [Comprobado].
- **Beneficio:** el alumno puede abrir la app una vez en el colegio con wifi y usarla después en casa sin datos.

### 2. La IA corre en el móvil y siempre tiene plan B

- **Evidencia:**
  - **Rampa:** MediaPipe con EfficientDet-Lite0 cargado desde `/modelos/rampa/`. La versión está fijada a la 0.10.35, porque desde la 1.0 envía datos de uso a Google (`src/experimentos/rampa/detectorIA.js`, línea 3).
  - **Asistente:** Transformers.js configurado con `env.allowRemoteModels = false` (`src/asistente/busqueda/workerEmbeddings.js`).
  - La prueba `recursos: son rutas locales, nunca de internet` pasa [Comprobado].
- **Beneficio:** sin coste por alumno, sin depender de la conexión y sin enviar imágenes de menores a ningún servidor.

### 3. Un asistente que no se inventa nada

- **Evidencia:** `src/asistente/busqueda/buscarRespuesta.js` **solo devuelve preguntas escritas por el equipo**:
  - Con confianza ≥ 0,60 responde.
  - Entre 0,40 y 0,60 pregunta «¿Quieres decir…?».
  - Por debajo de 0,40 dice «No tengo una respuesta para eso. Pregúntale a tu profe».
- **Resultado medido:** con el banco de pruebas de 73 frases escritas como las haría un alumno (`src/asistente/datos/pruebasBusqueda.js`), la búsqueda por palabras (nivel 1) acierta el **77 %**, da **2 respuestas equivocadas** y tarda unos **2 ms** por búsqueda [Comprobado con un script de Node que usa `evaluarPruebas`]. El objetivo que se marcó el equipo es el 70 %.
- **Beneficio:** el alumno pregunta con sus palabras y no recibe información falsa.

### 4. Ligera y rápida en la primera visita

- **Evidencia:** Lighthouse 12.8.2 en móvil da **97 de rendimiento**, con un tiempo de bloqueo de 0 ms y un desplazamiento de la página de 0 [Comprobado]. Además, `index.html` trae una portada estática que se pinta antes del JavaScript, y el CSS no bloquea el primer pintado (`vite.config.js`, plugins `coloresPortada` y `cssSinBloqueo`).
- **Beneficio:** en 3G lenta con la CPU 6 veces más lenta, el alumno ve algo a los **0,6 s** [Comprobado], aunque la app completa tarde 3,6 s.

### 5. Arquitectura por contrato, que permite añadir experimentos

- **Evidencia:** cada experimento exporta desde su `index.js` un objeto con la misma forma (`id`, `titulo`, `ciencia`, `materiales`, `seguridad`, `preguntas`, `Simulacion`, `Medicion`…), y el core lo valida con `validarResultado` (`src/core/lib/validarResultado.js`). Añadir un experimento no obliga a tocar los demás. El historial lo refleja: 223 commits y 87 Pull Requests de 5 personas en 2 días, con commits separados por parte (`core:`, `ph:`, `rampa:`…) [Comprobado con `git log`].
- **Beneficio:** un docente o una ONG podría añadir experimentos sin rehacer la app. [Pendiente de validar]

---

## 5. Retos y soluciones

| Reto | Causa | Decisión | Compromiso | Resultado |
|---|---|---|---|---|
| **Modelo del asistente demasiado grande** | El modelo multilingüe pesa decenas de MB | Dos niveles: palabras (0 MB, siempre) y significado (opcional, 52 MB según `Ajustes.jsx`). Se oculta si el móvil dice tener menos de 4 GB (`MEMORIA_MINIMA_GB = 4`) | Los móviles más baratos solo tienen el nivel 1 | El nivel 1 cumple el objetivo [Comprobado]. El nivel 2 se dejó aparcado y luego se integró (commits `7f9fcb7`, `f77aa0f`) |
| **El nivel 2 podía dejar al alumno esperando** | Cargar el modelo tarda | Espera máxima de 2,5 s (8 s mientras carga la primera vez) y, si no llega, responde el nivel 1. El panel muestra «Buscando la respuesta…» | Una primera respuesta lenta en móviles flojos | [Inferido del código] en `busquedaSignificado.js`. [Pendiente de validar] en un móvil barato |
| **El tiempo de los fotogramas en iPhone** | Safari no siempre avanza `mediaTime` | Usar `presentationTime` o el reloj del fotograma como respaldo (commit `10243ac`) | Lógica más compleja | 5 pruebas de reloj pasan [Comprobado] |
| **Detectar la pelota no siempre funciona** | Luz, fondo, tamaño de la pelota | Detector de IA + seguimiento por color a 160 px de ancho + toque del alumno, con comprobación (`comprobarEleccion`) | El alumno a veces tiene que tocar | Pruebas de color, sombras y bordes pasan [Comprobado]. Con pelota real: [Pendiente de validar] |
| **Ruidos breves en las botellas** | Una palabra o un golpe parecían un tono | Una lectura solo vale si dura al menos 0,5 s, con 5 muestras y una dispersión inferior al 3 % (`analisisAudio.js`) | Hay que soplar de forma continua | [Comprobado] con 21 pruebas en `botellas.test.js` |
| **Versiones antiguas guardadas en el móvil** | Al publicar, cambian los nombres de archivo y el *service worker* sirve la copia vieja | `registerType: 'autoUpdate'` en `vite.config.js` y, si falla la carga de un archivo, la app escucha `vite:preloadError` y se recarga una sola vez para coger la versión nueva; si vuelve a fallar en menos de 10 s, no insiste, para no entrar en un bucle (`src/core/lib/recuperarVersion.js`, activado en `src/core/arrancar.jsx`) | Una recarga automática | Durante el desarrollo se vio el error «Unable to preload CSS» en un iPhone. Resuelto en el código [Comprobado con `grep`]; en un iPhone tras publicar: [Pendiente de validar] |
| **Traducir sin reescribir las pantallas** | Tres idiomas con poco tiempo | Un traductor recorre la pantalla (`traductorPantalla.js`, con `MutationObserver`) y busca cada texto en `textos.js`; lo que dibuja el canvas se traduce con `t()` | Si falta una fila, el texto sale en español | `npm run traducciones` lista lo que falta [Comprobado] |
| **Límite de publicaciones en Vercel** | Cada push a cualquier rama publicaba | `vercel.json` publica solo `main` | Las ramas no tienen vista previa | [Comprobado] en `vercel.json` |

---

## 6. Rendimiento y funcionamiento offline

| Métrica | Objetivo | Resultado | Método | Estado |
|---|---|---|---|---|
| JavaScript inicial transferido (gzip) | < 150 KB (objetivo del equipo) | **109,6 KB** | Chrome con CDP, caché desactivada, suma de `encodedDataLength` de los scripts | [Comprobado] |
| Carga inicial total | No definido | **157,2 KB** en 13 peticiones | Igual | [Comprobado] |
| Fuentes | No definido | **25,9 KB** (Gloock, `woff2`) | Igual | [Comprobado] |
| Contenido para usar sin conexión (precache) | No definido | **36 archivos, 825 KiB** sin comprimir | Salida de `npm run build` | [Comprobado] |
| Modelos opcionales | Solo si se piden | Rampa: unos **16 MB** (`efficientdet_lite0.tflite` 4,6 MB + `vision_wasm_internal.wasm` 11,2 MB + JS). Asistente: **52 MB** según Ajustes (modelo 35,9 MB + motor 14,3 MB + vectores 0,9 MB) | `ls -la public/modelos/…` | [Comprobado] |
| Primer pintado (FCP), red normal | No definido | 56 ms | Chrome sin ventana, red local | [Comprobado], no representativo de un móvil |
| **3G lenta + CPU 6x: primer pintado** | No definido | **0,6 s** (portada estática) | CDP: latencia de 400 ms, 400 kbit/s en cada sentido, `setCPUThrottlingRate 6`, caché desactivada | [Comprobado] |
| **3G lenta + CPU 6x: app lista** | No definido | **3,6 s** (LCP de 3,58 s) | Igual; «lista» = aparece `.core-inicio` | [Comprobado] |
| Lighthouse móvil: rendimiento | ≥ 90 | **97** (FCP 1,8 s, LCP 2,4 s, TBT 0 ms, CLS 0) | Lighthouse 12.8.2, `--form-factor=mobile`, simulación 4G lenta y CPU 4x, servidor local con gzip | [Comprobado] |
| Lighthouse móvil: accesibilidad | ≥ 90 | **94** | Igual | [Comprobado]. El único fallo, un enlace con `role="status"`, ya está corregido en el código; falta volver a pasar Lighthouse (sección 7) |
| Lighthouse móvil: buenas prácticas | ≥ 90 | **100** | Igual | [Comprobado] |
| 320 px de ancho | Sin desplazamiento horizontal | **0 de 8 pantallas se salen**; la tabla de la ficha se desliza dentro de su marco; texto mínimo de 16 px | CDP a 320 × 640, comparando `scrollWidth` con el ancho y buscando elementos que se salen | [Comprobado] |
| Sin conexión | Todo funciona tras una visita | Inicio, cuaderno, ficha, los 3 experimentos (paso 1), Ajustes y el asistente respondiendo, **sin errores** | CDP: esperar a que el *service worker* tenga los 36 archivos, cortar la red y recargar | [Comprobado] |
| Sin conexión con la cámara y los modelos | Medir en modo avión | No disponible | Necesita un móvil real y modelos descargados | [Pendiente de validar] |
| Movimiento reducido | Sin animaciones | Con `prefers-reduced-motion: reduce`: nivel «reducido» y **0 animaciones**; sin la preferencia: nivel «normal» y 8 animaciones | CDP `setEmulatedMedia` y conteo de `Element.animate` | [Comprobado] |
| Fluidez de las animaciones | Sin tirones | Mediana de 17 ms por fotograma (60 fps), 1 fotograma de más de 50 ms en 3 s, **igual con CPU 6x** | `requestAnimationFrame` durante 3 s tocando los dibujos | [Comprobado] en el M1. El freno de CPU sin ventana no afecta a los fotogramas, así que **no vale como medida de un móvil barato** |
| Tiempo de respuesta del asistente (nivel 1) | < 300 ms | Unos 2 ms por búsqueda | Node, 73 búsquedas | [Comprobado] en el ordenador |
| Asistente (nivel 2) en un móvil de gama media | < 1 s | No disponible | El equipo dice que funciona en un iPhone 13 | [Pendiente de validar] con medición |

---

## 7. Accesibilidad e inclusión

**Ya cubierto:**
- **Textos de al menos 16 px y botones de al menos 48 px de alto.** [Comprobado] a 320 px; los botones, en el CSS.
- **Contraste WCAG AA:** los colores de `src/core/estilos/tokens.css` se eligieron para cumplirlo. [Inferido del código]: no se ha medido de nuevo tras el rediseño, salvo lo que revisa Lighthouse.
- **Tres niveles de animación.** Respeta `prefers-reduced-motion` y además baja de nivel solo si el móvil tiene poca memoria o va lento (`src/core/lib/movimiento.js`). [Comprobado]
- **Tres idiomas.** Lo que escribe el alumno no se traduce. [Comprobado]
- **Textos pensados para 12–16 años,** con tuteo, frases cortas y avisos que dicen qué hacer. [Inferido del código]
- **Materiales caseros y baratos** (lista en la sección 8). [Comprobado] en los `index.js` de cada experimento.
- **Móviles básicos:** el modelo del asistente se oculta con menos de 4 GB, y el detector de la rampa tiene plan B. [Inferido del código]

**Falta:**
- **Lighthouse marcó un fallo** en `src/core/pantallas/Inicio.jsx`: el enlace «Prepara Kanga para poder usarla sin internet» tenía `role="status"`, que le quitaba su papel de enlace. Ya está corregido [Comprobado con `grep`]; falta volver a pasar Lighthouse. [Pendiente de validar]
- **No se ha probado con lector de pantalla** (TalkBack, VoiceOver). [Pendiente de validar]
- **No se ha comprobado la comprensión lectora** con alumnos reales. [Pendiente de validar]
- **Navegadores antiguos:** Vite 8 compila para navegadores recientes (por defecto, los «ampliamente disponibles»). Los móviles con Android muy antiguo, cuyo Chrome ya no se actualiza, **probablemente no pueden abrir la app**. [Inferido del código] No se ha probado.
- **WebAssembly sin SIMD:** el plan sin conexión de la rampa no incluye el motor `vision_wasm_nosimd_internal.wasm`, que sí está en `public/modelos/rampa/wasm/`. Un móvil sin SIMD podría no cargar el detector en modo avión y tendría que usar el plan B. [Inferido del código]

---

## 8. Seguridad de los experimentos y privacidad

### Avisos de seguridad

| Experimento | Avisos en la app | Qué falta |
|---|---|---|
| pH | «Pide ayuda a un adulto para trocear y cocer la lombarda: el cuchillo corta y el agua hirviendo quema», «No uses lejía, amoniaco ni desatascadores», «No mezcles productos de limpieza», «No bebas las mezclas» [Comprobado] | Nada destacable |
| Rampa | Ninguno (`seguridad: []`) [Comprobado] | Riesgo bajo; quizá «despeja el suelo» |
| Botellas | «Si usas una botella de vidrio, colócala donde no se pueda caer. Si se rompe, no toques los trozos y avisa a un adulto» [Comprobado] | Nada destacable |

El asistente tiene preguntas sobre la lejía y las salpicaduras (`ph-lejia`, `ph-salpica`) y una respuesta de ayuda personal que dirige a un adulto de confianza (`general-ayuda-personal`). [Comprobado]

### Datos: qué se guarda y dónde

| Dato | Dónde | Quién lo ve |
|---|---|---|
| Experimentos: hipótesis, predicción, resultados numéricos y respuestas | IndexedDB, base de datos `kanga` y almacén `cuaderno` (`src/cuaderno/almacen.js`) | Solo el móvil |
| Nombre del alumno, opcional, de 40 caracteres como máximo | El mismo almacén, clave `perfil` | Solo el móvil, y la imagen si el alumno la comparte |
| Idioma elegido | `localStorage`, clave `kanga-idioma` | Solo el móvil |
| Esqueleto de la app y modelos | Cache Storage (precache de Workbox y caché `modelos`) | Solo el móvil |
| Fotos, vídeo, audio y preguntas al asistente | **No se guardan** | Nadie |

- **No hay llamadas a servidores externos.** Lo comprobamos de dos formas [Comprobado]:
  - En el JavaScript compilado solo aparecen las URL `http://www.w3.org` (espacios de nombres de SVG) y `https://react.dev` (mensajes de error de React).
  - Durante la carga medida, las 13 peticiones fueron al mismo servidor.
- Si IndexedDB no está disponible, por ejemplo en algunos modos incógnito, guarda en memoria y avisa de que se perderá al cerrar. [Comprobado] con una simulación en Node.

---

## 9. Limitaciones y riesgos (de más a menos grave)

1. **No hay validación con alumnos ni con docentes.** No hay datos de uso real. [Pendiente de validar]
2. **La precisión de las medidas con material real no está medida.**
   - La tabla de color del pH ya se ajustó con fotos reales de lombarda (`estimarPh.js`), pero falta medir el error con sustancias de pH conocido.
   - El detector de la rampa con una pelota real está pendiente.
   - Botellas tiene 21 pruebas de la lógica, pero no una medida con botellas reales documentada.

   [Pendiente de validar]
3. **Partes sin pruebas automáticas:** el cuaderno (salvo una prueba manual en Node) y la mayor parte del asistente (sí hay 6 pruebas de los vectores del nivel 2). [Comprobado con la lista de `*.test.js`]
4. **Móviles muy antiguos** no soportados. **Plan sin conexión de la rampa incompleto** sin SIMD (sección 7). [Inferido del código]
5. **El nivel 2 del asistente** solo está probado por el equipo en un iPhone 13. Su porcentaje de aciertos no está reproducido en este informe. [Pendiente de validar]
6. **La recuperación tras publicar una versión nueva** está en el código (`recuperarVersion.js`), pero no se ha comprobado en un iPhone. Conviene no publicar nada justo antes de la demo. [Inferido del código]
7. **`npm ci` informa de vulnerabilidades** en dependencias (aviso de `npm audit`). No se han revisado. [Comprobado] que aparece el aviso.

---

## 10. Impacto y siguientes pasos

**Impacto potencial, no demostrado:** un alumno sin laboratorio y con conexión intermitente podría hacer tres prácticas reales con objetos de casa, con un método guiado y un registro que llega a su profe. El coste por alumno es cero si ya tiene acceso a un móvil.

**Plan priorizado:**

1. **Antes de la demo:**
   - Congelar las publicaciones.
   - Volver a pasar Lighthouse tras corregir el enlace.
2. **Calibrar con material real:**
   - Más fotos de lombarda con sustancias de pH conocido para afinar `TABLA_TONO_PH`.
   - Una sesión de la rampa con varias pelotas.
   - Botellas con 4 niveles de agua.
   - Publicar el error medido frente a los valores de referencia.
3. **Pruebas automáticas** del cuaderno (`almacen.js`).
4. **Piloto con 1–2 clases (20–30 alumnos).** Medir:
   - cuántos terminan cada experimento,
   - en qué móviles falla,
   - qué preguntan al asistente (anotado a mano por el docente, porque la app no guarda las preguntas),
   - y si el profe recibe las imágenes.
5. **Ampliar el banco de pruebas del asistente** con frases reales de alumnos y medir de nuevo los niveles 1 y 2.
6. **Accesibilidad:** probar con TalkBack y VoiceOver, y con un lector de nivel 12–14 años.

---

## 11. Argumentos para el jurado

### Tres mensajes, cada uno con su prueba

1. **«Funciona en modo avión».** Prueba: cortar la red y recargar. En Chrome cargan las 8 pantallas probadas y el asistente responde (sección 6).
2. **«La IA no sale del móvil y no se inventa nada».** Prueba:
   - el modelo se carga con `allowRemoteModels = false`;
   - el asistente acierta el 77 % y, cuando no sabe, manda al profe;
   - en el código compilado no hay llamadas a servidores (secciones 4 y 8).
3. **«Es ligera para móviles modestos».** Prueba: 110 KB de JavaScript inicial, Lighthouse 97 y la portada a los 0,6 s en 3G lenta con la CPU 6 veces más lenta (sección 6).

### Demo de 2 minutos (solo con lo comprobado)

| Tiempo | Qué se enseña |
|---|---|
| 0:00–0:15 | Abrir https://kanga-five.vercel.app ya instalada y **poner el modo avión** |
| 0:15–0:50 | pH: elegir el experimento, escribir la hipótesis con «Creo que… porque…», medir un vaso con la cámara. *(Ensayar antes con la luz de la sala.)* |
| 0:50–1:15 | Resultados: valores, gráfica y «¿Por qué ha salido así?» |
| 1:15–1:35 | Asistente: «xq el limon es acido» responde; «quién inventó la bombilla» manda al profe |
| 1:35–2:00 | Cuaderno: abrir el experimento guardado, «Compartir con mi profe» y enseñar la imagen |

Si se enseña la rampa o las botellas en directo, **tened un vídeo de reserva**: no hay medición con material real documentada.

---

## 12. Preguntas difíciles

1. **¿Qué precisión tienen las medidas?**
   - La lógica sí está probada: el análisis de la rampa recupera la aceleración con un error menor del 3 % en datos simulados con ruido (prueba `analisis: encuentra la aceleración con ruido`).
   - Con material real **no lo hemos medido todavía**, y la tabla de color del pH está marcada como provisional en el código.
2. **¿En qué móviles funciona?**
   - Lo comprobado: Chrome reciente en el ordenador, a 320 px, sin conexión y con la red y la CPU frenadas.
   - El equipo lo ha usado en un iPhone 13.
   - No sabemos el límite inferior. Los Android muy antiguos probablemente no la abren.
3. **¿Por qué no usar ChatGPT o una API?** Necesita conexión, cuesta dinero por uso, envía datos de menores a un tercero y puede inventarse respuestas. Nuestro asistente solo elige entre respuestas escritas por el equipo.
4. **¿El asistente se equivoca?**
   - En nuestro banco de 73 frases da 2 respuestas equivocadas: ambas son preguntas de botellas que también encajan.
   - Cuando duda, ofrece opciones o manda al profe.
   - El banco lo escribió el equipo; faltan frases de alumnos reales.
5. **¿Qué pasa si el alumno no tiene móvil?** Basta uno por grupo, o el del profe. Los datos se quedan en ese móvil. No lo hemos probado en clase.
6. **¿Qué datos guardáis?** Solo números y textos del experimento, y un nombre opcional, en el propio móvil (IndexedDB). No hay servidor. Las fotos y el audio no se guardan.
7. **¿Cuánto ocupa?**
   - Al abrir, 157 KB.
   - Para usarla sin conexión, 825 KiB.
   - Los modelos opcionales: unos 16 MB la rampa y 52 MB el asistente, solo si se activan.
8. **¿Lo habéis probado con alumnos?** No. Es el siguiente paso (sección 10).

---

## 13. Datos que debe confirmar el equipo

- **Móviles reales probados** (modelo, RAM, versión del sistema y navegador) y qué funcionó en cada uno. Hasta ahora, el iPhone 13.
- **Resultado de la rampa con una pelota real** y la pelota elegida para la demo.
- **Error de las medidas con material real** en los tres experimentos.
- **Porcentaje de aciertos del nivel 2** del asistente y cómo se midió.
- **Si las imágenes compartidas llegan bien por WhatsApp** en Android y en iPhone.
- **Duración y formato del pitch** según la organización.
- **Licencia y origen de los modelos:** `public/modelos/asistente/LEEME.md` indica licencia MIT para `multilingual-e5-small` y ONNX Runtime. Falta documentar EfficientDet-Lite0.

---

## Anexo A. Cómo funciona por dentro (para poder explicarlo)

### La app en una frase

Una aplicación React que se compila con Vite en archivos estáticos. Un *service worker* los guarda en el móvil para que funcione sin conexión. No hay servidor propio: Vercel solo sirve archivos.

### Las piezas

```
index.html ── portada estática (se ve antes que el JavaScript)
src/main.jsx ── arranca React
src/core/ ── el "esqueleto"
   App.jsx ............ lee el hash de la URL (#/cuaderno, #/experimento/ph…) y elige la pantalla
   pantallas/FlujoExperimento.jsx ... los 8 pasos, iguales para todos los experimentos
   hooks/useCamara.js .... abre la cámara trasera a 720p y la libera al salir
   hooks/useMicrofono.js . micrófono SIN cancelación de eco ni supresión de ruido (deformarían el tono)
   lib/idioma.js + traductorPantalla.js ... traducción de lo que aparece en pantalla
   lib/sinInternet.js ... descarga y comprueba los modelos en la caché
src/experimentos/{ph,rampa,botellas}/ ── cada uno exporta el mismo objeto desde su index.js
src/cuaderno/ ── guarda en IndexedDB y dibuja la imagen para compartir
src/asistente/ ── búsqueda de respuestas en dos niveles
```

- **Carga bajo demanda:** cada pantalla se descarga al abrirla (`lazy(() => import(…))` en `App.jsx`). Por eso al abrir solo bajan 110 KB de JavaScript, aunque el total sea mucho mayor.
- **Contrato entre partes:** cada experimento entrega su `Simulacion`, su `Medicion` y un objeto `resultado` con un formato fijo (valores, tabla, gráfica, explicaciones). Como todos hablan el mismo idioma, el core los pinta igual y el cuaderno los guarda igual.

### pH con lombarda: cómo se pasa de un color a un número

1. La cámara pinta cada fotograma en un canvas. Se hace la media del color de un recuadro (`analisisColor.js → colorMedio`).
2. El color RGB se pasa a HSV (tono, saturación y brillo). Si hay poca luz o poco color, se avisa en lugar de medir (`lecturaValida`).
3. **Sin calibrar:** se busca el tono en una tabla tono → pH y se interpola (`estimarPh.js → estimarPhPorTabla`).
4. **Calibrado (3 o más muestras de pH conocido):** clasificador **k-NN** (los *k* vecinos más cercanos). El color se coloca en un cilindro HSV, para que 359° y 1° queden juntos, y se mira a qué muestras del aula se parece más. El brillo pesa menos porque depende de la luz. **Esto es lo que «aprende» de la luz de cada aula.**
5. Si el color queda lejos de todo lo calibrado, se vuelve a la tabla (commit `240a5ff`).

### Rampa: cómo se mide la gravedad con un vídeo

1. **Escala:** el alumno toca dos marcas de cinta a una distancia conocida, y así se obtienen los centímetros por píxel (`calcularEscala`).
2. **Encontrar la pelota:** el detector EfficientDet-Lite0 de MediaPipe busca un objeto «pelota» en la imagen entera y en cuatro recortes (`zonasBusqueda`). Si no lo encuentra, el alumno la toca. En los dos casos se comprueba su color (`comprobarEleccion`).
3. **Seguirla:** en cada fotograma, la imagen se reduce a 160 px de ancho y se busca la mancha más grande de ese color (`seguimientoColor.js → encontrarPorColor`). Es rápido y no necesita IA en cada fotograma.
4. **Limpiar:** se quitan los saltos sueltos (`quitarSaltos`), el reposo del principio y lo que pasa tras llegar abajo (`recortar`).
5. **Ajustar:** se busca la parábola s = s₀ + v₀·t + ½·a·t² que mejor pasa por los puntos (**mínimos cuadrados**, `ajusteCuadratico`). De ahí sale la aceleración *a*.
6. **Física:** en un plano inclinado, a = factor · g · sen θ. El factor es 5/7 para una bola maciza que rueda. Despejando se obtiene *g* (`fisica.js`). Por eso la app enseña también «g sin contar la rodadura» (unos 7 m/s²): rodar «roba» aceleración.

### Botellas: cómo se mide la velocidad del sonido con un soplido

1. El micrófono entrega un **espectro** (FFT de 8192 puntos, de `AnalyserNode`): cuánta energía hay en cada frecuencia.
2. Se busca el pico más alto entre 80 y 2000 Hz y se afina con una **interpolación parabólica** entre los puntos vecinos (`analisisAudio.js → buscarPico`).
3. Una lectura solo vale si es **estable**: dura al menos 0,5 s, con 5 o más muestras y una dispersión inferior al 3 %. Así un golpe o una palabra no cuentan.
4. **Modelo:** una botella es un tubo cerrado por abajo, donde f = v / (4·L), siendo L la altura del aire. Con varias alturas, se ajusta una **recta** de 1/f frente a L. La pendiente es 4/v, así que v = 4 / pendiente (`modelo.js → velocidadSonido`). Este truco hace que la «corrección de extremo» no estropee el resultado.

### Asistente: cómo «entiende» sin generar texto

**Nivel 1, por palabras (siempre activo, 0 MB):**
1. Normaliza la frase: minúsculas, sin tildes, abreviaturas de chat («xq» pasa a «por qué»), sin palabras vacías, con sinónimos y raíces («botellas» y «botella» coinciden). Archivos: `normalizar.js` y `sinonimos.js`.
2. Puntúa cada pregunta del banco con **BM25**, el método clásico de los buscadores, contra la pregunta y sus variantes. Tolera faltas de ortografía con la **distancia de edición** (`busquedaPalabras.js`).

**Nivel 2, por significado (opcional, 52 MB):**
- Un modelo **multilingual-e5-small** convierte la frase del alumno en un vector de números que representa su significado.
- Los vectores de todas las preguntas del banco se calcularon antes en el ordenador (`npm run embeddings` → `embeddings.json`).
- Se compara con la **similitud del coseno**.
- Funciona dentro de un **Web Worker** (un hilo aparte), para que la pantalla no se congele.

**Decisión** (`buscarRespuesta.js`):
- Si hay nivel 2, cada pregunta se queda con la mejor puntuación entre la de palabras y la combinada (0,7 × significado + 0,3 × palabras).
- Una frase idéntica a la de una pregunta se responde directamente.
- Con confianza ≥ 0,60 (y, con nivel 2, con 0,10 de ventaja sobre la segunda) **responde**.
- Entre 0,40 y 0,60 pregunta **«¿Quieres decir…?»**.
- Por debajo **manda al profe**.

En ningún caso escribe texto nuevo.

### Cuaderno: guardar e imagen para compartir

- **Guardar:** `idb-keyval` sobre IndexedDB, con una escritura de prueba al empezar. Si falla, pasa a memoria (`almacen.js`).
- **Imagen:**
  - Se dibuja a mano en un canvas de 1080 × 1350 (`generarImagenFicha.js`), con un reparto de texto en líneas que **nunca corta palabras** (`imagen/textoCanvas.js`) y una gráfica propia (`imagen/graficaCanvas.js`).
  - No se reutiliza el SVG de la app porque usa variables CSS que se perderían.
  - Se comparte con la **Web Share API** (`navigator.share`). Si no está disponible, se descarga.
  - Va en dos toques porque iOS solo abre el menú de compartir justo después de un toque.

### Sin conexión

- **Workbox** (dentro de `vite-plugin-pwa`) genera `sw.js` con la lista de 36 archivos, que se descargan en la primera visita.
- Los modelos se guardan aparte, en la caché `modelos`, solo cuando el alumno los pide desde Ajustes («Preparar para usar sin internet» o «Activar búsqueda inteligente»).

### Glosario rápido

- **PWA:** web que se instala como una app y funciona sin conexión.
- ***Service worker*:** programa del navegador que intercepta las descargas y sirve copias guardadas.
- **Hash de la URL:** la parte tras `#`; cambiarla no recarga la página.
- **FFT:** operación que descompone un sonido en sus frecuencias.
- **Mínimos cuadrados:** forma de encontrar la curva que mejor pasa por unos puntos con ruido.
- **k-NN:** clasificar algo por los ejemplos conocidos más parecidos.
- **BM25:** fórmula que puntúa lo bien que un texto encaja con una búsqueda.
- ***Embedding*:** vector de números que representa el significado de una frase.
- **WebAssembly (WASM):** código rápido que el navegador ejecuta; lo usan MediaPipe y ONNX Runtime.

---

## Anexo B. Comandos ejecutados

```bash
npm ci                                   # instalación limpia (unos 5 s)
npm run build                            # compilación: tamaños y precache
npm test                                 # 148/148, con el sistema en español y en inglés
npm run lint                             # sin errores
npx prettier --check "src/**/*.{js,jsx,css}"   # formato correcto
npx -y lighthouse@12.8.2 http://localhost:8090/ --form-factor=mobile \
  --only-categories=performance,accessibility,best-practices
curl https://kanga-five.vercel.app/      # 200
git log / git rev-list --count HEAD      # historial
```

- Para las mediciones de carga, 320 px, sin conexión y movimiento se usaron scripts propios de Node que controlan Chrome 156 sin ventana por el protocolo de DevTools, sobre `dist/` servido en `http://localhost:8090` con gzip.
- La búsqueda del asistente se midió con un script de Node que llama a `evaluarPruebas` con los tres bancos y las preguntas generales.
- Estos scripts no forman parte del repositorio.
