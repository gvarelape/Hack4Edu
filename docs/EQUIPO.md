# Cómo trabajamos · Equipo

Este documento es para el equipo. La descripción del proyecto está en el `README.md`.

> **¿Eres nuevo en el proyecto?** Lee primero `docs/LEEME_PRIMERO.md`: resume todas las decisiones.

## Reparto

| Parte | Encargado | Documento |
|---|---|---|
| 1. Arquitectura y app base | Gabriel | `ARQUITECTURA.md`, `REGLAS.md`, `CONTRATO.md` |
| 2. Experimento pH | Karlos | `PH.md` |
| 3. Experimento rampa | Adrián | `RAMPA.md` |
| 4. Experimento botellas | Alejandro | `BOTELLAS.md` |
| 5. Cuaderno, asistente, diseño y presentación | Nicolás | `CUADERNO.md`, `ASISTENTE.md`, `DISENO.md`, `PITCH.md` |

Los bancos de preguntas del asistente los escribe cada dueño sobre su experimento.

## Primeros pasos (cada uno, una vez)

1. Aceptar la invitación al repositorio (llega por correo o en GitHub → notificaciones).
2. Tener instalados **Node.js LTS, Git y VS Code** (`node -v` y `git --version` para comprobarlo).
3. Clonar y activar el hook que impide firmas de IA en los commits:
   ```bash
   git clone https://github.com/gvarelape/Hack4Edu.git
   cd Hack4Edu
   git config core.hooksPath .githooks
   ```
4. Cambiar a tu rama: `git checkout parte/<tu-parte>` (`core`, `ph`, `rampa`, `botellas` o `cuaderno`).

## Cómo usar estos documentos con la IA

- **Con Claude Code en el repositorio:** `CLAUDE.md` carga solo `REGLAS.md` y `CONTRATO.md`. Dile qué parte es la tuya y que lea tu documento.
- **Con cualquier otra IA en el chat:** al empezar **cada conversación**, pégale en este orden `REGLAS.md`, `CONTRATO.md` y el documento de tu parte.

Después ve pidiéndole las tareas de la sección **"Prompts en orden"** de tu documento, **una a una**. No le pidas todo de golpe. Antes de pasar a la siguiente, comprueba que la anterior funciona en `#/prueba/<tu-parte>`.

## Normas de Git

- Cada uno trabaja en **su rama** y solo en **su carpeta**.
- Se integra en `main` **solo por Pull Request**, que revisa Gabriel. Después, todos `git pull origin main`.
- Commits en español, empezando por la parte: `rampa: añade el ajuste por mínimos cuadrados`.
- ⚠️ **Ningún commit ni Pull Request puede llevar firmas ni menciones a Claude ni a ninguna otra IA.** El hook las borra de los commits; en las descripciones de los Pull Requests, revisadlo vosotros.

## Calendario del hackatón

| Día | Objetivo |
|---|---|
| **Lun 3 nov** | **Que todo funcione.** Gabriel monta la base; los demás programan la lógica de su parte con sus datos de prueba y empiezan su banco de preguntas. Por la tarde, cada experimento mide algo dentro de la app. |
| **Mar 4 nov** | **Que todo esté completo.** Simulaciones, IA de la rampa, explicaciones, cuaderno y compartir. El asistente, **cuando los tres experimentos funcionen**. Al final del día, todo integrado en el enlace público. Enseñárselo a la mentora. |
| **Mié 5 nov** | **Que todo luzca.** A media mañana se **congela el código**: solo se arreglan fallos. Por la tarde, vídeo de la demo y ensayos del pitch. |
| **Jue 6 nov** | Recepción de finalistas. |
| **Vie 7 nov** | Final internacional. |

## Datos del hackatón

- Competimos en la **modalidad innovadora** (proyecto nuevo): premios de 1.500 €, 1.000 € y 700 €. Hay además un premio Retos ProFuturo de 1.000 € al mayor impacto social. Un equipo no puede ganar más de un premio.
- Criterios del jurado: creatividad, calidad técnica, posibilidad de llevarlo al mercado y uso de IA para resolver retos educativos.
- Las presentaciones son **virtuales**: llevad el vídeo de la demo grabado sí o sí.
- El proyecto es nuestro, pero se publica con licencia libre (**MIT**).
