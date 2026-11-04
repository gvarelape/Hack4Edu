# LÉEME PRIMERO · Resumen del proyecto y decisiones tomadas

> Este documento resume todo lo que se ha hablado y decidido para el hackatón Hack4Edu 2026, para que los cinco tengamos la misma información. Léelo entero antes de abrir tu documento de parte.
>
> **Equipo:** Gabriel, Nicolás (Troyano), Adrián, Karlos y Alejandro.
> **Repositorio:** https://github.com/gvarelape/Hack4Edu

---

## 1. El hackatón

**Hack4Edu 2026** es la séptima edición del hackatón de ProFuturo (Fundación Telefónica y Fundación "la Caixa"). Participamos por la sede de la **UPSA**.

| Fecha | Qué pasa |
|---|---|
| Hasta el 30 de octubre, 23:59 | Plazo de inscripción (ya cerrado). |
| **3, 4 y 5 de noviembre** | Días de trabajo y networking. Son **tres días**. |
| 6 de noviembre | Recepción de finalistas. |
| 7 de noviembre | Final internacional. |

- **Formato híbrido:** se puede ir a la sede o participar en línea. **Las presentaciones son virtuales.**
- **Ayuda:** cada sede tiene apoyo técnico y educativo, hay sesiones virtuales para dudas y contamos con una mentora en la sede.
- **Criterios del jurado:** creatividad, calidad técnica, posibilidad de llevarlo al mercado y **uso de IA para resolver retos educativos**.
- **Propiedad intelectual:** el proyecto es nuestro, pero hay que publicarlo con licencia libre. Usamos **MIT**.

### Premios

| Modalidad | Requisito | Premios |
|---|---|---|
| **Innovadora** | Proyecto nuevo | 1.500 €, 1.000 € y 700 € |
| **Senior** | Proyecto basado en trabajo previo, indicando qué se hizo en el hackatón | 1 premio de 1.500 € |
| **Retos ProFuturo** | Mayor impacto social en contextos vulnerables o con brechas de acceso | 1.000 € |

Un equipo no puede ganar más de un premio. Todos los participantes reciben un certificado de 10 horas de la UPSA, y cada sede puede publicar un artículo en Springer sobre su proyecto.

**Decisión: competimos en la modalidad innovadora.** Hay tres premios en vez de uno y el proyecto encaja también en el premio Retos ProFuturo. Por eso **no llevamos código hecho antes del hackatón**, solo documentación.

---

## 2. Nombre del equipo y de la app

Sin decidir todavía. Los favoritos para el equipo:
- **Kaballo de Troya:** Troyano + la K de Karlos, y además es un chiste de ciberseguridad.
- **GATKA:** iniciales de Gabriel, Alejandro, Troyano, Karlos y Adrián.

Otras opciones que salieron: Los 5 de Troya, Sudo Troyano, Backdoor Boys, Ctrl+Alt+Karlos, Kernel Panik, 404 Sleep Not Found, Merge Konflikt.

La app se llama provisionalmente **Lab de Bolsillo**. Lo cierra Nicolás.

---

## 3. El reto elegido

De los 20 retos se valoraron sobre todo el 17 (laboratorio), el 14 (videojuegos), el 03 (accesibilidad) y el 07 (IA crítica).

**Decisión: Reto 17, "Un laboratorio de ciencias donde no existe un laboratorio".** Se piden experimentos con dispositivos accesibles, que funcionen con poca conexión y que trabajen el pensamiento científico (hipótesis, experimento, observación). Se valora especialmente que funcione en dispositivos baratos y sin buena conexión.

---

## 4. La idea

**El móvil del alumno es el instrumento científico.** No es el objeto del experimento: se queda **apoyado y quieto** encima de la mesa y **observa** lo que pasa con la cámara o el micrófono.

> Se descartó la primera idea de tirar el móvil o colgarlo de una cuerda: en la vida real nadie va a querer hacer eso con su móvil.

### Los tres experimentos

