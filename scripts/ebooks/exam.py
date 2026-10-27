"""Recursos de práctica de examen de Poncho (kind="exam").

Un módulo de books/ con un dict PAPER arma un papel de práctica con el formato de su
junta (AQA, Pearson Edexcel, Cambridge) y el estilo de Poncho **en gris** — el negro
queda para los e-books (pedido de Anto, 27/10/2026).

Los textos son originales: el formato, los tiempos y los puntajes salen de los sample
assessment materials oficiales, pero ninguna pregunta copia una del examen real.

Las etiquetas de las preguntas y los puntajes se calculan solos a partir de los bloques,
y build_exam() verifica que cada sección sume el total declarado antes de imprimir.
"""

import subprocess

from build import CACHE, CHROME, CHROME_FLAGS, HERE, OUT, e, photo

LET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
BOX = '<span class="box"></span>'
ROM = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x", "xi", "xii"]


class Labels:
    """Numera las preguntas como lo hace cada junta y junta las respuestas."""

    def __init__(self, mode):
        self.mode = mode          # "aqa" (0 1 … 4 1 corridos) o "alpha" ((a), (b), (i)…)
        self.n = 0                # contador corrido de AQA
        self.alpha = 0
        self.roman = 0
        self._key = ""
        self.rows = []            # (etiqueta, respuesta) de la pregunta en curso

    def next(self, kind):
        """Devuelve la etiqueta que se imprime; self._key guarda la del solucionario."""
        if kind == "num":
            self.n += 1
            self._key = f"{self.n:02d}"
            return self._key
        if kind == "alpha":
            self.alpha += 1
            self.roman = 0
            self._key = f"({LET[self.alpha - 1].lower()})"
            return self._key
        if kind == "roman":
            self.roman += 1
            lab = f"({ROM[self.roman - 1]})"
            # en el solucionario la parte va delante: (b)(ii) y no un (ii) suelto
            self._key = (f"({LET[self.alpha - 1].lower()})" if self.alpha else "") + lab
            return lab
        self._key = ""
        return ""

    def key(self):
        return self._key

    def cur(self):
        """La etiqueta de la parte en curso, para los bloques que no llevan la suya."""
        return f"({LET[self.alpha - 1].lower()})" if self.alpha else "✓"

    def new_question(self):
        self.alpha = 0
        self.roman = 0
        self.rows = []

    def add(self, label, answer):
        self.rows.append((label, answer))


def marks(fmt, m):
    if fmt == "aqa":
        return f'<span class="mk">[{m} mark{"s" if m > 1 else ""}]</span>'
    if fmt == "cambridge":
        return f'<span class="mk">[{m}]</span>'
    return f'<span class="mk">({m})</span>'


def q_total(fmt, n, m):
    if fmt == "cambridge":
        return f'<p class="q-total">[Total: {m}]</p>'
    if fmt == "aqa":
        return f'<p class="q-total">[{m} marks]</p>'
    return f'<p class="q-total">(Total for Question {n} = {m} marks)</p>'


def paras(items):
    return "".join(f"<p>{e(p)}</p>" for p in items)


def dotted(n):
    return f'<span class="ruled">{"<i></i>" * n}</span>'


def row(lab, kind, text, tail, html=None):
    """Etiqueta · enunciado · casilla y puntaje, todo en un renglón."""
    body = html if html is not None else e(text or "")
    cls = "lab num" if kind == "num" else "lab"
    return f'<div class="row"><span class="{cls}">{lab}</span><span class="txt">{body}</span>{tail}</div>'


# --- bloques -----------------------------------------------------------------
# Cada render_* devuelve (html, puntos). Las respuestas se cargan en L (Labels).

def b_text(b, L, fmt):
    t = f'<p class="stim-t">{e(b["t_title"])}</p>' if b.get("t_title") else ""
    cls = "stim long" if len(b["es"]) > 4 else "stim"
    return f'<div class="{cls}">{t}{paras(b["es"])}</div>', 0


def b_speakers(b, L, fmt):
    out = "".join(f'<div class="spk"><b>{e(who)}</b>{e(txt)}</div>' for who, txt in b["items"])
    return f'<div class="speakers">{out}</div>', 0


def b_signs(b, L, fmt):
    out = "".join(f'<div>{e(s)}<span>{LET[k]}</span></div>' for k, s in enumerate(b["items"]))
    return f'<div class="signs">{out}</div>', 0


