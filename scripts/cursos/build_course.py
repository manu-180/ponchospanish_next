"""Arma un curso en video de Poncho Spanish a partir de un e-book y su guion de narración.

    python scripts/cursos/build_course.py confident_teens            # arma todos los proyectos
    python scripts/cursos/build_course.py confident_teens --only 1-1 # una lección (módulo-lección)
    python scripts/cursos/build_course.py confident_teens --render   # y los renderiza a MP4

Cada lección es un proyecto HyperFrames en .build/<curso>/<id>/ (index.html + assets/mix.wav).
Voces: edge-tts (gratis, sin clave). Música: loop CC0 de Freesound en assets/music/.
"""

import argparse
import asyncio
import hashlib
import html
import importlib.util
import json
import re
import shutil
import subprocess
import sys
import unicodedata
from pathlib import Path

import edge_tts
import numpy as np

HERE = Path(__file__).resolve().parent
REPO = HERE.parents[1]
EBOOKS = REPO / "scripts" / "ebooks"
BUILD = HERE / ".build"
TTS_CACHE = HERE / ".cache" / "tts"
SR = 48000

VOICES = {
    "en": ("en-GB-SoniaNeural", "+0%"),
    "es": ("es-ES-ElviraNeural", "-6%"),
    "ar": ("es-AR-TomasNeural", "-6%"),
    "es_m": ("es-ES-AlvaroNeural", "-6%"),
    "es_f2": ("es-ES-XimenaNeural", "-6%"),
}
SPEAKER_VOICE = {"Nico": "es_m", "Maya": "es", "Camarera": "es_f2", "Lola": "es", "Ana": "ar_f"}
VOICES["ar_f"] = ("es-AR-ElenaNeural", "-6%")

BG = {"dark": "#141414", "cream": "#EFECE5", "terra": "#C95023"}
TONE = {"dark": "oscuro", "cream": "claro", "terra": "terra"}
CONNECTORS = {"y", "de", "la", "el", "en", "que", "a", "tu", "the", "of", "to", "and", "a", "an", "con", "por",
              "para", "un", "una", "los", "las", "or", "o", "your", "my", "mi", "in", "for", "with", "is"}

ES_FLAG = '<svg class="flag" viewBox="0 0 30 20"><rect width="30" height="20" fill="#AA151B"/><rect y="5" width="30" height="10" fill="#F1BF00"/></svg>'
AR_FLAG = '<svg class="flag" viewBox="0 0 30 20"><rect width="30" height="20" fill="#74ACDF"/><rect y="6.67" width="30" height="6.67" fill="#fff"/><circle cx="15" cy="10" r="2.2" fill="#F6B40E"/></svg>'
LOGO_SVG = ('<svg class="logo" viewBox="0 0 100 92"><path fill="#C95023" d="M38 2h24l12 13-24 18-24-18z"/>'
            '<path fill="#D5682F" d="M20 24l30 22 30-22 9 12-39 30-39-30z"/>'
            '<path fill="#E8A84C" d="M6 44l44 33 44-33 6 9-50 38L0 53z"/></svg>')

e = html.escape


def load_module(path, name):
    spec = importlib.util.spec_from_file_location(name, path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


# ---------- voz ----------

def parse(s):
    """«España» y ‹Argentina› van a sus voces; el resto, a la narradora."""
    out, pos = [], 0
    for m in re.finditer(r"«([^»]*)»|‹([^›]*)›", s):
        pre = s[pos:m.start()].strip()
        if re.search(r"\w", pre):
            out.append(("en", pre))
        out.append(("es", m.group(1)) if m.group(1) is not None else ("ar", m.group(2)))
        pos = m.end()
    rest = s[pos:].strip()
    if re.search(r"\w", rest):
        out.append(("en", rest))
    return out


def spoken(text):
    """Lo que se le pasa al TTS: sin barras ni guiones de diálogo."""
    t = text.replace("…", ".").replace(" / ", ", ").replace("—", " ").replace("___", "…")
    return re.sub(r"\s+", " ", t).strip()


async def _synth(text, voice, rate, mp3):
    c = edge_tts.Communicate(text, voice, rate=rate, boundary="WordBoundary")
    words = []
    with open(mp3, "wb") as f:
        async for ch in c.stream():
            if ch["type"] == "audio":
                f.write(ch["data"])
            elif ch["type"] == "WordBoundary":
                words.append([ch["text"], ch["offset"] / 1e7, (ch["offset"] + ch["duration"]) / 1e7])
    return words


def decode(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(path), "-f", "f32le", "-ac", "1", "-ar", str(SR), "-"],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32).copy()


def tts(voice_key, text):
    voice, rate = VOICES[voice_key]
    say = spoken(text)
    h = hashlib.sha1(f"{voice}|{rate}|{say}".encode()).hexdigest()[:16]
    TTS_CACHE.mkdir(parents=True, exist_ok=True)
    mp3, meta = TTS_CACHE / f"{h}.mp3", TTS_CACHE / f"{h}.json"
    if not meta.exists():
        for intento in range(4):
            try:
                words = asyncio.run(asyncio.wait_for(_synth(say, voice, rate, mp3), 45))
                break
            except Exception:
                if intento == 3:
                    raise
        meta.write_text(json.dumps(words, ensure_ascii=False), encoding="utf-8")
    words = json.loads(meta.read_text(encoding="utf-8"))
    a = decode(mp3)
    loud = np.flatnonzero(np.abs(a) > 0.012)
    lead = max(0, loud[0] - int(0.03 * SR)) if len(loud) else 0
    tail = min(len(a), loud[-1] + int(0.08 * SR)) if len(loud) else len(a)
    a = a[lead:tail]
    off = lead / SR
    words = [[w, max(0.0, s - off), max(0.0, en - off)] for w, s, en in words]
    return {"voice": voice_key, "text": text, "audio": a, "dur": len(a) / SR, "words": align(text, words, len(a) / SR)}