| Experimento | Ciencia | Sensor | Qué se mide | Dueño |
|---|---|---|---|---|
| **pH con lombarda** | Química | Cámara | El agua de cocer lombarda cambia de color según el pH. La cámara lee el color y estima si una sustancia es ácida, neutra o básica. | Karlos |
| **Rampa** | Física | Cámara | Una pelota baja por una rampa. La app la sigue fotograma a fotograma, saca la gráfica y calcula la gravedad. | Adrián |
| **Botellas** | Sonido | Micrófono | Se sopla una botella con distintos niveles de agua. El micrófono mide la frecuencia y con ella se calcula la velocidad del sonido. | Alejandro |

Se descartaron el **pulso con la cámara**, el de **sonido y distancia** y el de **concentración y color**.

### El flujo de cada experimento

Todos siguen el método científico:

1. **Presentación:** pregunta, materiales y seguridad.
2. **Hipótesis:** el alumno escribe lo que cree que pasará.
3. **Simulación:** prueba el experimento en virtual y hace una predicción.
4. **Montaje:** instrucciones paso a paso.
5. **Medición:** el experimento real con el sensor.
6. **Resultados:** datos, tabla, gráfica, comparación con su predicción y **"¿Por qué ha salido así?"** (explicaciones automáticas).
7. **Reflexión:** preguntas para pensar.
8. **Guardar** en el cuaderno.

En todos los pasos está el botón del asistente **"Pregunta a Lab"**.

### El cuaderno de laboratorio (en lugar del panel docente)

Se descartó el panel para el profesor porque era como hacer otra aplicación entera. En su lugar:
- Cada alumno tiene un **cuaderno** dentro de la app con todos sus experimentos.
- Un botón **"Compartir con mi profe"** genera una **ficha en imagen** que se manda por WhatsApp o por correo.
- El profe recibe los resultados **sin panel, sin cuentas y sin servidor**.

### El asistente "Pregunta a Lab" (decisión del 3 de noviembre)

Queríamos que la app **diera información automática del experimento** y **respondiera preguntas de los alumnos** sobre temas muy concretos. Se valoraron tres opciones:

| Opción | Decisión | Por qué |
|---|---|---|
| Chatbot que genera respuestas (modelo de lenguaje en el móvil) | ❌ Descartada | Ocupa cientos de MB o varios GB, va muy lento en móviles baratos y **se inventa cosas**, algo inaceptable en una app para niños. |
| **Asistente que busca entre respuestas preparadas** | ✅ **Elegida** | Entiende la pregunta del alumno, pero responde **solo con contenido escrito y revisado por el equipo**. Funciona sin internet y nunca se inventa nada. |
| Chatbot en internet (API) cuando haya conexión | ❌ Descartada | Servidor, claves, coste y privacidad de menores. Demasiado para un hackatón. |

Cómo queda:
- **Información automática:** cada experimento genera **explicaciones según lo que ha salido** (por ejemplo, si en la rampa sale g ≈ 7, explica la rodadura). Se muestran en "¿Por qué ha salido así?".
- **Preguntas del alumno:** cada experimento tiene un **banco de 20–30 preguntas** con varias formas de preguntarlas, y hay unas 20–25 preguntas generales. El asistente busca la más parecida en **dos niveles**:
  - **Nivel 1, por palabras:** siempre disponible, no ocupa nada.
  - **Nivel 2, por significado (IA de *embeddings*):** se descarga una vez. ⚠️ Como tiene que entender español, el modelo es multilingüe y puede rondar **los 100 MB**: hay que comprobarlo el primer día y, si es mucho, dejarlo como opción en Ajustes.
- Si no está seguro, **ofrece opciones o dice "Pregúntale a tu profe"**.
- **Quién lo hace:** el código, Nicolás (`ASISTENTE.md`). Los bancos de preguntas y las explicaciones, **cada dueño de experimento**.
- **Cuándo:** el contenido (preguntas y respuestas) se puede escribir desde ya. El código, **el martes, cuando los tres experimentos funcionen**.

---

## 5. Decisiones técnicas

