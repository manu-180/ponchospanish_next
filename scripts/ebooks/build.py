"""Arma un e-book / diccionario de Poncho Spanish en PDF A4.

    python scripts/ebooks/build.py travel_dictionary
    python scripts/ebooks/build.py --all

Cada libro es un módulo en books/ con un dict BOOK; los de kind="ebook" los arma ebook.py. Las fotos son de Pexels
(licencia libre): el libro guarda sólo el id y se bajan a .cache/ la primera vez. Las que manda Anto van en photos/
y el libro guarda el nombre del archivo en vez del id.
El PDF lo imprime Chrome headless; los PDF salen a scripts/ebooks/out/.
"""

import html
import importlib
import os
import random
import subprocess
import sys
import unicodedata
import urllib.request
from pathlib import Path

HERE = Path(__file__).parent
CACHE = HERE / ".cache"
OUT = HERE / "out"
PHOTOS = HERE / "photos"
CHROME = next(
    (c for c in (os.environ.get("CHROME"), "/opt/pw-browsers/chromium",
                 "/usr/bin/chromium", "/usr/bin/google-chrome") if c and Path(c).exists()),
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
)
CHROME_FLAGS = ["--headless=new", "--disable-gpu", "--no-pdf-header-footer",
                "--allow-file-access-from-files"]
if os.name != "nt":
    CHROME_FLAGS.append("--no-sandbox")  # Linux: Chrome no arranca como root sin esto

COPY = "Copyright © 2026 PONCHO Spanish. All Rights Reserved."

ES_FLAG = '<svg class="flag" viewBox="0 0 30 20"><rect width="30" height="20" fill="#AA151B"/><rect y="5" width="30" height="10" fill="#F1BF00"/></svg>'
AR_FLAG = '<svg class="flag" viewBox="0 0 30 20"><rect width="30" height="20" fill="#74ACDF"/><rect y="6.67" width="30" height="6.67" fill="#fff"/><circle cx="15" cy="10" r="2.2" fill="#F6B40E"/></svg>'

e = html.escape


def flags(text):
    return text.replace("{ES}", ES_FLAG).replace("{AR}", AR_FLAG)


def photo(pid):
    """Foto de portada o de sección: un id de Pexels, o el nombre de un archivo de photos/.

    Las que manda Anto por el grupo van a photos/ y se nombran con su archivo; las de
    Pexels se bajan por id a .cache/ la primera vez.
    """
    if isinstance(pid, str):
        f = PHOTOS / pid
        if not f.exists():
            raise FileNotFoundError(f"falta la foto {f}")
        return f.as_uri()
    CACHE.mkdir(exist_ok=True)
    f = CACHE / f"p{pid}.jpg"
    if not f.exists():
        url = f"https://images.pexels.com/photos/{pid}/pexels-photo-{pid}.jpeg?auto=compress&cs=tinysrgb&w=1800"
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        f.write_bytes(urllib.request.urlopen(req, timeout=60).read())
    return f.as_uri()


def page(body, cls="", footer=True):
    foot = f'<div class="copy">{COPY}</div>' if footer else ""
    return f'<section class="page {cls}">{body}{foot}</section>'


def spanish_cell(es, region):
    if region == "ES/AR" and " / " in es:
        a, b = es.split(" / ", 1)
        return f'<span class="term">{e(a)}</span> {ES_FLAG}<span class="alt">{e(b)} {AR_FLAG}</span>'
    mark = {"ES": f" {ES_FLAG}", "AR": f" {AR_FLAG}"}.get(region or "", "")
    return f'<span class="term">{e(es)}</span>{mark}'


def vocab_rows(words):
    return "".join(
        f'<tr><td class="es">{spanish_cell(es, r)}</td><td class="en">{e(en)}</td>'
        f'<td class="ex"><span class="ex-es">{e(xes)}</span><span class="ex-en">{e(xen)}</span></td></tr>'
        for es, en, xes, xen, r in words
    )


def vocab_table(words, cols):
    head = "".join(f"<th>{e(c)}</th>" for c in cols)
    return f'<table class="vocab"><thead><tr>{head}</tr></thead><tbody>{vocab_rows(words)}</tbody></table>'