def norm(w):
    w = unicodedata.normalize("NFKD", w.lower())
    return "".join(c for c in w if c.isalnum())


def align(text, bounds, dur):
    """Pega los tiempos del TTS a las palabras tal como se escriben (con signos)."""
    toks, carry = [], ""
    for t in text.replace("—", "— ").split():
        if not norm(t):
            carry += t
            continue
        toks.append(carry + t)
        carry = ""
    if carry and toks:
        toks[-1] += carry
    out, j = [], 0
    for t in toks:
        k = next((i for i in range(j, min(j + 4, len(bounds))) if norm(bounds[i][0]) and norm(bounds[i][0]) in norm(t)
                  or norm(t) in norm(bounds[i][0])), None)
        if k is None:
            out.append([t, None, None])
            continue
        out.append([t, bounds[k][1], bounds[k][2]])
        j = k + 1
    known = [i for i, w in enumerate(out) if w[1] is not None]
    if not known:
        n = max(1, len(out))
        return [[w[0], dur * i / n, dur * (i + 1) / n] for i, w in enumerate(out)]
    for i, w in enumerate(out):
        if w[1] is None:
            prev = max((k for k in known if k < i), default=None)
            nxt = min((k for k in known if k > i), default=None)
            s = out[prev][2] if prev is not None else 0.0
            en = out[nxt][1] if nxt is not None else dur
            w[1], w[2] = s, max(s + 0.05, en)
    return out


# ---------- línea de tiempo ----------

class Lesson:
    def __init__(self, lid, title):
        self.id, self.title = lid, title
        self.t = 0.0
        self.clips = []      # (start, seg)
        self.scenes = []
        self.sfx = []        # (t, name, gain)

    def say(self, voice, text, gap=0.4):
        seg = tts(voice, text)
        start = self.t
        self.clips.append((start, seg))
        self.t += seg["dur"] + gap
        return start, start + seg["dur"]

    def narrate(self, lines, gap=0.75, inner=0.28):
        """Cada línea del guion: tramos en inglés y en español, con aire entre oraciones."""
        marks = []
        for line in lines:
            parts = parse(line)
            for i, (v, txt) in enumerate(parts):
                s, en = self.say(v, txt, gap=inner if i < len(parts) - 1 else gap)
                marks.append((v, txt, s, en))
        return marks

    def wait(self, s):
        self.t += s

    def scene(self, kind, bg, html_body, start, end, trans="stripes"):
        self.scenes.append({"kind": kind, "bg": bg, "html": html_body, "start": start, "end": end, "trans": trans})


def split_region(es):
    a, b = [x.strip() for x in es.split(" / ", 1)]
    wa, wb = a.split(), b.split()
    if len(wb) < len(wa):
        low = [w.lower() for w in wa]
        if wb[0].lower() in low:
            k = low.index(wb[0].lower())
            b = " ".join(wa[:k] + wb)
        else:
            b = " ".join(wa[: len(wa) - len(wb)] + wb)
    return a.rstrip("."), b


def flagify(s):
    return s.replace("{ES}", ES_FLAG).replace("{AR}", AR_FLAG)


def strip_tags(s):
    return re.sub(r"<[^>]+>", "", s)


def chrome(label, sub, tone):
    return (f'<div class="chrome {tone}"><span class="lab">{e(label)}</span>'
            f'<span class="sub">{e(sub)}</span></div>{LOGO_SVG.replace("class=\"logo\"", "class=\"logo cl\"")}')


def at(t, anim="rise", out=None, extra=""):
    s = f' data-at="{t:.3f}" data-anim="{anim}"'
    if out is not None:
        s += f' data-out="{out:.3f}"'
    return s + extra


# ---------- escenas ----------

def scene_open(L, ch, ch_title, ch_en, title, en, hook, photo, pos, kicker=None):
    s0 = L.t
    L.wait(1.1)
    marks = L.narrate(hook)
    L.wait(0.4)
    end = L.t
    body = f"""
      <div class="open-photo"{at(s0 + 0.15, 'wipe')}><img src="{photo}" style="object-position:{pos}"></div>
      <div class="band"{at(s0 + 0.05, 'band')}></div>
      <div class="open-text">
        <div class="kicker"{at(s0 + 0.45, 'rise')}>{e(kicker or (ch_title + ' · ' + ch_en))}</div>
        <h1 class="open-title"{at(s0 + 0.6, 'words')}>{words_html(title)}</h1>
        <div class="open-en"{at(s0 + 1.0, 'rise')}>{e(en)}</div>
      </div>"""
    L.scene("open", "dark", body, s0, end)


def words_html(t):
    return " ".join(f"<span class=\"w\">{e(w)}</span>" for w in t.split())


def scene_words(L, ch_label, unit_title, words):
    n = len(words)
    for i, (es, en, ex_es, ex_en, region) in enumerate(words):
        s0 = L.t
        L.wait(0.45)
        prog = "".join(f'<i class="{"on" if k == i else ("done" if k < i else "")}"></i>' for k in range(n))
        if region == "ES/AR":
            a, b = split_region(es)
            sa, _ = L.say("es", a, gap=0.3)
            sb, _ = L.say("ar", b, gap=0.45)
            head = (f'<div class="var"{at(sa - 0.05, "rise")}>{ES_FLAG}<span class="tag">Spain</span>'
                    f'<span class="es big2">{e(a)}</span></div>'
                    f'<div class="var"{at(sb - 0.05, "rise")}>{AR_FLAG}<span class="tag">Argentina</span>'
                    f'<span class="es big2">{e(b)}</span></div>')
        else:
            sa, _ = L.say("es", es, gap=0.45)
            size = "big" if len(es) <= 22 else "big2"
            head = f'<div class="es {size}"{at(sa - 0.08, "words")}>{words_html(es)}</div>'
        L.sfx.append((sa - 0.05, "pop", 0.22))
        se, _ = L.say("en", en, gap=0.55)
        sx, _ = say_example(L, ex_es)
        L.wait(0.5)
        end = L.t
        out = end - 0.28
        body = f"""
          {chrome('Vocabulario', unit_title, 'light')}
          <div class="prog">{prog}</div>
          {deco()}
          <div class="word-stage"{at(s0, 'none', out)}>
            {head}
            <div class="meaning"{at(se - 0.05, 'rise')}><b class="bar"></b>{e(en)}</div>
            <div class="example"{at(sx - 0.1, 'rise')}><div class="ex-es">{e(ex_es)}</div><div class="ex-en">{e(ex_en)}</div></div>
          </div>"""
        L.scene("word", "cream", body, s0, end, trans="stripes" if i == 0 else "swap")


