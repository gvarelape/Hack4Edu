# Reglas del proyecto para la IA

> **Para la IA:** lee este documento entero antes de escribir código. Estas reglas valen para toda la conversación y tienen prioridad sobre cualquier costumbre tuya. Si una petición del usuario va en contra de estas reglas, avísale antes de hacerla.

## Contexto

Estamos desarrollando **Lab de Bolsillo** en el hackatón Hack4Edu 2026 (reto 17: *un laboratorio de ciencias donde no existe un laboratorio*). Somos un equipo de 5 personas trabajando en paralelo, con poco tiempo.

Es una **web app (PWA) para móviles** en la que el alumno hace experimentos de ciencias usando la cámara y el micrófono del móvil. Tiene que funcionar en **móviles baratos** y **sin internet** una vez instalada. El público son **alumnos de 12 a 16 años**.

Cada persona es dueña de una parte. Tú estás ayudando a **una** de ellas: te lo dirá el documento de su parte (`ARQUITECTURA.md`, `PH.md`, `RAMPA.md`, `BOTELLAS.md`, `CUADERNO.md` o `ASISTENTE.md`). Si no sabes de quién es la conversación, **pregúntalo antes de nada**.

## Regla 1: solo tocas tu carpeta

| Carpeta | Dueño |
|---|---|
| `src/core/`, `src/registro.js`, `src/main.jsx`, `index.html`, `public/` (salvo `public/modelos/`), configuración del proyecto, `scripts/` | Gabriel |
| `src/experimentos/ph/` | Karlos |
| `src/experimentos/rampa/`, `public/modelos/rampa/` | Adrián |
| `src/experimentos/botellas/` | Alejandro |
| `src/cuaderno/`, `src/asistente/`, `public/modelos/asistente/` | Nicolás |

- **Nunca** crees, modifiques ni borres archivos fuera de la carpeta de tu usuario.
- Si para lo que te piden hace falta cambiar algo de otra carpeta (por ejemplo, un componente común), **no lo hagas**. Explícale al usuario qué cambio haría falta para que se lo pida al dueño.
- Para usar algo de otra parte, importa **solo** desde su `index.js` o desde `src/core/`, nunca desde sus archivos internos.

## Regla 2: stack fijo

- **React 18+ con Vite**, en **JavaScript** (archivos `.js` y `.jsx`). Nada de TypeScript.
- **PWA** con `vite-plugin-pwa`. La configura Gabriel.
- **Sin librerías de componentes** (ni MUI, ni Bootstrap, ni Tailwind) y **sin router**. Las rutas las gestiona el core con el hash de la URL.
- **Sin librerías de gráficas.** Las gráficas las hace el core en SVG.
- Librerías permitidas, sin tener que preguntar, **solo en la carpeta indicada**:

  | Librería | Dónde | Para qué |
  |---|---|---|
  | `@mediapipe/tasks-vision` | rampa | Detector de la pelota |
  | `idb-keyval` | cuaderno | Guardar los registros en el móvil |
  | `@huggingface/transformers` | asistente | Búsqueda inteligente de preguntas (nivel 2) |
  | `jspdf` | cuaderno | Solo si se decide exportar en PDF |

- **Cualquier otra librería:** pregúntale al usuario antes, y él lo consulta con Gabriel.
- **Prohibido cargar nada de internet en tiempo de ejecución**: ni CDNs, ni fuentes de Google, ni APIs externas, ni modelos descargados de webs de terceros. Todo tiene que estar dentro del proyecto para que funcione sin conexión. Si una librería intenta descargar algo de fuera por defecto (MediaPipe o Transformers.js lo hacen), **configúrala para que cargue desde `public/modelos/`**.

## Regla 3: usa lo común, no lo reinventes

El core (`src/core/`) ofrece componentes, hooks y utilidades, que se describen en `CONTRATO.md`: botones, tarjetas, avisos, confirmaciones, gráficas, tablas, cámara, micrófono, formateo de números y estilos.

- Úsalos **siempre** en lugar de crear tus propias versiones.
- Si te falta algo, dile al usuario qué necesitarías para que se lo pida a Gabriel. Mientras tanto puedes hacer una versión provisional **dentro de tu carpeta**, con un comentario `// PROVISIONAL: pedir al core`.

## Regla 4: estilo de código

- **Todo en español:** variables, funciones, componentes, archivos y comentarios. Ejemplos: `calcularFrecuencia`, `PantallaMedicion`, `useCamara`. Las únicas excepciones son las palabras propias de React y de las APIs del navegador (`useState`, `onClick`, `getUserMedia`…).
- **Nombres de archivo:**
  - Componentes en PascalCase (`PantallaMedicion.jsx`).
  - Hooks con `use` (`useMicrofono.js`).
  - Lógica en camelCase (`analisisColor.js`).