| Tema | Decisión |
|---|---|
| Tipo de app | **Web app (PWA)** hecha con **React y Vite**, en **JavaScript**. Se abre desde el navegador del móvil con un enlace o un QR y se puede instalar con "Añadir a pantalla de inicio". |
| Sin internet | Se descarga una vez y después **funciona en modo avión**. Los modelos de IA se descargan solo cuando hacen falta (o desde Ajustes, con wifi). |
| Publicación | **Vercel**, conectado a GitHub. Cada cambio en `main` se publica solo. |
| Datos | **Nada sale del móvil.** No hay servidor. El cuaderno guarda en el propio móvil (IndexedDB con `idb-keyval`). No se guardan fotos, audios ni las preguntas al asistente. |
| Sensores | Solo **cámara y micrófono**, porque funcionan en cualquier móvil. |
| Licencia | MIT |

### La IA de la app

**No se usa ninguna IA de pago ni de internet.** Toda la IA es ligera y corre dentro del móvil:

| Dónde | Qué IA | Tamaño | ¿Hay que entrenarla? |
|---|---|---|---|
| **Rampa** | Detector de objetos de **MediaPipe** que encuentra la pelota. Luego se sigue por su color. **Plan B:** el alumno toca la pelota. | Unos 4–7 MB de modelo más unos MB del motor. Solo lo descarga quien entra en la rampa. | No. Viene entrenado por Google. |
| **pH** | **Clasificador k-NN** que estima el pH comparando con muestras de color. Aprende con la luz de cada aula (calibración). | Unos pocos KB. | Sí, pero es solo guardar ejemplos: las fotos de Karlos y la calibración en clase. Instantáneo. |
| **Asistente** | Búsqueda por palabras y, opcionalmente, por significado (*embeddings* multilingües). | Nivel 1: 0 MB. Nivel 2: del orden de 100 MB (por confirmar). | No. Solo hay que escribir buenas preguntas y respuestas. |
| **Botellas** | Sin IA: matemáticas (FFT). | — | — |

Todos los modelos necesitan internet **solo la primera vez**. Después funcionan en modo avión.

Mensaje para el jurado: *la IA cabe en el móvil, cuesta 0 €, funciona sin internet, no envía datos de menores a ningún sitio y nunca se inventa nada.*

---

## 6. Organización del equipo

### Principio clave: dividir por proyectos, no por capas

Cada persona hace **una parte completa** (su experimento entero, con su simulación, sus resultados, sus explicaciones y su banco de preguntas) y trabaja **solo en su carpeta**. Así nadie pisa el código de otro. Las partes se conectan mediante un **contrato** fijo (`CONTRATO.md`).

### Reparto (los cuatro últimos, por sorteo aleatorio)

| Parte | Encargado | Qué incluye | Documentos |
|---|---|---|---|
| **1. Arquitectura y app base** | **Gabriel** | Arquitectura, Git, reglas, componentes comunes, cámara y micrófono, inicio, flujo del experimento, Ajustes, modo prueba, PWA, publicación e integración final. | `ARQUITECTURA.md`, `REGLAS.md`, `CONTRATO.md` |
| **2. Experimento pH** | **Karlos** | Medición con cámara, k-NN, simulación, explicaciones, banco de preguntas y calibración con lombarda de verdad. | `PH.md` |
| **3. Experimento rampa** | **Adrián** | Seguimiento de la pelota, IA de detección, simulación, explicaciones, banco de preguntas y montar la rampa. | `RAMPA.md` |
| **4. Experimento botellas** | **Alejandro** | Detección del sonido, simulación, explicaciones, banco de preguntas y pruebas con botellas. | `BOTELLAS.md` |
| **5. Cuaderno, asistente, diseño y presentación** | **Nicolás** | Cuaderno y compartir ficha, código del asistente y preguntas generales, diseño visual, revisión del tono de los textos, pitch y vídeo de la demo. | `CUADERNO.md`, `ASISTENTE.md`, `DISENO.md`, `PITCH.md` |