def b_note(b, L, fmt):
    return f'<p class="fnote">{e(b["text"])}</p>', 0


def b_inst(b, L, fmt):
    return f'<p class="inst">{e(b["text"])}</p>', 0


def b_part(b, L, fmt):
    lab = L.next(b.get("lab", "alpha"))
    sub = f'<em>{e(b["sub"])}</em>' if b.get("sub") else ""
    return f'<p class="part"><span>{lab}</span>{e(b["text"])}{sub}</p>', 0


def b_options(b, L, fmt):
    cols = b.get("cols", 1)
    out = "".join(f"<li><b>{LET[k]}</b><span>{e(o)}</span></li>" for k, o in enumerate(b["items"]))
    return f'<ul class="optbank" style="--c:{cols}">{out}</ul>', 0


def b_legend(b, L, fmt):
    """Lista de claves sin letras (las trae ya escritas el propio texto)."""
    out = "".join(f"<li>{e(x)}</li>" for x in b["items"])
    return f'<ul class="legend" style="--c:{b.get("cols", 1)}">{out}</ul>', 0


def b_example(b, L, fmt):
    word = "Ejemplo" if b.get("es") else "Example"
    return f'<p class="inst"><b>{word}:</b> {e(b["text"])}</p>', 0


def _ms(b, n):
    if b.get("ms"):
        return list(b["ms"])
    return [b.get("m", 1)] * n


def b_letters(b, L, fmt):
    """Escribir la letra correcta en la casilla."""
    ms = _ms(b, len(b["items"]))
    kind = b.get("lab", L.mode if L.mode == "num" else "alpha")
    opts = b.get("opts")
    out, tot = "", 0
    for (prompt, ans), m in zip(b["items"], ms):
        lab = L.next(kind)
        L.add(L.key(), ans)
        tot += m
        boxes = BOX
        if opts:
            boxes = '<span class="boxes">' + "".join(f'<span class="box">{c}</span>' for c in opts) + "</span>"
        out += f'<li>{row(lab, kind, prompt, boxes + marks(fmt, m))}</li>'
    return f'<ul class="items">{out}</ul>', tot


def b_mcq(b, L, fmt):
    ms = _ms(b, len(b["items"]))
    # dentro de una parte (a) las opciones van (i), (ii)…; sueltas, (a), (b)…
    kind = b.get("lab", "num" if L.mode == "num" else ("roman" if L.alpha else "alpha"))
    out, tot = "", 0
    for (stem, opts, c), m in zip(b["items"], ms):
        lab = L.next(kind)
        L.add(L.key(), f"{LET[c]} — {opts[c]}")
        tot += m
        if fmt == "aqa":
            choices = "".join(f'<li><b>{LET[k]}</b><span>{e(o)}</span></li>' for k, o in enumerate(opts))
            head = row(lab, kind, stem, BOX + marks(fmt, m))
        else:
            choices = "".join(f'<li>{BOX}<b>{LET[k]}</b><span>{e(o)}</span></li>' for k, o in enumerate(opts))
            head = row(lab, kind, stem, marks(fmt, m))
        out += f'<li>{head}<ul class="choices">{choices}</ul></li>'
    return f'<ul class="items">{out}</ul>', tot


def b_ab(b, L, fmt):
    """«Escribí A si sólo A es correcta, B si sólo B, A + B si las dos.»"""
    ms = _ms(b, len(b["items"]))
    kind = b.get("lab", L.mode if L.mode == "num" else "alpha")
    out, tot = "", 0
    for (stem, oa, ob, ans), m in zip(b["items"], ms):
        lab = L.next(kind)
        L.add(L.key(), ans)
        tot += m
        choices = f'<li><b>A</b><span>{e(oa)}</span></li><li><b>B</b><span>{e(ob)}</span></li>'
        out += (f'<li>{row(lab, kind, stem, BOX + marks(fmt, m))}'
                f'<ul class="choices">{choices}</ul></li>')
    return f'<ul class="items">{out}</ul>', tot