def say_example(L, ex):
    parts = [p.strip() for p in ex.split("—") if p.strip()]
    if len(parts) <= 1:
        return L.say("es", ex, gap=0.5)
    first = None
    for k, p in enumerate(parts):
        s, en = L.say("es" if k % 2 == 0 else "es_m", p, gap=0.3 if k < len(parts) - 1 else 0.5)
        first = first if first is not None else (s, en)
    return first


def deco():
    return f'<div class="deco">{LOGO_SVG}</div>'


def scene_grid(L, ch_label, unit_title, grid, per=4):
    pages = [grid[i:i + per] for i in range(0, len(grid), per)]
    for pi, page in enumerate(pages):
        s0 = L.t
        L.wait(0.4)
        cards = []
        for k, (es, en) in enumerate(page):
            st, _ = L.say("es", es, gap=0.85)
            L.sfx.append((st - 0.05, "pop", 0.18))
            size = "g1" if len(es) <= 18 else ("g2" if len(es) <= 26 else "g3")
            cards.append(f'<div class="gcard c{k}"{at(st - 0.1, "pop")}><div class="g-es {size}">{e(es)}</div>'
                         f'<div class="g-en">{e(en)}</div></div>')
        L.wait(0.4)
        end = L.t
        body = f"""
          {chrome('Vocabulario', unit_title, 'light')}
          {deco()}
          <div class="grid"{at(s0, 'none', end - 0.28)}>{''.join(cards)}</div>"""
        L.scene("grid", "cream", body, s0, end, trans="stripes" if pi == 0 else "swap")


def table_html(tbl, row_times, cls):
    rows = re.findall(r"<tr>(.*?)</tr>", tbl, flags=re.S)
    out = []
    for r, t in zip(rows, row_times):
        cells = re.findall(r"<td>(.*?)</td>", r, flags=re.S)
        tds = "".join(f"<td>{flagify(c)}</td>" for c in cells)
        out.append(f'<tr{at(t, "row")}>{tds}</tr>')
    return f'<table class="gt {cls}">{"".join(out)}</table>'


def scene_grammar(L, unit_title, grammar, script):
    gtitle, ghtml = grammar
    s0 = L.t
    L.wait(0.9)
    tbl = re.search(r"<table>.*?</table>", ghtml, flags=re.S)
    tbl = tbl.group(0) if tbl else ""
    before = re.findall(r"<p>(.*?)</p>", ghtml[: ghtml.find("<table>")] if tbl else ghtml, flags=re.S)
    after_p = re.findall(r"<p>(.*?)</p>", ghtml[ghtml.find("</table>"):], flags=re.S) if tbl else []
    exp_marks = L.narrate(script.get("explain", []))
    first = exp_marks[0][2] if exp_marks else L.t
    row_specs = script.get("rows", [])
    n_rows = len(re.findall(r"<tr>", tbl))
    row_specs = (row_specs + [None] * n_rows)[:n_rows]
    times = [None] * n_rows
    L.wait(0.2)
    for i, spec in enumerate(row_specs):
        if spec is None:
            continue
        m = L.narrate([spec], gap=0.7, inner=0.3)
        times[i] = m[0][2] - 0.12
        L.sfx.append((times[i], "pop", 0.14))
    first_row = next((t for t in times if t is not None), L.t)
    times = [t if t is not None else first_row - 0.35 for t in times]
    aft = L.narrate(script.get("after", [])) if script.get("after") else []
    L.wait(0.6)
    end = L.t
    ncols = max((len(re.findall(r"<td>", r)) for r in re.findall(r"<tr>(.*?)</tr>", tbl, flags=re.S)), default=2)
    cls = "dense" if n_rows >= 6 or ncols >= 5 else ("mid" if n_rows >= 4 or ncols >= 4 else "")
    ps_before = "".join(f'<p class="rule"{at(first, "rise")}>{flagify(p)}</p>' for p in before)
    t_after = aft[0][2] - 0.1 if aft else end - 2
    ps_after = "".join(f'<p class="rule after"{at(t_after, "rise")}>{flagify(p)}</p>' for p in after_p)
    body = f"""
      {chrome('Gramática', unit_title, 'dark')}
      <div class="gram">
        <h2 class="g-title"{at(s0 + 0.25, 'words')}>{words_html(gtitle)}</h2>
        {ps_before}
        {table_html(tbl, times, cls) if tbl else ''}
        {ps_after}
      </div>"""
    L.scene("grammar", "dark", body, s0, end)


def scene_dialogue(L, unit_title, d):
    s0 = L.t
    L.wait(0.9)
    names = []
    for who, _, _ in d["lines"]:
        if who not in names:
            names.append(who)
    bubbles, shifts = [], []
    step, visible = 158, 3
    for i, (who, es, en) in enumerate(d["lines"]):
        v = SPEAKER_VOICE.get(who, "es" if names.index(who) % 2 == 0 else "es_m")
        st, _ = L.say(v, es, gap=0.75)
        L.sfx.append((st - 0.05, "pop", 0.16))
        side = "l" if names.index(who) % 2 == 0 else "r"
        col = names.index(who) % 3
        bubbles.append(f'<div class="bub {side}" style="top:{i * step}px"{at(st - 0.1, "pop")}>'
                       f'<span class="av av{col}">{e(who[0])}</span><div class="bb"><span class="who">{e(who)}</span>'
                       f'<div class="b-es">{e(es)}</div><div class="b-en">{e(en)}</div></div></div>')
        if i >= visible:
            shifts.append([round(st - 0.35, 3), -(i - visible + 1) * step])
    L.wait(0.5)
    end = L.t
    body = f"""
      {chrome('Diálogo', unit_title, 'light')}
      {deco()}
      <h2 class="d-title"{at(s0 + 0.2, 'words')}>{words_html(d['title'])}</h2>
      <div class="chat"><div class="stack" data-shifts='{json.dumps(shifts)}'>{''.join(bubbles)}</div></div>"""
    L.scene("dialogue", "cream", body, s0, end)