El reparto busca que cada uno tenga más o menos un **20 % del trabajo**, contando el tiempo real (construir, probar con materiales, escribir contenido y corregir), no la dificultad del código. Con el asistente, la parte de Nicolás crece: para compensarlo, **cada dueño escribe los textos de su experimento** (antes los iba a escribir Nicolás) y él solo los revisa. Las partes que más pueden atascarse son la de **Gabriel** y la de **Adrián**: al que le sobre tiempo, que ayude ahí **probando**, no metiéndose en su código.

### Normas para no pisarnos

1. **Cada uno solo toca su carpeta**, y solo le pide a la IA cambios dentro de ella.
2. **Si necesitas algo común** (un componente, un cambio en las gráficas o en el contrato), **se lo pides a Gabriel**. No lo haces tú.
3. **Una rama por persona:** `parte/core`, `parte/ph`, `parte/rampa`, `parte/botellas`, `parte/cuaderno` (Nicolás usa esta para el cuaderno y el asistente).
4. **Se integra en `main` solo por Pull Request**, que revisa Gabriel. Después de cada integración, todos hacen `git pull origin main` en su rama.
5. **Subid vuestra parte en cuanto funcione algo**, no todo al final.
6. **Mensajes de commit en español** empezando por la parte, por ejemplo: `ph: añade estimación de pH por color`.

### ⚠️ Nada de IA en Git

**En ningún repositorio y en ningún momento puede aparecer Claude ni ninguna otra IA como colaborador o coautor.** Nada de `Co-Authored-By`, "Generated with…" ni enlaces de sesión en commits o Pull Requests. El autor de cada commit es siempre la persona que trabaja.

El repositorio lo blinda de tres maneras (los archivos están en `configuracion-repo/`):
- `.claude/settings.json`: desactiva la firma de Claude Code.
- `.githooks/commit-msg`: borra cualquier firma de IA de los mensajes de commit.
- `CLAUDE.md`: la orden por escrito para Claude Code.

**Cada uno, después de clonar el repositorio, ejecuta una vez:**
```bash
git config core.hooksPath .githooks
```
Y antes de abrir un Pull Request, revisad que la descripción no lleve ninguna firma de IA.

### Repositorio e invitaciones

- **GitHub:** `gvarelape/Hack4Edu`.
- Invitados como colaboradores: **Adrián** (`Adrian25-inf`), **Nicolás** (`NicolasTroyano`) y **Karlos** (`karlosvicent`). Tienen que **aceptar la invitación** (caduca a los 7 días).
- **Alejandro:** su correo `asevillejalo.inf@upsa.es` no tenía cuenta de GitHub. Tiene que **crearse la cuenta con ese correo** (o añadirlo a la que tenga) y aceptar la invitación desde el email.

---

## 7. Cómo vamos a programar: vibecoding con documentos preparados

**Decisión:** no llevamos código hecho antes del hackatón (así seguimos en la modalidad innovadora). Lo que llevamos es **todo preparado en documentos `.md`** para que la IA programe desde el primer minuto.

### Cómo usar los documentos con la IA

- **Con Claude Code en el repositorio:** el `CLAUDE.md` carga solo `REGLAS.md` y `CONTRATO.md`. Basta con decirle qué parte es la tuya y que lea tu documento.
- **Con cualquier otra IA en el chat:** al empezar **cada conversación**, pégale en este orden `REGLAS.md`, `CONTRATO.md` y tu documento de parte.

Después ve pidiéndole las tareas de la sección **"Prompts en orden"** de tu documento, **una a una**. No le pidas todo de golpe. Antes de pasar a la siguiente, comprueba que la anterior funciona.

**Ojo con el contenido que escribe la IA:** las respuestas del banco de preguntas y las explicaciones las va a dar el asistente por buenas. **Revisad cada una** antes de subirla: si la ciencia está mal, la app enseñará algo falso.

### Qué lleva cada documento de parte

Objetivo, datos del experimento (textos), la ciencia, cómo funciona por dentro, pantallas, formato del resultado, **explicaciones automáticas y temas del banco de preguntas**, archivos, **datos reales que hay que traer**, **prompts en orden** y **criterios de aceptación** (cómo sabes que está terminado).

