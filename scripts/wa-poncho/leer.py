"""Lee el grupo de WhatsApp "Poncho" desde el bot (bot_fede) y lo imprime en orden.

    envkit run -- python scripts/wa-poncho/leer.py --since ultimo
    envkit run -- python scripts/wa-poncho/leer.py --since 2026-10-01 --no-transcribir

Descarga la media a .wa-poncho/media/ y transcribe los audios con faster-whisper
local (el Whisper de OpenAI no tiene créditos). Guarda en .wa-poncho/cursor.json
el último mensaje leído para que `--since ultimo` siga desde ahí.
"""

import argparse
import json
import os
import sys
import urllib.parse
import urllib.request
from datetime import datetime, timedelta, timezone
from pathlib import Path

# Argentina no tiene horario de verano; un offset fijo evita depender de tzdata en Windows.
AR = timezone(timedelta(hours=-3), "ART")
RAIZ = Path(__file__).resolve().parents[2] / ".wa-poncho"
DIAS = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"]
EXT = {"audio": "ogg", "image": "jpg", "video": "mp4", "document": "bin", "sticker": "webp"}


def fecha_desde(valor: str | None, cursor: Path) -> str | None:
    if not valor:
        return None
    if valor.lower() in ("ultimo", "último", "last"):
        if cursor.exists():
            return json.loads(cursor.read_text(encoding="utf-8")).get("ts")
        return None
    for fmt in ("%Y-%m-%d", "%Y-%m-%dT%H:%M", "%d/%m/%Y", "%d/%m"):
        try:
            d = datetime.strptime(valor, fmt)
            if fmt == "%d/%m":
                d = d.replace(year=datetime.now(AR).year)
            return d.replace(tzinfo=AR).isoformat()
        except ValueError:
            pass
    sys.exit(f"--since no entendido: {valor!r} (usá YYYY-MM-DD, DD/MM o 'ultimo')")


def pedir(base: str, token: str, since: str | None) -> list[dict]:
    mensajes: list[dict] = []
    while True:
        q = {"limit": "2000"}
        if since:
            q["since"] = since
        url = f"{base.rstrip('/')}/private/{token}/messages?{urllib.parse.urlencode(q)}"
        with urllib.request.urlopen(url, timeout=60) as r:
            lote = json.load(r)["mensajes"]
        mensajes += lote
        if len(lote) < 2000:
            return mensajes
        since = lote[-1]["ts"]


def descargar(m: dict) -> Path | None:
    if not m.get("media_url"):
        return None
    ext = Path(m["media_path"]).suffix.lstrip(".") or EXT.get(m.get("media_type") or "", "bin")
    destino = RAIZ / "media" / f"{m['wa_message_id']}.{ext}"
    if not destino.exists():
        destino.parent.mkdir(parents=True, exist_ok=True)
        urllib.request.urlretrieve(m["media_url"], destino)
    return destino


_modelo = None


def transcribir(audio: Path, modelo: str) -> str:
    cache = RAIZ / "transcripciones" / f"{audio.stem}.txt"
    if cache.exists():
        return cache.read_text(encoding="utf-8")
    global _modelo
    if _modelo is None:
        from faster_whisper import WhisperModel

        _modelo = WhisperModel(modelo, device="cpu", compute_type="int8")
    segmentos, _ = _modelo.transcribe(str(audio), language="es", vad_filter=True)
    texto = " ".join(s.text.strip() for s in segmentos).strip()
    cache.parent.mkdir(parents=True, exist_ok=True)
    cache.write_text(texto, encoding="utf-8")
    return texto


def main() -> None:
    sys.stdout.reconfigure(encoding="utf-8")
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--group", default="poncho", help="etiqueta del grupo (la define el token)")
    p.add_argument("--since", help="YYYY-MM-DD, DD/MM o 'ultimo' (desde la última lectura)")
    p.add_argument("--no-media", action="store_true", help="no descargar media")
    p.add_argument("--no-transcribir", action="store_true", help="no transcribir audios")
    p.add_argument("--modelo", default="small", help="modelo de faster-whisper (small, medium)")
    p.add_argument("--no-marcar", action="store_true", help="no mover el cursor de 'ultimo'")
    a = p.parse_args()

    base = os.environ.get("PONCHO_WA_URL")
    token = os.environ.get("PONCHO_WA_TOKEN")
    if not base or not token:
        sys.exit("Faltan PONCHO_WA_URL / PONCHO_WA_TOKEN: corré con `envkit run -- python ...`")

    cursor = RAIZ / f"cursor-{a.group}.json"
    since = fecha_desde(a.since, cursor)
    mensajes = pedir(base, token, since)
    if not mensajes:
        print(f"Sin mensajes nuevos en {a.group}" + (f" desde {since}" if since else "") + ".")
        return

    dia_actual = None
    for m in mensajes:
        cuando = datetime.fromisoformat(m["ts"].replace("Z", "+00:00")).astimezone(AR)
        if cuando.date() != dia_actual:
            dia_actual = cuando.date()
            print(f"\n── {DIAS[cuando.weekday()]} {cuando:%d/%m/%Y} ──")
        autor = "Bot" if m.get("from_me") else (m.get("push_name") or (m.get("sender") or "?").split("@")[0])
        texto = (m.get("text") or "").strip()
        tipo = m.get("media_type")
        extra = ""
        if tipo:
            archivo = None if a.no_media else descargar(m)
            if tipo == "audio" and archivo and not a.no_transcribir:
                extra = f"(audio) «{transcribir(archivo, a.modelo)}»"
            else:
                extra = f"({tipo}{': ' + str(archivo) if archivo else ''})"
        print(f"[{cuando:%H:%M}] {autor}: {' '.join(x for x in (extra, texto) if x)}")

    if not a.no_marcar:
        cursor.parent.mkdir(parents=True, exist_ok=True)
        cursor.write_text(json.dumps({"ts": mensajes[-1]["ts"]}), encoding="utf-8")
    print(f"\n{len(mensajes)} mensaje(s). Hasta {mensajes[-1]['ts']}.")


if __name__ == "__main__":
    main()