def scene_card(L, unit_title, label, title, body_html, lines):
    s0 = L.t
    L.wait(0.9)
    marks = L.narrate(lines)
    L.wait(0.6)
    end = L.t
    body_html = flagify(body_html)
    bolds = re.findall(r"<b>(.*?)</b>", body_html)
    hl = {}
    for v, txt, st, _ in marks:
        if v == "en":
            continue
        for bi, b in enumerate(bolds):
            nb = norm(strip_tags(b))
            if bi not in hl and nb and (nb == norm(txt) or (len(nb) >= 4 and nb in norm(txt))):
                hl[bi] = st
    counter = iter(range(len(bolds)))

    def mark(m):
        bi = next(counter)
        extra = f' data-hl="{hl[bi]:.3f}"' if bi in hl else ""
        return f"<b{extra}>{m.group(1)}</b>"

    body_html = re.sub(r"<b>(.*?)</b>", mark, body_html)
    first = marks[0][2] if marks else s0 + 1
    out = f"""
      {chrome(label, unit_title, 'dark')}
      <div class="card">
        <h2 class="c-title"{at(s0 + 0.2, 'stamp')}>{e(title)}</h2>
        <div class="c-body"{at(first - 0.1, 'rise')}>{body_html}</div>
      </div>"""
    L.scene("card", "dark", out, s0, end)


def scene_project_intro(L, unit_title, text):
    pass


def scene_quiz(L, unit_title, items, title="¡Te toca!", intro="Your turn! Say it in Spanish, before you hear it."):
    s0 = L.t
    L.wait(0.7)
    L.narrate([intro], gap=0.6)
    end = L.t
    L.scene("quiz-intro", "terra", f"""
      <div class="qi">
        <h2 class="qi-title"{at(s0 + 0.15, 'stamp')}>{e(title)}</h2>
        <div class="qi-sub"{at(s0 + 0.55, 'rise')}>Say it out loud</div>
      </div>""", s0, end, trans="flood")
    L.sfx.append((s0 + 0.15, "pop", 0.25))
    for i, (prompt, answer, voice) in enumerate(items):
        s0 = L.t
        L.wait(0.35)
        sp, ep = L.say("en", prompt, gap=0.25)
        c0 = L.t
        L.wait(3.4)
        sa, _ = L.say(voice, answer, gap=0.9)
        L.sfx.append((sa - 0.1, "pop", 0.25))
        end = L.t
        dots = "".join(f'<i class="{"on" if k == i else ("done" if k < i else "")}"></i>' for k in range(len(items)))
        L.scene("quiz", "terra", f"""
          <div class="prog q">{dots}</div>
          <div class="q-stage"{at(s0, 'none', end - 0.28)}>
            <div class="q-prompt"{at(sp - 0.1, 'rise')}>{e(prompt)}</div>
            <svg class="ring" viewBox="0 0 200 200"{at(c0, 'fade', sa - 0.15)}><circle class="trk" cx="100" cy="100" r="86"/>
              <circle class="arc" cx="100" cy="100" r="86" data-ring="{c0:.3f}" data-ring-dur="3.2"/></svg>
            {countdown(c0, 3.2, sa - 0.15)}
            <div class="q-hint"{at(c0 + 0.1, 'fade', sa - 0.15)}>Say it in Spanish</div>
            <div class="q-ans"{at(sa - 0.12, 'pop')}>{e(answer)}</div>
          </div>""", s0, end, trans="swap")


def countdown(c0, dur, end, small=False):
    step = dur / 3
    spans = "".join(f'<span{at(c0 + k * step, "pop", c0 + (k + 1) * step - 0.12 if k < 2 else end)}>{3 - k}</span>' for k in range(3))
    return f'<div class="count{" small" if small else ""}">{spans}</div>'


def scene_choice(L, items):
    s0 = L.t
    L.wait(0.7)
    L.narrate(["Which one fits? Choose before the answer appears."], gap=0.6)
    end = L.t
    L.scene("quiz-intro", "terra", f"""
      <div class="qi">
        <h2 class="qi-title"{at(s0 + 0.15, 'stamp')}>¿Cuál es?</h2>
        <div class="qi-sub"{at(s0 + 0.55, 'rise')}>Pick the right word</div>
      </div>""", s0, end, trans="flood")
    for i, (sent, opts, ok) in enumerate(items):
        s0 = L.t
        L.wait(0.5)
        c0 = L.t
        L.wait(3.6)
        full = sent.replace("___", opts[ok])
        sa, _ = L.say("es", full, gap=0.9)
        L.sfx.append((sa - 0.1, "pop", 0.25))
        end = L.t
        sent_html = e(sent).replace("___", '<span class="gap">&nbsp;</span>')
        opts_html = "".join(f'<span class="opt {"ok" if k == ok else "no"}" data-res="{sa - 0.12:.3f}">{e(o)}</span>'
                            for k, o in enumerate(opts))
        L.scene("choice", "terra", f"""
          <div class="q-stage"{at(s0, 'none', end - 0.28)}>
            <div class="q-sent"{at(s0 + 0.15, 'rise')}>{sent_html}</div>
            <div class="opts"{at(s0 + 0.45, 'rise')}>{opts_html}</div>
            <svg class="ring small" viewBox="0 0 200 200"{at(c0, 'fade', sa - 0.15)}><circle class="trk" cx="100" cy="100" r="86"/>
              <circle class="arc" cx="100" cy="100" r="86" data-ring="{c0:.3f}" data-ring-dur="3.4"/></svg>
            {countdown(c0, 3.4, sa - 0.15, small=True)}
            <div class="q-full"{at(sa - 0.12, 'rise')}>{e(full)}</div>
          </div>""", s0, end, trans="swap")


