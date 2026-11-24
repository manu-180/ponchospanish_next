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
- Voces con ElevenLabs (`ELEVENLABS_API_KEY` en envkit, ids en `voices.json`); sin clave cae
  a edge-tts. Cache en `.cache/tts/` por texto: cambiar una frase sólo regenera esa.
- Los cambios que Anto pide sobre un curso se juntan hasta su "Listo" y los aplica la
  rutina `poncho-pedidos` (`docs/pedidos/PROTOCOLO.md`), que deja `"render": "<curso>"` en el
  estado.json. El render y la entrega los hace sola `scripts/cursos/entregar.py` en la PC de
  escritorio (tarea programada "Poncho - renders pendientes", cada hora; log en
  `%LOCALAPPDATA%\poncho-cursos\entregar.log`): render, zip, Drive con link público, e-book si
  cambió el libro y el pedido de entrega que el bot le manda a Anto. Si falla, alerta
  `poncho:cursos:render-<curso>` en el tablero de Kairo.
- La caché de voces fija vive en `%LOCALAPPDATA%\poncho-cursos\tts` (`PONCHO_TTS_CACHE`); la
  de `.cache/tts/` de cada checkout es la de las corridas a mano.
- ElevenLabs va siempre por `elevenlabs-con-saldo.mjs`. Las voces del curso (Tere, Carlos,
  Carolina, Agustín, Valeria) son de la biblioteca y están en las dos cuentas con el mismo ID
  desde el 24/11: una voz nueva hay que sumarla también a la de respaldo
  (`POST /v1/voices/add/<public_owner_id>/<voice_id>`) o la corrida se queda sin cuenta. Con
  `--jobs 16` el plan starter devuelve 429: `tts()` reintenta con espera.
- Subtítulos según la skill `subtitulos-premium` (Bricolage 800 a 64 px, resaltador por
  palabra, tinta por fondo: crema = `claro`, negro = `oscuro`, terracota = `terra`).
- Música: loop CC0 de Freesound ("simple relaxing guitar loop", Kodack). SFX: pop, whoosh y
  sparkle de la librería de `media-use`.
- Los videos van a Descargas y se le mandan a Anto apenas están (desde 2026-10-24; antes
  se demoraban a propósito). El zip pasa los 60 MB del bot: va por link de Drive.
- Render: ~1,4x tiempo real con 16 workers. Un curso de 38 lecciones son ~2 h de render.
  Necesita más de 20 GB libres en E: (con 14 GB una lección falló por ENOSPC); las `fallidas`
  se reintentan con `--only X --skip-build --render <carpeta>`.
- Un libro con el capítulo al revés (`title` en inglés, `en` en español, como Spanish for
  Travel) lleva `"swap_chapter_names": True` en el curso. Con más de seis módulos la pantalla
  de módulos arma la grilla sola (4 columnas); `modules_line`/`modules_sub` dicen cuántos son.
- Una fila de `grid` con `"ES/AR"` sale con las dos voces y las dos banderas en la tarjeta.
- Antes de sintetizar, medir los caracteres de ElevenLabs con el `tts` falso (plan starter:
  84k por mes; Spanish for Travel pidió ~43k para 87 lecciones).
- La tarea programada corre `%LOCALAPPDATA%\poncho-cursos\tarea.ps1` (vive en la PC, no en el repo). Dos
  trampas del 24/11: llama a `envkit.cmd` y no a `envkit` (el shim .ps1 de PowerShell 5.1 se come el `--` y
  envkit rechaza `--auto`), y fija `PYTHONPATH` en la carpeta de la app de Claude
  (`%LOCALAPPDATA%\Packages\Claude_*\LocalCache\Roaming\Python\Python313\site-packages`): un `pip install --user`
  desde una sesión instala ahí y la tarea no lo ve. Un render a mano no escribe el candado: `entregar.py` sólo
  respeta un candado con el PID de un proceso vivo.
