"""Entrega sola un curso en video que la rutina dejó corregido pero sin renderizar.

La rutina poncho-pedidos (cloud) aplica los cambios de Anto al guion pero no puede renderizar:
hace falta la caché de voces, ElevenLabs y ~2 h de máquina. Hasta el 24/11 eso quedaba escrito
en el `resumen` de estado.json y nadie lo corría (Spanish for Travel esperó 5 días). Esto corre
en la PC de escritorio como tarea programada ("Poncho - renders pendientes", cada hora):

    envkit run -g -- python scripts/cursos/entregar.py --auto
    envkit run -g -- python scripts/cursos/entregar.py --dry-run
    envkit run -g -- python scripts/cursos/entregar.py --curso spanish_for_travel --pedidos 2026-11-19-1857

Busca en la rama `pedidos` los estado.json hechos con `render` (o un `build_course.py <curso>` en
el resumen) que ninguna entrega cubrió todavía, renderiza el curso, lo zipea, lo sube al Drive de
manunv97 con link público, rearma el e-book si el libro cambió, y deja un pedido de entrega en la
rama + su fila `enviado` en wa_private_pedidos: el bot se lo manda a Anto en el grupo.
"""

import argparse
import datetime as dt
import importlib.util
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import urllib.error
import urllib.parse
import urllib.request
import zipfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
REPO = HERE.parent.parent
REPO_GH = "manu-180/ponchospanish_next"
GRUPO = "120363412899303277@g.us"
SUPABASE_BOT = "yzmtzyuncekspgtsetwk"
AUTOR = ["-c", "user.name=manu-180", "-c", "user.email=157671390+manu-180@users.noreply.github.com"]
# Lo anterior a esta fecha ya se entregó a mano y no tiene marca `entrega_de`.
DESDE = "2026-11-19"
LOCAL = Path(os.environ.get("LOCALAPPDATA", Path.home())) / "poncho-cursos"
TTS = LOCAL / "tts"
DOWNLOADS = Path.home() / "Downloads"
DRIVE_CREDS = Path.home() / ".local/share/google-workspace-mcp/credentials/manunv97_at_gmail_dot_com.json"
ELEVEN_WRAP = Path.home() / ".claude/scripts/elevenlabs-con-saldo.mjs"
TABLERO = Path.home() / ".claude/skills/kairo/tablero.mjs"
MIN_GB = 20


def sh(*cmd, cwd=REPO, check=True, env=None):
    r = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True, encoding="utf-8", errors="replace", env=env)
    if check and r.returncode:
        raise RuntimeError(f"{' '.join(map(str, cmd))}\n{r.stdout[-2000:]}\n{r.stderr[-2000:]}")
    return r.stdout


def git_json(ref, path):
    r = subprocess.run(["git", "show", f"{ref}:{path}"], cwd=REPO, capture_output=True)
    if r.returncode:
        return None
    try:
        return json.loads(r.stdout.decode("utf-8"))
    except ValueError:
        return None


def pendientes():
    """{curso: [ids]} de tandas hechas con render pendiente y sin entrega."""
    sh("git", "fetch", "-q", "origin", "main", "pedidos")
    dirs = [d for d in sh("git", "ls-tree", "-d", "--name-only", "origin/pedidos", "pedidos/").split()]
    entregados, out = set(), {}
    for d in dirs:
        p = git_json("origin/pedidos", f"{d}/pedido.json") or {}
        e = p.get("entrega_de")
        entregados.update(e if isinstance(e, list) else [e] if e else [])
    for d in dirs:
        pid = d.split("/", 1)[1]
        if pid < DESDE or pid in entregados:
            continue
        e = git_json("origin/pedidos", f"{d}/estado.json") or {}
        if e.get("estado") != "hecho":
            continue
        cursos = e.get("render") or re.findall(r"build_course\.py\s+(\w+)", e.get("resumen") or "")
        for c in [cursos] if isinstance(cursos, str) else cursos:
            if (HERE / "courses" / f"{c}.py").exists():
                out.setdefault(c, []).append(pid)
    return out


