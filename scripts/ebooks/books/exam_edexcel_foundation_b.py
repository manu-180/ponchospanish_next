"""Pearson Edexcel GCSE (9–1) Spanish 1SP1 · Paper 3 · Foundation tier · modelo B.

Mismo formato y puntaje que el modelo A (45 minutos, 50 puntos), con textos, temas y
preguntas distintos. Todo original de Poncho.
"""

from books._exam_paper import shell

SECTION_A = {
    "name": "Section A", "sub": "Reading comprehension", "total": 40,
    "questions": [
        {
            "n": 1, "title": "Pets",
            "lead": "Read these comments from an internet forum.",
            "blocks": [
                {"t": "speakers", "items": [
                    ("Vera", "Tengo dos gatos negros. Los sábados ayudo en la protectora de animales."),
                    ("Nico", "Saco a pasear al perro de mi abuela cada tarde. No quiero pájaros en casa porque hacen mucho ruido."),
                    ("Lara", "Mi tortuga se llama Pepa. Este año he aprendido a cuidar los peces del acuario del instituto."),
                ]},
                {"t": "inst", "text": "Who says what? Choose the correct answers. Put a cross in the correct column for each question."},
                {"t": "grid", "head": "Who …", "cols": ["Vera", "Nico", "Lara"], "items": [
                    ("… walks a dog?", 1),
                    ("… volunteers at an animal shelter?", 0),
                    ("… has a tortoise?", 2),
                    ("… has two cats?", 0),
                    ("… does not want a bird?", 1),
                    ("… looks after fish at school?", 2),
                ]},
            ],
        },
        {
            "n": 2, "title": "The weekend",
            "lead": "Read Carmen’s text message.",
            "blocks": [
                {"t": "text", "es": [
                    "¡Buenas!",
                    "El sábado vamos a la montaña porque mi hermano quiere ver la nieve. A mi padre le gustaría llevar la cámara, pero está rota. Mi tía va a preparar la comida. Yo prefiero quedarme en el refugio leyendo.",
                ]},
                {"t": "inst", "text": "Put a cross in each one of the three correct boxes."},
                {"t": "pick", "stem": "Carmen …", "items": [
                    ("is going to the mountains on Saturday.", 1),
                    ("says her brother wants to see the sea.", 0),
                    ("says her father’s camera is broken.", 1),
                    ("will prepare the food herself.", 0),
                    ("would rather stay inside and read.", 1),
                    ("is travelling on her own.", 0),
                ]},
            ],
        },
        {
            "n": 3, "title": "A young photographer",
            "lead": "Read this extract from an art magazine.",
            "blocks": [
                {"t": "text", "es": [
                    "El fotógrafo peruano Simón* tiene una exposición nueva. Este artista joven retrata mercados de todo el país. Publica sus fotos en papel y en internet, pero no le gusta vender copias caras. Simón es una persona muy humilde* porque nunca habla de sus premios.",
                ]},
                {"t": "note", "text": "* Simón – the name of a photographer"},
                {"t": "part", "text": "Complete the sentences below.", "sub": "Put a cross in the correct box for each question."},
                {"t": "mcq", "items": [
                    ("Simón’s exhibition is …", ["Peruvian.", "new.", "expensive."], 1),
                    ("Simón …", ["publishes in two places.", "photographs only one market.", "sells expensive copies."], 0),
                ]},
                {"t": "inst", "text": "Put a cross in the correct box."},
                {"t": "mcq", "lab": "alpha", "items": [
                    ("Which of these is the best translation for the word humilde?", ["humble", "humid", "funny"], 0),
                ]},
            ],
        },
        {
            "n": 4, "title": "My school",
            "lead": "Read Yusuf and Daniela’s comments in a blog. Complete the following tables in English. You do not need to write in full sentences.",
            "blocks": [
                {"t": "part", "text": "Yusuf"},
                {"t": "text", "es": [
                    "Yusuf: En mi instituto hay trescientos alumnos. El edificio tiene dos pisos y un patio enorme. Los profesores son amables. Las clases empiezan a las ocho y media. Voy en tren y por eso me levanto muy temprano.",
                ]},
                {"t": "table", "lab": "roman", "items": [
                    ("One detail about the building", "It has two floors / a huge playground"),
                    ("When school starts", "At half past eight"),
                ]},
                {"t": "part", "text": "Daniela"},
                {"t": "text", "es": [
                    "Daniela: Me gusta mi colegio porque tenemos una radio escolar. Mis asignaturas preferidas son la geografía y el inglés porque me ayudan a entender el mundo. Después quiero estudiar periodismo. Me gustaría trabajar en un periódico en Uruguay.",
                ]},
                {"t": "table", "lab": "roman", "items": [
                    ("One subject Daniela likes", "Geography / English"),
                    ("One job Daniela would like to do", "Work on a newspaper (in Uruguay) / journalist"),
                ]},
            ],
        },
        {
            "n": 5, "title": "Life in Valparaíso",
            "lead": "Read this comment from a local newspaper.",
            "blocks": [
                {"t": "text", "es": [
                    "Vivir en Valparaíso* no se parece a nada. Los ascensores antiguos suben por los cerros y todavía funcionan. Los murales llenan las paredes de colores y cada año se pintan de nuevo.",
                    "Hay autobuses hasta muy tarde y el billete es barato. En cambio, en invierno llueve muchísimo y las calles empinadas se vuelven peligrosas.",
                ]},
                {"t": "note", "text": "* Valparaíso – a port city in Chile (a Spanish-speaking country in South America)"},
                {"t": "inst", "text": "Put a cross in each one of the three correct boxes."},
                {"t": "pick", "stem": "In Valparaíso …", "items": [
                    ("the old lifts still work.", 1),
                    ("the murals are never repainted.", 0),
                    ("the buses run until very late.", 1),
                    ("tickets are expensive.", 0),
                    ("it rains a lot in winter.", 1),
                    ("the streets are flat.", 0),
                ]},
            ],
        },
        {
            "n": 6, "title": "A lost phone",
            "lead": "Read Elsa’s description of how she helped Tomás.",
            "blocks": [
                {"t": "text", "es": [
                    "Conozco a Tomás desde el verano pasado. Es el hijo de la vecina del quinto, donde vive con su padre y su hermana.",
                    "Tomás tiene un móvil viejo que normalmente deja en la mochila o en el escritorio. Pero el jueves no. Me escribió porque no lo encontraba.",
                    "Buscamos en el ascensor, en el portal y debajo del banco de la plaza. Al final apareció en la nevera. Me gusta ayudar a la gente del edificio.",
                ]},
                {"t": "inst", "text": "Complete the gap in each sentence using a word from the box below. There are more words than gaps."},
                {"t": "gapbank", "bank": ["neighbour", "cousin", "fridge", "lift", "desk", "bench", "backpack"], "items": [
                    ("Tomás is Elsa’s ___ .", "neighbour"),
                    ("Normally, Tomás leaves his phone in his backpack or on the ___ .", "desk"),
                    ("They found the phone in the ___ .", "fridge"),
                ]},
            ],
        },
        {
            "n": 7, "title": "Reading in school",
            "lead": "Read Omar’s article about reading in his school.",
            "blocks": [
                {"t": "text", "es": [
                    "En mi instituto hay más alumnos que leen por gusto que el curso pasado. Esto es porque ahora hay media hora de lectura cada mañana, la biblioteca abre al mediodía y podemos elegir el libro que queramos.",
                    "Durante ese rato los alumnos pueden leer novelas, cómics o revistas de ciencia. Los profesores nos recomiendan dejar el móvil en la mochila, porque si no, nadie pasa de la primera página.",
                    "Todo el mundo cree que leer en clase es muy útil* y debería seguir el año que viene.",
                ]},
                {"t": "note", "text": "* útil – useful"},
                {"t": "part", "text": "Complete the sentences below.", "sub": "Put a cross in the correct box for each question."},
                {"t": "mcq", "items": [
                    ("The number of students reading for pleasure has …", ["gone up.", "gone down.", "stayed the same."], 0),
                    ("In Omar’s school the library …", ["is closed at midday.", "opens at midday.", "has no novels."], 1),
                    ("During the reading time, students can …", ["choose a comic.", "watch videos.", "do homework."], 0),
                    ("Teachers say students should …", ["leave the phone in the bag.", "read aloud.", "write a summary."], 0),
                ]},
                {"t": "inst", "text": "Put a cross in the correct box."},
                {"t": "mcq", "lab": "alpha", "items": [
                    ("Which of these is the best translation for the word gusto in «leen por gusto»?", ["duty", "pleasure", "mistake"], 1),
                ]},
            ],
        },
        {
            "n": 8, "title": "A series and its star",
            "lead": "Read this review of a television series and an actor.",
            "blocks": [
                {"t": "text", "es": [
                    "Esta serie cuenta una historia inventada sobre una familia de pescadores gallegos. Hay un chico que deja la ciudad ruidosa y se muda al pueblo de sus abuelos, donde aprende a reparar barcos y lo encuentra relajante. ¡Le encanta el mar! Después de verla, querrás pasar un verano en la costa.",
                ]},
                {"t": "part", "text": "Complete the gap in each sentence using a word from the box below. There are more words than gaps."},
                {"t": "gapbank", "lab": "roman", "bank": ["true", "invented", "relaxing", "boats", "coast", "city", "fish"], "items": [
                    ("The story is ___ .", "invented"),
                    ("The boy learns to repair ___ .", "boats"),
                    ("The series makes people want to spend a summer on the ___ .", "coast"),
                ]},
                {"t": "part", "text": "The review continues and talks about the actor."},
                {"t": "text", "es": [
                    "Este actor gallego hizo su primer anuncio a los seis años. Tiene pocos seguidores en las redes porque no las usa casi nunca. También canta en un grupo de su pueblo. Su personalidad es tímida y amable, justo lo que pedía el papel. ¡Si lo ves actuar, lo creerás de verdad!",
                ]},
                {"t": "part", "text": "Complete the sentences below.", "sub": "Put a cross in the correct box for each question."},
                {"t": "mcq", "items": [
                    ("The actor made his first advert when he was …", ["six.", "sixteen.", "sixty."], 0),
                    ("He …", ["hardly uses social media.", "has millions of followers.", "only acts."], 0),
                ]},
                {"t": "part", "text": "Answer the following questions in English. You do not need to write in full sentences."},
                {"t": "short", "lab": "roman", "lines": 1, "items": [
                    ("What is the actor’s personality like? (1 detail)", "Shy / kind"),
                    ("What else does the actor do, apart from acting?", "He sings in a group (from his village)"),
                ]},
            ],
        },
        {
            "n": 9, "title": "Healthy living",
            "lead": "Read these social media comments about healthy habits. Complete the tables in English. You do not need to write in full sentences.",
            "blocks": [
                {"t": "speakers", "items": [
                    ("Dani", "Voy al instituto en bici todos los días. Así hago ejercicio sin pensar y llego despierto."),
                    ("Sofía", "He dejado las bebidas con azúcar y ahora bebo agua. Me dolían mucho las muelas y el dentista me asustó."),
                    ("Berta", "Duermo ocho horas aunque tenga exámenes. Si no descanso, al día siguiente no me entra nada y me pongo de mal humor."),
                ]},
                {"t": "part", "text": "Dani"},
                {"t": "table", "lab": "roman", "items": [
                    ("One healthy action they take", "He cycles to school every day"),
                    ("One reason", "He exercises without thinking about it / he arrives awake"),
                ]},
                {"t": "part", "text": "Sofía"},
                {"t": "table", "lab": "roman", "items": [
                    ("One healthy action they take", "She has given up sugary drinks / she drinks water"),
                    ("One reason", "Her teeth hurt a lot / the dentist frightened her"),
                ]},
                {"t": "part", "text": "Berta"},
                {"t": "table", "lab": "roman", "items": [
                    ("One healthy action they take", "She sleeps eight hours (even during exams)"),
                    ("One reason", "Without rest she cannot take anything in / she gets bad-tempered"),
                ]},
            ],
        },
    ],
}

SECTION_B = {
    "name": "Section B", "sub": "Translation", "total": 10,
    "questions": [
        {
            "n": 10, "title": "A day by the sea",
            "lead": "Translate the following sentences into English.",
            "blocks": [
                {"t": "translate", "m": 2, "lines": 2, "items": [
                    ("Me gusta nadar por la mañana.", "I like to swim / swimming in the morning."),
                    ("Vamos a varios pueblos pequeños.", "We go to several small villages / towns."),
                    ("Siempre llevo dos botellas de agua.", "I always take / carry two bottles of water."),
                    ("Ayer, mi hermano y yo caminamos por la playa.", "Yesterday, my brother and I walked along the beach."),
                    ("Mañana queremos comprar regalos para nuestros primos.", "Tomorrow we want to buy presents for our cousins."),
                ]},
            ],
        },
    ],
}

PAPER = shell("edexcel_foundation", "B", [SECTION_A, SECTION_B])
