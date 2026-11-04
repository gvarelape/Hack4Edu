# Diseño visual · Nicolás

> **Propuesta inicial.** Nicolás la ajusta y la cierra **cuanto antes**, y se la pasa a Gabriel, que la convierte en `src/core/estilos/tokens.css`. A partir de ahí, nadie usa colores ni tamaños que no estén aquí.

## Principios

- **Para alumnos de 12 a 16 años, en móviles baratos:** letra grande, botones grandes, una cosa por pantalla.
- **Funciona a pleno sol y en aulas con poca luz:** alto contraste.
- **Cada ciencia tiene su color**, para reconocerla de un vistazo.
- **Sin imágenes pesadas:** iconos en SVG y nada de fotos de fondo.
- **Sin fuentes descargadas:** la del sistema, para que funcione sin internet y no pese nada.

## Colores

| Token | Uso | RGB |
|---|---|---|
| `--color-primario` | Botones principales, enlaces, progreso | `rgb(37, 99, 235)` |
| `--color-primario-suave` | Fondos de etiquetas y resaltados | `rgb(219, 234, 254)` |
| `--color-fondo` | Fondo de la app | `rgb(248, 250, 252)` |
| `--color-superficie` | Tarjetas y paneles | `rgb(255, 255, 255)` |
| `--color-texto` | Texto principal | `rgb(17, 24, 39)` |
| `--color-texto-suave` | Texto secundario | `rgb(75, 85, 99)` |
| `--color-borde` | Bordes y líneas | `rgb(229, 231, 235)` |
| `--color-error` | Errores, botón de peligro | `rgb(220, 38, 38)` |
| `--color-error-suave` | Fondo de avisos de error | `rgb(254, 226, 226)` |
| `--color-exito` | Mensajes de éxito | `rgb(22, 163, 74)` |
| `--color-exito-suave` | Fondo de avisos de éxito | `rgb(220, 252, 231)` |
| `--color-info-suave` | Fondo de avisos informativos | `rgb(219, 234, 254)` |
| `--color-sombra` | Sombra del botón flotante y de los paneles | `rgba(17, 24, 39, 0.18)` |
| `--color-velo` | Fondo oscurecido detrás de paneles y confirmaciones | `rgba(17, 24, 39, 0.45)` |

### Color por ciencia

| Token | Ciencia | RGB |
|---|---|---|
| `--color-quimica` | pH | `rgb(126, 34, 206)` |
| `--color-fisica` | Rampa | `rgb(194, 65, 12)` |
| `--color-sonido` | Botellas | `rgb(21, 128, 61)` |

### Colores de las gráficas (por `rol`)

| Token | Rol | RGB |
|---|---|---|
| `--color-serie-medido` | Datos reales | `rgb(37, 99, 235)` |
| `--color-serie-teorico` | Fórmula o ajuste | `rgb(220, 38, 38)` |
| `--color-serie-simulado` | Simulación | `rgb(156, 163, 175)` |

> En los `canvas` (ficha para compartir, simulaciones) no se pueden usar variables CSS: se usan directamente estos valores RGB.

## Tipografía

- **Fuente del sistema:** `system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif`. No se descarga ninguna fuente: funciona sin internet y pesa 0 KB.

| Token | Uso | Tamaño |
|---|---|---|
| `--texto-pequeno` | Notas y leyendas | 14 px |
| `--texto-normal` | Texto general | 16 px |
| `--texto-grande` | Preguntas y subtítulos | 20 px |
| `--texto-titulo` | Títulos de pantalla | 26 px |
| `--texto-dato` | Valor destacado (pH ≈ 3,2 · 9,62 m/s²) | 40 px, negrita |

## Espaciado y formas

| Token | Valor |
|---|---|
| `--espacio-1` | 4 px |
| `--espacio-2` | 8 px |
| `--espacio-3` | 16 px |
| `--espacio-4` | 24 px |
| `--espacio-5` | 40 px |
| `--radio` | 14 px (tarjetas y botones) |
| `--radio-pequeno` | 8 px (campos y etiquetas) |
| `--radio-chip` | 999 px (chips y botón flotante) |
| `--alto-boton` | 52 px |
| `--ancho-maximo` | 560 px (en pantallas grandes el contenido se centra) |

## Componentes

- **Botón principal:** fondo primario, texto blanco, ocupa todo el ancho, `--alto-boton` de alto y esquinas `--radio`.
- **Botón secundario:** fondo blanco, borde gris y texto oscuro.
- **Tarjeta de experimento** (en el inicio):
  - Etiqueta con la ciencia, en su color.
  - Título y descripción corta.
  - Borde izquierdo de 6 px en el color de la ciencia.
- **Barra de progreso del flujo:** ocho segmentos. Los hechos van en primario y los pendientes en gris.
- **Valor destacado:** número en `--texto-dato` con la unidad al lado, más pequeña.
- **Explicaciones ("¿Por qué ha salido así?"):** tarjetas con fondo `--color-info-suave`, título en negrita y el enlace "Saber más" en primario.
- **Confirmación:** ventana centrada sobre `--color-velo`, con el texto y dos botones (aceptar y cancelar).
- **Asistente:**
  - **Botón flotante "Pregunta a Lab":** abajo a la derecha, a 16 px de los bordes, fondo primario, texto blanco, `--radio-chip` y sombra. No debe tapar el botón principal de la pantalla (dejar espacio debajo del contenido).
  - **Panel:** sube desde abajo, fondo `--color-superficie`, esquinas superiores redondeadas, sobre `--color-velo`.
  - **Chips de preguntas sugeridas:** fondo `--color-primario-suave`, texto primario, `--radio-chip`.
  - **Respuesta:** la pregunta entendida en `--texto-pequeno` y `--color-texto-suave`, y la respuesta en `--texto-normal`.

## Iconos y logo

- Logo de la app en SVG y dos iconos PNG para instalarla: `icon-192.png` (192×192) y `icon-512.png` (512×512). Van en `public/iconos/`.
- Un icono por ciencia: matraz (Química), pelota en rampa (Física) y onda de sonido (Sonido). En SVG sencillo, de un solo color.
- Icono del asistente: bocadillo de conversación con un signo de interrogación.

## Guía de tono de los textos

Para todos los textos de la app: experimentos, explicaciones, preguntas del asistente y avisos.

- **Tuteo** y tono cercano, como un profe joven que explica bien.
- **Frases cortas.** Una idea por frase.
- **Sin tecnicismos sin explicar.** Si sale "frecuencia", se explica la primera vez ("cuántas veces vibra por segundo").
- **Ejemplos de la vida diaria** siempre que se pueda.
- **Los errores no son fracasos:** "Tu hipótesis no se ha cumplido, ¡y eso también es ciencia!".
- **Avisos que dicen qué hacer:** no "Error de cámara", sino "No podemos usar la cámara. Revisa que le has dado permiso".
- **Números con coma decimal** y unidades siempre (9,81 m/s²).
- Emojis: con moderación, como mucho uno en mensajes de ánimo.

## Pendiente de decidir (Nicolás)

- [ ] Nombre final de la app (provisional: *Lab de Bolsillo*) y del equipo (favoritos: *Kaballo de Troya* y *GATKA*).
- [ ] Logo.
- [ ] ¿Modo oscuro? **Recomendación: no.** Duplica el trabajo de diseño y no aporta nada al reto.