def curso_info(curso):
    spec = importlib.util.spec_from_file_location(curso, HERE / "courses" / f"{curso}.py")
    m = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(m)
    return m.COURSE, m.BOOK


def renderizar(curso, dst):
    """Videos en dst/Videos y el temario. Devuelve la cantidad de lecciones."""
    voces = json.loads((HERE / "voices.json").read_text(encoding="utf-8"))
    env = {**os.environ, "PONCHO_TTS_CACHE": str(TTS), "PYTHONUTF8": "1"}
    # elevenlabs-con-saldo junta los argumentos con espacios: rutas sin espacios.
    vids, outline = dst / "Videos", dst / "outline.pdf"
    base = ["node", str(ELEVEN_WRAP), "--min", "5000", "--voz", voces["es"], "--",
            sys.executable, str(HERE / "build_course.py"), curso]
    listado = sh(sys.executable, str(HERE / "build_course.py"), curso, "--list", env=env)
    total = len(re.findall(r"^\d+-\d+ ", listado, re.M))
    log = sh(*base, "--jobs", "16", "--render", vids.as_posix(), "--outline", outline.as_posix(), env=env)
    m = re.findall(r"fallidas: \[(.*)\]", log)
    fall = re.findall(r"'([^']+)'", m[-1]) if m else []
    if fall:
        sh(*base, "--only", *fall, "--skip-build", "--render", vids.as_posix(), env=env)
    if not outline.exists():
        sh(sys.executable, str(HERE / "build_course.py"), curso, "--skip-build", "--outline", outline.as_posix(), env=env)
    hechos = len(list(vids.rglob("*.mp4")))
    if hechos < total:
        raise RuntimeError(f"render incompleto: {hechos} de {total} lecciones")
    return total


def ebook_cambio(book, ids):
    for pid in ids:
        e = git_json("origin/pedidos", f"pedidos/{pid}/estado.json") or {}
        for sha in e.get("commits") or []:
            if f"scripts/ebooks/books/{book}.py" in sh("git", "show", "--name-only", "--format=", sha, check=False):
                return True
    return False


def armar_ebook(book):
    sh(sys.executable, str(REPO / "scripts/ebooks/build.py"), book)
    spec = importlib.util.spec_from_file_location(book, REPO / "scripts/ebooks/books" / f"{book}.py")
    m = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(m)
    return REPO / "scripts/ebooks/out" / f'{m.BOOK["file"]}.pdf'


def zipear(carpeta, destino):
    with zipfile.ZipFile(destino, "w", zipfile.ZIP_STORED) as z:
        for f in sorted(carpeta.rglob("*")):
            if f.is_file():
                z.write(f, Path(carpeta.name) / f.relative_to(carpeta))
    return destino


def drive_token():
    c = json.loads(DRIVE_CREDS.read_text(encoding="utf-8"))
    body = urllib.parse.urlencode({"client_id": c["client_id"], "client_secret": c["client_secret"],
                                   "refresh_token": c["refresh_token"], "grant_type": "refresh_token"}).encode()
    return json.load(urllib.request.urlopen("https://oauth2.googleapis.com/token", body, timeout=60))["access_token"]


def subir_drive(archivo):
    """Sube por partes y deja el link "cualquiera con el link". Devuelve el link."""
    tok = drive_token()
    meta = json.dumps({"name": archivo.name}).encode()
    req = urllib.request.Request("https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable",
                                 meta, {"Authorization": f"Bearer {tok}", "Content-Type": "application/json; charset=UTF-8"})
    url = urllib.request.urlopen(req, timeout=60).headers["Location"]
    size, chunk, pos = archivo.stat().st_size, 64 * 1024 * 1024, 0
    with open(archivo, "rb") as f:
        while pos < size:
            data = f.read(chunk)
            end = pos + len(data) - 1
            r = urllib.request.Request(url, data, {"Content-Range": f"bytes {pos}-{end}/{size}"}, method="PUT")
            try:
                resp = urllib.request.urlopen(r, timeout=600)
                fid = json.load(resp)["id"]
            except urllib.error.HTTPError as e:
                if e.code != 308:
                    raise
            pos = end + 1
    perm = urllib.request.Request(f"https://www.googleapis.com/drive/v3/files/{fid}/permissions",
                                  json.dumps({"role": "reader", "type": "anyone"}).encode(),
                                  {"Authorization": f"Bearer {tok}", "Content-Type": "application/json"})
    urllib.request.urlopen(perm, timeout=60)
    return f"https://drive.google.com/file/d/{fid}/view?usp=sharing"


