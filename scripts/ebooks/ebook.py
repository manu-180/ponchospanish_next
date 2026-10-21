"""E-books de Poncho (kind="ebook"): capítulos con aperturas en negro, unidades,
ejercicios por capítulo y respuestas al final. A diferencia de los diccionarios
(build.py), el contenido fluye y Chrome pagina solo; las páginas con foto van
a sangre en negro para distinguir los e-books de los recursos (pedido de Anto).
"""

import random
import subprocess

from build import CACHE, CHROME, HERE, OUT, e, flags, photo, spanish_cell, strip, word_search, ws_table

LETTERS = "ABCDEFGHIJKLMNOP"


def bleed(body, cls=""):
    return f'<section class="bleed {cls}">{body}</section>'


def vocab_table(words):
    rows = "".join(
        f'<tr><td class="es">{spanish_cell(es, r)}</td><td class="en">{e(en)}</td>'
        f'<td class="ex"><span class="ex-es">{e(xes)}</span><span class="ex-en">{e(xen)}</span></td></tr>'
        for es, en, xes, xen, r in words
    )
    return ('<table class="vocab"><thead><tr><th>Español</th><th>English</th><th>En una frase</th></tr></thead>'
            f'<tbody>{rows}</tbody></table>')


def grid_list(items):
    cells = "".join(
        f'<li>{spanish_cell(it[0], it[2] if len(it) > 2 else None)}<span class="g-en">{e(it[1])}</span></li>'
        for it in items
    )
    return f'<ul class="grid">{cells}</ul>'


def dialogue(d):
    rows = "".join(
        f'<li><span class="who">{e(who)}</span><span class="d-es">{e(es)}</span><span class="d-en">{e(en)}</span></li>'
        for who, es, en in d["lines"]
    )
    return f'<div class="dialogue"><p class="d-title">{e(d["title"])}</p><ol>{rows}</ol></div>'


def box(kind, t, body):
    return f'<aside class="{kind}"><p class="box-t">{e(t)}</p><div>{flags(body)}</div></aside>'


def unit_html(ci, ui, u):
    out = (f'<div class="unit"><div class="unit-head"><span class="u-num">{ci}.{ui}</span>'
           f'<h3>{e(u["title"])}</h3><span class="u-en">{e(u["en"])}</span></div>')
    if u.get("intro"):
        out += f'<p class="u-intro">{flags(e(u["intro"]))}</p>'
    if u.get("words"):
        out += vocab_table(u["words"])
    if u.get("grid"):
        out += grid_list(u["grid"])
    if u.get("grammar"):
        out += box("grammar", u["grammar"][0], u["grammar"][1])
    if u.get("dialogue"):
        out += dialogue(u["dialogue"])
    if u.get("tip"):
        out += box("tip", u["tip"][0], u["tip"][1])
    if u.get("fact"):
        out += box("fact", u["fact"][0], e(u["fact"][1]))
    return out + "</div>"


