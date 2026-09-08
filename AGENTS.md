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
