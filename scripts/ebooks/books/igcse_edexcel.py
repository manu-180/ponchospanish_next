"""International GCSE Spanish · Pearson Edexcel 4SP1.

Datos del examen: especificación Pearson Edexcel International GCSE (9-1) in Spanish
(4SP1) de qualifications.pearson.com. Es una cualificación lineal y sin niveles
(no hay Foundation ni Higher), así que el libro usa la gramática de nivel H.
"""

from books._exam_core import (
    end_page, grammar_practice, grammar_toolbox, instructions_unit, paper_unit,
    practice, topic, vocab_practice, vocab_toolbox, welcome,
    NOTE_REGIONS, NOTE_SOURCE,
)

BOOK = {
    "kind": "ebook",
    "file": "International-GCSE-Spanish-Edexcel-Poncho",
    "title_lines": ["International GCSE", "Spanish · Edexcel"],
    "title_pt": 52,
    "cover_sub": "Your International GCSE revision e-book",
    "sticker": "Pearson Edexcel 4SP1 · Answers included",
    "kicker": "The five topic areas, the three papers and a grammar and vocabulary toolbox,<br>with Spain {ES} and Argentina {AR} alternatives",
    "cover_photo": "igcse-edexcel-cover.jpg",
    "cover_pos": "50% 30%",
    "welcome": welcome(
        "¡Hola! Welcome",
        "This book is built around one exam: Pearson Edexcel International GCSE Spanish (4SP1). Everything in it points at the three papers you will actually sit.",
        [
            "Chapter 1 explains how each paper works: the tasks, the timings and what the examiner is counting. Chapters 2, 3 and 4 cover the five topic areas of the specification, with the vocabulary, the grammar and the phrases each one needs. Chapters 5 and 6 are your toolbox: all the grammar in one place, including the subjunctive, and the words and exam phrases that come up whatever the topic.",
            "There are no tiers in this qualification: everybody sits the same papers, and it is linear, so all three are taken at the end of the course. That makes range the thing worth building. The students who do best are not the ones who know the most words, but the ones who can use three tenses, give an opinion with a reason and keep going when a word escapes them.",
            "This qualification is taught in British and international schools all over the world, including in Spain itself. Plenty of its candidates hear Spanish every day outside the classroom; this book is here to turn that into exam marks.",
        ],
        [
            ("Tu examen de un vistazo", "<p>Three papers: <b>Listening</b> (30 minutes, 40 marks), <b>Reading and Writing</b> (1 hour 45, 80 marks) and <b>Speaking</b> (8–10 minutes, 40 marks, worth <b>25%</b>).</p><p>No tiers and no coursework: all papers at the end of the course.</p>"),
            ("Las cinco áreas", "<p>A · Home and abroad · B · Education and employment · C · Personal life and relationships · D · The world around us · E · Social activities, fitness and health.</p><p>Each area has five sub-topics, and a few of them are not used in the speaking test.</p>"),
            NOTE_REGIONS,
        ],
    ),
    "chapters": [
        {
            "title": "Tu examen",
            "en": "Your three papers, explained",
            "photo": "igcse-edexcel-cover.jpg",
            "pos": "50% 38%",
            "intro": "Three papers, five topic areas, no tiers. The reading and writing paper is the long one, and the way you split your time inside it decides a lot of marks.",
            "fact": ("¿Sabías que...?", "Every writing task in this exam is tied to one of the five topic areas, so a question can ask you to write about school even if you were hoping for holidays. Preparing all five areas is the only safe strategy."),
            "units": [
                paper_unit(
                    "La comprensión oral", "Paper 1 · Listening · 30 minutes · 40 marks",
                    "A short, dense paper: 30 minutes and seven questions covering all five topic areas. The task types change from question to question, so read each rubric before the recording starts.",
                    [
                        ("Question types", "multiple choice and multiple matching"),
                        ("Note-taking", "complete notes in Spanish"),
                        ("Gap-fill", "one word, exactly as you hear it"),
                        ("Topics", "all five areas can appear"),
                        ("Length", "30 minutes, 40 marks"),
                        ("Dictionaries", "are not allowed"),
                    ],
                    tip=("Treinta minutos pasan rápido", "There is no time to translate in your head. Train with short clips: listen once for the gist, once for the detail, and write the Spanish word you hear rather than the one you expect."),
                ),
                paper_unit(
                    "Lectura y escritura", "Paper 2 · Reading and Writing · 1 hour 45 · 80 marks",
                    "One paper, two halves, 40 marks each. The reading section has five questions; the writing section has two open-response tasks plus a task on verb forms, and each task is tied to a topic area.",
                    [
                        ("Reading", "five questions · 40 marks"),
                        ("Writing", "two open-response tasks · and a verb-form task"),
                        ("Verb forms", "the right tense, the right person"),
                        ("Timing", "about half the paper for each section"),
                        ("Answers", "in Spanish"),
                        ("Dictionaries", "are not allowed"),
                    ],
                    tip=("No empieces por el final", "Leave yourself a fixed time for the writing half, whatever is happening in the reading half. A blank writing task costs far more than a rushed reading answer."),
                ),
                paper_unit(
                    "La expresión oral", "Paper 3 · Speaking · 8–10 minutes · 40 marks",
                    "Conducted by your teacher and marked by Pearson. Three tasks in 8 to 10 minutes, worth 25% of the qualification.",
                    [
                        ("Task A", "a picture-based discussion"),
                        ("Tasks B and C", "two conversations on topics set by Pearson"),
                        ("Topics", "from the five areas, minus a few sub-topics"),
                        ("Length", "8–10 minutes · 40 marks"),
                        ("Marked by", "Pearson, from the recording"),
                        ("25%", "of the qualification"),
                    ],
                    tip=("La foto no se describe, se comenta", "Task A is not a list of objects. Say what you see, then what you think about it and what it reminds you of: <b>En la foto se ve… Me parece que… A mí me pasó algo parecido cuando…</b>"),
                ),
                instructions_unit(),
            ],
            "practice": [
                {"type": "quiz", "title": "¿Conoces tu examen?", "inst": "Choose the right answer about International GCSE Spanish (4SP1).", "items": [
                    ("How many papers are there?", ["two", "three", "four"], 1),
                    ("How long is the listening paper?", ["30 minutes", "45 minutes", "1 hour"], 0),
                    ("Reading and writing are…", ["separate papers", "one paper", "coursework"], 1),
                    ("How many topic areas are there?", ["three", "five", "six"], 1),
                    ("The speaking test is worth…", ["10%", "25%", "50%"], 1),
                    ("Are there Foundation and Higher tiers?", ["yes", "no", "only in writing"], 1)]},
                {"type": "gap", "title": "La tarea de formas verbales", "inst": "Write the correct form of the verb in brackets, as in the verb-form task.", "text": "El año pasado (yo, vivir) ___ en Madrid. Ahora (nosotros, estudiar) ___ juntos todos los días. Mañana mi hermana (ir) ___ a visitarnos. Si pudiera, (yo, viajar) ___ más a menudo. Espero que tú (poder) ___ venir en verano.", "answers": ["viví", "estudiamos", "irá", "viajaría", "puedas"]},
                {"type": "write", "title": "Paper 3, Task A · La foto", "inst": "Imagine a photo of a street market in a Spanish-speaking city. Write about 80 words in Spanish: describe it, say what the people are doing, give your opinion and link it to your own experience.", "tip": "En la foto se ve… La gente está… Me parece… A mí me gusta(n)… porque… Una vez fui a…", "answer": "Many answers are possible. Check: se ve / hay, estar + gerund, one opinion with a reason and one sentence in the past.", "lines": 10},
            ],
        },
        {
            "title": "La vida personal y los estudios",
            "en": "Areas B & C · Education and employment · Personal life and relationships",
            "photo": "confident-teens-cover.jpg",
            "pos": "50% 26%",
            "intro": "Who you are, who you live with, how you get on with them, and what school and work look like now and later. Two areas that between them cover most of what the speaking test asks.",
            "fact": ("¿Sabías que...?", "In most Spanish state schools there is no uniform, lessons often end at two or three, and marks are out of ten, where a five is a pass and a nine is a sobresaliente."),
            "units": [
                topic("identity", "H"),
                topic("family", "H"),
                topic("friends", "H"),
                topic("school", "H"),
                topic("future", "H"),
            ],
            "practice": practice(["identity", "family", "friends", "school"], write={
                "type": "write", "title": "Paper 2 · Tarea de expresión escrita",
                "inst": "Write about 100 words in Spanish about your school and your plans: what your school is like, what you are good at, what you want to study next and why.",
                "tip": "Mi instituto es… Se me da bien… porque… El año que viene voy a… Me gustaría… ya que…",
                "answer": "Many answers are possible. Check: a present, a future (voy a / estudiaré), one opinion with a reason and a connective beyond porque.", "lines": 12,
            }),
        },
        {
            "title": "Mi casa y el extranjero",
            "en": "Area A · Home and abroad",
            "photo": "igcse-cambridge-cover.jpg",
            "pos": "50% 40%",
            "intro": "Where you live, where you go and what happens when you get there. This area is the home of the past tenses: a holiday told well is worth more than a holiday listed.",
            "fact": ("¿Sabías que...?", "Spanish is the official language of twenty countries and the second most spoken native language in the world. International GCSE texts come from across that whole map, not only Spain."),
            "units": [
                topic("home", "H"),
                topic("town", "H"),
                topic("travel", "H"),
                topic("celebrations", "H"),
                topic("world", "H"),
            ],
            "practice": practice(["home", "town", "travel", "celebrations", "world"], write={
                "type": "write", "title": "Paper 2 · Tarea de expresión escrita",
                "inst": "Write about 120 words in Spanish about a trip you took: where you went and when, where you stayed, something that went wrong and whether you would go back.",
                "tip": "Hace dos años fui a… Nos alojamos en… Mientras… de repente… Volvería porque…",
                "answer": "Many answers are possible. Check: preterite for the events, imperfect for the background, and a conditional (volvería, me gustaría) at the end.", "lines": 14,
            }),
        },
        {
            "title": "El mundo y la vida social",
            "en": "Areas D & E · The world around us · Social activities, fitness and health",
            "photo": "gcse-aqa-cover.jpg",
            "pos": "50% 28%",
            "intro": "The planet, the technology we live through, and what you do with your time and your body. The most ambitious vocabulary in the exam sits here, and so do the best opportunities for complex sentences.",
            "fact": ("¿Sabías que...?", "Spanish borrows English technology words but reshapes them: chatear, postear, un selfi. In an exam the safer version is the Spanish one: colgar una foto, buscar en internet."),
            "units": [
                topic("environment", "H"),
                topic("tech", "H"),
                topic("freetime", "H"),
                topic("health", "H"),
                topic("food", "H"),
            ],
            "practice": practice(["environment", "tech", "freetime", "health", "food"], write={
                "type": "write", "title": "Paper 2 · Tarea de expresión escrita",
                "inst": "Write about 120 words in Spanish about health and technology in your generation: what young people do well, what worries you, and what should change.",
                "tip": "Hoy en día, los jóvenes… Lo que más me preocupa es… Es importante que… Deberíamos… para que…",
                "answer": "Many answers are possible. Check: lo que + verb + es, two justified opinions, and at least one subjunctive after es importante que or para que.", "lines": 14,
            }),
        },
        {
            "title": "Caja de herramientas: la gramática",
            "en": "Your grammar toolbox",
            "photo": "gcse-edexcel-cover.jpg",
            "pos": "50% 32%",
            "intro": "Every structure on the specification's grammar list, in one place: the tenses, the pronouns, the agreements and the subjunctive phrases that lift a good answer into a strong one.",
            "fact": ("¿Sabías que...?", "The specification's grammar list is public. Everything in this chapter comes from it, which means the verb-form task in Paper 2 cannot ask you for anything you have not met here."),
            "units": grammar_toolbox("H"),
            "practice": grammar_practice("H", write={
                "type": "write", "title": "Cuatro tiempos en un párrafo",
                "inst": "Write about 120 words in Spanish about how your life has changed: what it used to be like, what it is like now, what you would change and what you hope for.",
                "tip": "Antes… Ahora, en cambio… Si pudiera, cambiaría… Espero que…",
                "answer": "Many answers are possible. Check: imperfect for the past routine, present, si + imperfect subjunctive with a conditional, and espero que + subjunctive.", "lines": 14,
            }),
        },
        {
            "title": "Caja de herramientas: el vocabulario",
            "en": "Your vocabulary and exam phrases",
            "photo": "igcse-edexcel-cover.jpg",
            "pos": "50% 55%",
            "intro": "The words that belong to no single area and appear in every paper: connectives, opinions, time phrases, numbers and the phrases that keep you talking when a word disappears.",
            "fact": ("¿Sabías que...?", "Dictionaries are not allowed in any paper of this qualification, which is exactly why a small set of flexible phrases is worth more than a long list of rare nouns."),
            "units": vocab_toolbox("H"),
            "practice": vocab_practice(write={
                "type": "write", "title": "Una respuesta modelo",
                "inst": "Write about 150 words answering «¿Qué es lo más importante para los jóvenes de hoy?». Use at least three connectives, two justified opinions, one perfect tense and one subjunctive.",
                "tip": "Por un lado… por otro lado… He visto que… No creo que… Es fundamental que… En resumen…",
                "answer": "Many answers are possible. Check: three connectives, two opinions with reasons, a present perfect and a subjunctive.", "lines": 16,
            }),
        },
    ],
    "end": end_page(
        "gcse-edexcel-cover.jpg",
        "You know what the three papers ask, you have the vocabulary of all five topic areas and you have a grammar toolbox you can check in seconds. Keep speaking, keep writing a little every week, and walk into each paper knowing exactly what is coming.",
    ),
}