def b_short(b, L, fmt):
    """Preguntas abiertas con renglones."""
    ms = _ms(b, len(b["items"]))
    kind = b.get("lab", L.mode if L.mode == "num" else "alpha")
    lines = b.get("lines", 2)
    out, tot = "", 0
    for (prompt, ans), m in zip(b["items"], ms):
        lab = L.next(kind)
        L.add(L.key(), ans)
        tot += m
        n = lines * m if b.get("per_mark") else lines
        out += f'<li>{row(lab, kind, prompt, marks(fmt, m))}{dotted(n)}</li>'
    return f'<ul class="items">{out}</ul>', tot


def b_pick(b, L, fmt):
    """Poner una equis en las N casillas correctas."""
    right = [k for k, (_, ok) in enumerate(b["items"]) if ok]
    tot = len(right)
    lab = L.next(b.get("lab", "none"))
    L.add(L.key() or L.cur(), ", ".join(LET[k] for k in right))
    stem = f'<div class="row"><span class="txt pick-stem">{e(b.get("stem", ""))}</span>{marks(fmt, tot)}</div>'
    out = "".join(f'<li><i></i><b>{LET[k]}</b><span>{e(t)}</span></li>' for k, (t, _) in enumerate(b["items"]))
    return f'{stem}<ul class="pick">{out}</ul>', tot


def b_grid(b, L, fmt):
    cols = b["cols"]
    kind = b.get("lab", L.mode if L.mode == "num" else "alpha")
    head = "".join(f"<th>{e(c)}</th>" for c in cols)
    rows, tot = "", 0
    for prompt, c in b["items"]:
        lab = L.next(kind)
        L.add(L.key(), cols[c])
        tot += 1
        cells = "".join('<td class="c"><i></i></td>' for _ in cols)
        rows += f'<tr><td><b>{lab}</b> {e(prompt)}</td>{cells}<td class="m">{marks(fmt, 1)}</td></tr>'
    return (f'<table class="gridq"><thead><tr><th>{e(b.get("head", ""))}</th>{head}<th></th></tr></thead>'
            f"<tbody>{rows}</tbody></table>"), tot


def b_table(b, L, fmt):
    """Tabla de apuntes: etiqueta a la izquierda, renglón a la derecha."""
    ms = _ms(b, len(b["items"]))
    kind = b.get("lab", L.mode if L.mode == "num" else "alpha")
    rows, tot = "", 0
    for (k, ans), m in zip(b["items"], ms):
        lab = L.next(kind)
        L.add(L.key(), ans)
        tot += m
        rows += f'<tr><td class="k"><b>{lab}</b> {e(k)}</td><td class="v">{marks(fmt, m)}</td></tr>'
    return f'<table class="notes-table"><tbody>{rows}</tbody></table>', tot


def b_gapbank(b, L, fmt):
    ms = _ms(b, len(b["items"]))
    kind = b.get("lab", L.mode if L.mode == "num" else "alpha")
    bank = "".join(f"<span>{e(w)}</span>" for w in b.get("bank") or [])
    out, tot = "", 0
    for (sent, ans), m in zip(b["items"], ms):
        lab = L.next(kind)
        L.add(L.key(), ans)
        tot += m
        body = e(sent).replace("___", '<span class="gapline"></span>')
        out += f'<li>{row(lab, kind, None, marks(fmt, m), html=body)}</li>'
    box = f'<div class="bank">{bank}</div>' if bank else ""
    return f'{box}<ul class="items">{out}</ul>', tot


def b_translate(b, L, fmt):
    ms = _ms(b, len(b["items"]))
    kind = b.get("lab", L.mode if L.mode == "num" else "alpha")
    out, tot = "", 0
    for (es, en), m in zip(b["items"], ms):
        lab = L.next(kind)
        L.add(lab, en)
        tot += m
        out += (f'<li>{row(lab, kind, None, marks(fmt, m), html="<b>" + e(es) + "</b>")}'
                f'{dotted(b.get("lines", 2))}</li>')
    return f'<ul class="items">{out}</ul>', tot


def b_para(b, L, fmt):
    """Traducción de un párrafo entero."""
    m = b.get("m", 10)
    lab = L.next(b.get("lab", "none"))
    L.add(L.key() or L.cur(), b["answer"])
    return (f'{marks(fmt, m)}<div class="stim">{paras(b["es"])}</div>{dotted(b.get("lines", 12))}'), m