def banner(i, title, en, pid, cls=""):
    return f'''
      <div class="banner {cls}" style="background-image:url('{photo(pid)}')">
        <div class="banner-shade"></div>
        <div class="banner-text"><span class="num">{i:02d}</span><h2>{e(title)}</h2><p class="sub">{e(en)}</p></div>
      </div>'''


def fact_box(fact):
    if not fact:
        return ""
    t, b = fact
    return f'<aside class="fact"><p class="fact-t">{e(t)}</p><p>{flags(e(b))}</p></aside>'


def dialogue_box(d):
    rows = "".join(
        f'<li><span class="who">{e(who)}</span><span class="d-es">{e(es)}</span><span class="d-en">{e(en)}</span></li>'
        for who, es, en in d["lines"]
    )
    return f'<div class="dialogue"><p class="d-title">{e(d["title"])}</p><ol>{rows}</ol></div>'


def section_pages(i, s, cols):
    words = s["words"]
    head = banner(i, s["title"], s["en"], s["photo"], "tight" if len(words) <= 13 else "")
    head += f'<p class="intro">{e(s["intro"])}</p>'
    pages = []
    if len(words) <= 13 and not s.get("dialogue"):
        pages.append(page(head + vocab_table(words, cols) + ("" if len(words) > 11 else fact_box(s.get("fact"))), "vocab-page single"))
        if len(words) > 11 and s.get("fact"):
            pass
        return pages
    first, rest = words[:11], words[11:]
    pages.append(page(head + vocab_table(first, cols), "vocab-page"))
    cont = f'<p class="running">{i:02d} · {e(s["title"])} <span>{e(s["en"])}</span></p>'
    if rest:
        cont += vocab_table(rest, cols)
    if s.get("dialogue"):
        cont += dialogue_box(s["dialogue"])
    cont += fact_box(s.get("fact"))
    pages.append(page(cont, "vocab-page"))
    return pages


def strip(w):
    return "".join(c for c in unicodedata.normalize("NFD", w) if unicodedata.category(c) != "Mn").upper()


def word_search(words, size=12, seed=7):
    rnd = random.Random(seed)
    grid = [[None] * size for _ in range(size)]
    placed = {}
    for w in sorted(words, key=len, reverse=True):
        for _ in range(2000):
            horiz = rnd.random() < 0.5
            r = rnd.randrange(size if horiz else size - len(w) + 1)
            c = rnd.randrange(size - len(w) + 1 if horiz else size)
            cells = [(r, c + k) if horiz else (r + k, c) for k in range(len(w))]
            if all(grid[y][x] in (None, w[k]) for k, (y, x) in enumerate(cells)):
                for k, (y, x) in enumerate(cells):
                    grid[y][x] = w[k]
                placed[w] = cells
                break
        else:
            raise SystemExit(f"could not place {w}")
    for y in range(size):
        for x in range(size):
            if grid[y][x] is None:
                grid[y][x] = rnd.choice("ABCDEFGHIJLMNOPRSTUV")
    return grid, placed


def ws_table(grid, placed=None):
    hit = {cell for cells in (placed or {}).values() for cell in cells}
    rows = "".join(
        "<tr>" + "".join(f'<td class="{"hit" if (y, x) in hit else ""}">{ch}</td>' for x, ch in enumerate(row)) + "</tr>"
        for y, row in enumerate(grid)
    )
    return f'<table class="ws">{rows}</table>'


def act(n, title, inst, body):
    return f'<div class="act"><h3><span class="badge">{n}</span> {e(title)}</h3><p class="inst">{e(inst)}</p>{body}</div>'


