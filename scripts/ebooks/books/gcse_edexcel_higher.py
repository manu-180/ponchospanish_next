"""GCSE Spanish · Pearson Edexcel 1SP1 (2024) · Higher tier.

Mismos datos oficiales que el libro de Foundation (especificación 1SP1, primeras pruebas
2026), con los tiempos y los recuentos de palabras del nivel Higher. Gramática de nivel H,
con subjuntivo.
"""

from books._exam_core import (
    end_page, grammar_practice, grammar_toolbox, instructions_unit, paper_unit,
    practice, topic, vocab_practice, vocab_toolbox, welcome,
    NOTE_REGIONS, NOTE_SOURCE,
)

BOOK = {
    "kind": "ebook",
    "file": "GCSE-Spanish-Edexcel-Higher-Poncho",
    "title_lines": ["GCSE Spanish", "Edexcel · Higher"],
    "title_pt": 60,
    "cover_sub": "Your Higher tier revision e-book",
    "sticker": "Pearson Edexcel 1SP1 · Higher tier · Answers included",
    "kicker": "The six thematic contexts, the four papers and a grammar and vocabulary toolbox,<br>with Spain {ES} and Argentina {AR} alternatives",
    "cover_photo": "gcse-edexcel-cover.jpg",
    "cover_pos": "50% 28%",
    "welcome": welcome(
        "¡Hola! Welcome",
        "This book is built around one exam: Pearson Edexcel GCSE Spanish (1SP1) at Higher tier. Everything in it points at the four papers you will actually sit, and at the top of the grade range.",
        [
            "Chapter 1 explains how each paper works: the tasks, the timings and what the examiner is counting. Chapters 2, 3 and 4 cover Edexcel's six thematic contexts, with the vocabulary, the grammar and the structures each one needs. Chapters 5 and 6 are your toolbox: all the grammar in one place, including the subjunctive, and the words and phrases that come up whatever the topic.",
            "Edexcel's six contexts are My personal world, Lifestyle and wellbeing, My neighbourhood, Media and technology, Studying and my future, and Travel and tourism. The topics are familiar on purpose; at Higher tier what separates a 6 from an 8 is not the subject, it is the range of language you bring to it.",
            "The 130–150 word task is worth 22 marks on its own. Plan it, structure it, and finish it with something ambitious: that single question can move your grade.",
        ],
        [
            ("Tu examen de un vistazo", "<p>Four papers, each worth <b>25%</b> and <b>50 marks</b>: Speaking, Listening, Reading and Writing. First exams: <b>summer 2026</b>.</p><p>You sit <b>one tier</b> across all four papers.</p>"),
            ("Los seis contextos", "<p>My personal world · Lifestyle and wellbeing · My neighbourhood · Media and technology · Studying and my future · Travel and tourism.</p>"),
            ("Lo que sube de un 6 a un 8", "<p>Not longer answers, <b>richer</b> ones: three time frames, two justified opinions, one subjunctive and a connective beyond <b>porque</b> in every extended task.</p>"),
        ],
    ),
    "chapters": [
        {
            "title": "Tu examen",
            "en": "Your four papers, explained",
            "photo": "gcse-edexcel-cover.jpg",
            "pos": "50% 35%",
            "intro": "Four papers, 50 marks each, 25% each. Edexcel puts Speaking first, and at Higher tier it runs 10 to 12 minutes: long enough that preparation shows, and long enough that a lack of it shows too.",
            "fact": ("¿Sabías que...?", "Word counts in the Edexcel writing paper are guidance, not limits. Students are not penalised for writing more or fewer words, so the real target is covering the task well, not counting."),
            "units": [
                paper_unit(
                    "La expresión oral", "Paper 1 · Speaking · 10–12 minutes · 50 marks",
                    "Set by Pearson and conducted by your teacher, with supervised preparation time beforehand. At Higher tier the test lasts 10 to 12 minutes.",
                    [
                        ("Read aloud", "12 marks · a short text, out loud"),
                        ("Role play", "10 marks · a situation with prompts"),
                        ("Picture task", "28 marks · describe, then conversation"),
                        ("Preparation", "supervised, before the test"),
                        ("Pronunciation", "is assessed in the read-aloud task"),
                        ("25%", "of the whole GCSE"),
                    ],
                    tip=("Los 28 puntos de la conversación", "The conversation is more than half the paper. Never stop at one sentence: opinion, reason, example, and a comparison with how things used to be or will be. <b>Ahora… En cambio, de pequeño… El año que viene espero que…</b>"),
                ),
                paper_unit(
                    "La comprensión oral", "Paper 2 · Listening · 1 hour · 50 marks",
                    "One hour at Higher tier, including five minutes of reading time at the start. Section B is a dictation.",
                    [
                        ("Section A", "listening comprehension · 40 marks"),
                        ("Section B · dictation", "write what you hear · 10 marks"),
                        ("Reading time", "5 minutes, before the recordings"),
                        ("Recordings", "are played more than once"),
                        ("Spelling and accents", "count in the dictation"),
                        ("25%", "of the whole GCSE"),
                    ],
                    tip=("El dictado se prepara escribiendo", "Listen to a minute of Spanish radio or a podcast and transcribe one sentence a day. Focus on the pairs that sound the same: <b>b / v</b>, <b>c / s / z</b>, <b>ll / y</b>, and on the silent <b>h</b>."),
                ),
                paper_unit(
                    "La comprensión lectora", "Paper 3 · Reading · 1 hour · 50 marks",
                    "One hour at Higher tier. Comprehension first, then a translation from Spanish into English.",
                    [
                        ("Section A", "reading comprehension · 40 marks"),
                        ("Section B", "translation into English · 10 marks"),
                        ("Texts", "include authentic and literary sources"),
                        ("Questions", "in English and in Spanish"),
                        ("Dictionaries", "are not allowed"),
                        ("25%", "of the whole GCSE"),
                    ],
                    tip=("Traducí el tiempo verbal que ves", "<b>Había llegado</b> is <i>had arrived</i>; <b>llegaba</b> is <i>used to arrive</i>. At Higher tier the translation is chosen precisely because it mixes tenses, so slow down and name each one before you write."),
                ),
                paper_unit(
                    "La expresión escrita", "Paper 4 · Writing · 1 hour 20 · 50 marks",
                    "Two open-response questions and a translation in 1 hour 20 at Higher tier. The 130–150 word task is the biggest single question in the paper.",
                    [
                        ("Question 1 · informal", "80–90 words · 18 marks"),
                        ("Question 2 · formal", "130–150 words · 22 marks"),
                        ("Question 3 · translation", "a short paragraph into Spanish · 10 marks"),
                        ("Register", "informal in Q1, formal in Q2"),
                        ("Word counts", "are guidance, not a limit"),
                        ("25%", "of the whole GCSE"),
                    ],
                    tip=("Formal no es difícil, es distinto", "Formal means <b>usted</b>, <b>le escribo para…</b>, <b>agradecería que…</b>, <b>un saludo cordial</b>. Informal means <b>tú</b>, <b>¡hola!</b>, <b>un abrazo</b>. Choosing the wrong one costs marks even when the Spanish is perfect."),
                ),
                instructions_unit(),
            ],
            "practice": [
                {"type": "quiz", "title": "¿Conoces tu examen?", "inst": "Choose the right answer about Edexcel Higher tier.", "items": [
                    ("How many marks is each paper worth?", ["40", "50", "100"], 1),
                    ("How long is the Higher speaking test?", ["7–9 minutes", "10–12 minutes", "20 minutes"], 1),
                    ("The longest writing task is…", ["80–90 words", "130–150 words", "200 words"], 1),
                    ("The 130–150 word task is worth…", ["10 marks", "18 marks", "22 marks"], 2),
                    ("The dictation is part of…", ["Writing", "Listening", "Reading"], 1),
                    ("Question 2 of the writing paper uses…", ["informal register", "formal register", "either"], 1)]},
                {"type": "match", "title": "Formal o informal", "pairs": [
                    ("Estimado señor:", "Dear Sir, (formal)"), ("¡Hola, Marta!", "Hi Marta! (informal)"),
                    ("Le escribo para…", "I'm writing to you to… (formal)"), ("Te cuento que…", "Let me tell you that… (informal)"),
                    ("Agradecería que…", "I would be grateful if… (formal)"), ("Un abrazo", "Love, (informal)"),
                    ("¿Podría usted…?", "Could you…? (formal)"), ("¿Te apetece…?", "Do you fancy…? (informal)")]},
                {"type": "write", "title": "Paper 1 · La conversación", "inst": "Answer in writing, then out loud, in about 100 words: «¿Cómo han cambiado tus gustos en los últimos años?». Use three time frames and one subjunctive.", "tip": "De pequeño/a… Ahora, en cambio… He descubierto que… Espero que el año que viene…", "answer": "Many answers are possible. Check: imperfect for how things were, present for now, and a subjunctive after espero que.", "lines": 12},
            ],
        },
        {
            "title": "Mi mundo personal y mi bienestar",
            "en": "Contexts 1 & 2 · My personal world · Lifestyle and wellbeing",
            "photo": "confident-teens-cover.jpg",
            "pos": "50% 26%",
            "intro": "Family, friends, relationships and equality, then physical and mental wellbeing and food. At Higher tier these contexts are less about describing people and more about judging situations.",
            "fact": ("¿Sabías que...?", "In Spain lunch is the main meal and is eaten at two or three, which is why dinner is so late. Concrete cultural detail like this is what examiners mean by cultural awareness."),
            "units": [
                topic("identity", "H"),
                topic("family", "H"),
                topic("friends", "H"),
                topic("health", "H"),
                topic("food", "H"),
            ],
            "practice": practice(["identity", "family", "friends", "health"], write={
                "type": "write", "title": "Paper 4, Question 2 · Una tarea de 130–150 palabras",
                "inst": "Write approximately 130–150 words in Spanish for a Spanish health magazine for teenagers. Explain what young people in your country do to look after themselves, what gets in the way, and what should change.",
                "tip": "Hoy en día, los jóvenes… Sin embargo, … Es importante que… Deberíamos… para que…",
                "answer": "Many answers are possible. Check: formal register, two justified opinions, one subjunctive (es importante que / para que) and a connective beyond porque.", "lines": 16,
            }),
        },
        {
            "title": "Mi barrio y la tecnología",
            "en": "Contexts 3 & 4 · My neighbourhood · Media and technology",
            "photo": "igcse-edexcel-cover.jpg",
            "pos": "50% 32%",
            "intro": "Where you live and what it is like to live there, plus the screens that shape everyone's free time. The environment belongs here too, and it is the single best place to show off complex structures.",
            "fact": ("¿Sabías que...?", "Many Spanish cities have pedestrianised their casco antiguo and built carriles bici. One concrete example beats three general statements in any environment answer."),
            "units": [
                topic("town", "H"),
                topic("home", "H"),
                topic("tech", "H"),
                topic("music_tv", "H"),
                topic("environment", "H"),
            ],
            "practice": practice(["town", "home", "tech", "music_tv", "environment"], write={
                "type": "write", "title": "Paper 4, Question 1 · Un mensaje de 80–90 palabras",
                "inst": "Write approximately 80–90 words in Spanish to a Spanish friend about technology: how you use it, what worries you about it and one rule you would set if it were up to you.",
                "tip": "Uso las redes sociales para… Lo que más me preocupa es… Si pudiera, prohibiría… No creo que sea…",
                "answer": "Many answers are possible. Check: informal register, lo que + verb + es, and either si + imperfect subjunctive or no creo que + subjunctive.", "lines": 12,
            }),
        },
        {
            "title": "Mis estudios, mi futuro y los viajes",
            "en": "Contexts 5 & 6 · Studying and my future · Travel and tourism",
            "photo": "igcse-cambridge-cover.jpg",
            "pos": "50% 40%",
            "intro": "School now, work later and travel in between. These contexts are where the past tenses and the conditional do their best work, and where a planned paragraph is worth more than a long one.",
            "fact": ("¿Sabías que...?", "Spain is the second most visited country in the world, and tourism is a frequent exam topic precisely because it links travel, jobs and the environment in one text."),
            "units": [
                topic("school", "H"),
                topic("future", "H"),
                topic("travel", "H"),
                topic("celebrations", "H"),
            ],
            "practice": practice(["school", "future", "travel", "celebrations"], extra=[
                {"type": "translate", "title": "Paper 4, Question 3 · Traducción al español", "inst": "Translate this paragraph into Spanish, sentence by sentence, as in the Higher translation task.", "items": [
                    ("Last year I did work experience in a primary school.", "El año pasado hice prácticas en una escuela primaria."),
                    ("I had never worked with children before.", "Nunca había trabajado con niños antes."),
                    ("Although it was tiring, I learnt a lot.", "Aunque fue cansado, aprendí mucho."),
                    ("Next year I am going to study languages because they have good job prospects.", "El año que viene voy a estudiar idiomas porque tienen mucha salida."),
                    ("If I could, I would spend a year abroad.", "Si pudiera, pasaría un año en el extranjero.")]},
            ], write={
                "type": "write", "title": "Paper 4, Question 2 · Una tarea de 130–150 palabras",
                "inst": "Write approximately 130–150 words in Spanish for a Spanish school magazine about education and the future. Explain what your school is like, what you plan to do after your exams and why learning languages matters.",
                "tip": "En mi instituto… A diferencia de España, … Cuando termine los exámenes, … Aunque sea difícil, … Espero que…",
                "answer": "Many answers are possible. Check: formal register, a cultural comparison, cuando + subjunctive for the future and one more subjunctive phrase.", "lines": 16,
            }),
        },
        {
            "title": "Caja de herramientas: la gramática",
            "en": "Your grammar toolbox",
            "photo": "gcse-aqa-cover.jpg",
            "pos": "50% 30%",
            "intro": "Every structure Higher tier expects, in one place: the tenses, the pronouns, the agreements and the subjunctive phrases the top bands describe as complex language.",
            "fact": ("¿Sabías que...?", "Edexcel publishes a vocabulary and grammar guide alongside the specification, so nothing in this chapter is optional extra: it is the list your paper is written from."),
            "units": grammar_toolbox("H"),
            "practice": grammar_practice("H", write={
                "type": "write", "title": "Cuatro tiempos en un párrafo",
                "inst": "Write about 120 words in Spanish about a place that matters to you: when you first went, what it is like now, what you would change and what you hope for it.",
                "tip": "Fui por primera vez cuando tenía… Ahora… Si pudiera, cambiaría… Espero que…",
                "answer": "Many answers are possible. Check: preterite and imperfect together, present, si + imperfect subjunctive with a conditional, and espero que + subjunctive.", "lines": 14,
            }),
        },
        {
            "title": "Caja de herramientas: el vocabulario",
            "en": "Your vocabulary and exam phrases",
            "photo": "gcse-edexcel-cover.jpg",
            "pos": "50% 55%",
            "intro": "The words that belong to no single context and appear in every paper: connectives, opinions, time phrases, numbers and the phrases that keep you talking when a word disappears.",
            "fact": ("¿Sabías que...?", "In the dictation, Spanish writes thousands with a full stop and decimals with a comma: 1.500 is one thousand five hundred and 3,5 is three point five."),
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
        "igcse-edexcel-cover.jpg",
        "You know what each of the four papers asks, you have the vocabulary of all six contexts and you have every structure the Higher mark bands look for. Keep reading aloud, keep stretching each answer with a reason and an example, and go and get the grade you have been working for.",
    ),
}