def scene_close(L, chips, next_en, line):
    s0 = L.t
    L.wait(0.6)
    L.narrate(line, gap=0.6)
    L.wait(2.2)
    end = L.t
    chip_html = "".join(f'<span class="chip"{at(s0 + 0.9 + k * 0.12, "pop")}>{e(c)}</span>' for k, c in enumerate(chips))
    nxt = (f'<div class="next"{at(s0 + 1.5, "rise")}><span>Next lesson</span><b>{e(next_en)}</b></div>' if next_en else "")
    L.sfx.append((s0 + 0.3, "sparkle", 0.16))
    L.scene("close", "dark", f"""
      <div class="close">
        <h2 class="cl-title"{at(s0 + 0.25, 'stamp')}>¡Muy bien!</h2>
        <div class="chips">{chip_html}</div>
        {nxt}
      </div>
      <div class="brand"{at(s0 + 1.0, 'rise')}>{LOGO_SVG}<span>PONCHO <i>Spanish</i></span></div>""", s0, end)


def scene_modules(L, chapters, photos, lines_before, lines_after):
    s0 = L.t
    L.wait(0.5)
    L.narrate(lines_before, gap=0.4)
    cards = []
    for k, ch in enumerate(chapters):
        st, _ = L.say("en", ch["en"] + ".", gap=0.25)
        L.sfx.append((st - 0.05, "pop", 0.16))
        cards.append(f'<div class="mod m{k}"{at(st - 0.1, "pop")}><img src="{photos[k][0]}" style="object-position:{photos[k][1]}">'
                     f'<div class="mod-t"><b>{e(ch["title"])}</b><span>{e(ch["en"])}</span></div></div>')
    L.wait(0.4)
    L.narrate(lines_after, gap=0.7)
    end = L.t
    L.scene("modules", "dark", f"""{chrome('Spanish for Confident Teens', 'Six modules', 'dark')}
      <div class="mods">{''.join(cards)}</div>""", s0, end)


# ---------- HTML ----------

def caption_groups(L):
    groups = []
    for start, seg in L.clips:
        ws = [(w, start + s, start + en) for w, s, en in seg["words"]]
        cur = []
        for i, w in enumerate(ws):
            cur.append(w)
            txt = " ".join(x[0] for x in cur)
            nxt = ws[i + 1] if i + 1 < len(ws) else None
            brk = nxt is None or re.search(r"[.,!?;:…]$", w[0]) or len(cur) >= 4 or len(txt) >= 22
            if nxt is not None and nxt[1] - w[2] > 0.35:
                brk = True
            if brk and nxt is not None and norm(w[0]) in CONNECTORS and len(cur) > 1 and not re.search(r"[.,!?;:]$", w[0]):
                cur.pop()
                groups.append(cur)
                cur = [w]
                continue
            if brk:
                groups.append(cur)
                cur = []
        if cur:
            groups.append(cur)
    out = []
    for g in groups:
        st, en = g[0][1], g[-1][2]
        out.append({"start": st, "end": en, "words": [{"t": w[0], "s": round(w[1], 3), "e": round(w[2], 3)} for w in g]})
    for i, g in enumerate(out):
        nxt = out[i + 1]["start"] if i + 1 < len(out) else g["end"] + 0.8
        g["end"] = min(max(g["end"] + 0.25, g["start"] + 0.5), nxt - 0.04)
        g["start"] = round(g["start"] - 0.1, 3)
        g["end"] = round(g["end"], 3)
    for g in out:
        sc = next((s for s in L.scenes if s["start"] <= g["start"] + 0.2 < s["end"]), L.scenes[-1])
        g["tone"] = TONE[sc["bg"]]
    return out


def render_html(L, total):
    scenes, trans = [], []
    for i, s in enumerate(L.scenes):
        dur = s["end"] - s["start"]
        scenes.append(f'<section id="s{i}" class="scene clip bg-{s["bg"]} k-{s["kind"]}" data-start="{s["start"]:.3f}" '
                      f'data-duration="{dur:.3f}" data-track-index="1">{s["html"]}</section>')
        if i and s["trans"] in ("stripes", "flood"):
            t = s["start"]
            trans.append(f'<div id="t{i}" class="trans clip {s["trans"]}" data-start="{max(0, t - 0.5):.3f}" data-duration="1.0" '
                         f'data-track-index="3" data-layout-allow-overflow data-layout-ignore>'
                         f'<div class="tb"><i></i><i></i><i></i><i></i><i></i></div></div>')
            L.sfx.append((t - 0.32, "whoosh", 0.2))
    caps = caption_groups(L)
    cap_html = []
    for i, g in enumerate(caps):
        ws = "".join(f"<span>{e(w['t'])}</span> " for w in g["words"])
        cap_html.append(f'<div class="grupo {g["tone"]}" id="g{i}"><div class="linea"><i class="resalte"></i>{ws.strip()}</div></div>')
    css = (HERE / "template" / "lesson.css").read_text(encoding="utf-8")
    js = (HERE / "template" / "lesson.js").read_text(encoding="utf-8")
    data = json.dumps({"caps": caps, "total": total}, ensure_ascii=False)
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=1920, height=1080" />
<title>{e(L.title)}</title>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
<style>{css}</style>
</head>
<body>
<div id="root" data-composition-id="main" data-start="0" data-duration="{total:.3f}" data-width="1920" data-height="1080">
  <div id="paper" class="clip" data-start="0" data-duration="{total:.3f}" data-track-index="0"></div>
  {''.join(scenes)}
  {''.join(trans)}
  <div id="subs" class="clip" data-start="0" data-duration="{total:.3f}" data-track-index="4" data-track-kind="captions" data-layout-allow-overlap>{''.join(cap_html)}</div>
  <div id="progress" class="clip" data-start="0" data-duration="{total:.3f}" data-track-index="5"><i></i></div>
  <audio id="mix" class="clip" src="assets/mix.wav" data-start="0" data-duration="{total:.3f}" data-track-index="6" data-volume="1"></audio>
