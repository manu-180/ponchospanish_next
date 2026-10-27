"""GCSE Spanish · AQA 8692 · Foundation tier.

Los datos del examen salen de la especificación de AQA 8692 (primeras pruebas, verano
2026) y de las páginas «specification at a glance» y «scheme of assessment» de aqa.org.uk.
El contenido de lengua es el de books/_exam_core.py, con las cajas de gramática de nivel F.
"""

from books._exam_core import (
    end_page, grammar_practice, grammar_toolbox, instructions_unit, paper_unit,
    practice, topic, vocab_practice, vocab_toolbox, welcome,
    NOTE_REGIONS, NOTE_SOURCE,
)

BOOK = {
    "kind": "ebook",
    "file": "GCSE-Spanish-AQA-Foundation-Poncho",
    "title_lines": ["GCSE Spanish", "AQA · Foundation"],
    "title_pt": 64,
    "cover_sub": "Your Foundation tier revision e-book",
    "sticker": "AQA 8692 · Foundation tier · Answers included",
    "kicker": "The three themes, the four papers and a grammar and vocabulary toolbox,<br>with Spain {ES} and Argentina {AR} alternatives",
    "cover_photo": "gcse-aqa-cover.jpg",
    "cover_pos": "50% 22%",
    "welcome": welcome(
        "¡Hola! Welcome",
        "This book is built around one exam: AQA GCSE Spanish (8692) at Foundation tier. Everything in it points at the four papers you will actually sit.",
        [
            "Chapter 1 explains how each paper works: what the tasks look like, how long you get and what the examiner is counting. Chapters 2, 3 and 4 follow AQA's three themes, with the vocabulary, the grammar and the phrases you need for each one. Chapters 5 and 6 are your toolbox: the grammar in one place, and the words and exam phrases that come up whatever the topic.",
            "Foundation tier covers grades 1 to 5, and you sit the same tier in all four papers. That means nothing in this book asks you to write essays: it asks you to be accurate, to answer every bullet point and to never leave a gap empty.",
            "Spanish is spoken by more than 490 million people in over twenty countries. The exam is the reason you are here today, but the language is the thing you keep.",
        ],
        [
            ("Tu examen de un vistazo", "<p>Four papers, each worth <b>25%</b> of the grade: Listening, Speaking, Reading and Writing. First exams: <b>summer 2026</b>.</p><p>Foundation tier covers <b>grades 1 to 5</b>, and you must sit all four papers at the same tier.</p>"),
            NOTE_REGIONS,
            NOTE_SOURCE,
        ],
    ),
    "chapters": [
        {
            "title": "Tu examen",
            "en": "Your four papers, explained",
            "photo": "gcse-aqa-cover.jpg",
            "pos": "50% 30%",
            "intro": "Before any revision, know the shape of the thing. Four papers, equal weight, same tier in all of them. Nothing here is designed to catch you out, and every task has a technique you can practise.",
            "fact": ("¿Sabías que...?", "All four papers are worth exactly 25%. A student who reads well but avoids speaking cannot make the marks up elsewhere, which is why the speaking test deserves more practice than it usually gets."),
            "units": [
                paper_unit(
                    "La comprensión oral", "Paper 1 · Listening · 35 minutes · 40 marks",
                    "A written exam of 35 minutes at Foundation tier. You hear the recordings twice, and the paper ends with a dictation: short sentences you write down exactly as you hear them, in Spanish.",
                    [
                        ("Section A", "questions and answers in English"),
                        ("Section B", "questions and answers in Spanish"),
                        ("Section C · dictation", "a minimum of 20 words at Foundation"),
                        ("Each sentence", "is repeated, with pauses for writing"),
                        ("Unfamiliar words", "a few are included on purpose"),
                        ("25%", "of the whole GCSE"),
                    ],
                    tip=("Cómo se aprueba el dictado", "The dictation rewards knowing how Spanish sounds are spelt. Practise the pairs that sound the same: <b>b / v</b>, <b>c / s / z</b>, <b>ll / y</b>, and the silent <b>h</b>. If a word is new, write what you hear and move on: an empty line scores nothing."),
                ),
                paper_unit(
                    "La expresión oral", "Paper 2 · Speaking · 7–9 minutes · 50 marks",
                    "Your teacher conducts the test and AQA marks it. You get 15 minutes of supervised preparation first. At Foundation tier the test lasts 7 to 9 minutes.",
                    [
                        ("Role-play", "10 marks · instructions in English"),
                        ("Reading aloud", "15 marks · a short text, then four questions"),
                        ("Photo card", "25 marks · describe, then unprepared conversation"),
                        ("Preparation", "15 minutes, supervised"),
                        ("Pronunciation", "is assessed directly in the reading aloud task"),
                        ("25%", "of the whole GCSE"),
                    ],
                    tip=("La parte que más sorprende", "Reading aloud is marked on pronunciation, so it can be revised: read three lines of Spanish out loud every day, especially <b>j</b> (jirafa), <b>ll</b>, <b>ñ</b>, <b>v</b> and the silent <b>h</b>."),
                ),
                paper_unit(
                    "La comprensión lectora", "Paper 3 · Reading · 45 minutes · 50 marks",
                    "45 minutes at Foundation tier. Most of the paper is comprehension, and it closes with a translation from Spanish into English.",
                    [
                        ("Section A", "reading comprehension · 40 marks"),
                        ("Section B", "translation into English · 10 marks"),
                        ("Translation", "a minimum of 35 words at Foundation"),
                        ("Texts", "come from all over the Spanish-speaking world"),
                        ("Answers", "in English and in Spanish, depending on the section"),
                        ("25%", "of the whole GCSE"),
                    ],
                    tip=("La traducción se corrige en inglés", "Translate what the Spanish says, in natural English, and never leave a word out: a missing <b>no</b> or <b>nunca</b> turns a right answer into a wrong one."),
                ),
                paper_unit(
                    "La expresión escrita", "Paper 4 · Writing · 1 hour 10 · 50 marks",
                    "Five tasks in 1 hour 10 at Foundation tier. Each one has a clear job, and the marks are spread, so no single task can sink you.",
                    [
                        ("Question 1 · photo", "five short sentences · 10 marks"),
                        ("Question 2 · message", "about 50 words, five bullets · 10 marks"),
                        ("Question 3 · grammar", "gap-fill · 5 marks"),
                        ("Question 4 · translation", "into Spanish, minimum 35 words · 10 marks"),
                        ("Question 5 · extended", "about 90 words, three bullets · 15 marks"),
                        ("25%", "of the whole GCSE"),
                    ],
                    tip=("Cuenta los puntos, no las palabras", "In the 50 and 90-word tasks, every bullet point must be answered. Two sentences per bullet is usually enough, and the word count is approximate: covering all the bullets matters more."),
                ),
                instructions_unit(),
            ],
            "practice": [
                {"type": "quiz", "title": "¿Conoces tu examen?", "inst": "Choose the right answer about AQA Foundation tier.", "items": [
                    ("How much is each paper worth?", ["10%", "25%", "50%"], 1),
                    ("The dictation is part of…", ["Listening", "Writing", "Reading"], 0),
                    ("At Foundation the dictation is a minimum of…", ["10 words", "20 words", "30 words"], 1),
                    ("How long is the speaking test?", ["3–5 minutes", "7–9 minutes", "15 minutes"], 1),
                    ("The reading paper ends with a translation into…", ["Spanish", "English", "both"], 1),
                    ("The longest writing task is about…", ["50 words", "90 words", "150 words"], 1)]},
                {"type": "match", "title": "Palabras de instrucción", "pairs": [
                    ("Contesta a las preguntas", "Answer the questions"), ("Rellena los espacios", "Fill in the gaps"),
                    ("Empareja", "Match up"), ("Según el texto", "According to the text"),
                    ("Justifica tu respuesta", "Justify your answer"), ("Marca con una cruz", "Mark with a cross"),
                    ("Elige", "Choose"), ("Menciona dos", "Mention two")]},
                {"type": "write", "title": "Paper 2 · La tarjeta con foto", "inst": "Look at a photo on your phone of you with family or friends. Write five sentences in Spanish describing it, as you would in the photo card task: who is in it, where it is, what you are doing, how you feel and when it was taken.", "tip": "En la foto hay… Estamos en… Estoy + -ando / -iendo… Me siento… La foto es de…", "answer": "Many answers are possible. Check: hay for what there is, estar for where people are, and one sentence in the past (la foto es del verano pasado).", "lines": 8},
            ],
        },
        {
            "title": "Yo y mi estilo de vida",
            "en": "Theme 1 · People and lifestyle",
            "photo": "confident-teens-cover.jpg",
            "pos": "50% 28%",
            "intro": "AQA's first theme covers identity and relationships with others, healthy living and lifestyle, and education and work. In other words: you, your people, your body and your future.",
            "fact": ("¿Sabías que...?", "In Spain, lunch is the big meal of the day and is eaten at two or three in the afternoon, which is why the evening meal is so late. School usually finishes at two or three too."),
            "units": [
                topic("identity", "F"),
                topic("family", "F"),
                topic("health", "F"),
                topic("food", "F"),
                topic("school", "F"),
                topic("future", "F"),
            ],
            "practice": practice(["identity", "family", "health", "school"], write={
                "type": "write", "title": "Paper 4, Question 2 · Un mensaje de 50 palabras",
                "inst": "Write approximately 50 words in Spanish about yourself. Answer all five bullet points: your personality, your family, what you eat, your favourite subject and one plan for next year.",
                "tip": "Soy… Tengo… Me llevo bien con… Como… Mi asignatura preferida es… El año que viene voy a…",
                "answer": "Many answers are possible. Check: one sentence per bullet, verbs that agree, and at least one opinion with porque.", "lines": 9,
            }),
        },
        {
            "title": "La cultura popular",
            "en": "Theme 2 · Popular culture",
            "photo": "gcse-edexcel-cover.jpg",
            "pos": "50% 32%",
            "intro": "Theme 2 is free-time activities, customs, festivals and celebrations, and celebrity culture. It is the friendliest theme in the exam: you already have opinions about all of it.",
            "fact": ("¿Sabías que...?", "La Tomatina in Buñol, the Fallas in Valencia and the Carnaval de Gualeguaychú in Argentina are three of the festivals that come up most often in GCSE reading texts. One cultural detail per answer is often what lifts it."),
            "units": [
                topic("freetime", "F"),
                topic("music_tv", "F"),
                topic("celebrations", "F"),
            ],
            "practice": practice(["freetime", "music_tv", "celebrations"], write={
                "type": "write", "title": "Paper 4, Question 5 · Una tarea de 90 palabras",
                "inst": "Write approximately 90 words in Spanish about your free time. Cover all three bullet points: what you do in your free time and why, a celebration you enjoyed last year, and what you think of famous people as role models.",
                "tip": "En mi tiempo libre… porque… El año pasado fui a… Hubo… En mi opinión, los famosos…",
                "answer": "Many answers are possible. Check: three bullets covered, one sentence in the preterite (fui, hubo, comimos) and one opinion with a reason.", "lines": 12,
            }),
        },
        {
            "title": "La comunicación y el mundo",
            "en": "Theme 3 · Communication and the world around us",
            "photo": "igcse-cambridge-cover.jpg",
            "pos": "50% 38%",
            "intro": "Theme 3 covers travel and tourism, media and technology, and the environment and where people live. This is the theme with the longest words in it, and they are worth learning: they come up in every reading paper.",
            "fact": ("¿Sabías que...?", "Spain is the second most visited country in the world, and tourism is one of the subjects examiners love: it links travel, the environment and jobs in a single reading text."),
            "units": [
                topic("travel", "F"),
                topic("tech", "F"),
                topic("town", "F"),
                topic("environment", "F"),
            ],
            "practice": practice(["travel", "tech", "town"], extra=[
                {"type": "translate", "title": "Paper 4, Question 4 · Traducción al español", "inst": "Translate these sentences into Spanish. Together they are about 40 words, like the Foundation translation task.", "items": [
                    ("Last summer I went to Spain with my family.", "El verano pasado fui a España con mi familia."),
                    ("I use my phone every day.", "Uso el móvil todos los días."),
                    ("In my neighbourhood there is a park and two shops.", "En mi barrio hay un parque y dos tiendas."),
                    ("We recycle glass and paper at home.", "Reciclamos el vidrio y el papel en casa."),
                    ("I would like to travel to Argentina.", "Me gustaría viajar a Argentina.")]},
            ], write={
                "type": "write", "title": "Paper 4, Question 1 · Cinco frases sobre una foto",
                "inst": "Imagine a photo of a busy beach in summer. Write five short sentences in Spanish about it, as in Question 1: what there is, what the people are doing, the weather, one opinion and one thing you did on a holiday like that.",
                "tip": "En la foto hay… La gente está… Hace… Me gusta la playa porque… El año pasado fui a…",
                "answer": "Many answers are possible. Check: five separate sentences, each with a verb, and no English words left in.", "lines": 8,
            }),
        },
        {
            "title": "Caja de herramientas: la gramática",
            "en": "Your grammar toolbox",
            "photo": "igcse-edexcel-cover.jpg",
            "pos": "50% 30%",
            "intro": "All the grammar of Foundation tier in one place: the tenses, the agreements and the patterns that the writing paper marks directly. Come back to these pages whenever a sentence does not sound right.",
            "fact": ("¿Sabías que...?", "Spanish has two verbs for to be. Ser is what something is, estar is how and where it is. Half of all Foundation writing errors are one of those two in the wrong place."),
            "units": grammar_toolbox("F"),
            "practice": grammar_practice("F", write={
                "type": "write", "title": "Tres tiempos en un párrafo",
                "inst": "Write about 90 words in Spanish about last weekend and next weekend. Use at least one verb in the past, one in the present and one in the future.",
                "tip": "El fin de semana pasado fui… Normalmente los sábados… El próximo fin de semana voy a…",
                "answer": "Many answers are possible. Check you used three time frames: fui / hice (past), voy / juego (present), voy a + infinitive (future).", "lines": 12,
            }),
        },
        {
            "title": "Caja de herramientas: el vocabulario",
            "en": "Your vocabulary and exam phrases",
            "photo": "gcse-aqa-cover.jpg",
            "pos": "50% 55%",
            "intro": "The words that do not belong to any one topic but turn up in every paper: connectives, opinions, time phrases, numbers and the phrases that keep you talking in the speaking test.",
            "fact": ("¿Sabías que...?", "A few of the words in the listening paper are deliberately outside the vocabulary list. You are not expected to know them, only to keep going: writing down what you hear is still worth marks."),
            "units": vocab_toolbox("F"),
            "practice": vocab_practice(write={
                "type": "write", "title": "Tu respuesta de siempre",
                "inst": "Write about 90 words answering the question «¿Cómo es tu vida?». Use at least two connectives, two opinions with reasons and one time phrase.",
                "tip": "Normalmente… Además… En mi opinión… porque… Sin embargo… El año que viene…",
                "answer": "Many answers are possible. Check: two connectives, two opinions with porque, one time phrase and verbs that agree.", "lines": 12,
            }),
        },
    ],
    "end": end_page(
        "gcse-edexcel-cover.jpg",
        "You now know what each paper asks, you have the vocabulary of the three themes and you have a grammar toolbox you can check in seconds. Keep reading aloud, keep answering every bullet point, and walk into that exam knowing exactly what is coming.",
    ),
}
