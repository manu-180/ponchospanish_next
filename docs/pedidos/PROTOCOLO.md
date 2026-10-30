# Pedidos de Anto — protocolo de la rutina

Anto pide cambios por el grupo de WhatsApp "Poncho" y cierra cada tanda con **"Listo"**.
Quien le habla a Anto es **Kairo**, el compañero de trabajo de Manu (identidad en
`manu-180/kairo`, `IDENTIDAD.md`): todo lo que el bot le dice en el grupo, incluidos el
`mensaje` y la `pregunta` que escribís acá, es Kairo hablando. Paciente, cálido, en
criollo y sin tecnicismos: le contás lo que va a ver, no cómo lo hiciste. Al recibir el
"Listo", Kairo ya le confirmó con sus palabras qué entendió (lo escribe el bot con Claude).

El bot (`bot_fede`, Railway) commitea esa tanda a la rama **`pedidos`** de este repo
como `pedidos/<id>/pedido.json` + `pedidos/<id>/media/`. Ese push dispara la rutina
de Claude `poncho-pedidos`, que sigue este archivo.

La sesión cloud no tiene red hacia el bot ni hacia Vercel: todo ida y vuelta viaja por
git. El bot mira `pedidos/<id>/estado.json` cada 2 minutos.

## 1. ¿Hay trabajo?

```bash
git fetch origin pedidos main
PEND=""
for d in $(git ls-tree -d --name-only origin/pedidos pedidos/ 2>/dev/null); do
  git cat-file -e "origin/pedidos:$d/pedido.json" 2>/dev/null || continue
  git cat-file -e "origin/pedidos:$d/estado.json" 2>/dev/null && continue
  PEND="$d"; break
done
[ -n "$PEND" ] || { echo "Sin pedidos."; exit 0; }
echo "Pedido pendiente: $PEND"
```

Sin pedido pendiente se termina ahí, en una línea, sin instalar ni leer nada: cada push
a cualquier rama del repo (incluidos los tuyos) vuelve a disparar la rutina.

## 2. Tomarlo

```bash
git worktree add -B pedidos ../pedidos origin/pedidos
cd ../pedidos
echo '{"estado":"trabajando"}' > "$PEND/estado.json"
git add "$PEND/estado.json"
git -c user.name=manu-180 -c user.email=157671390+manu-180@users.noreply.github.com commit -m "pedido $(basename $PEND): tomado"
git push origin pedidos || { echo "Otra corrida lo tomó."; exit 0; }
```

## 3. Entender la tanda

- `pedido.json` trae los mensajes en orden (`hora` en Argentina, `autor`, `texto`,
  `media`). Los audios ya vienen transcriptos en `texto` (Whisper: puede tener errores
  de oído, interpretá con criterio). Abrí con Read **toda** imagen y PDF de `media/`:
  casi siempre son capturas de la web marcando qué cambiar o el material para pegar.
- Si `anterior` no es null, leé `pedidos/<anterior>/estado.json`: si ahí hay una
  `pregunta`, esta tanda probablemente trae la respuesta de Anto.
- Un mensaje posterior que corrige uno anterior manda. Charla personal, stickers y
  saludos no son pedidos.
- Leé `AGENTS.md` antes de tocar nada.

## 4. ¿Hay una duda real?

Preguntar cuesta: Anto pidió que el bot **sólo** pregunte cuando de verdad no se puede
seguir. Es duda real únicamente si:

- hay dos lecturas razonables del pedido y el resultado visible cambia mucho entre una
  y otra, y ni las capturas ni el contexto lo resuelven;
- falta un dato que no se puede inventar ni deducir: un precio, una fecha, un dato de
  examen, un texto que ella dijo que iba a mandar y no mandó;
- el pedido choca con `AGENTS.md` (PayPal, sumar una sección o página nueva que ella no
  pidió explícitamente).

**No** es duda: elegir la redacción, el tono, el lugar obvio de un cambio, corregir un
typo, adaptar al estilo de la web, decidir detalles de diseño. Eso se resuelve con
criterio y se hace.

Lo claro se implementa igual aunque haya una duda en otra parte del pedido. Lo dudoso
queda sin tocar hasta la respuesta.

### Cuando Anto pregunta algo