def activities(B):
    A = B["activities"]
    n_sec = len(B["sections"]) + (1 if B.get("phrases") else 0) + 1
    pages, keys = [], []

    match = A["match"]
    shuffled = match[:]
    random.Random(3).shuffle(shuffled)
    letters = "ABCDEFGHIJKL"
    left = "".join(f'<li><span class="mn">{n}</span><span class="mw">{e(a)}</span><span class="box"></span></li>' for n, (a, _) in enumerate(match, 1))
    right = "".join(f'<li><span class="box">{letters[k]}</span>{e(b)}</li>' for k, (_, b) in enumerate(shuffled))
    keys.append(("1 · Match them up", ", ".join(f"{n}–{letters[shuffled.index(p)]}" for n, p in enumerate(match, 1))))
    tf = A["tf"]
    keys.append(("2 · ¿Verdadero o falso?", ", ".join(f"{n} {'V' if v else 'F'}" for n, (_, v) in enumerate(tf, 1))))
    pages.append(page(
        f'<div class="act-head"><span class="num">{n_sec:02d}</span><h2 class="title">{e(A.get("title", "¡A practicar!"))}</h2><p class="sub dark">Activities</p></div>'
        + act(1, "Match them up", "Write the letter of the English meaning next to each Spanish word or phrase.",
              f'<div class="match"><ol class="plain">{left}</ol><ol class="plain">{right}</ol></div>')
        + act(2, "¿Verdadero o falso?", "Read each sentence and circle V (true) or F (false).",
              f'<ol class="tf">{"".join(f"<li><span>{e(t)}</span><b>V &nbsp; F</b></li>" for t, _ in tf)}</ol>'),
        "act-page"))

    g = A["gap"]
    gap = e(g["text"]).replace("___", '<span class="gap"></span>')
    keys.append((f'3 · {g["title"]}', ", ".join(f"{n}. {w}" for n, w in enumerate(g["answers"], 1))))
    country = A["country"]
    keys.append(("4 · Spain or Argentina?", "; ".join(f"{a} → {b}" for a, b in country)))
    pages.append(page(
        act(3, g["title"], g["inst"], f'<div class="bank">{"".join(f"<span>{e(w)}</span>" for w in g["bank"])}</div><p class="report">{gap}</p>')
        + act(4, "Spain or Argentina?", "Write the word used in Argentina next to the one used in Spain.",
              f'<ol class="country">{"".join(f"<li>{ES_FLAG}<b>{e(a)}</b><span class=\"arrow\">→</span>{AR_FLAG}<span class=\"line\"></span></li>" for a, _ in country)}</ol>'),
        "act-page"))

    ws_words = [strip(w) for w in A["ws"]]
    grid, placed = word_search(ws_words, size=A.get("ws_size", 12))
    extra = ""
    if A.get("order"):
        order = A["order"]
        rnd = random.Random(11)
        items = ""
        for s in order:
            parts = s.rstrip(".?!").split()
            mixed = parts[:]
            while mixed == parts:
                rnd.shuffle(mixed)
            items += f'<li><span class="scr">{e(" / ".join(mixed))}</span><span class="line"></span></li>'
        keys.append(("6 · Put it in order", " · ".join(order)))
        extra = act(6, "Put it in order", "Unscramble each sentence and write it on the line.", f'<ol class="order">{items}</ol>')
    keys.append((f"5 · Sopa de letras", "See the grid below."))
    pages.append(page(
        act(5, "Sopa de letras", f"Find the {len(ws_words)} words. They go across → or down ↓.",
            f'<div class="ws-wrap">{ws_table(grid)}<ul class="ws-list">{"".join(f"<li>{w}</li>" for w in ws_words)}</ul></div>')
        + extra, "act-page"))

    wn = 7 if A.get("order") else 6
    pages.append(page(
        act(wn, A["write"]["title"], A["write"]["inst"], '<div class="write">' + "<span></span>" * 9 + "</div>")
        + (f'<div class="tip">{flags(e(A["write"]["tip"]))}</div>' if A["write"].get("tip") else ""),
        "act-page"))
    keys.append((f'{wn} · {A["write"]["title"]}', A["write"]["answer"]))

    ans = "".join(f"<div><h4>{e(t)}</h4><p>{e(b)}</p></div>" for t, b in keys if not t.startswith("5 ·"))
    pages.append(page(f'<h2 class="title">Answers</h2><div class="answers">{ans}</div>'
                      f'<div class="ws-answer"><h4>5 · Sopa de letras</h4>{ws_table(grid, placed)}</div>', "text-page"))
    return pages