</div>
<script>window.LESSON = {data};</script>
<script>{js}</script>
</body>
</html>"""


# ---------- audio ----------

def mix_audio(L, total, out):
    n = int((total + 0.5) * SR)
    voice = np.zeros(n, np.float32)
    for start, seg in L.clips:
        i = int(start * SR)
        a = seg["audio"][: n - i]
        voice[i:i + len(a)] += a
    peak = np.max(np.abs(voice)) or 1
    voice *= 0.89 / peak
    fx = np.zeros(n, np.float32)
    sfx_dir = HERE / "assets" / "sfx"
    cache = {}
    for t, name, gain in L.sfx:
        if name not in cache:
            cache[name] = decode(sfx_dir / f"{name}.mp3")
        a = cache[name]
        i = max(0, int(t * SR))
        a = a[: n - i]
        fx[i:i + len(a)] += a * gain
    bed = decode(HERE / "assets" / "music" / "bed.mp3")
    reps = int(np.ceil(n / len(bed))) + 1
    music = np.tile(bed, reps)[:n]
    env = np.abs(voice)
    win = int(0.25 * SR)
    act = np.convolve((env > 0.02).astype(np.float32), np.ones(win, np.float32) / win, mode="same")
    act = np.clip(act * 3, 0, 1)
    k = int(0.6 * SR)
    act = np.convolve(act, np.ones(k, np.float32) / k, mode="same")
    gain = 0.16 - 0.09 * act
    fade_in = np.clip(np.arange(n) / (1.0 * SR), 0, 1)
    fade_out = np.clip((n - np.arange(n)) / (2.5 * SR), 0, 1)
    music = music * gain * fade_in * fade_out
    mix = voice + fx + music
    raw = out.with_suffix(".raw.wav")
    stereo = np.repeat(np.clip(mix, -1, 1)[:, None], 2, axis=1)
    write_wav(raw, stereo)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(raw), "-af", "loudnorm=I=-16:TP=-1.5:LRA=11",
                    "-ar", str(SR), str(out)], check=True)
    raw.unlink()


def write_wav(path, stereo):
    import wave
    pcm = (stereo * 32767).astype("<i2")
    with wave.open(str(path), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())


# ---------- curso ----------

def lesson_projects(course_name):
    C = load_module(HERE / "courses" / f"{course_name}.py", course_name)
    B = load_module(EBOOKS / "books" / f"{C.BOOK}.py", C.BOOK).BOOK
    sys.path.insert(0, str(EBOOKS))
    import build as ebook_build
    S = C.COURSE

    def photo_file(pid):
        return Path(ebook_build.photo(pid).replace("file:///", "").replace("%20", " "))

    plans = []
    chapters = B["chapters"]
    photos = [(photo_file(ch["photo"]), S["photo_pos"].get(ci, "50% 50%")) for ci, ch in enumerate(chapters)]
    cover = (EBOOKS / "photos" / S["cover_photo"], "50% 22%")

    plans.append(("0-0", "Welcome", None))
    for ci, ch in enumerate(chapters):
        for ui, u in enumerate(ch["units"]):
            plans.append((f"{ci + 1}-{ui + 1}", u["en"], (ci, ui)))
        plans.append((f"{ci + 1}-{len(ch['units']) + 1}", f"Practice - {ch['en']}", (ci, None)))
    return C, B, S, chapters, photos, cover, plans


def build_lesson(course_name, lid, only_meta=False):
    C, B, S, chapters, photos, cover, plans = lesson_projects(course_name)
    idx = next(i for i, p in enumerate(plans) if p[0] == lid)
    _, title, key = plans[idx]
    nxt = plans[idx + 1] if idx + 1 < len(plans) else None
    proj = BUILD / course_name / lid
    if proj.exists():
        shutil.rmtree(proj)
    (proj / "assets").mkdir(parents=True)
    fonts = proj / "assets" / "fonts"
    shutil.copytree(HERE / "assets" / "fonts", fonts)

    def put_photo(src):
        dst = proj / "assets" / src[0].name
        shutil.copy(src[0], dst)
        return f"assets/{src[0].name}"

    L = Lesson(lid, title)
    if key is None:
        cov = put_photo(cover)
        ph = [(put_photo(p), p[1]) for p in photos]
        w = S["welcome"]
        scene_open(L, None, "", "", S["title"], S["level"], w[:2], cov, cover[1], kicker="PONCHO Spanish · Online course")
        scene_modules(L, chapters, ph, ["There are six modules."], [])
        s0 = L.t
        L.wait(0.6)
        m = L.narrate(w[3:6])
        end = L.t
        es_t = next(x[2] for x in m if x[0] == "es")
        ar_t = next(x[2] for x in m if x[0] == "ar")
        L.scene("voices", "cream", f"""
          {chrome('How it works', 'Two accents, one language', 'light')}
          {deco()}
          <div class="voices">
            <div class="vcard"{at(es_t - 0.15, 'pop')}>{ES_FLAG}<b>Spain</b><span class="es big2">¡Hola! ¿Qué tal?</span></div>
            <div class="vcard"{at(ar_t - 0.15, 'pop')}>{AR_FLAG}<b>Argentina</b><span class="es big2">¡Hola! ¿Cómo andás?</span></div>
          </div>""", s0, end)
        scene_quiz(L, "", [("Hello! How are you?", "¡Hola! ¿Qué tal?", "es")], intro=w[6].replace("«¡Te toca!»", "Te toca"))
        scene_close(L, ["¡Hola!", "¿Qué tal?", "¡Vamos!"], chapters[0]["units"][0]["en"], w[7:])
    else:
        ci, ui = key
        ch = chapters[ci]
        cs = S["chapters"][ci]
        ph = (put_photo(photos[ci]), photos[ci][1])
        if ui is None:
            scene_open(L, ci, ch["title"], ch["en"], "¡A practicar!", f"Practice · {ch['en']}",
                       [f"Time to practise everything from {ch['en'].lower()}. Ready?"], ph[0], ph[1])
            choice, trans = [], []
            for p in ch["practice"]:
                if p["type"] == "quiz":
                    choice += [tuple(x) for x in p["items"]]
                elif p["type"] in ("translate", "match"):
                    items = p["items"] if p["type"] == "translate" else p["pairs"]
                    for a, b in items:
                        en, es = (a, b) if p["type"] == "translate" else (b, a)
                        trans.append((en, es, "es"))
            if choice:
                scene_choice(L, choice[:4])
            if trans:
                scene_quiz(L, "", trans[:4], title="¡En español!", intro="Now, say it in Spanish. You've got three seconds.")
            scene_card(L, ch["en"], "Dato curioso", "¿Sabías que...?", e(ch["fact"][1]), cs["fact"])
            line = [f"Great work! You've finished {ch['en'].lower()}.",
                    "Find more activities, and all the answers, in your e-book."]
            nxt_en = chapters[ci + 1]["en"] if ci + 1 < len(chapters) else None
            if nxt_en:
                line.append(f"See you in the next module: {nxt_en.lower()}!")
            else:
                line.append("You've completed the whole course. ¡Enhorabuena!")
            scene_close(L, [ch["title"], "¡Muy bien!", "¡Vamos!"], nxt_en, line)
        else:
            u = ch["units"][ui]
            us = cs["units"][ui]
            scene_open(L, ci, ch["title"], ch["en"], u["title"], u["en"], us["hook"], ph[0], ph[1])
            if u.get("intro") and ui == len(ch["units"]) - 1:
                pass
            if u.get("words"):
                scene_words(L, ch["title"], u["title"], u["words"])
            if u.get("grid"):
                scene_grid(L, ch["title"], u["title"], u["grid"])
            if u.get("grammar"):
                scene_grammar(L, u["title"], u["grammar"], us.get("grammar", {}))
            if u.get("dialogue"):
                scene_dialogue(L, u["title"], u["dialogue"])
            if u.get("tip") and us.get("tip"):
                scene_card(L, u["title"], "Tip", u["tip"][0], u["tip"][1], us["tip"])
            if u.get("fact") and us.get("fact"):
                scene_card(L, u["title"], "Dato curioso", u["fact"][0], u["fact"][1], us["fact"])
            pool = [(w[1].split(" / ")[0], w[0].split(" / ")[0], "es") for w in u.get("words", [])]
            pool += [(en.split(" / ")[0] if "," not in en else en, es, "es") for es, en in u.get("grid", [])]
            if not pool and u.get("grammar"):
                pool = []
            if pool:
                step = max(1, len(pool) // 3)
                picks = [pool[i] for i in range(0, len(pool), step)][:3]
                scene_quiz(L, u["title"], picks)
            chips = [w[0].split(" / ")[0] for w in u.get("words", [])][:3] or [g[0] for g in u.get("grid", [])][:3]
            if not chips and u.get("grammar"):
                chips = [u["grammar"][0]]
            nxt_en = nxt[1] if nxt and nxt[2] and nxt[2][1] is not None else ("Practice time" if nxt else None)
            close = [f"¡Muy bien! Now you can talk about {u['en'][0].lower() + u['en'][1:]}."
                     if not u["en"].lower().startswith(("project", "regular", "key", "articles", "question", "connectives"))
                     else f"¡Muy bien! You've finished: {u['en'].lower()}.",
                     "Practise more in your e-book, and I'll see you in the next lesson."]
            scene_close(L, chips, nxt_en, close)
    total = round(L.t + 0.2, 3)
    L.scenes[-1]["end"] = total
    mix_audio(L, total, proj / "assets" / "mix.wav")
    (proj / "index.html").write_text(render_html(L, total), encoding="utf-8")
    (proj / "hyperframes.json").write_text(json.dumps({"paths": {"assets": "assets"}}), encoding="utf-8")
    meta = {"id": lid, "title": title, "duration": total,
            "module": chapters[key[0]]["en"] if key else "Welcome", "unit": key}
    (proj / "lesson.json").write_text(json.dumps(meta, ensure_ascii=False, indent=1), encoding="utf-8")
    return proj, meta


MODULE_DIR = "{n} - {title}"


def out_name(plans, lid, chapters):
    m, u = (int(x) for x in lid.split("-"))
    title = next(p[1] for p in plans if p[0] == lid)
    folder = "0 - Welcome" if m == 0 else MODULE_DIR.format(n=m, title=f"{chapters[m - 1]['title']} ({chapters[m - 1]['en']})")
    name = "Welcome to the course" if m == 0 else title
    name = re.sub(r'[<>:"/\|?*¿¡!]', "", name).strip()
    return folder, f"{lid.replace('-', '.')} - {name}.mp4"


def render(proj, dst):
    dst.parent.mkdir(parents=True, exist_ok=True)
    tmp = proj / "render.mp4"
    subprocess.run(["npx", "hyperframes", "render", "-q", "standard", "-o", str(tmp), "--quiet"],
                   cwd=proj, check=True, shell=(sys.platform == "win32"))
    shutil.move(str(tmp), dst)


def _build(args):
    course, lid = args
    proj, meta = build_lesson(course, lid)
    return lid, str(proj), meta


def write_outline(course_name, pdf):
    """Temario del curso en PDF A4 (Chrome headless), para cargar las lecciones en la academia."""
    C, B, S, chapters, photos, cover, plans = lesson_projects(course_name)
    import build as ebook_build

    def plain(lines):
        return re.sub(r"[«»‹›]", "", " ".join(lines))

    rows, cur = [], None
    for lid, title, key in plans:
        meta = json.loads((BUILD / course_name / lid / "lesson.json").read_text(encoding="utf-8"))
        m = int(lid.split("-")[0])
        mod = "Welcome" if m == 0 else f"{chapters[m - 1]['title']} · {chapters[m - 1]['en']}"
        if mod != cur:
            rows.append(f'<h2>{e(mod)}</h2>')
            cur = mod
        if key is None:
            desc = "How the course works: six modules, voices from Spain and Argentina, and your first ¡Te toca!"
            name = "Welcome to the course"
        elif key[1] is None:
            desc = "Module review: choose the right word, say it in Spanish against the clock, and a curious fact."
            name = title
        else:
            u = chapters[key[0]]["units"][key[1]]
            desc = plain(S["chapters"][key[0]]["units"][key[1]]["hook"])
            name = f"{u['title']} · {u['en']}"
        mins = f"{int(meta['duration'] // 60)}:{int(meta['duration'] % 60):02d}"
        rows.append(f'<div class="l"><span class="id">{lid.replace("-", ".")}</span><div><b>{e(name)}</b>'
                    f'<p>{e(desc)}</p></div><span class="t">{mins}</span></div>')
    total = sum(json.loads((BUILD / course_name / p[0] / "lesson.json").read_text(encoding="utf-8"))["duration"] for p in plans)
    fonts = (HERE / "assets" / "fonts").as_uri()
    doc = f"""<!doctype html><html><head><meta charset="utf-8"><style>