def b_write(b, L, fmt):
    m = b.get("m", 10)
    lab = L.next(b.get("lab", "none"))
    L.add(L.key() or L.cur(), b["answer"])
    bank = f'<div class="bank">{"".join(f"<span>{e(w)}</span>" for w in b["bank"])}</div>' if b.get("bank") else ""
    bullets = ("<ul>" + "".join(f"<li>{e(x)}</li>" for x in b["bullets"]) + "</ul>") if b.get("bullets") else ""
    return (f'{marks(fmt, m)}<p class="part">{e(b["prompt"])}</p>{bank}{bullets}{dotted(b.get("lines", 14))}'), m


def b_tasks(b, L, fmt):
    m = b.get("m", 20)
    lab = L.next(b.get("lab", "none"))
    L.add(L.key() or L.cur(), b["answer"])
    out = ""
    for k, t in enumerate(b["items"]):
        bl = "".join(f"<li>{e(x)}</li>" for x in t["bullets"])
        out += f'<div class="task"><h4>Opción {k + 1}</h4><p>{e(t["prompt"])}</p><ul>{bl}</ul></div>'
    return f'{marks(fmt, m)}<div class="tasks">{out}</div>{dotted(b.get("lines", 20))}', m


def b_correct(b, L, fmt):
    """Corregir la forma de la palabra entre corchetes."""
    out, tot = "", 0
    for word, ans in b["items"]:
        lab = L.next(b.get("lab", L.mode if L.mode == "num" else "alpha"))
        L.add(L.key(), f"{word} → {ans}")
        tot += 1
        out += (f'<li>{row(lab, "alpha", None, marks(fmt, 1), html="<b>" + e(word) + "</b>")}'
                f'{dotted(1)}</li>')
    return f'<ul class="items">{out}</ul>', tot


BLOCKS = {
    "text": b_text, "speakers": b_speakers, "signs": b_signs, "note": b_note, "inst": b_inst,
    "part": b_part, "options": b_options, "legend": b_legend, "example": b_example, "letters": b_letters, "mcq": b_mcq,
    "ab": b_ab,
    "short": b_short, "pick": b_pick, "grid": b_grid, "table": b_table, "gapbank": b_gapbank,
    "translate": b_translate, "para": b_para, "write": b_write, "tasks": b_tasks, "correct": b_correct,
}


