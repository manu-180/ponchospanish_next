---
paths:
  - "scripts/cursos/**"
---

# Cursos en video (2026-10-23)

Manuel quiere que todos los cursos de Poncho salgan con este formato: lecciones cortas en
motion graphics con HyperFrames, subtituladas, explicación en inglés británico y voces
nativas de España y Argentina. El generador es `scripts/cursos/build_course.py`; un curso
nuevo es un archivo en `scripts/cursos/courses/` que apunta a un libro de
`scripts/ebooks/books/` y trae sólo el guion hablado (hook, explicación de gramática, tips).

- Marcado del guion: texto suelto = narradora `en-GB-SoniaNeural`; `«…»` = España
  (`es-ES-ElviraNeural`); `‹…›` = Argentina (`es-AR-TomasNeural`). Nunca dejar una palabra en
  español dentro de una frase de la narradora: la lee con acento inglés.
- `rows` va fila por fila con la tabla de gramática del libro (`None` = encabezado); si el
  libro cambia la tabla, cambiar `rows`.
- Voces con edge-tts (gratis, sin clave; cache en `.cache/tts/`). La clave de OpenAI de la
  bóveda está desactivada y no hay ElevenLabs.
- Subtítulos según la skill `subtitulos-premium` (Bricolage 800 a 64 px, resaltador por
  palabra, tinta por fondo: crema = `claro`, negro = `oscuro`, terracota = `terra`).
- Música: loop CC0 de Freesound ("simple relaxing guitar loop", Kodack). SFX: pop, whoosh y
  sparkle de la librería de `media-use`.
- Los videos se entregan a Manuel (carpeta de Descargas), nunca por el grupo de Anto:
  él se los pasa cuando quiere.
- Render: ~1,4x tiempo real con 16 workers. Un curso de 38 lecciones son ~2 h de render.
