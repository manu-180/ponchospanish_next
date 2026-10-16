# Poncho Spanish — notas para agentes

Next.js 15 (App Router) + Supabase + Mux + PayPal. Producción: **https://www.ponchospanish.com**

⚠️ El sitio cobra pagos **reales** con las claves live de PayPal de Anto. Nada de tocar
`PAYPAL_ENVIRONMENT` ni las credenciales sin que Manuel lo pida explícitamente.

---

## Desplegar a producción

Vercel está conectado al repo por Git integration: **un push a `main` es el deploy**.
No hace falta `vercel deploy` ni `vercel --prod`, y el repo no tiene `.vercel/` linkeado.

```
pnpm type-check
pnpm build
git push origin HEAD:main
```

`HEAD:main` en vez de `git checkout main` porque casi siempre se trabaja desde un worktree
en `.claude/worktrees/`, donde `main` está tomado por el checkout principal.

`pnpm lint` falla dentro de un worktree con
`Plugin "@next/next" was conflicted between .eslintrc.json and ../../../.eslintrc.json`.
Es el `.eslintrc.json` del repo padre pisándose con el del worktree, no un problema del
código. `type-check` + `build` son la puerta real.

### Las dos trampas que rompen el deploy

**1. La cuenta activa de `gh` casi nunca es la correcta.** El repo es
`manu-180/ponchospanish_next`, pero el keyring suele quedar en `developers-insights`, y
entonces `git push` falla con **"Repository not found"** — que parece un problema del
remoto y no lo es.

```
gh auth status
bash ~/.claude/scripts/gh-switch.sh manu-180
```

La cuenta puede volver a cambiar **a mitad de sesión** (pasó escribiendo este archivo: un
push que había funcionado veinte minutos antes falló con `Permission denied to
developers-insights`). Ante cualquier 403 o "Repository not found", el primer reflejo es
`gh auth status`, no buscar el problema en el remoto.

El script también deja el `user.email` del repo en
`157671390+manu-180@users.noreply.github.com`. **Ese mail importa:** Vercel marca el deploy
como `BLOCKED` cuando no puede atribuir el autor del commit a un miembro del proyecto, y el
síntoma es mudo (main avanza, producción sigue sirviendo el commit anterior, ningún error
en ningún lado).

**2. El Vercel CLI logueado localmente NO ve este proyecto.** La sesión persistida es
`developers-2878` → scope `insights3`. `ponchospanish` vive en la cuenta personal
`manu-180` (`manuels-projects-66819a23`), y `vercel project ls` ni siquiera lo lista.

El token de `manu-180` está en la bóveda de envkit como `VERCEL_TOKEN` (global). Todo
comando de Vercel contra este proyecto va prefijado:

```
envkit run -- vercel whoami
envkit run -- vercel ls ponchospanish
envkit run -- vercel inspect https://www.ponchospanish.com
```

Sin el prefijo el CLI responde desde el scope equivocado y parece que el proyecto no
existe.

### Verificar — el deploy no está entregado hasta acá

`vercel ls` muestra `UNKNOWN` en la columna de status cuando algo salió mal; el estado real
sale de `vercel inspect`. Los tres chequeos:

```
envkit run -- vercel ls ponchospanish
envkit run -- vercel inspect https://www.ponchospanish.com
curl -s https://www.ponchospanish.com/ | grep "<un string del cambio>"
```

1. El deploy más reciente dice `● Ready` (no `Building`, no `Error`, no `Queued`).
2. `inspect` dice `status ● Ready` y lista `www.ponchospanish.com` entre los **Aliases** —
   si quedó `BLOCKED`, el dominio sigue apuntando al deploy viejo.
3. El HTML en vivo contiene el cambio. Para un asset, comparar el sha:
   `curl -s https://www.ponchospanish.com/images/x.jpg | sha256sum`.

Si quedó `BLOCKED` no hay que reescribir historia: un commit nuevo con el mail correcto
arrastra al deploy todo lo bloqueado.

---

## Secretos