def build_exam(name, P):
    fmt = P["marks_fmt"]
    L = Labels("num" if fmt == "aqa" else "alpha")
    parts = []

    # --- tapa ---
    parts.append(f'''<section class="bleed cover">
      <div class="cover-photo" style="background-image:url('{photo(P["cover_photo"])}');background-position:{P.get("cover_pos", "50% 35%")}"></div>
      <img class="cover-logo" src="{(HERE / "logo.png").as_uri()}" alt="">
      <div class="cover-set"><b>{e(P["set"])}</b><span>Paper</span></div>
      <div class="cover-body">
        <div class="sticker">{e(P["sticker"])}</div>
        <h1 style="font-size:{P.get("title_pt", 76)}pt">{"<br>".join(e(x) for x in P["title_lines"])}</h1>
        <p class="cover-sub">{e(P["cover_sub"])}</p>
        <p class="cover-kicker">{e(P["kicker"])}</p>
        <p class="brand">PONCHO<span>Spanish</span></p>
      </div></section>''')

    # --- carátula del examen ---
    rules = ""
    for title, items in P["rules"]:
        rules += f'<div><h3>{e(title)}</h3><ul>{"".join(f"<li>{e(x)}</li>" for x in items)}</ul></div>'
    meta = "".join(f'<div><dt>{e(k)}</dt><dd>{e(v)}</dd></div>' for k, v in P["meta"])
    note = "".join(f"<p>{e(p)}</p>" for p in P["note"])
    parts.append(f'''<section class="flow start">
      <div class="candidate">
        <div><label>Name</label><i></i></div><div><label>Date</label><i></i></div>
      </div>
      <div class="front">
        <p class="front-board">{e(P["board"])} · {e(P["qual"])}</p>
        <h1>{e(P["subject"])}</h1>
        <p class="front-paper">{e(P["paper"])}</p>
        <p class="front-tier">{e(P["tier"])} · Practice paper {e(P["set"])} · {e(P["code"])}</p>
        <dl class="front-meta">{meta}</dl>
        <div class="rules">{rules}</div>
      </div>
      <div class="poncho-note"><p class="note-t">{e(P["note_title"])}</p>{note}</div>
    </section>''')

    # --- secciones ---
    for S in P["sections"]:
        body = (f'<div class="sec-head"><h2>{e(S["name"])}</h2>'
                f'<span class="sec-sub">{e(S["sub"])}</span>'
                f'<span class="sec-marks">{S["total"]} marks</span></div>')
        sec_total = 0
        answers_sec = []
        for Q in S["questions"]:
            L.new_question()
            qn = Q["n"]
            inner, qtot = "", 0
            for b in Q["blocks"]:
                h, m = BLOCKS[b["t"]](b, L, fmt)
                inner += h
                qtot += m
            head = (f'<div class="q-head"><span class="q-n">{qn}</span>'
                    f'<h3>{e(Q["title"])}</h3></div>')
            lead = f'<p class="q-lead">{e(Q["lead"])}</p>' if Q.get("lead") else ""
            body += f'<div class="q">{head}{lead}{inner}{q_total(fmt, qn, qtot)}</div>'
            sec_total += qtot
            answers_sec.append((qn, Q["title"], list(L.rows)))
        if sec_total != S["total"]:
            raise SystemExit(f'{name}: {S["name"]} suma {sec_total} y declara {S["total"]}')
        body += f'<p class="sec-total">Total for {e(S["name"])} = {S["total"]} marks</p>'
        parts.append(f'<section class="flow start">{body}</section>')
        S["_answers"] = answers_sec

    declared = sum(S["total"] for S in P["sections"])
    if declared != P["marks"]:
        raise SystemExit(f'{name}: las secciones suman {declared} y el papel declara {P["marks"]}')

    parts.append(f'''<section class="bleed ans-cover">
      <div class="ans-cover-body">
        <p class="sticker">Respuestas · Mark scheme</p>
        <h2>ANSWERS</h2>
        <p>{e(P["answers_note"])}</p>
      </div></section>''')

    for S in P["sections"]:
        body = f'<h2 class="title">Answers · {e(S["name"])}</h2>'
        run = []  # preguntas cortas seguidas, que van a dos columnas

        def flush(run=run):
            if not run:
                return ""
            cols = ""
            for qn, title, rows in run:
                items = "".join(f'<div class="a-row"><b>{e(lab)}</b><p>{e(a)}</p></div>' for lab, a in rows)
                cols += f'<div class="a-q"><h4><span>{qn}</span>{e(title)}</h4>{items}</div>'
            run.clear()
            return f'<div class="answers">{cols}</div>'

        for qn, title, rows in S["_answers"]:
            if not any(len(a) > 180 for _, a in rows):
                run.append((qn, title, rows))
                continue
            body += flush()
            items = f'<h5>{qn} · {e(title)}</h5>'
            for _, a in rows:
                items += "".join(f"<p>{e(x)}</p>" for x in a.split("\n"))
            body += f'<div class="a-wide"><div class="model">{items}</div></div>'
        body += flush()
        parts.append(f'<section class="flow start">{body}</section>')

    End = P["end"]
    parts.append(f'''<section class="bleed end">
      <div class="end-photo" style="background-image:url('{photo(End["photo"])}');background-position:{End.get("pos", "50% 50%")}"></div>
      <div class="end-body">
        <h2>{e(End["title"])}</h2>
        <p class="script">{e(End["script"])}</p>
        <p class="end-text">{e(End["text"])}</p>
        <img class="logo" src="{(HERE / "logo.png").as_uri()}" alt="">
        <p class="brand">PONCHO<span>Spanish</span></p>
        <p class="web">www.ponchospanish.com</p>
      </div></section>''')

    css = (HERE / "exam.css").read_text(encoding="utf-8")
    doc = f'''<!doctype html><html lang="es"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Permanent+Marker&display=swap" rel="stylesheet">
<style>{css}</style></head><body>{"".join(parts)}</body></html>'''
    OUT.mkdir(exist_ok=True)
    CACHE.mkdir(exist_ok=True)
    out_html = CACHE / f"{name}.html"
    out_html.write_text(doc, encoding="utf-8")
    out_pdf = OUT / f'{P["file"]}.pdf'
    subprocess.run([CHROME, *CHROME_FLAGS, "--virtual-time-budget=30000", f"--print-to-pdf={out_pdf}", out_html.as_uri()],
                   check=True, capture_output=True)
    print("built", out_pdf.name, P["marks"], "marks")