Una pregunta de Anto ("¿los pasos para usar el código serían estos?", "¿cómo hago
para...?") es un pedido: se contesta. Averiguá la respuesta en el código del sitio y la
Academy (el flujo real, los textos que ve el alumno), no de memoria, y escribila en el
`mensaje` como se la explicaría Kairo: si lo que ella supone está bien, confirmáselo; si
falta o sobra un paso, decíselo con los pasos en orden, en sus palabras y sin nombres de
pantallas técnicas. Si la respuesta depende de algo que no podés ver (su panel, un dato
de producción), decí qué sí confirmaste y qué tiene que mirar ella. Una tanda que sólo
trae una pregunta cierra igual con `estado: "hecho"`, sin commits en `main`.

## 5. Implementar y desplegar

```bash
cd <repo>                      # el clon original, no ../pedidos
git checkout -B main origin/main
pnpm install --frozen-lockfile
```

- Reglas de contenido: `AGENTS.md` (público, "menos es más", nada de PayPal, inglés
  británico en la web, nunca datos de exámenes sin fuente oficial).
- Material que no es la web (un e-book, un PDF, un recurso): se arma en
  `pedidos/<id>/entregables/` de la rama `pedidos`, no en main, y se nombra en el
  `resumen`. No se publica en la Academy sin que Manuel lo apruebe.
- Antes de pushear: `pnpm type-check` y `pnpm build` en verde. El build necesita
  `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` (vienen en el entorno
  de la rutina). Si el build cae **sólo** al prerenderizar `/sitemap.xml` porque no
  llega a Supabase (red de la sesión cloud), alcanza con `pnpm type-check` y
  `pnpm test:seo` en verde: Vercel construye de nuevo y si falla no promueve el deploy.
  Anotalo en el `resumen`. `pnpm lint` no es puerta.
- Commits firmados `manu-180 <157671390+manu-180@users.noreply.github.com>`: con otro
  autor Vercel deja el deploy en `BLOCKED` sin avisar.
- `git push origin HEAD:main` es el deploy (Git integration de Vercel). Si el push
  rebota, `git pull --rebase origin main` y de nuevo. Nunca `--force`.

### Cambios a un curso en video

Anto revisa los cursos (`scripts/cursos/`) y manda cambios con lección y minuto
("1.1, 0:52: HASTA CHAU por CHAU", "pronunciación de JIRAFA", "TE TOCA por TU TURNO en
todo el curso"). La rutina **no renderiza**: el render necesita la caché de voces de la
PC de Manuel (`scripts/cursos/.cache/tts/`, fuera de git), ElevenLabs y ~2 h de máquina,
y el curso nuevo sale desde ahí (la rutina no lo puede mandar).

- Aplicá todos los cambios de la tanda en el guion (`scripts/cursos/courses/<curso>.py`),
  en el libro base (`scripts/ebooks/books/`) si la palabra sale de ahí, o en
  `build_course.py` si el error lo genera el armado (antes de tocar un texto, fijate de
  dónde sale). Commit a `main` como cualquier cambio.
- El minuto que da Anto ubica el pedido dentro de la lección: la lección `1.1` es el
  capítulo 1, unidad 1, y el orden de las escenas es el del guion. Los videos que manda
  (`.mp4`) no se pueden ver desde la sesión; alcanza con su texto.
- Pronunciación: las voces son ElevenLabs `eleven_multilingual_v2`. Una palabra
  española sola (`«jirafa»`) a veces sale con acento inglés porque el modelo no sabe el
  idioma: dale contexto español en el guion (`«la jirafa»`, o la palabra dentro de una
  frase corta). Nunca respellings que cambien lo que se ve en pantalla sin avisar.
- Un cambio "en todo el curso" (un título que se repite, como `¡Te toca!`) se busca en el
  guion, en `build_course.py` y en `template/`.
- `adjuntos` vacío y `mensaje` sin prometer el video: "Ya dejé hechos todos los cambios
  del curso; Manu te pasa la versión nueva apenas la termine". El `resumen` le dice a
  Manuel qué lecciones cambiaron y que corra
  `python scripts/cursos/build_course.py <curso> --jobs 16 --render <carpeta>`.

## 6. Cerrar

En `../pedidos`, `$PEND/estado.json`:

```json
{
  "estado": "hecho",
  "mensaje": "¡Listo, Anto! Ya cambié el título de la home y subí las fotos nuevas ✨",
  "pregunta": null,
  "resumen": "Qué se cambió, en dos o tres líneas, para Manuel.",
  "commits": ["<sha en main>"],
  "adjuntos": ["entregables/Spanish-for-Travel-Poncho.pdf"]
}
```

- `mensaje`: lo que Kairo le manda a Anto en el grupo al terminar (ya le confirmó al
  recibir el "Listo"). Si preguntó algo, acá va la respuesta. Mismo tono que `pregunta`: una o dos frases sobre lo que ella va
  a ver en la web, sin tecnicismos. Si hay `pregunta`, el bot manda `mensaje` y abajo la
  pregunta, así que el `mensaje` dice qué quedó hecho y no anticipa la duda. Sin
  `mensaje`, el bot manda un "¡Listo, Anto! Ya está todo subido a la web ✨" genérico.
- `pregunta`: `null`, o el texto **exacto** que el bot va a mandar al grupo. Para Anto:
  español rioplatense, cálido y corto, sin tecnicismos ni nombres de archivos. Una sola
  pregunta, o varias numeradas en el mismo mensaje. Que se entienda sin abrir nada
  ("En la página de adultos, ¿el precio va también en el título o sólo abajo?"). Nada
  de "¿Querés que...?" sobre cosas que ya están claras.
- `adjuntos`: los archivos que Anto tiene que recibir en el grupo, con ruta relativa a
  `$PEND/` (casi siempre `entregables/<archivo>`). El bot los manda después del
  `mensaje`: PDF, documentos y fotos, cada uno con su nombre. Si se tocó un PDF, va acá
  sí o sí: el `mensaje` nunca dice "te dejo el PDF" sin el archivo en `adjuntos`. Sólo
  lo que cambió en esta tanda; nada de fuera de `$PEND/`. Hasta 60 MB por archivo.
  `entregables/` está en `.gitignore`: va con `git add -f`, o el bot dice "no está en la
  rama" y Anto recibe el mensaje sin el archivo (2026-10-25).
- `estado: "fallido"` sólo si no se pudo desplegar nada (build roto que no se puede
  arreglar, push imposible); el `resumen` dice por qué.

Commit (mismo autor) y `git push origin pedidos`. El bot manda `mensaje`, `pregunta` y `adjuntos` al
grupo y el resumen por privado a Manuel. Con `fallido` (o si pasan 6 h sin cierre) le
dice a Anto que Manu lo revisa.