No hay `.env.local` en el repo ni se lee ninguno: un hook bloquea `cat`/`grep`/`cp` sobre
`.env*`. Para correr algo con las variables, `envkit run -- <cmd>`; para ver qué existe sin
revelar valores, `envkit list` / `envkit keys`.

El build de producción anda sin variables locales (la validación de env es lazy), así que
`pnpm build` corre tal cual.

---

## Preview local

`.claude/launch.json` levanta `pnpm start` en el puerto 3123.

Al mirar la home en un browser headless: la mayoría de las secciones usan framer-motion con
`whileInView`, que depende de `requestAnimationFrame`. Con la pestaña en segundo plano las
animaciones quedan congeladas en `opacity: 0` y la captura sale **en blanco** aunque el DOM
esté perfecto. Además el scroll no repinta bien. La forma que funciona: poner el viewport
alto (`1280x3400`), navegar, esperar unos segundos y capturar sin scrollear.

---

## SEO — estado y contexto (2026-09-20)

**Línea base de Search Console antes de tocar nada:** 16 meses = 421 impresiones, 9 clics,
CTR 2,1%, posición 10,7. La curva es plana desde febrero 2026, antes y después de la
migración. O sea: el CTR y los snippets funcionan; **el problema es 100% volumen de
impresiones**. No gastar tiempo en titles o velocidad; lo que mueve el número es contenido.

**Migración Wix → Next sin redirects.** El dominio corrió sobre Wix hasta mayo 2026.
`LEGACY_WIX_REDIRECTS` en `next.config.mjs` manda cada URL vieja con `statusCode: 301`
(no `permanent: true`, que da 308). No borrar ese bloque. Si Search Console muestra un 404
de una URL de Wix que falta, se agrega ahí.

**`/guides`** (`lib/seo/guides.ts`, mismo patrón que `lib/seo/lessons.ts`). Tres guías
confirmadas por Anto. La de GCSE sale de la especificación oficial de AQA 8692; si se
actualiza un dato, cambiar también `updated` (mueve el `dateModified` del schema). Nunca
escribir datos de exámenes sin verificarlos contra la fuente oficial. Cada guía declara
`relatedLessons`, y las landings de `/spanish-lessons/[slug]` las muestran solas.

**Público, según Anto:** chicos y adolescentes de 7 a 18, sobre todo en el Reino Unido,
y también familias angloparlantes que viven en España u otro país hispanohablante con
hijos en colegios británicos o internacionales (IGCSE, español como segunda lengua).
Adultos solo como excepción. Anto vive en Buenos Aires y el negocio es 100% online: no
aplica SEO local ni Google Business Profile.

**Anto prefiere menos es más.** Pidió explícitamente no seguir agregando secciones. Antes
de sumar páginas nuevas, preguntar.

**Backlinks:** las dos fichas que existían están muertas. Club Hub da 404 (membresía
vencida, cuesta desde £49/año) y la de Family Grapevine fue borrada (el alta es gratis en
`thefamilygrapevine.co.uk/brighton-hove/send-your-free-listing/`).

---

## Grupo de WhatsApp "Poncho"

Anto pide los cambios del sitio por el grupo de WhatsApp "Poncho". Cuando Manuel diga
"fijate lo que pasó en el grupo de Poncho": skill `grupo-poncho`
(`envkit run -- python scripts/wa-poncho/leer.py --since ultimo`), resumir los pedidos
y armar la lista de tareas. No implementar sin confirmación.

Desde 2026-10-16 Anto cierra cada tanda con **"Listo"** y eso arranca solo: el bot
commitea la tanda a la rama `pedidos` y la rutina cloud `poncho-pedidos`
(`trig_012vy2YXnbT6iTpBxQJWwxfT`) la implementa y deploya. El bot sólo le escribe al
grupo si la rutina dejó una pregunta. Protocolo: `docs/pedidos/PROTOCOLO.md`. Si una
tanda se trabaja a mano, hay que marcarla en `wa_private_pedidos` (estado `manual`) para
que la rutina no la repita.