def exercise(x, label, seed):
    """Devuelve (html, respuesta)."""
    t = x["type"]
    inst = x.get("inst")
    head = f'<h4><span class="badge">{label}</span> {e(x["title"])}</h4>'
    if t == "match":
        pairs = x["pairs"]
        shuffled = pairs[:]
        random.Random(seed).shuffle(shuffled)
        left = "".join(f'<li><span class="mn">{n}</span><span class="mw">{e(a)}</span><span class="box"></span></li>' for n, (a, _) in enumerate(pairs, 1))
        right = "".join(f'<li><span class="box">{LETTERS[k]}</span>{e(b)}</li>' for k, (_, b) in enumerate(shuffled))
        body = f'<div class="match"><ol class="plain">{left}</ol><ol class="plain">{right}</ol></div>'
        ans = ", ".join(f"{n}–{LETTERS[shuffled.index(p)]}" for n, p in enumerate(pairs, 1))
        inst = inst or "Write the letter of the matching meaning in each box."
    elif t == "tf":
        body = f'<ol class="tf">{"".join(f"<li><span>{e(s)}</span><b>V &nbsp; F</b></li>" for s, _ in x["items"])}</ol>'
        ans = ", ".join(f"{n} {'V' if v else 'F'}" for n, (_, v) in enumerate(x["items"], 1))
        inst = inst or "Circle V (verdadero, true) or F (falso, false)."
    elif t == "gap":
        text = e(x["text"]).replace("___", '<span class="gap"></span>')
        bank = "".join(f"<span>{e(w)}</span>" for w in sorted(x["answers"], key=lambda w: strip(w)))
        body = f'<div class="bank">{bank}</div><p class="report">{text}</p>'
        ans = ", ".join(f"{n}. {w}" for n, w in enumerate(x["answers"], 1))
        inst = inst or "Complete the text with the words from the box."
    elif t == "translate":
        body = f'<ol class="lines">{"".join(f"<li><span>{e(en)}</span><i></i></li>" for en, _ in x["items"])}</ol>'
        ans = " · ".join(f"{n}. {es}" for n, (_, es) in enumerate(x["items"], 1))
        inst = inst or "How would you say it in Spanish?"
    elif t == "quiz":
        items = ""
        for q, opts, _ in x["items"]:
            o = "".join(f"<span><b>{LETTERS[k].lower()}</b> {e(op)}</span>" for k, op in enumerate(opts))
            items += f'<li><p>{e(q)}</p><div class="opts">{o}</div></li>'
        body = f'<ol class="quiz">{items}</ol>'
        ans = ", ".join(f"{n}{LETTERS[c].lower()}" for n, (_, _, c) in enumerate(x["items"], 1))
        inst = inst or "Choose the right answer."
    elif t == "odd":
        items = "".join(f'<li>{" ".join(f"<span>{e(w)}</span>" for w in ws)}</li>' for ws, _, _ in x["items"])
        body = f'<ol class="odd">{items}</ol>'
        ans = " · ".join(f"{n}. {ws[k]} ({why})" for n, (ws, k, why) in enumerate(x["items"], 1))
        inst = inst or "Circle the word that doesn't belong and say why."
    elif t == "order":
        rnd = random.Random(seed)
        items = ""
        for s in x["items"]:
            parts = s.rstrip(".?!").split()
            mixed = parts[:]
            while mixed == parts:
                rnd.shuffle(mixed)
            items += f'<li><span class="scr">{e(" / ".join(mixed))}</span><span class="line"></span></li>'
        body = f'<ol class="order">{items}</ol>'
        ans = " · ".join(f"{n}. {s}" for n, s in enumerate(x["items"], 1))
        inst = inst or "Put the words in order and write the sentence."
    elif t == "ws":
        words = [strip(w) for w in x["words"]]
        grid, placed = word_search(words, size=x.get("size", 12), seed=seed)
        body = f'<div class="ws-wrap">{ws_table(grid)}<ul class="ws-list">{"".join(f"<li>{w}</li>" for w in words)}</ul></div>'
        ans = ws_table(grid, placed)
        inst = inst or f"Find the {len(words)} words. They go across → or down ↓."
    elif t == "write":
        body = '<div class="write">' + "<span></span>" * x.get("lines", 7) + "</div>"
        if x.get("tip"):
            body += f'<p class="w-tip">{flags(e(x["tip"]))}</p>'
        ans = x["answer"]
    else:
        raise SystemExit(f"tipo de ejercicio desconocido: {t}")
    return f'<div class="ex ex-{t}">{head}<p class="inst">{e(inst)}</p>{body}</div>', ans