def sql(q):
    req = urllib.request.Request(f"https://api.supabase.com/v1/projects/{SUPABASE_BOT}/database/query",
                                 json.dumps({"query": q}).encode(),
                                 {"Authorization": f"Bearer {os.environ['SUPABASE_ACCESS_TOKEN']}",
                                  "Content-Type": "application/json", "User-Agent": "poncho-entregar"})
    return json.load(urllib.request.urlopen(req, timeout=60))


def publicar(eid, ids, mensaje, resumen, adjuntos):
    """Pedido de entrega en la rama `pedidos` y su fila `enviado`: el bot lo manda en ≤2 min."""
    wt = Path(tempfile.mkdtemp(prefix="poncho-entrega-"))
    try:
        sh("git", "worktree", "add", "-q", "--detach", str(wt), "origin/pedidos")
        d = wt / "pedidos" / eid
        (d / "entregables").mkdir(parents=True)
        ahora = dt.datetime.now(dt.timezone(dt.timedelta(hours=-3))).strftime("%Y-%m-%d %H:%M")
        (d / "pedido.json").write_text(json.dumps({
            "id": eid, "etiqueta": "poncho", "repo": REPO_GH, "anterior": ids[-1], "desde": ahora, "hasta": ahora,
            "manual": True, "entrega_de": ids, "mensajes": []}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        rel = []
        for a in adjuntos:
            shutil.copy2(a, d / "entregables" / a.name)
            rel.append(f"entregables/{a.name}")
        (d / "estado.json").write_text(json.dumps({
            "estado": "hecho", "mensaje": mensaje, "pregunta": None, "resumen": resumen,
            "commits": [], "adjuntos": rel}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        sh("git", "add", "-f", ".", cwd=d)
        sh("git", *AUTOR, "commit", "-q", "-m", f"pedido {eid}: entrega del render", cwd=wt)
        for _ in range(3):
            if subprocess.run(["git", "push", "-q", "origin", "HEAD:pedidos"], cwd=wt).returncode == 0:
                break
            sh("git", "pull", "-q", "--rebase", "origin", "pedidos", cwd=wt)
        else:
            raise RuntimeError("no se pudo pushear la entrega a pedidos")
    finally:
        subprocess.run(["git", "worktree", "remove", "--force", str(wt)], cwd=REPO, capture_output=True)
    sql(f"insert into wa_private_pedidos (id, etiqueta, group_jid, repo, desde, hasta, listo_wa_message_id, estado) "
        f"values ('{eid}', 'poncho', '{GRUPO}', '{REPO_GH}', now(), now(), 'manual-{eid}', 'enviado') "
        f"on conflict (id) do nothing")


def tablero(*args):
    subprocess.run(["node", str(TABLERO), *args, "--proyecto", "poncho", "--por", "poncho-entregar"],
                   capture_output=True, text=True, encoding="utf-8", errors="replace")


def entregar(curso, ids, carpeta=None):
    C, book = curso_info(curso)
    clave = f"poncho:cursos:render-{curso}"
    libre = shutil.disk_usage(REPO).free / 1e9
    if libre < MIN_GB:
        raise RuntimeError(f"quedan {libre:.0f} GB en el disco del repo y el render pide {MIN_GB}")
    hoy = dt.date.today().isoformat()
    tmp = DOWNLOADS / f"poncho-render-{curso}-{hoy}"
    if tmp.exists():
        shutil.rmtree(tmp)
    if carpeta:
        # Render ya hecho a mano (con Videos/ y outline.pdf): sólo se entrega.
        shutil.move(str(carpeta), tmp)
        n = len(list((tmp / "Videos").rglob("*.mp4")))
    else:
        print(f"[{curso}] render de {ids} en {tmp}", flush=True)
        n = renderizar(curso, tmp)
    final = DOWNLOADS / f"{C['title']} - Poncho Academy ({hoy})"
    if final.exists():
        shutil.rmtree(final)
    tmp.rename(final)
    (final / "outline.pdf").rename(final / f"{C['title']} - Course outline.pdf")
    z = zipear(final, final.with_suffix(".zip"))
    print(f"[{curso}] subiendo {z.name} ({z.stat().st_size / 1e6:.0f} MB)", flush=True)
    link = subir_drive(z)
    adjuntos = [armar_ebook(book)] if ebook_cambio(book, ids) else []
    mensaje = (f"¡Anto! Ya está la versión nueva de {C['title']} con todas tus correcciones 🎬\n\n"
               f"Acá la podés bajar entera, con los {n} videos y el temario: {link}")
    if adjuntos:
        mensaje += "\n\nY abajo te dejo el e-book actualizado con los mismos cambios 📘"
    eid = f"{hoy}-entrega-{curso.replace('_', '-')}"
    publicar(eid, ids, mensaje, f"Render de {curso} ({n} lecciones) por scripts/cursos/entregar.py, "
             f"de las tandas {', '.join(ids)}. Drive: {link}", adjuntos)
    tablero("cerrar", "--clave", clave, "--detalle", f"Entregado a Anto: {link}")
    print(f"[{curso}] entregado: {eid} {link}", flush=True)


def candado_vivo(contenido: str) -> bool:
    """El candado vale sólo si es el PID de un proceso vivo.

    24/11: una sesión dejó "manual" en el candado para su render a mano, la sesión se borró y la
    tarea de cada hora quedó frenada 6 h con "otra entrega en curso" sin que nada corriera.
    En Windows no se usa os.kill(pid, 0): la señal 0 es CTRL_C_EVENT.
    """
    pid = contenido.strip()
    if not pid.isdigit():
        return False
    r = subprocess.run(["tasklist", "/FI", f"PID eq {pid}", "/NH"], capture_output=True, text=True,
                       errors="replace")
    return re.search(rf"\b{pid}\b", r.stdout) is not None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--auto", action="store_true", help="entregar todo lo pendiente")
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--curso")
    ap.add_argument("--pedidos", nargs="*", default=[])
    ap.add_argument("--carpeta", type=Path, help="render ya hecho (Videos/ + outline.pdf): sólo entregar")
    a = ap.parse_args()
    LOCAL.mkdir(parents=True, exist_ok=True)
    lock = LOCAL / "entregar.lock"
    if lock.exists() and (dt.datetime.now().timestamp() - lock.stat().st_mtime) < 6 * 3600 \
            and candado_vivo(lock.read_text(encoding="utf-8", errors="replace")):
        print("otra entrega en curso", flush=True)
        return
    trabajo = {a.curso: a.pedidos} if a.curso else pendientes()
    if a.dry_run or not trabajo:
        print(json.dumps(trabajo) if trabajo else "sin renders pendientes", flush=True)
        return
    if not (a.auto or a.curso):
        ap.error("--auto, --curso o --dry-run")
    lock.write_text(str(os.getpid()))
    try:
        for curso, ids in trabajo.items():
            try:
                entregar(curso, ids, a.carpeta)
            except Exception as e:
                print(f"[{curso}] FALLO: {e}", flush=True)
                tablero("anotar", "--tipo", "alerta", "--clave", f"poncho:cursos:render-{curso}",
                        "--titulo", f"No pude entregarle a Anto el curso {curso} corregido",
                        "--detalle", f"scripts/cursos/entregar.py falló: {str(e)[:400]}. Vuelve a probar cada hora.")
    finally:
        lock.unlink(missing_ok=True)


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    main()