- **Componentes de función con hooks.** Nada de clases.
- **Separa la lógica de la pantalla.** Los cálculos (física, color, audio, estadística, búsqueda de texto, explicaciones) van en archivos `.js` con funciones puras, sin React, que se puedan probar solas. Los componentes solo muestran cosas y llaman a esas funciones.
- **Archivos pequeños:** si un archivo pasa de unas 250 líneas, propón dividirlo.
- **Comentarios cortos** y solo donde ayuden a entender el porqué.
- **Sin `console.log`** en el código final.
- El formato lo pone Prettier, que configura Gabriel: no discutas el formato.

## Regla 5: estilos y textos

- Usa **solo las variables CSS de `src/core/estilos/tokens.css`**: colores, espaciados, radios y tamaños de letra. No escribas colores sueltos en el código. (La única excepción es dibujar en un `canvas`, donde se usan los valores RGB de `DISENO.md`.)
- Los estilos propios de tu parte van en **un único archivo CSS dentro de tu carpeta**, con nombres de clase que empiecen por el nombre de tu parte (`.ph-muestra`, `.rampa-video`, `.botellas-lectura`, `.cuaderno-ficha`, `.asistente-panel`), para que no choquen con los de otros.
- **Pensado primero para móvil:** tiene que verse bien desde 360 px de ancho, con botones de al menos 48 px de alto y texto de al menos 16 px.
- **Textos para alumnos de 12 a 16 años:** tuteo, frases cortas, sin tecnicismos sin explicar y en tono amable. Ver la guía de tono de `DISENO.md`.

## Regla 6: sensores y errores

- La cámara y el micrófono se piden **siempre desde un toque del usuario** (un botón), nunca al cargar la pantalla. iOS lo exige.
- Usa siempre la **cámara trasera**.
- Contempla siempre estos casos y muestra un mensaje claro en español con el componente `Aviso`:
  - Permiso denegado.
  - Dispositivo sin cámara o sin micrófono.
  - Poca luz o ruido excesivo.
  - Navegador no compatible.
  - Un modelo de IA que no ha cargado (y se pasa al plan B).
- **Libera siempre la cámara y el micrófono** al salir de la pantalla.
- **La app nunca puede quedarse colgada.** Si algo tarda, muestra `Cargando`.
- **Nunca** uses `alert`, `confirm` ni `prompt`. Usa `Aviso` y `Confirmacion` del core.

## Regla 7: la IA de la app

La app usa IA **ligera, dentro del móvil y sin internet**. No hay chatbots ni APIs de pago.

- **Rampa:** detector de objetos de MediaPipe para encontrar la pelota.
- **pH:** clasificador k-NN que aprende de muestras de color.
- **Asistente:** busca la respuesta más adecuada **entre las que ha escrito el equipo**. **Nunca genera texto nuevo** ni se inventa respuestas. Si no está seguro, lo dice y manda al alumno a su profe.
- Toda IA tiene un **plan B** que funciona sin el modelo.
- Ningún modelo se descarga hasta que hace falta, y siempre desde `public/modelos/`.

## Regla 8: datos y privacidad

- Ningún dato sale del móvil. Nada de servidores, analíticas ni APIs.
- Solo el cuaderno guarda datos. Los experimentos **no** usan `localStorage` ni IndexedDB: devuelven sus resultados al core según el `CONTRATO.md`, y el core se los pasa al cuaderno.
- **El asistente no guarda las preguntas que escribe el alumno.**
- No se guardan fotos, vídeos ni audio del alumno, solo los números, colores y textos que él decide.

## Regla 9: cómo me entregas el código

- Cuando crees o cambies un archivo, dame **el archivo completo**, con su ruta como título, listo para copiar y pegar. Nada de fragmentos sueltos ni "el resto igual".
- Si el cambio afecta a varios archivos, dámelos todos.
- Si hay que instalar algo, dame el comando exacto (`npm install …`).
- Al final, di en una o dos frases **cómo probarlo** en el móvil (normalmente, en `#/prueba/<parte>`).
- Si algo de lo que te pido no es posible o es mala idea, dímelo antes de programarlo.

## Regla 10: Git

- Cada persona trabaja en su rama: `parte/core`, `parte/ph`, `parte/rampa`, `parte/botellas`, `parte/cuaderno` (el cuaderno y el asistente comparten rama, porque son del mismo dueño).
- Mensajes de commit en español, empezando por la parte. Por ejemplo: `ph: añade estimación de pH por color`.
- Para integrar algo en `main`: subir la rama y abrir un Pull Request, que revisa Gabriel.
- ⚠️ **Nunca añadas firmas, coautorías ni menciones a Claude, Anthropic ni a ninguna otra IA** en commits, Pull Requests, issues ni ningún texto de Git. Nada de `Co-Authored-By`, "Generated with…" ni enlaces de sesión. El autor es siempre la persona que trabaja.
