---
name: grupo-poncho
description: Lee el grupo de WhatsApp "Poncho" (donde Anto pide cambios del sitio), transcribe los audios, resume los pedidos y arma la lista de tareas. Usar cuando Manuel dice "fijate lo que pasó en el grupo de Poncho", "qué pidió Anto", "leé el grupo", "qué hay nuevo en WhatsApp".
---

# Grupo de WhatsApp "Poncho"

El bot de Insights (`bot_fede`, Railway) escucha el grupo y guarda los mensajes en
una tabla aislada (`wa_private_messages`). No responde nunca. Este repo los lee con
un token de sólo lectura (envkit `poncho_next`: `PONCHO_WA_URL`, `PONCHO_WA_TOKEN`).

## Pasos

1. Leer desde la última vez:

   ```
   envkit run -- python scripts/wa-poncho/leer.py --since ultimo
   ```

   Primera vez o para mirar atrás: `--since 2026-10-01` (o `--since 15/10`). Los
   audios se transcriben con faster-whisper local (`--modelo medium` si un audio sale
   mal; tarda más). Imágenes y documentos quedan en `.wa-poncho/media/`: abrilos con
   Read si el pedido depende de ellos (capturas, textos para pegar, fotos).
   El cursor avanza solo; `--no-marcar` para releer sin moverlo.

2. Resumir en español, corto: qué pidió Anto, agrupado por tema (no mensaje por
   mensaje). Distinguir pedido firme de idea suelta o pregunta. Si un mensaje
   posterior corrige uno anterior, vale el último.

3. Lista de tareas accionables, cada una con: qué cambiar, dónde (página o
   archivo si es obvio) y la cita corta del mensaje que la origina. Marcar lo que
   necesita una respuesta de Anto antes de tocar código.

4. No arrancar a implementar sin que Manuel lo confirme. Recordar lo de
   `AGENTS.md`: Anto prefiere menos es más, nada de secciones nuevas sin preguntar,
   y nada de tocar PayPal.

## Si falla

- `Faltan PONCHO_WA_URL / PONCHO_WA_TOKEN` → faltó `envkit run --`.
- `401` → el token de envkit no coincide con `PRIVATE_READ_TOKENS` del servicio
  `bot-worker` en Railway (proyecto `bot-fede`, cuenta developers-insights).
- `Sin mensajes` y se esperaban → el bot no está en el grupo o el grupo no quedó
  registrado como privado: `GET <PONCHO_WA_URL>/admin/<WEBHOOK_SECRET>/private-groups`.