def build(name):
    B = importlib.import_module(f"books.{name}").BOOK
    if B.get("kind") == "ebook":
        from ebook import build_ebook
        return build_ebook(name, B)
    cols = B.get("columns", ("Español", "English", "En una frase"))
    pages = []

    pages.append(page(f'''
      <div class="cover-photo" style="background-image:url('{photo(B["cover_photo"])}');background-position:{B.get("cover_pos", "50% 30%")}"></div>
      <img class="cover-logo" src="{(HERE / "logo.png").as_uri()}" alt="">
      <div class="cover-body">
        <div class="sticker">{e(B["sticker"])}</div>
        <h1>{"<br>".join(e(x) for x in B["title_lines"])}</h1>
        <p class="cover-sub">{e(B["cover_sub"])}</p>
        <p class="cover-kicker">{flags(B["kicker"])}</p>
        <p class="brand">PONCHO<span>Spanish</span></p>
      </div>''', "cover", footer=False))

    W = B["welcome"]
    how = "".join(f"<li><b>{e(a)}</b> {e(b)}</li>" for a, b in W["how"])
    notes = "".join(f'<div class="note {"light" if k else ""}"><h3>{e(t)}</h3>{flags(body)}</div>' for k, (t, body) in enumerate(W["notes"]))
    paras = "".join(f"<p>{flags(e(p))}</p>" for p in W["body"])
    pages.append(page(f'''
      <h2 class="title">{e(W["title"])}</h2>
      <div class="two">
        <div><p class="lead">{e(W["lead"])}</p>{paras}<h3>How to use it</h3><ol class="steps">{how}</ol></div>
        <div>{notes}</div>
      </div>''', "text-page"))

    toc = "".join(f'<li><span class="n">{i:02d}</span><span class="t">{e(s["title"])}</span><span class="d">{e(s["en"])}</span></li>' for i, s in enumerate(B["sections"], 1))
    k = len(B["sections"])
    if B.get("phrases"):
        k += 1
        toc += f'<li><span class="n">{k:02d}</span><span class="t">{e(B["phrases"]["title"])}</span><span class="d">{e(B["phrases"]["en"])}</span></li>'
    toc += f'<li><span class="n">{k + 1:02d}</span><span class="t">{e(B["activities"].get("title", "¡A practicar!"))}</span><span class="d">Activities &amp; answers</span></li>'
    pages.append(page(f'<h2 class="title">Contenido</h2><ol class="toc">{toc}</ol>'
                      f'<div class="toc-photo" style="background-image:url(\'{photo(B["toc_photo"])}\')"></div>', "text-page"))

    for i, s in enumerate(B["sections"], 1):
        pages.extend(section_pages(i, s, cols))

    if B.get("phrases"):
        P = B["phrases"]
        rows = "".join(f'<li><span class="ph-es">{flags(e(a))}</span><span class="ph-en">{flags(e(b))}</span></li>' for a, b in P["items"])
        pages.append(page(banner(k, P["title"], P["en"], P["photo"], "short")
                          + f'<p class="intro">{e(P["intro"])}</p><ul class="phrases">{rows}</ul>' + fact_box(P.get("fact")), "vocab-page"))

    pages.extend(activities(B))

    End = B["end"]
    pages.append(page(f'''
      <div class="end-photo" style="background-image:url('{photo(End["photo"])}')"></div>
      <div class="end-body">
        <h2>{e(End["title"])}</h2>
        <p class="script">{e(End["script"])}</p>
        <p>{e(End["text"])}</p>
        <img class="logo" src="{(HERE / "logo.png").as_uri()}" alt="">
        <p class="brand">PONCHO<span>Spanish</span></p>
        <p class="web">www.ponchospanish.com</p>
      </div>''', "end", footer=False))

    css = (HERE / "style.css").read_text(encoding="utf-8")
    doc = f'''<!doctype html><html lang="es"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Permanent+Marker&display=swap" rel="stylesheet">
<style>{css}</style></head><body>{"".join(pages)}</body></html>'''
    OUT.mkdir(exist_ok=True)
    out_html = CACHE / f"{name}.html"
    out_html.write_text(doc, encoding="utf-8")
    out_pdf = OUT / f'{B["file"]}.pdf'
    subprocess.run([CHROME, *CHROME_FLAGS, "--virtual-time-budget=20000", f"--print-to-pdf={out_pdf}", out_html.as_uri()],
                   check=True, capture_output=True)
    print("built", out_pdf.name, len(pages), "pages")


if __name__ == "__main__":
    sys.path.insert(0, str(HERE))
    names = [p.stem for p in (HERE / "books").glob("*.py") if not p.stem.startswith("_")] if sys.argv[1:] == ["--all"] else sys.argv[1:]
    for n in names:
        build(n)