### El modo prueba

Cada uno puede probar su parte **sin esperar a los demás** en `#/prueba/<su-parte>`, con archivos de vídeo o audio grabados en lugar del sensor en directo. Un **validador** avisa si el resultado no cumple el contrato. El asistente tiene `#/prueba/asistente`, que mide el porcentaje de aciertos.

---

## 8. Tareas pendientes

**Todos:**
- [ ] Aceptar la invitación al repositorio (Alejandro: crear antes la cuenta con su correo de la UPSA).
- [ ] Tener Node.js LTS, Git y VS Code instalados.
- [ ] Clonar el repositorio y ejecutar `git config core.hooksPath .githooks`.
- [ ] Leer este documento y el de su parte.
- [ ] Probar que la cámara y el micrófono funcionan en su móvil.
- [ ] Empezar a escribir su **banco de preguntas** (se puede hacer sin código).
- [ ] Pedir a hermanos, primos o amigos que escriban **preguntas reales** sobre su experimento, para el banco de pruebas del asistente.

**Gabriel:**
- [ ] Subir al repositorio los documentos, la licencia y la configuración anti-IA.
- [ ] Proteger `main` y crear las ramas.
- [ ] Cuenta de Vercel con GitHub.
- [ ] Preguntar a la organización cuánto dura el pitch y qué recursos de IA ofrecen.

**Karlos:** lombarda, fotos con dos luces y dos móviles, vídeo de los vasos y pH real de cada sustancia.

**Adrián:** rampa probada, 2 o 3 vídeos con las medidas en el nombre y la pelota que mejor se ve.

**Alejandro:** la botella más clara y recta, grabaciones con 4 o 5 niveles de agua y una grabación de ruido de clase.

**Nicolás:**
- [ ] Cerrar el diseño (`DISENO.md`) y pasárselo a Gabriel.
- [ ] Nombre del equipo y de la app.
- [ ] Preguntas generales del asistente.
- [ ] Revisar el tono de los textos de los demás.
- [ ] 1 o 2 datos reales, con fuente, sobre escuelas sin laboratorio o sin conexión.
- [ ] Borrador del pitch y de las diapositivas.

---

## 9. Plan del hackatón

| Día | Objetivo | Detalle |
|---|---|---|
| **Lunes 3** | **Que todo funcione** | Gabriel monta la base en unas 3 horas mientras los demás programan la lógica de su parte (cálculos con sus datos de prueba, sin pantallas) y empiezan su banco de preguntas. Por la tarde, cada experimento mide algo de verdad dentro de la app. |
| **Martes 4** | **Que todo esté completo** | Simulaciones, IA de la rampa, explicaciones, cuaderno y compartir. **El asistente, cuando los tres experimentos funcionen.** Al final del día, integración completa en el enlace público. **Enseñársela a la mentora.** |
| **Miércoles 5** | **Que todo luzca** | A media mañana se **congela el código**: desde ese momento solo se arreglan fallos, no se añade nada. Por la tarde, **vídeo de la demo** y ensayos del pitch (uno delante de la mentora). |
| Jueves 6 | Finalistas | |
| Viernes 7 | Final internacional | |

**Si vamos justos de tiempo, se recorta en este orden:** nivel 2 del asistente → calibración en clase del pH → simulaciones más simples. Lo que **no** se recorta: los tres experimentos midiendo, el cuaderno y el funcionamiento sin internet.

---

## 10. El pitch

- **Frase clave:** *"El laboratorio de ciencias que ya está en el bolsillo del alumno: funciona sin internet, cuesta 0 € y su IA cabe en el móvil."*
- **Orden de la demo:** pH (el más visual) → rampa (la IA encuentra la pelota y calcula g) → botellas (medir la velocidad del sonido) → asistente en modo avión (incluida una pregunta que no sabe) → cuaderno y "Compartir con mi profe".
- Como la presentación es virtual, la demo se enseña con una segunda cámara grabando el móvil. **Siempre con un vídeo grabado de reserva.**
- Para el premio Retos ProFuturo, insistir en: sin internet, móviles baratos, materiales caseros y privacidad de menores.
- **No inventar cifras:** cualquier dato, con su fuente. Los tamaños y porcentajes de acierto, los medidos de verdad.

