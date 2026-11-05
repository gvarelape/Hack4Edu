# Kanga

**Un laboratorio de ciencias en el móvil del alumno, también sin internet.**

Proyecto para Hack4Edu 2026, reto 17: *Un laboratorio de ciencias donde no existe un laboratorio*.

**Pruébala:** https://kanga-five.vercel.app (ábrela en el móvil e instálala desde el navegador)

## La idea

Muchas escuelas no tienen laboratorio, pero un móvil está al alcance de muchos alumnos. Kanga usa su cámara y su micrófono como instrumentos de medida, con materiales que hay en casa. El móvil se queda quieto, observando el experimento, y el alumno hace ciencia con las manos.

## Tres experimentos

| Experimento | Ciencia | Cómo mide | Qué descubre el alumno |
|---|---|---|---|
| Indicador de pH con lombarda | Química | La cámara lee el color del líquido | Qué sustancias de su casa son ácidas o básicas |
| Pelota en una rampa | Física | La cámara sigue la pelota y ajusta su movimiento | La aceleración de la gravedad, y por qué rodar la reduce |
| La música de las botellas | Sonido | El micrófono analiza el tono al soplar | La velocidad del sonido |

Todos siguen el mismo camino: pregunta, hipótesis, simulación, montaje, medida, resultados explicados y reflexión. Cada experimento queda en un **cuaderno de laboratorio** dentro del móvil, y el alumno puede compartirlo con su profe como imagen.

## La IA, dentro del móvil

No hay servidores, ni cuentas, ni coste por alumno. Cada IA tiene además un plan B que funciona sin ella.

| Dónde | Qué hace | Si no está disponible |
|---|---|---|
| Rampa | Un detector de objetos (MediaPipe) busca la pelota | El alumno la toca en la pantalla |
| pH | Un clasificador k-NN aprende de muestras medidas con la luz y la cámara de cada aula | Lejos de lo aprendido, y sin calibrar, usa una tabla de colores |
| Asistente «Pregunta a Kanga» | Busca entre las respuestas escritas por el equipo, también por significado si se activa la búsqueda inteligente | Busca por palabras |

El asistente **nunca genera texto**: solo elige entre respuestas revisadas y, si no está seguro, lo dice y manda al alumno a su profe. Tampoco guarda lo que se le pregunta.

## Pensada para donde hace falta

- **Sin internet:** es una PWA. Se descarga una vez y después funciona en modo avión.
- **Móviles baratos:** la app inicial pesa poco y los modelos solo se descargan si hacen falta.
- **Privacidad de menores:** ningún dato sale del móvil. No se guardan fotos, vídeos ni audio.
- **Tres idiomas:** español, inglés y francés.
- **Ampliable:** cada experimento es un módulo que cumple el mismo contrato.

## Técnica

React y Vite en JavaScript, sin librerías de componentes ni de gráficas. MediaPipe Tasks Vision, Transformers.js con ONNX Runtime en un Web Worker, Web Audio con FFT e IndexedDB.

```bash
npm install
npm run dev      # desarrollo
npm test         # pruebas de la lógica
npm run build    # versión de producción
```

Cada parte se puede probar por separado en `#/prueba/ph`, `#/prueba/rampa`, `#/prueba/botellas`, `#/prueba/cuaderno` y `#/prueba/asistente`.

| Carpeta | Contenido |
|---|---|
| `src/core/` | Rutas, flujo, componentes, sensores, traducciones |
| `src/experimentos/` | Los tres experimentos |
| `src/cuaderno/` | Registros y compartir |
| `src/asistente/` | Búsqueda de respuestas en dos niveles |
| `docs/` | Decisiones, contrato entre partes y guía del equipo (`EQUIPO.md`) |

## Equipo

Gabriel (arquitectura y app base), Karlos (pH), Adrián (rampa), Alejandro (botellas) y Nicolás (cuaderno, asistente, diseño y presentación).

## Licencia

Código bajo licencia [MIT](LICENSE). La tipografía Gloock se distribuye con licencia OFL (`public/fuentes/`). Los modelos y las librerías de terceros mantienen sus propias licencias.