def build_ebook(name, B):
    parts = []

    parts.append(bleed(f'''
      <div class="cover-photo" style="background-image:url('{photo(B["cover_photo"])}');background-position:{B.get("cover_pos", "50% 40%")}"></div>
      <img class="cover-logo" src="{(HERE / "logo.png").as_uri()}" alt="">
      <div class="cover-body">
        <div class="sticker">{e(B["sticker"])}</div>
        <h1 style="font-size:{B.get('title_pt', 100)}pt">{"<br>".join(e(x) for x in B["title_lines"])}</h1>
        <p class="cover-sub">{e(B["cover_sub"])}</p>
        <p class="cover-kicker">{flags(B["kicker"])}</p>
        <p class="brand">PONCHO <span>Spanish</span></p>
      </div>''', "cover"))

    W = B["welcome"]
    how = "".join(f"<li><b>{e(a)}</b> {e(b)}</li>" for a, b in W["how"])
    notes = "".join(f'<div class="note">{"<h3>" + e(t) + "</h3>"}{flags(body)}</div>' for t, body in W["notes"])
    paras = "".join(f"<p>{flags(e(p))}</p>" for p in W["body"])
    parts.append(f'''<section class="flow start">
      <h2 class="title">{e(W["title"])}</h2>
      <div class="two"><div><p class="lead">{e(W["lead"])}</p>{paras}<h3>How to use this book</h3><ol class="steps">{how}</ol></div>
      <div>{notes}</div></div></section>''')

    toc = ""
    for ci, c in enumerate(B["chapters"], 1):
        units = "".join(f"<li>{e(u['title'])} <span>· {e(u['en'])}</span></li>" for u in c["units"])
        toc += f'<li class="toc-ch"><p><span class="n">{ci:02d}</span><b>{e(c["title"])}</b><em>{e(c["en"])}</em></p><ul>{units}</ul></li>'
    toc += f'<li class="toc-ch"><p><span class="n">✓</span><b>Answers</b><em>Respuestas</em></p></li>'
    parts.append(f'<section class="flow start"><h2 class="title">Contenido</h2><ol class="toc">{toc}</ol></section>')

    answers = []
    for ci, c in enumerate(B["chapters"], 1):
        units_list = "".join(f"<li><span>{ci}.{ui}</span>{e(u['title'])}</li>" for ui, u in enumerate(c["units"], 1))
        fact = box("fact dark", c["fact"][0], e(c["fact"][1])) if c.get("fact") else ""
        parts.append(bleed(f'''
          <div class="ch-photo" style="background-image:url('{photo(c["photo"])}');background-position:{c.get("pos", "50% 45%")}"></div>
          <div class="ch-body">
            <span class="ch-num">{ci:02d}</span>
            <h2>{e(c["title"])}</h2>
            <p class="ch-en">{e(c["en"])}</p>
            <p class="ch-intro">{flags(e(c["intro"]))}</p>
            <div class="ch-cols"><ol class="ch-units">{units_list}</ol>{fact}</div>
          </div>''', "opener"))

        body = "".join(unit_html(ci, ui, u) for ui, u in enumerate(c["units"], 1))
        ch_ans = []
        if c.get("practice"):
            exs = ""
            for k, x in enumerate(c["practice"]):
                h, a = exercise(x, LETTERS[k], seed=ci * 31 + k)
                exs += h
                ch_ans.append((LETTERS[k], x["title"], a, x["type"]))
            body += f'<div class="practice"><p class="p-kicker">Chapter {ci}</p><h2 class="p-title">¡A practicar!</h2>{exs}</div>'
        answers.append((ci, c["title"], ch_ans))
        parts.append(f'<section class="flow start">{body}</section>')

    ans_html = ""
    for ci, title, items in answers:
        if not items:
            continue
        rows = "".join(
            f'<div class="a-item {"a-ws" if typ == "ws" else ""}"><h5>{L} · {e(t)}</h5>'
            f'{a if typ == "ws" else "<p>" + e(a) + "</p>"}</div>'
            for L, t, a, typ in items
        )
        ans_html += f'<div class="a-ch"><h4><span>{ci:02d}</span> {e(title)}</h4>{rows}</div>'
    parts.append(f'<section class="flow start"><h2 class="title">Answers</h2><div class="answers">{ans_html}</div></section>')

    End = B["end"]
    parts.append(bleed(f'''
      <div class="end-photo" style="background-image:url('{photo(End["photo"])}')"></div>
      <div class="end-body">
        <h2>{e(End["title"])}</h2>
        <p class="script">{e(End["script"])}</p>
        <p class="end-text">{e(End["text"])}</p>
        <img class="logo" src="{(HERE / "logo.png").as_uri()}" alt="">
        <p class="brand">PONCHO <span>Spanish</span></p>
        <p class="web">www.ponchospanish.com</p>
      </div>''', "end"))

    css = (HERE / "ebook.css").read_text(encoding="utf-8")
    doc = f'''<!doctype html><html lang="es"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Permanent+Marker&display=swap" rel="stylesheet">
<style>{css}</style></head><body>{"".join(parts)}</body></html>'''
    OUT.mkdir(exist_ok=True)
    CACHE.mkdir(exist_ok=True)
    out_html = CACHE / f"{name}.html"
    out_html.write_text(doc, encoding="utf-8")
    out_pdf = OUT / f'{B["file"]}.pdf'
    subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--no-pdf-header-footer", "--allow-file-access-from-files",
                    "--virtual-time-budget=30000", f"--print-to-pdf={out_pdf}", out_html.as_uri()],
                   check=True, capture_output=True)
    print("built", out_pdf.name)
