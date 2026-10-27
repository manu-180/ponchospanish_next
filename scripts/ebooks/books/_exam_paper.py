"""Lo que comparten los doce recursos de práctica: tapa, carátula, reglas y cierre.

Cada módulo de un papel sólo trae sus preguntas; `shell()` pone todo lo demás a partir
de la junta y de la letra del modelo (A o B).

Los datos de cada examen (duración, puntaje, código de papel, estructura de secciones)
salen de los sample assessment materials oficiales que mandó Anto:

  AQA GCSE Spanish 8692, Paper 3 Reading, sample assessment material set 2 (F y H).
  Pearson Edexcel GCSE (9–1) Spanish 1SP1, Paper 3, SAMs issue 3, agosto 2025 (F y H).
  Pearson Edexcel International GCSE (9–1) Spanish 4SP1/02, Paper 2, junio 2025.
  Cambridge IGCSE Spanish 0530/02, Paper 2 Reading, specimen paper (examen desde 2028).

Los textos y las preguntas de estos recursos son originales de Poncho: ninguno copia un
texto del examen real, y el modelo A es distinto del B.
"""

BOARDS = {
    "aqa_foundation": {
        "board": "AQA", "qual": "GCSE Spanish 8692", "subject": "GCSE SPANISH",
        "paper": "Paper 3 · Reading", "tier": "Foundation Tier", "code": "8692/RF",
        "time": "45 minutes", "marks": 50, "marks_fmt": "aqa",
        "photo": "gcse-aqa-cover.jpg", "cover_pos": "50% 22%",
        "title_lines": ["GCSE SPANISH", "READING"], "title_pt": 54,
        "cover_sub": "AQA · Foundation tier",
        "short": "AQA Foundation", "base": "GCSE-AQA-Foundation-Reading",
    },
    "aqa_higher": {
        "board": "AQA", "qual": "GCSE Spanish 8692", "subject": "GCSE SPANISH",
        "paper": "Paper 3 · Reading", "tier": "Higher Tier", "code": "8692/RH",
        "time": "1 hour", "marks": 50, "marks_fmt": "aqa",
        "photo": "gcse-aqa-cover.jpg", "cover_pos": "50% 22%",
        "title_lines": ["GCSE SPANISH", "READING"], "title_pt": 54,
        "cover_sub": "AQA · Higher tier",
        "short": "AQA Higher", "base": "GCSE-AQA-Higher-Reading",
    },
    "edexcel_foundation": {
        "board": "Pearson Edexcel", "qual": "Level 1/Level 2 GCSE (9–1) Spanish 1SP1",
        "subject": "GCSE SPANISH", "paper": "Paper 3 · Reading and understanding in Spanish",
        "tier": "Foundation Tier", "code": "1SP1/3F", "time": "45 minutes", "marks": 50,
        "marks_fmt": "edexcel", "photo": "gcse-edexcel-cover.jpg", "cover_pos": "50% 30%",
        "title_lines": ["GCSE SPANISH", "READING"], "title_pt": 54,
        "cover_sub": "Edexcel · Foundation tier",
        "short": "Edexcel Foundation", "base": "GCSE-Edexcel-Foundation-Reading",
    },
    "edexcel_higher": {
        "board": "Pearson Edexcel", "qual": "Level 1/Level 2 GCSE (9–1) Spanish 1SP1",
        "subject": "GCSE SPANISH", "paper": "Paper 3 · Reading and understanding in Spanish",
        "tier": "Higher Tier", "code": "1SP1/3H", "time": "1 hour", "marks": 50,
        "marks_fmt": "edexcel", "photo": "gcse-edexcel-cover.jpg", "cover_pos": "50% 30%",
        "title_lines": ["GCSE SPANISH", "READING"], "title_pt": 54,
        "cover_sub": "Edexcel · Higher tier",
        "short": "Edexcel Higher", "base": "GCSE-Edexcel-Higher-Reading",
    },
    "igcse_edexcel": {
        "board": "Pearson Edexcel", "qual": "Level 1/Level 2 International GCSE (9–1) Spanish 4SP1",
        "subject": "INTERNATIONAL GCSE SPANISH", "paper": "Paper 2 · Reading and Writing",
        "tier": "One tier", "code": "4SP1/02", "time": "1 hour 45 minutes", "marks": 80,
        "marks_fmt": "edexcel", "photo": "igcse-edexcel-cover.jpg", "cover_pos": "50% 35%",
        "title_lines": ["INTERNATIONAL", "GCSE SPANISH"], "title_pt": 44,
        "cover_sub": "Edexcel · Reading and Writing",
        "short": "International GCSE Edexcel", "base": "International-GCSE-Edexcel-Reading-Writing",
    },
    "igcse_cambridge": {
        "board": "Cambridge Assessment International Education", "qual": "Cambridge IGCSE Spanish 0530",
        "subject": "IGCSE SPANISH", "paper": "Paper 2 · Reading", "tier": "One tier",
        "code": "0530/02", "time": "1 hour", "marks": 40, "marks_fmt": "cambridge",
        "photo": "igcse-cambridge-cover.jpg", "cover_pos": "50% 35%",
        "title_lines": ["IGCSE SPANISH", "READING"], "title_pt": 50,
        "cover_sub": "Cambridge · Paper 2",
        "short": "IGCSE Cambridge", "base": "IGCSE-Cambridge-Reading",
    },
}