@font-face {{ font-family: Bebas; src: url('{fonts}/bebas-neue-latin-400-normal.woff2'); }}
@font-face {{ font-family: Marker; src: url('{fonts}/permanent-marker-latin-400-normal.woff2'); }}
@font-face {{ font-family: Mont; src: url('{fonts}/montserrat-latin-500-normal.woff2'); font-weight: 500; }}
@font-face {{ font-family: Mont; src: url('{fonts}/montserrat-latin-700-normal.woff2'); font-weight: 700; }}
@page {{ size: A4; margin: 16mm 16mm 18mm; }}
body {{ font-family: Mont; color: #2C2C2C; font-size: 9.5pt; }}
.top {{ background: #141414; color: #EFECE5; padding: 12mm 12mm 10mm; border-radius: 4mm; position: relative; overflow: hidden; }}
.top::after {{ content: ""; position: absolute; right: 0; top: 0; bottom: 0; width: 9mm; background: repeating-linear-gradient(180deg,#C95023 0 5mm,#141414 5mm 6mm,#D5682F 6mm 11mm,#141414 11mm 12mm,#E8A84C 12mm 17mm,#141414 17mm 18mm); }}
.k {{ font-weight: 700; letter-spacing: .2em; font-size: 8pt; color: #D5682F; text-transform: uppercase; }}
h1 {{ font-family: Bebas; font-weight: 400; font-size: 40pt; line-height: .95; margin: 3mm 0 1mm; }}
.sub {{ font-family: Marker; color: #E8A84C; font-size: 14pt; }}
.facts {{ margin-top: 5mm; color: #cfc9ba; font-size: 9pt; }}
h2 {{ font-family: Bebas; font-weight: 400; font-size: 19pt; margin: 8mm 0 2mm; border-bottom: 1.5px solid #141414; padding-bottom: 1mm; break-after: avoid; }}
.l {{ display: flex; gap: 5mm; padding: 2.4mm 0; border-bottom: 1px solid #e8e4da; break-inside: avoid; }}
.id {{ font-family: Bebas; color: #C95023; font-size: 14pt; width: 10mm; flex: none; }}
.l b {{ font-weight: 700; }}
.l p {{ margin: .8mm 0 0; color: #57534A; }}
.l > div {{ flex: 1; }}
.t {{ color: #8d887c; font-weight: 700; flex: none; }}
</style></head><body>
<div class="top"><div class="k">PONCHO Spanish · Video course</div><h1>{e(S['title'])}</h1><div class="sub">{e(S['level'])}</div>
<div class="facts">{len(plans)} video lessons · {int(total // 60)} minutes · British English explanations · voices from Spain and Argentina · subtitled · based on the e-book {e(S['title'])}</div></div>
{''.join(rows)}
</body></html>"""
    html_path = BUILD / course_name / "outline.html"
    html_path.write_text(doc, encoding="utf-8")
    subprocess.run([ebook_build.CHROME, *ebook_build.CHROME_FLAGS, f"--print-to-pdf={pdf}", html_path.as_uri()],
                   check=True, capture_output=True)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("course")
    ap.add_argument("--only", nargs="*")
    ap.add_argument("--list", action="store_true")
    ap.add_argument("--jobs", type=int, default=1)
    ap.add_argument("--render", help="carpeta de salida de los MP4")
    ap.add_argument("--skip-build", action="store_true")
    ap.add_argument("--outline", help="ruta del PDF con el temario")
    a = ap.parse_args()
    C, B, S, chapters, photos, cover, plans = lesson_projects(a.course)
    if a.list:
        for p in plans:
            print(p[0], p[1])
        return
    ids = [p[0] for p in plans if not a.only or p[0] in a.only]
    if not a.skip_build:
        if a.jobs > 1:
            from concurrent.futures import ProcessPoolExecutor
            with ProcessPoolExecutor(a.jobs) as ex:
                for lid, proj, meta in ex.map(_build, [(a.course, i) for i in ids]):
                    print(f"{lid}  {meta['duration']:.1f}s  {proj}", flush=True)
        else:
            for lid in ids:
                _, proj, meta = _build((a.course, lid))
                print(f"{lid}  {meta['duration']:.1f}s  {proj}", flush=True)
    if a.outline:
        write_outline(a.course, a.outline)
    if a.render:
        root = Path(a.render)
        for lid in ids:
            folder, name = out_name(plans, lid, chapters)
            render(BUILD / a.course / lid, root / folder / name)
            print("render", lid, root / folder / name, flush=True)


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    main()
