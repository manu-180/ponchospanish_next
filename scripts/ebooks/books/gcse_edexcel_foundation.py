"""GCSE Spanish · Pearson Edexcel 1SP1 (2024) · Foundation tier.

Datos del examen: especificación Pearson Edexcel Level 1/Level 2 GCSE (9-1) in Spanish
(1SP1), primera enseñanza 2024, primeras pruebas 2026, y la guía «qualification at a
glance» de qualifications.pearson.com. Gramática de nivel F.
"""

from books._exam_core import (
    end_page, grammar_practice, grammar_toolbox, instructions_unit, paper_unit,
    practice, topic, vocab_practice, vocab_toolbox, welcome,
    NOTE_REGIONS, NOTE_SOURCE,
)

BOOK = {
    "kind": "ebook",
    "file": "GCSE-Spanish-Edexcel-Foundation-Poncho",
    "title_lines": ["GCSE Spanish", "Edexcel · Foundation"],
    "title_pt": 54,
    "cover_sub": "Your Foundation tier revision e-book",
    "sticker": "Pearson Edexcel 1SP1 · Foundation · Answers included",
    "kicker": "The six thematic contexts, the four papers and a grammar and vocabulary toolbox,<br>with Spain {ES} and Argentina {AR} alternatives",
    "cover_photo": "gcse-edexcel-cover.jpg",
    "cover_pos": "50% 28%",
    "welcome": welcome(
        "¡Hola! Welcome",
        "This book is built around one exam: Pearson Edexcel GCSE Spanish (1SP1) at Foundation tier. Everything in it points at the four papers you will actually sit.",
        [
            "Chapter 1 explains how each paper works: the tasks, the timings and what the examiner is counting. Chapters 2, 3 and 4 cover Edexcel's six thematic contexts, with the vocabulary, the grammar and the phrases each one needs. Chapters 5 and 6 are your toolbox: the grammar in one place, and the words and exam phrases that come up whatever the topic.",
            "Edexcel's six contexts are My personal world, Lifestyle and wellbeing, My neighbourhood, Media and technology, Studying and my future, and Travel and tourism. They were chosen after asking students what they actually wanted to talk about, which is good news: nothing in the exam is designed to be alien to you.",
            "At Foundation tier you are entered for a single tier across all four papers. Nothing here asks you for essays: it asks for accuracy, for every bullet point answered and for no empty gaps.",
        ],
        [
            ("Tu examen de un vistazo", "<p>Four papers, each worth <b>25%</b> and <b>50 marks</b>: Speaking, Listening, Reading and Writing. First exams: <b>summer 2026</b>.</p><p>You sit <b>one tier</b> across all four papers.</p>"),
            ("Los seis contextos", "<p>My personal world · Lifestyle and wellbeing · My neighbourhood · Media and technology · Studying and my future · Travel and tourism.</p><p>Every text and every task in the exam sits inside one of those six.</p>"),
            NOTE_REGIONS,
        ],
    ),
    "chapters": [
        {
            "title": "Tu examen",
            "en": "Your four papers, explained",
            "photo": "gcse-edexcel-cover.jpg",
            "pos": "50% 35%",
            "intro": "Four papers, 50 marks each, 25% each. Edexcel puts Speaking first, and it is the paper most students leave until last. Start with chapter 1 and that will not be you.",
            "fact": ("¿Sabías que...?", "Each paper is worth exactly a quarter. Students often assume writing counts most because it feels hardest; in fact a strong speaking test is worth exactly as much and is far easier to prepare."),
            "units": [
                paper_unit(
                    "La expresión oral", "Paper 1 · Speaking · 7–9 minutes · 50 marks",
                    "Set by Pearson and conducted by your teacher, with supervised preparation time beforehand. At Foundation tier the test lasts 7 to 9 minutes.",
                    [
                        ("Read aloud", "12 marks · a short text, out loud"),
                        ("Role play", "10 marks · a situation with prompts"),
                        ("Picture task", "28 marks · describe, then conversation"),
                        ("Preparation", "supervised, before the test"),
                        ("Pronunciation", "is assessed in the read-aloud task"),
                        ("25%", "of the whole GCSE"),
                    ],
                    tip=("La lectura en voz alta", "Read-aloud is worth 12 marks and is pure technique. Three lines of Spanish out loud a day, paying attention to <b>j</b>, <b>ll</b>, <b>ñ</b>, <b>v</b> and the silent <b>h</b>, is the cheapest mark gain in the whole qualification."),
                ),
                paper_unit(
                    "La comprensión oral", "Paper 2 · Listening · 45 minutes · 50 marks",
                    "45 minutes at Foundation tier, including five minutes of reading time at the start. Section B is a dictation.",
                    [
                        ("Section A", "listening comprehension · 40 marks"),
                        ("Section B · dictation", "write what you hear · 10 marks"),
                        ("Reading time", "5 minutes, before the recordings"),
                        ("Recordings", "are played more than once"),
                        ("Spelling", "counts in the dictation"),
                        ("25%", "of the whole GCSE"),
                    ],
                    tip=("Los cinco minutos del principio", "Use the reading time to underline the question words: <b>cuántos</b>, <b>cuándo</b>, <b>por qué</b>, <b>dónde</b>. Knowing what you are listening <i>for</i> is most of the battle."),
                ),
                paper_unit(
                    "La comprensión lectora", "Paper 3 · Reading · 45 minutes · 50 marks",
                    "45 minutes at Foundation tier. Comprehension first, then a translation from Spanish into English.",
                    [
                        ("Section A", "reading comprehension · 40 marks"),
                        ("Section B", "translation into English · 10 marks"),
                        ("Texts", "from across the Spanish-speaking world"),
                        ("Questions", "in English and in Spanish"),
                        ("Dictionaries", "are not allowed"),
                        ("25%", "of the whole GCSE"),
                    ],
                    tip=("No traduzcas palabra por palabra", "Read the whole Spanish sentence, then write natural English. And never skip a small word: <b>no</b>, <b>nunca</b> and <b>todavía</b> change the meaning and the mark."),
                ),
                paper_unit(
                    "La expresión escrita", "Paper 4 · Writing · 1 hour 15 · 50 marks",
                    "Four questions in 1 hour 15 at Foundation tier, from four short sentences about a picture to a translation into Spanish.",
                    [
                        ("Question 1 · picture", "four short sentences"),
                        ("Question 2 · formal", "40–50 words · 14 marks"),
                        ("Question 3 · informal", "80–90 words · 18 marks"),
                        ("Question 4 · translation", "five sentences into Spanish · 10 marks"),
                        ("Word counts", "are guidance, not a limit"),
                        ("25%", "of the whole GCSE"),
                    ],
                    tip=("Formal e informal no son lo mismo", "Question 2 is formal: <b>usted</b>, <b>le escribo para…</b>, <b>un saludo cordial</b>. Question 3 is a message to a friend: <b>tú</b>, <b>¡hola!</b>, <b>un abrazo</b>. Mixing them up costs marks for register."),
                ),
                instructions_unit(),
            ],
            "practice": [
                {"type": "quiz", "title": "¿Conoces tu examen?", "inst": "Choose the right answer about Edexcel Foundation tier.", "items": [
                    ("How many marks is each paper worth?", ["40", "50", "100"], 1),
                    ("The read-aloud task is part of…", ["Speaking", "Reading", "Listening"], 0),
                    ("The dictation is part of…", ["Writing", "Listening", "Speaking"], 1),
                    ("The informal writing task is about…", ["40–50 words", "80–90 words", "130–150 words"], 1),
                    ("The reading paper ends with a translation into…", ["Spanish", "English", "both"], 1),
                    ("How many thematic contexts are there?", ["three", "five", "six"], 2)]},
                {"type": "match", "title": "Formal o informal", "pairs": [
                    ("Estimado señor:", "Dear Sir, (formal)"), ("¡Hola, Marta!", "Hi Marta! (informal)"),
                    ("Le escribo para…", "I'm writing to you to… (formal)"), ("Te escribo para contarte…", "I'm writing to tell you… (informal)"),
                    ("Un saludo cordial", "Kind regards (formal)"), ("Un abrazo", "A hug, love (informal)"),
                    ("¿Podría usted…?", "Could you…? (formal)"), ("¿Puedes…?", "Can you…? (informal)")]},
                {"type": "write", "title": "Paper 1 · La tarea con imagen", "inst": "Imagine a photo of a family having lunch in a garden. Write five sentences in Spanish about it, as in the picture task: what there is, who the people are, what they are doing, the weather and your opinion.", "tip": "En la foto hay… Son… Están + -ando / -iendo… Hace… Me parece…", "answer": "Many answers are possible. Check: hay, estar + gerund for what people are doing, and one opinion with a reason.", "lines": 8},
            ],
        },
        {
            "title": "Mi mundo personal y mi bienestar",
            "en": "Contexts 1 & 2 · My personal world · Lifestyle and wellbeing",
            "photo": "confident-teens-cover.jpg",
            "pos": "50% 26%",
            "intro": "Edexcel's first two contexts cover family, friends, relationships and equality, and then physical and mental wellbeing, food and drink. Between them they account for a huge share of the speaking test.",
            "fact": ("¿Sabías que...?", "In Spain, lunch is the big meal of the day and is eaten at two or three in the afternoon. That is why dinner is so late and why the merienda, an afternoon snack, exists at all."),
            "units": [
                topic("identity", "F"),
                topic("family", "F"),
                topic("friends", "F"),
                topic("health", "F"),
                topic("food", "F"),
            ],
            "practice": practice(["identity", "family", "friends", "health"], write={
                "type": "write", "title": "Paper 4, Question 3 · Un mensaje de 80–90 palabras",
                "inst": "Write approximately 80–90 words in Spanish to a Spanish friend. Tell them what your family is like, who your best friend is and why, and what you do to stay healthy.",
                "tip": "¡Hola! Te escribo para contarte… En mi familia somos… Mi mejor amigo/a es… porque… Para estar en forma…",
                "answer": "Many answers are possible. Check: informal register (tú, ¡hola!, un abrazo), three topics covered and at least one opinion with porque.", "lines": 12,
            }),
        },
        {
            "title": "Mi barrio y la tecnología",
            "en": "Contexts 3 & 4 · My neighbourhood · Media and technology",
            "photo": "igcse-edexcel-cover.jpg",
            "pos": "50% 32%",
            "intro": "Where you live, what there is to do there, and the screens that take up the rest of your time. Hay, se puede and a short opinion will carry most of what you need to say.",
            "fact": ("¿Sabías que...?", "Many Spanish towns have pedestrianised their old centre, el casco antiguo, and built carriles bici. It is a concrete example you can use in both the neighbourhood and the environment questions."),
            "units": [
                topic("town", "F"),
                topic("home", "F"),
                topic("tech", "F"),
                topic("music_tv", "F"),
                topic("environment", "F"),
            ],
            "practice": practice(["town", "home", "tech", "music_tv"], write={
                "type": "write", "title": "Paper 4, Question 2 · Un texto formal de 40–50 palabras",
                "inst": "Write approximately 40–50 words in Spanish for your town's website, aimed at Spanish visitors. Say what there is in your area, what you can do there and what it still needs.",
                "tip": "En mi barrio hay… Se puede… Lo mejor es… Sin embargo, hace falta…",
                "answer": "Many answers are possible. Check: formal register, hay for what there is, se puede for what you can do, and one thing that is missing.", "lines": 8,
            }),
        },
        {
            "title": "Mis estudios, mi futuro y los viajes",
            "en": "Contexts 5 & 6 · Studying and my future · Travel and tourism",
            "photo": "igcse-cambridge-cover.jpg",
            "pos": "50% 40%",
            "intro": "School now, work later and holidays in between. These two contexts are where the past and the future tenses live, and where a 90-word answer writes itself once you have the phrases.",
            "fact": ("¿Sabías que...?", "In most Spanish state schools there is no uniform, marks are out of ten and a five is a pass. Comparing that with your own school is an easy, memorable answer."),
            "units": [
                topic("school", "F"),
                topic("future", "F"),
                topic("travel", "F"),
                topic("celebrations", "F"),
            ],
            "practice": practice(["school", "future", "travel", "celebrations"], extra=[
                {"type": "translate", "title": "Paper 4, Question 4 · Traducción al español", "inst": "Translate these five sentences into Spanish, as in the Foundation translation task.", "items": [
                    ("I study ten subjects and my favourite is history.", "Estudio diez asignaturas y mi preferida es la historia."),
                    ("Next year I am going to study at sixth form.", "El año que viene voy a estudiar bachillerato."),
                    ("Last summer I went to Spain with my family.", "El verano pasado fui a España con mi familia."),
                    ("We stayed in a hotel near the beach.", "Nos alojamos en un hotel cerca de la playa."),
                    ("I would like to work abroad.", "Me gustaría trabajar en el extranjero.")]},
            ], write={
                "type": "write", "title": "Paper 4, Question 3 · Un mensaje de 80–90 palabras",
                "inst": "Write approximately 80–90 words in Spanish to a friend about school and holidays: your subjects and why you like them, what you did last summer and what you want to do after your GCSEs.",
                "tip": "Estudio… porque… El verano pasado fui a… Después de los exámenes quiero…",
                "answer": "Many answers are possible. Check: a present, a preterite (fui, visité) and a future (voy a / quiero + infinitive).", "lines": 12,
            }),
        },
        {
            "title": "Caja de herramientas: la gramática",
            "en": "Your grammar toolbox",
            "photo": "gcse-aqa-cover.jpg",
            "pos": "50% 30%",
            "intro": "All the grammar Foundation tier needs, in one place: the tenses, the agreements and the patterns the writing paper marks directly.",
            "fact": ("¿Sabías que...?", "Edexcel publishes a vocabulary and grammar guide alongside the specification. Everything in this chapter sits inside it, which means nothing here is optional extra."),
            "units": grammar_toolbox("F"),
            "practice": grammar_practice("F", write={
                "type": "write", "title": "Tres tiempos en un párrafo",
                "inst": "Write about 90 words in Spanish about last weekend, a normal week and next weekend. Use at least one verb in the past, one in the present and one in the future.",
                "tip": "El fin de semana pasado fui… Normalmente, entre semana… El próximo fin de semana voy a…",
                "answer": "Many answers are possible. Check the three time frames: fui / hice, normalmente + present, voy a + infinitive.", "lines": 12,
            }),
        },
        {
            "title": "Caja de herramientas: el vocabulario",
            "en": "Your vocabulary and exam phrases",
            "photo": "gcse-edexcel-cover.jpg",
            "pos": "50% 55%",
            "intro": "The words that belong to no single context and turn up in every paper: connectives, opinions, time phrases, numbers and the phrases that keep you talking in the speaking test.",
            "fact": ("¿Sabías que...?", "In the dictation, Spanish writes thousands with a full stop and decimals with a comma: 1.500 is one thousand five hundred and 3,5 is three point five."),
            "units": vocab_toolbox("F"),
            "practice": vocab_practice(write={
                "type": "write", "title": "Tu respuesta de siempre",
                "inst": "Write about 90 words answering «¿Cómo es tu vida?». Use at least two connectives, two opinions with reasons and one time phrase.",
                "tip": "Normalmente… Además… En mi opinión… porque… Sin embargo… El año que viene…",
                "answer": "Many answers are possible. Check: two connectives, two opinions with porque, one time phrase and verbs that agree.", "lines": 12,
            }),
        },
    ],
    "end": end_page(
        "igcse-edexcel-cover.jpg",
        "You now know what each of the four papers asks, you have the vocabulary of all six contexts and you have a grammar toolbox you can check in seconds. Keep reading aloud, keep answering every bullet point, and walk in knowing exactly what is coming.",
    ),
}
