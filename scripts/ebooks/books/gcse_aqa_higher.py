"""GCSE Spanish · AQA 8692 · Higher tier.

Mismos datos oficiales que el libro de Foundation (especificación AQA 8692, primeras
pruebas en verano de 2026), con los tiempos, las palabras mínimas y las tareas del nivel
Higher. Gramática de nivel H, con subjuntivo.
"""

from books._exam_core import (
    end_page, grammar_practice, grammar_toolbox, instructions_unit, paper_unit,
    practice, topic, vocab_practice, vocab_toolbox, welcome,
    NOTE_REGIONS, NOTE_SOURCE,
)

BOOK = {
    "kind": "ebook",
    "file": "GCSE-Spanish-AQA-Higher-Poncho",
    "title_lines": ["GCSE Spanish", "AQA · Higher"],
    "title_pt": 70,
    "cover_sub": "Your Higher tier revision e-book",
    "sticker": "AQA 8692 · Higher tier · Answers included",
    "kicker": "The three themes, the four papers and a grammar and vocabulary toolbox,<br>with Spain {ES} and Argentina {AR} alternatives",
    "cover_photo": "gcse-aqa-cover.jpg",
    "cover_pos": "50% 22%",
    "welcome": welcome(
        "¡Hola! Welcome",
        "This book is built around one exam: AQA GCSE Spanish (8692) at Higher tier. Everything in it points at the four papers you will actually sit, and at the grades 7 to 9 end of them.",
        [
            "Chapter 1 explains how each paper works: the tasks, the timings and what the examiner is counting. Chapters 2, 3 and 4 follow AQA's three themes, with the vocabulary, the grammar and the structures each one needs. Chapters 5 and 6 are your toolbox: all the grammar in one place, including the subjunctive, and the words and phrases that turn up whatever the topic.",
            "Higher tier covers grades 4 to 9, and you sit the same tier in all four papers. At this level accuracy alone is not what separates a 6 from an 8: range is. Three tenses, an opinion with a reason, a connective that is not porque, and one complex structure per paragraph is the recipe, and this book drills it everywhere.",
            "Spanish is spoken by more than 490 million people in over twenty countries. The exam is the reason you are here today, but the language is the thing you keep.",
        ],
        [
            ("Tu examen de un vistazo", "<p>Four papers, each worth <b>25%</b> of the grade: Listening, Speaking, Reading and Writing. First exams: <b>summer 2026</b>.</p><p>Higher tier covers <b>grades 4 to 9</b>, and you must sit all four papers at the same tier.</p>"),
            ("Lo que sube de un 6 a un 8", "<p>Not longer answers: <b>richer</b> ones. In every extended task aim for three time frames, two opinions with reasons, one subjunctive and one connective beyond <b>porque</b>.</p>"),
            NOTE_REGIONS,
        ],
    ),
    "chapters": [
        {
            "title": "Tu examen",
            "en": "Your four papers, explained",
            "photo": "gcse-aqa-cover.jpg",
            "pos": "50% 30%",
            "intro": "Four papers, equal weight, same tier in all of them. At Higher tier the texts are longer and the questions less literal, but the technique for each task is still learnable.",
            "fact": ("¿Sabías que...?", "All four papers are worth exactly 25%. The speaking test is the one most students practise least and the one where a Higher candidate can gain the most, because unprepared conversation rewards fluency over perfection."),
            "units": [
                paper_unit(
                    "La comprensión oral", "Paper 1 · Listening · 45 minutes · 50 marks",
                    "A written exam of 45 minutes at Higher tier. You hear the recordings twice, and the paper ends with a dictation: short sentences you write down exactly as you hear them, in Spanish.",
                    [
                        ("Section A", "questions and answers in English"),
                        ("Section B", "questions and answers in Spanish"),
                        ("Section C · dictation", "a minimum of 30 words at Higher"),
                        ("Each sentence", "is repeated, with pauses for writing"),
                        ("Unfamiliar words", "a few are included on purpose"),
                        ("25%", "of the whole GCSE"),
                    ],
                    tip=("Cómo se aprueba el dictado", "The dictation tests spelling as much as listening. Drill the pairs that sound identical: <b>b / v</b>, <b>c / s / z</b>, <b>ll / y</b>, the silent <b>h</b>, and accents that change the word (<b>hablo</b> / <b>habló</b>). If a word is new, write the sounds and move on."),
                ),
                paper_unit(
                    "La expresión oral", "Paper 2 · Speaking · 10–12 minutes · 50 marks",
                    "Your teacher conducts the test and AQA marks it. You get 15 minutes of supervised preparation first. At Higher tier the test lasts 10 to 12 minutes.",
                    [
                        ("Role-play", "10 marks · instructions in English"),
                        ("Reading aloud", "15 marks · a short text, then four questions"),
                        ("Photo card", "25 marks · describe, then unprepared conversation"),
                        ("Preparation", "15 minutes, supervised"),
                        ("Pronunciation", "is assessed directly in the reading aloud task"),
                        ("25%", "of the whole GCSE"),
                    ],
                    tip=("La conversación no preparada", "This is where Higher marks are won. Never answer in one sentence: add a reason, an example and a comparison with the past or the future. <b>Sí, me encanta… porque… Por ejemplo… De pequeño, en cambio, …</b>"),
                ),
                paper_unit(
                    "La comprensión lectora", "Paper 3 · Reading · 1 hour · 50 marks",
                    "One hour at Higher tier. Mostly comprehension, closing with a translation from Spanish into English.",
                    [
                        ("Section A", "reading comprehension · 40 marks"),
                        ("Section B", "translation into English · 10 marks"),
                        ("Translation", "a minimum of 50 words at Higher"),
                        ("Texts", "include literary and authentic sources"),
                        ("Answers", "in English and in Spanish, depending on the section"),
                        ("25%", "of the whole GCSE"),
                    ],
                    tip=("Traducir no es adivinar", "Translate the tense you see, not the tense you expect: <b>había llegado</b> is <i>had arrived</i>, not <i>arrived</i>. Keep every negative and every little word: they carry marks."),
                ),
                paper_unit(
                    "La expresión escrita", "Paper 4 · Writing · 1 hour 15 · 50 marks",
                    "Three tasks in 1 hour 15 at Higher tier. The last one is worth half the paper, so leave it the time it deserves.",
                    [
                        ("Question 1 · translation", "into Spanish, minimum 50 words · 10 marks"),
                        ("Question 2 · structured", "about 90 words, three bullets · 15 marks"),
                        ("Question 3 · open-ended", "about 150 words, two bullets · 25 marks"),
                        ("Choice", "two options in Questions 2 and 3"),
                        ("Word counts", "are approximate; examiners read everything"),
                        ("25%", "of the whole GCSE"),
                    ],
                    tip=("Los 25 puntos del final", "Plan the 150-word task for two minutes before writing: one paragraph per bullet, three tenses between them, and a final sentence with a subjunctive (<b>Espero que…</b>). That shape is what the top band describes."),
                ),
                instructions_unit(),
            ],
            "practice": [
                {"type": "quiz", "title": "¿Conoces tu examen?", "inst": "Choose the right answer about AQA Higher tier.", "items": [
                    ("How much is each paper worth?", ["10%", "25%", "50%"], 1),
                    ("At Higher the dictation is a minimum of…", ["20 words", "30 words", "50 words"], 1),
                    ("How long is the speaking test?", ["7–9 minutes", "10–12 minutes", "20 minutes"], 1),
                    ("The reading translation is a minimum of…", ["35 words", "50 words", "90 words"], 1),
                    ("The open-ended writing task is worth…", ["10 marks", "15 marks", "25 marks"], 2),
                    ("The longest writing task is about…", ["90 words", "150 words", "250 words"], 1)]},
                {"type": "match", "title": "Palabras de instrucción", "pairs": [
                    ("Contesta a las preguntas", "Answer the questions"), ("Rellena los espacios", "Fill in the gaps"),
                    ("Empareja", "Match up"), ("Según el texto", "According to the text"),
                    ("Justifica tu respuesta", "Justify your answer"), ("Compara", "Compare"),
                    ("Elige", "Choose"), ("Menciona dos", "Mention two")]},
                {"type": "write", "title": "Paper 2 · La conversación no preparada", "inst": "Answer this question in writing, then out loud, in about 90 words: «¿Qué haces para relajarte y por qué es importante?». Use three time frames and one subjunctive.", "tip": "Normalmente… El fin de semana pasado… El año que viene… Es importante que…", "answer": "Many answers are possible. Check: a present, a past and a future, one opinion with a reason, and a subjunctive after es importante que or espero que.", "lines": 10},
            ],
        },
        {
            "title": "Yo y mi estilo de vida",
            "en": "Theme 1 · People and lifestyle",
            "photo": "confident-teens-cover.jpg",
            "pos": "50% 28%",
            "intro": "AQA's first theme covers identity and relationships with others, healthy living and lifestyle, and education and work. At Higher tier the same topics need more opinion and more nuance: not what you do, but what you think about what you do.",
            "fact": ("¿Sabías que...?", "In Spain, lunch is the main meal and is eaten at two or three, which is why dinner is so late. Mentioning a concrete cultural difference like this is a quick way to show cultural knowledge in the speaking test."),
            "units": [
                topic("identity", "H"),
                topic("family", "H"),
                topic("friends", "H"),
                topic("health", "H"),
                topic("school", "H"),
                topic("future", "H"),
            ],
            "practice": practice(["identity", "family", "friends", "health"], write={
                "type": "write", "title": "Paper 4, Question 3 · Una tarea de 150 palabras",
                "inst": "Write approximately 150 words in Spanish about your family and your health. Cover both bullet points: what your relationship with your family is like and why, and what you do to look after your physical and mental health.",
                "tip": "Lo que más valoro es… Me llevo bien con… aunque… Intento… Es importante que… Si tuviera más tiempo, …",
                "answer": "Many answers are possible. Check: both bullets developed, three time frames, at least one subjunctive and at least one connective beyond porque.", "lines": 16,
            }),
        },
        {
            "title": "La cultura popular",
            "en": "Theme 2 · Popular culture",
            "photo": "gcse-edexcel-cover.jpg",
            "pos": "50% 32%",
            "intro": "Free-time activities, customs, festivals and celebrations, and celebrity culture. Easy to talk about and easy to be shallow about: at Higher tier the marks are in the judgements, not the lists.",
            "fact": ("¿Sabías que...?", "La Tomatina, las Fallas de Valencia and el Carnaval de Gualeguaychú are among the festivals that appear most often in GCSE texts. Knowing one in detail beats knowing five by name."),
            "units": [
                topic("freetime", "H"),
                topic("music_tv", "H"),
                topic("celebrations", "H"),
                topic("food", "H"),
            ],
            "practice": practice(["freetime", "music_tv", "celebrations"], write={
                "type": "write", "title": "Paper 4, Question 2 · Una tarea de 90 palabras",
                "inst": "Write approximately 90 words in Spanish about popular culture. Cover all three bullet points: a celebration you took part in last year, what you watch or listen to now, and whether famous people are good role models.",
                "tip": "El año pasado fui a… Hubo… Ahora veo… No creo que los famosos sean… porque…",
                "answer": "Many answers are possible. Check: three bullets covered, a preterite and an imperfect in the celebration part, and no creo que + subjunctive in the opinion.", "lines": 12,
            }),
        },
        {
            "title": "La comunicación y el mundo",
            "en": "Theme 3 · Communication and the world around us",
            "photo": "igcse-cambridge-cover.jpg",
            "pos": "50% 38%",
            "intro": "Travel and tourism, media and technology, and the environment and where people live. This is the theme with the most ambitious vocabulary in the exam, and the one where a well-placed subjunctive does the most work.",
            "fact": ("¿Sabías que...?", "Spain is the second most visited country in the world. Tourism links travel, jobs and the environment, which is why examiners build whole reading texts around it."),
            "units": [
                topic("travel", "H"),
                topic("tech", "H"),
                topic("town", "H"),
                topic("environment", "H"),
            ],
            "practice": practice(["travel", "tech", "town", "environment"], extra=[
                {"type": "translate", "title": "Paper 4, Question 1 · Traducción al español", "inst": "Translate these sentences into Spanish. Together they are about 55 words, like the Higher translation task.", "items": [
                    ("Last summer we went to Granada and the weather was very hot.", "El verano pasado fuimos a Granada y hacía mucho calor."),
                    ("I had already booked the hotel before we left.", "Ya había reservado el hotel antes de salir."),
                    ("Social media is useful, although I spend too much time on my phone.", "Las redes sociales son útiles, aunque paso demasiado tiempo con el móvil."),
                    ("We should take action so that the planet survives.", "Deberíamos tomar medidas para que el planeta sobreviva."),
                    ("If there were more buses, I would go out more often.", "Si hubiera más autobuses, saldría más a menudo.")]},
            ], write={
                "type": "write", "title": "Paper 4, Question 3 · Una tarea de 150 palabras",
                "inst": "Write approximately 150 words in Spanish about travel and the environment. Cover both bullet points: a journey or holiday that mattered to you, and what your generation should do about the climate.",
                "tip": "Hace dos años fui a… Mientras… Lo que más me impresionó fue… Deberíamos… para que… A menos que actuemos, …",
                "answer": "Many answers are possible. Check: preterite and imperfect together in the first bullet, deberíamos + infinitive and para que / a menos que + subjunctive in the second.", "lines": 16,
            }),
        },
        {
            "title": "Caja de herramientas: la gramática",
            "en": "Your grammar toolbox",
            "photo": "igcse-edexcel-cover.jpg",
            "pos": "50% 30%",
            "intro": "Every structure Higher tier expects, in one place: the tenses, the agreements, the pronouns and the subjunctive phrases that the top mark bands describe as complex language.",
            "fact": ("¿Sabías que...?", "Examiners do not count subjunctives. They notice whether the language is varied and appropriate, which is why two well-placed subjunctive phrases beat six forced ones."),
            "units": grammar_toolbox("H"),
            "practice": grammar_practice("H", write={
                "type": "write", "title": "Cuatro tiempos en un párrafo",
                "inst": "Write about 120 words in Spanish about your relationship with sport or music: how it started, what you do now, what you would do with more time and what you hope for next year.",
                "tip": "Empecé cuando tenía… Ahora… Si tuviera más tiempo, … Espero que el año que viene…",
                "answer": "Many answers are possible. Check: preterite and imperfect in the first part, present in the second, si + imperfect subjunctive with a conditional, and espero que + subjunctive at the end.", "lines": 14,
            }),
        },
        {
            "title": "Caja de herramientas: el vocabulario",
            "en": "Your vocabulary and exam phrases",
            "photo": "gcse-aqa-cover.jpg",
            "pos": "50% 55%",
            "intro": "The words that belong to no single topic and appear in every paper: connectives, opinions, time phrases, numbers and the phrases that keep you talking when a word disappears.",
            "fact": ("¿Sabías que...?", "A few words in the listening paper sit deliberately outside the vocabulary list. You are not expected to know them, only to keep going and write down what you hear."),
            "units": vocab_toolbox("H"),
            "practice": vocab_practice(write={
                "type": "write", "title": "Una respuesta modelo",
                "inst": "Write about 150 words answering «¿Cómo ha cambiado tu vida en los últimos años?». Use at least three connectives, two opinions with reasons, one perfect tense and one subjunctive.",
                "tip": "Hace unos años… Ahora, en cambio… He aprendido que… Por un lado… por otro lado… Espero que…",
                "answer": "Many answers are possible. Check: three connectives, two justified opinions, a present perfect (he + participle) and a subjunctive.", "lines": 16,
            }),
        },
    ],
    "end": end_page(
        "gcse-edexcel-cover.jpg",
        "You know what each paper asks, you have the vocabulary of the three themes and you have every structure the Higher mark bands look for. Keep reading aloud, keep stretching every answer with a reason and an example, and go and get the grade you have been working for.",
    ),
}
