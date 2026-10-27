"""Cambridge IGCSE Spanish · Foreign Language 0530.

Datos del examen: syllabus de Cambridge IGCSE Spanish - Foreign Language (0530) de
cambridgeinternational.org. Cambridge publica una edición por trienio y el contenido
cambia algo entre ediciones, así que el libro insiste en comprobar la del año de examen.
No hay niveles: el libro usa la gramática de nivel H.
"""

from books._exam_core import (
    end_page, grammar_practice, grammar_toolbox, instructions_unit, paper_unit,
    practice, topic, vocab_practice, vocab_toolbox, welcome,
    NOTE_REGIONS, NOTE_SOURCE,
)

BOOK = {
    "kind": "ebook",
    "file": "IGCSE-Spanish-Cambridge-Poncho",
    "title_lines": ["IGCSE Spanish", "Cambridge · 0530"],
    "title_pt": 60,
    "cover_sub": "Your Cambridge IGCSE revision e-book",
    "sticker": "Cambridge IGCSE 0530 · Answers included",
    "kicker": "The five topic areas, the four papers and a grammar and vocabulary toolbox,<br>with Spain {ES} and Argentina {AR} alternatives",
    "cover_photo": "igcse-cambridge-cover.jpg",
    "cover_pos": "50% 38%",
    "welcome": welcome(
        "¡Hola! Welcome",
        "This book is built around one exam: Cambridge IGCSE Spanish as a Foreign Language (0530). Everything in it points at the four papers you will actually sit.",
        [
            "Chapter 1 explains how each paper works: the tasks, the timings and what the examiner is counting. Chapters 2, 3 and 4 cover the five topic areas of the syllabus, with the vocabulary, the grammar and the phrases each one needs. Chapters 5 and 6 are your toolbox: all the grammar in one place, including the subjunctive, and the words and exam phrases that come up whatever the topic.",
            "There are no tiers: everyone sits the same four papers, and all your written answers are in Spanish. No dictionaries, in any paper. That sounds harsh and is actually freeing, because it means the exam can only ask you for language you have already met.",
            "Cambridge publishes a new edition of the syllabus every few years and the detail inside the topic areas does change. Check which edition applies to your exam year with your teacher before your first mock.",
        ],
        [
            ("Tu examen de un vistazo", "<p>Four papers, each worth <b>25%</b>: Listening (about 50 minutes), Reading (1 hour), Speaking (about 10 minutes plus preparation) and Writing (1 hour).</p><p>No tiers, no dictionaries, and all written answers in Spanish.</p>"),
            ("Las cinco áreas", "<p>A · Everyday activities · B · Personal and social life · C · The world around us · D · The world of work · E · The international world.</p>"),
            NOTE_SOURCE,
        ],
    ),
    "chapters": [
        {
            "title": "Tu examen",
            "en": "Your four papers, explained",
            "photo": "igcse-cambridge-cover.jpg",
            "pos": "50% 45%",
            "intro": "Four papers, one for each skill, each worth a quarter of the grade. Everything you write is in Spanish, and nothing you write can lean on a dictionary.",
            "fact": ("¿Sabías que...?", "In the listening paper every recording is played twice. The first listen is for the gist; the second is for the detail you missed. Students who answer everything on the first play and stop listening lose marks that were still available."),
            "units": [
                paper_unit(
                    "La comprensión oral", "Paper 1 · Listening · about 50 minutes · 25%",
                    "Recorded texts of several kinds: conversations, announcements, interviews. Each recording is played twice, and the questions are mostly multiple choice and matching.",
                    [
                        ("Question types", "multiple choice and matching"),
                        ("Recordings", "played twice"),
                        ("Texts", "dialogues, announcements, interviews"),
                        ("Topics", "all five areas"),
                        ("Dictionaries", "are not allowed"),
                        ("25%", "of the qualification"),
                    ],
                    tip=("Las dos escuchas", "Use the first play for the big picture and mark anything you are unsure of. On the second play go straight to those marks. Never leave a multiple-choice question blank: a guess is free."),
                ),
                paper_unit(
                    "La comprensión lectora", "Paper 2 · Reading · 1 hour · 25%",
                    "Several groups of questions over texts of increasing difficulty, with multiple choice, matching and short answers written in Spanish.",
                    [
                        ("Question types", "multiple choice, matching, short answers"),
                        ("Short answers", "written in Spanish"),
                        ("Texts", "get longer and harder as you go"),
                        ("Topics", "all five areas"),
                        ("Dictionaries", "are not allowed"),
                        ("25%", "of the qualification"),
                    ],
                    tip=("Contesta corto y en español", "A short answer wants the information, not a beautiful sentence. Lift the useful words from the text, but change the verb ending if the question changes the person: <b>¿Qué hace Marta?</b> → <b>Trabaja en…</b>"),
                ),
                paper_unit(
                    "La expresión oral", "Paper 3 · Speaking · about 10 minutes · 25%",
                    "A role play and two topic conversations, with about ten minutes of preparation beforehand. Your teacher conducts the test and it is recorded.",
                    [
                        ("Role play", "a situation with prompts"),
                        ("Conversation 1", "a prepared topic"),
                        ("Conversation 2", "a second topic"),
                        ("Preparation", "about 10 minutes before the test"),
                        ("Marks for", "communication and quality of language"),
                        ("25%", "of the qualification"),
                    ],
                    tip=("Dos marcas distintas", "Communication is about getting the message across; quality of language is about tenses, range and accuracy. A long answer with one tense scores well on the first and badly on the second: mix in a past and a future."),
                ),
                paper_unit(
                    "La expresión escrita", "Paper 4 · Writing · 1 hour · 25%",
                    "Three tasks in an hour, from filling in a form to an extended piece of about 130 to 140 words. Everything is written in Spanish.",
                    [
                        ("Task 1 · form", "fill in a form in Spanish"),
                        ("Task 2 · directed writing", "about 80–90 words"),
                        ("Task 3 · extended writing", "about 130–140 words"),
                        ("Answers", "all in Spanish"),
                        ("Dictionaries", "are not allowed"),
                        ("25%", "of the qualification"),
                    ],
                    tip=("El formulario no es un regalo", "The form asks for short, exact Spanish: <b>Apellidos</b>, <b>Fecha de nacimiento</b>, <b>Nacionalidad</b>, <b>Motivo del viaje</b>. Learn the field names, because misreading one costs a mark that nobody should lose."),
                ),
                instructions_unit(),
            ],
            "practice": [
                {"type": "quiz", "title": "¿Conoces tu examen?", "inst": "Choose the right answer about Cambridge IGCSE Spanish (0530).", "items": [
                    ("How many papers are there?", ["three", "four", "five"], 1),
                    ("How much is each paper worth?", ["20%", "25%", "40%"], 1),
                    ("In the listening paper each recording is played…", ["once", "twice", "three times"], 1),
                    ("The extended writing task is about…", ["40–50 words", "80–90 words", "130–140 words"], 2),
                    ("Written answers are in…", ["English", "Spanish", "either"], 1),
                    ("Dictionaries are…", ["allowed", "not allowed", "allowed in writing only"], 1)]},
                {"type": "match", "title": "Rellenar un formulario", "pairs": [
                    ("Apellidos", "Surname(s)"), ("Nombre", "First name"), ("Fecha de nacimiento", "Date of birth"),
                    ("Lugar de nacimiento", "Place of birth"), ("Nacionalidad", "Nationality"), ("Domicilio", "Home address"),
                    ("Código postal", "Postcode"), ("Motivo del viaje", "Reason for the trip")]},
                {"type": "write", "title": "Paper 4, Task 3 · Redacción de 130–140 palabras", "inst": "Write about 130–140 words in Spanish about a day that did not go to plan: what you were going to do, what happened, how you felt and what you would do differently.", "tip": "Aquel día iba a… De repente… Me sentí… La próxima vez haría…", "answer": "Many answers are possible. Check: iba a + infinitive for the plan, preterite for the events, imperfect for the feelings and a conditional at the end.", "lines": 16},
            ],
        },
        {
            "title": "La vida diaria y personal",
            "en": "Areas A & B · Everyday activities · Personal and social life",
            "photo": "confident-teens-cover.jpg",
            "pos": "50% 26%",
            "intro": "Food and drink, health and the body, the home, your family and what you do for fun. Two areas that between them cover most of the vocabulary of ordinary life, which is most of the exam.",
            "fact": ("¿Sabías que...?", "In Spain lunch is the big meal and is eaten at two or three in the afternoon; the merienda, an afternoon snack, exists to bridge the gap until a dinner that can start at nine."),
            "units": [
                topic("identity", "H"),
                topic("family", "H"),
                topic("home", "H"),
                topic("food", "H"),
                topic("health", "H"),
                topic("freetime", "H"),
            ],
            "practice": practice(["identity", "family", "home", "food", "health"], write={
                "type": "write", "title": "Paper 4, Task 2 · Redacción de 80–90 palabras",
                "inst": "Write about 80–90 words in Spanish to a Spanish-speaking friend about a normal weekday: your routine, what you eat, what you do after school and what you do to stay healthy.",
                "tip": "Entre semana me levanto a las… Desayuno… Después de clase… Para estar en forma…",
                "answer": "Many answers are possible. Check: reflexive verbs with their pronouns, times with a las, and one opinion with a reason.", "lines": 12,
            }),
        },
        {
            "title": "El mundo que nos rodea",
            "en": "Area C · The world around us",
            "photo": "gcse-aqa-cover.jpg",
            "pos": "50% 28%",
            "intro": "People and places, the natural world and the climate, communications and technology, and the built environment. The widest area in the syllabus and the one with the most ambitious vocabulary.",
            "fact": ("¿Sabías que...?", "Spanish-speaking countries cover almost every climate there is, from the Atacama desert, the driest on Earth, to the rainforest of the Amazon and the glaciers of Patagonia."),
            "units": [
                topic("town", "H"),
                topic("environment", "H"),
                topic("tech", "H"),
                topic("travel", "H"),
            ],
            "practice": practice(["town", "environment", "tech", "travel"], write={
                "type": "write", "title": "Paper 4, Task 3 · Redacción de 130–140 palabras",
                "inst": "Write about 130–140 words in Spanish about where you live and the environment: what your area is like, how it has changed, what the main problem is and what should be done.",
                "tip": "Vivo en… Antes había… ahora, en cambio… El mayor problema es… Deberíamos… para que…",
                "answer": "Many answers are possible. Check: imperfect for how things were, present for now, deberíamos + infinitive and para que + subjunctive.", "lines": 16,
            }),
        },
        {
            "title": "El trabajo y el mundo internacional",
            "en": "Areas D & E · The world of work · The international world",
            "photo": "igcse-edexcel-cover.jpg",
            "pos": "50% 30%",
            "intro": "Education and work, then countries, languages, customs and celebrations. This is where the future and the conditional live, and where a little cultural knowledge goes a long way.",
            "fact": ("¿Sabías que...?", "On 6 January Spanish children receive their presents from los Reyes Magos, and in Mexico el Día de Muertos, on 1 and 2 November, is a celebration of life rather than a day of mourning."),
            "units": [
                topic("school", "H"),
                topic("future", "H"),
                topic("world", "H"),
                topic("celebrations", "H"),
            ],
            "practice": practice(["school", "future", "world", "celebrations"], write={
                "type": "write", "title": "Paper 4, Task 2 · Redacción de 80–90 palabras",
                "inst": "Write about 80–90 words in Spanish about your studies and your future: what you study now, what you want to do afterwards, and why learning Spanish will help you.",
                "tip": "Ahora estudio… Cuando termine, quiero… Aprender español me ayudará a… porque…",
                "answer": "Many answers are possible. Check: present, cuando + subjunctive or a clear future, and one justified opinion.", "lines": 12,
            }),
        },
        {
            "title": "Caja de herramientas: la gramática",
            "en": "Your grammar toolbox",
            "photo": "gcse-edexcel-cover.jpg",
            "pos": "50% 32%",
            "intro": "All the grammar of the syllabus in one place: the tenses, the pronouns, the agreements and the subjunctive phrases that separate a solid answer from a strong one.",
            "fact": ("¿Sabías que...?", "With no dictionary in the exam, grammar is your only tool for building a word you half remember. Knowing that -mente makes an adverb or that des- reverses a verb can rescue a whole sentence."),
            "units": grammar_toolbox("H"),
            "practice": grammar_practice("H", write={
                "type": "write", "title": "Cuatro tiempos en un párrafo",
                "inst": "Write about 120 words in Spanish about your town or your school: how it was when you arrived, how it is now, what you would change and what you hope for next year.",
                "tip": "Cuando llegué… Antes era… Ahora… Si pudiera, cambiaría… Espero que…",
                "answer": "Many answers are possible. Check: preterite and imperfect together, present, si + imperfect subjunctive with a conditional, and espero que + subjunctive.", "lines": 14,
            }),
        },
        {
            "title": "Caja de herramientas: el vocabulario",
            "en": "Your vocabulary and exam phrases",
            "photo": "igcse-cambridge-cover.jpg",
            "pos": "50% 60%",
            "intro": "The words that belong to no single area and appear in every paper: connectives, opinions, time phrases, numbers and the phrases that keep you talking in the speaking test.",
            "fact": ("¿Sabías que...?", "Spanish writes thousands with a full stop and decimals with a comma: 1.500 is one thousand five hundred and 3,5 is three point five. In a listening paper that detail is a mark."),
            "units": vocab_toolbox("H"),
            "practice": vocab_practice(write={
                "type": "write", "title": "Una respuesta modelo",
                "inst": "Write about 140 words answering «¿Qué es lo más importante para los jóvenes de hoy?». Use at least three connectives, two justified opinions, one perfect tense and one subjunctive.",
                "tip": "Por un lado… por otro lado… He visto que… No creo que… Es fundamental que… En resumen…",
                "answer": "Many answers are possible. Check: three connectives, two opinions with reasons, a present perfect and a subjunctive.", "lines": 16,
            }),
        },
    ],
    "end": end_page(
        "igcse-edexcel-cover.jpg",
        "You know what the four papers ask, you have the vocabulary of all five topic areas and you have a grammar toolbox you can check in seconds. Keep listening twice, keep writing in Spanish without a dictionary, and walk into each paper knowing exactly what is coming.",
    ),
}