RULES_AQA = [
    ("Materials", ["You will need no other materials.", "You must not use a dictionary."]),
    ("Instructions", [
        "Answer all questions.",
        "Use black ink or black ball-point pen.",
        "Answer the questions in the spaces provided.",
        "In Section A, answer the questions in English. In Section B, translate the sentences into English.",
    ]),
    ("Information", [
        "The marks for questions are shown in brackets.",
        "There is a mark scheme at the back. Do not look at it until you have finished.",
    ]),
    ("Advice", [
        "Read each question carefully before you answer it.",
        "Never leave a box or a line empty: a sensible guess costs nothing.",
    ]),
]

RULES_EDEXCEL = [
    ("Materials", ["You do not need any other materials.", "You must not use a dictionary."]),
    ("Instructions", [
        "Answer all questions in Sections A and B.",
        "Use black ink or ball-point pen.",
        "Answer the questions in the spaces provided — there may be more space than you need.",
        "Some questions must be answered with a cross in a box.",
    ]),
    ("Information", [
        "The marks for each question are shown in brackets.",
        "There is a mark scheme at the back. Do not look at it until you have finished.",
    ]),
    ("Advice", [
        "Read each question carefully before you start to answer it.",
        "Check your answers if you have time at the end.",
    ]),
]

RULES_IGCSE_EDEXCEL = [
    ("Materials", ["You do not need any other materials.", "You must not use a dictionary."]),
    ("Instructions", [
        "Answer all questions.",
        "Use black ink or ball-point pen.",
        "Answer the questions in the spaces provided.",
        "Spend about 52 minutes on Section A and 52 minutes on Section B.",
    ]),
    ("Information", [
        "The marks for each question are shown in brackets.",
        "Section A is answered in Spanish; Section B is written in Spanish.",
    ]),
    ("Advice", [
        "Try to answer every question.",
        "In Section B, count your words: the task tells you how many to write.",
    ]),
]

RULES_CAMBRIDGE = [
    ("Materials", ["You must answer on the question paper.", "Dictionaries are not allowed."]),
    ("Instructions", [
        "Answer all questions.",
        "Use a black or dark blue pen.",
        "Write your answer to each question in the space provided.",
        "All the texts you need are printed in this paper.",
    ]),
    ("Information", [
        "The number of marks for each question is shown in brackets [ ].",
        "There is a mark scheme at the back. Do not look at it until you have finished.",
    ]),
    ("Advice", [
        "Read every option before you choose one.",
        "If you are not sure, cross out the options you know are wrong first.",
    ]),
]

RULES = {
    "aqa_foundation": RULES_AQA, "aqa_higher": RULES_AQA,
    "edexcel_foundation": RULES_EDEXCEL, "edexcel_higher": RULES_EDEXCEL,
    "igcse_edexcel": RULES_IGCSE_EDEXCEL, "igcse_cambridge": RULES_CAMBRIDGE,
}


def shell(key, letter, sections, kicker=None):
    """Devuelve el PAPER completo: todo lo común, más las secciones que le pasan."""
    B = BOARDS[key]
    file = f'{B["base"]}-{letter}-Poncho'
    return {
        "kind": "exam",
        "file": file,
        "set": letter,
        "board": B["board"], "qual": B["qual"], "subject": B["subject"],
        "paper": B["paper"], "tier": B["tier"], "code": B["code"],
        "time": B["time"], "marks": B["marks"], "marks_fmt": B["marks_fmt"],
        "cover_photo": B["photo"], "cover_pos": B["cover_pos"],
        "title_lines": B["title_lines"], "title_pt": B["title_pt"],
        "cover_sub": B["cover_sub"],
        "sticker": f'Practice paper {letter} · {B["time"]} · {B["marks"]} marks',
        "kicker": kicker or (
            f'A full {B["paper"].split("·")[1].strip().lower()} paper in the shape of the real one, '
            f'with the mark scheme at the back.'
        ),
        "meta": [("Time allowed", B["time"]), ("Maximum mark", str(B["marks"])), ("Paper reference", B["code"])],
        "rules": RULES[key],
        "note_title": "Antes de empezar",
        "note": [
            f'This is a Poncho practice paper. It follows the shape, the timings and the mark '
            f'allocation of {B["board"]} {B["qual"]}, {B["paper"]}, but every text and every '
            f'question in it is written by Poncho Spanish. It is not a past paper and it is not '
            f'published by the exam board.',
            "Sit it in one go, with a clock and without a dictionary. Mark it afterwards with the "
            "scheme at the back, and write down every word you did not know — that list is the "
            "most useful page in the whole paper.",
            "Always check the current specification on your exam board's website: boards do update "
            "their documents.",
        ],
        "answers_note": "Mark it honestly, one mark per correct answer unless the scheme says "
                        "otherwise. Where an answer could be worded in more than one way, the "
                        "scheme shows the idea the examiner is looking for.",
        "sections": sections,
        "end": {
            "photo": B["photo"], "pos": "50% 45%",
            "title": "¡Mucha suerte!", "script": "you've got this",
            "text": "Finished? Mark it, count the words you did not know and come back to this paper "
                    "in a fortnight. The second time around is where the marks are.",
        },
    }