El guion completo, las preguntas que nos pueden hacer y la estructura de las diapositivas están en `PITCH.md`.

---

## 11. Conceptos básicos (para que todos hablemos el mismo idioma)

| Concepto | Qué es |
|---|---|
| **Lenguaje** | El idioma en el que se escribe el código. Usamos **JavaScript**. |
| **Librería** | Código ya hecho al que **tú llamas** cuando quieres (como `stdio.h` en C o `idb-keyval` aquí). |
| **Framework** | Código ya hecho que te da la estructura y **te llama a ti**. Te impone cómo organizar el proyecto. |
| **React** | Técnicamente una **librería** para hacer interfaces, aunque mucha gente la llama framework porque te hace organizarlo todo en **componentes**. Se encarga de repintar solo lo que cambia. |
| **JSX** | La mezcla de JavaScript con etiquetas tipo HTML que se usa en React. El navegador no la entiende directamente. |
| **Vite** | La **herramienta** que crea el proyecto, lo sirve en tu ordenador con recarga instantánea (también en el móvil) y lo empaqueta para publicarlo. Traduce el JSX a JavaScript normal. |
| **PWA** | Una web que se puede **instalar** en el móvil como una app y funcionar **sin internet**. |
| **HTTPS** | Conexión segura. Sin ella, el navegador no deja usar la cámara ni el micrófono. Por eso usamos `plugin-basic-ssl` en desarrollo. |
| **IndexedDB** | Base de datos que viene dentro de todos los navegadores. Guarda datos en el propio dispositivo. |
| **idb-keyval** | Librería diminuta que convierte IndexedDB en un simple "guardar y leer por clave". |
| **MediaPipe** | Librería de Google con modelos de IA que corren en el navegador. La usamos para detectar la pelota. |
| **k-NN** | IA muy sencilla: para clasificar algo, busca los k ejemplos más parecidos que conoce y hace la media. |
| **Embeddings** | Convertir una frase en una lista de números que representa su significado. Frases que significan lo mismo dan números parecidos. |
| **FFT** | Operación matemática que descompone un sonido en sus frecuencias. Con ella sabemos el tono de la botella. |
| **Vercel** | Servicio gratuito que publica la web en internet cada vez que se sube código a `main`. |

---

## 12. Índice de documentos

| Archivo | Para quién | Qué es |
|---|---|---|
| `LEEME_PRIMERO.md` | Todos | Este resumen. |
| `README.md` | Todos | Resumen corto, reparto, primeros pasos, normas de Git y calendario. Va en la raíz del repositorio. |
| `REGLAS.md` | Todos (se le pasa a la IA) | Normas de código, estilo, carpetas, librerías, IA y privacidad. |
| `CONTRATO.md` | Todos (se le pasa a la IA) | Cómo se conectan las partes: experimento, resultado, explicaciones, preguntas, cuaderno y asistente. |
| `ARQUITECTURA.md` | Gabriel | Estructura, stack, flujo, Ajustes, modo prueba, Git, Vercel y plan del primer día. |
| `DISENO.md` | Nicolás → Gabriel | Colores en RGB, tipografía, espaciados, componentes y guía de tono de los textos. |
| `PH.md` | Karlos | Experimento pH completo. |
| `RAMPA.md` | Adrián | Experimento rampa completo. |
| `BOTELLAS.md` | Alejandro | Experimento botellas completo. |
| `CUADERNO.md` | Nicolás | Cuaderno de laboratorio y compartir ficha. |
| `ASISTENTE.md` | Nicolás | Asistente "Pregunta a Lab". |
| `PITCH.md` | Nicolás (y todos) | Guion, demo, criterios del jurado y checklist del pitch. |
| `configuracion-repo/` | Gabriel | `CLAUDE.md`, `.claude/settings.json`, `.githooks/commit-msg` y `.gitignore`, listos para copiar a la raíz del repositorio. |
