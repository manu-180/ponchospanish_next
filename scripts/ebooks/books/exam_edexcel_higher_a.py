"""Pearson Edexcel GCSE (9–1) Spanish 1SP1 · Paper 3 · Higher tier · modelo A.

Formato y puntaje: sample assessment materials issue 3 (agosto 2025) de Pearson
(1 hora, 50 puntos; Sección A de comprensión 40 puntos y Sección B con la traducción
de un párrafo entero, 10 puntos).
Los textos y las preguntas son originales de Poncho.
"""

from books._exam_paper import shell

SECTION_A = {
    "name": "Section A", "sub": "Reading comprehension", "total": 40,
    "questions": [
        {
            "n": 1, "title": "A lost phone",
            "lead": "Read Elsa’s description of how she helped Tomás.",
            "blocks": [
                {"t": "text", "es": [
                    "Conozco a Tomás desde el verano pasado. Es el hijo de la vecina del quinto, donde vive con su padre y su hermana.",
                    "Tomás tiene un móvil viejo que normalmente deja en la mochila o en el escritorio. Pero el jueves no. Me escribió porque no lo encontraba.",
                    "Buscamos en el ascensor, en el portal y debajo del banco de la plaza. Al final apareció en la nevera.",
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
            "n": 2, "title": "Reading in school",
            "lead": "Read Omar’s article about reading in his school.",
            "blocks": [
                {"t": "text", "es": [
                    "En mi instituto hay más alumnos que leen por gusto que el curso pasado. Esto es porque ahora hay media hora de lectura cada mañana, la biblioteca abre al mediodía y podemos elegir el libro que queramos.",
                    "Durante ese rato los alumnos pueden leer novelas, cómics o revistas de ciencia. Los profesores nos recomiendan dejar el móvil en la mochila, porque si no, nadie pasa de la primera página.",
                    "Todo el mundo cree que leer en clase es imprescindible* y debería seguir el año que viene.",
                ]},
                {"t": "note", "text": "* imprescindible – ?"},
                {"t": "part", "text": "Complete the sentences below.", "sub": "Put a cross in the correct box for each question."},
                {"t": "mcq", "items": [
                    ("The number of students reading for pleasure has …", ["gone up.", "gone down.", "stayed the same."], 0),
                    ("In Omar’s school the library …", ["is closed at midday.", "opens at midday.", "has no novels."], 1),
                    ("During the reading time, students can …", ["choose a comic.", "watch videos.", "do homework."], 0),
                    ("Teachers say students should …", ["leave the phone in the bag.", "read aloud.", "write a summary."], 0),
                ]},
                {"t": "inst", "text": "Put a cross in the correct box."},
                {"t": "mcq", "lab": "alpha", "items": [
                    ("Which of these is the best translation for the word imprescindible?", ["unnecessary", "essential", "impressive"], 1),
                ]},
            ],
        },
        {
            "n": 3, "title": "A series and its star",
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
            "n": 4, "title": "A holiday that went wrong",
            "lead": "Read this entry on a holiday forum.",
            "blocks": [
                {"t": "text", "es": [
                    "¿Casa rural o apartamento? Para nosotros era una decisión complicada porque nos gusta cocinar en vacaciones. Al final elegimos la casa rural porque queríamos estar rodeados de montañas.",
                    "Los primeros dos días los niños no entraron en casa: subían y bajaban por el bosque sin parar.",
                    "Por desgracia, después el tiempo cambió: se levantó una niebla* que no se iba y dejamos de ver el valle. Tuvimos que volver antes porque los caminos estaban resbaladizos.",
                ]},
                {"t": "part", "text": "Answer the following questions in English. You do not need to write in full sentences."},
                {"t": "short", "lab": "roman", "lines": 1, "items": [
                    ("What was the reason for choosing the country house?", "They wanted to be surrounded by mountains"),
                    ("How do we know the children were active? (1 detail)", "They did not go inside for two days / they went up and down through the wood non-stop"),
                ]},
                {"t": "inst", "text": "Put a cross in the correct box."},
                {"t": "mcq", "lab": "alpha", "items": [
                    ("Which of these is the best translation for the word niebla?", ["fog", "storm", "heat"], 0),
                ]},
            ],
        },
        {
            "n": 5, "title": "In the future",
            "lead": "Read Nerea’s and Hugo’s blogs about their future plans.",
            "blocks": [
                {"t": "part", "text": "What does Nerea say about her future plans?"},
                {"t": "text", "es": [
                    "Mi sueño es ser piloto de líneas comerciales. Mis padres me apoyan, aunque les preocupa lo que cuesta la formación. Para conseguirlo hay que estudiar muchísimo y volar cientos de horas.",
                    "Si al final no sale, sería una pena, pero podría trabajar como controladora aérea y eso también me gustaría.",
                ]},
                {"t": "inst", "text": "Put a cross next to each one of the three correct statements."},
                {"t": "pick", "stem": "Nerea …", "items": [
                    ("already works as a pilot.", 0),
                    ("wants to fly commercial aircraft.", 1),
                    ("has parents who support her plan.", 1),
                    ("has been offered a job.", 0),
                    ("must train twice a week.", 0),
                    ("could also work as an air traffic controller.", 1),
                ]},
                {"t": "part", "text": "What does Hugo tell us?", "sub": "Complete the tables in English. You do not need to write in full sentences."},
                {"t": "text", "es": [
                    "Soy una persona muy inquieta, así que odio la idea de repetir la misma tarea cada día. Siempre quise ser guía* de montaña. Con este trabajo estaré al aire libre y conoceré gente de todas partes. Estoy terminando el curso y ya he hecho las prácticas. Espero poder ahorrar para comprarme una furgoneta algún día.",
                ]},
                {"t": "note", "text": "* guía – guide"},
                {"t": "table", "lab": "roman", "items": [
                    ("What he hates the idea of", "Repeating the same task every day"),
                    ("Why he wants to be a mountain guide (1 detail)", "He will be outdoors / he will meet people from everywhere"),
                    ("His current situation (1 detail)", "He is finishing the course / he has already done his work placement"),
                    ("His future plan (1 detail)", "To save (money) to buy a van"),
                ]},
            ],
        },
        {
            "n": 6, "title": "A restaurant review",
            "lead": "Read Dalia’s restaurant review.",
            "blocks": [
                {"t": "text", "es": [
                    "Anteayer, por primera vez, fui a Raíz, un restaurante peruano bastante caro. Mi vecina me insistió en que probara el ceviche, y la verdad es que tenía razón.",
                    "El local es pequeño y siempre está lleno, así que conviene reservar con dos semanas de antelación. El negocio abrió hace treinta años y el dueño me contó que la carta se renueva cada temporada.",
                ]},
                {"t": "part", "text": "What does Dalia say about the restaurant?", "sub": "Put a cross next to each one of the two correct statements."},
                {"t": "pick", "stem": "The restaurant Raíz …", "items": [
                    ("is quite expensive.", 1),
                    ("is always empty.", 0),
                    ("changes its menu every season.", 1),
                    ("opened last year.", 0),
                ]},
                {"t": "part", "text": "The review continues.", "sub": "Complete the following tables in English. You do not need to write in full sentences."},
                {"t": "text", "es": [
                    "Antes de ir, yo creía que esta cocina era siempre picante y que no podría comer nada. Ahora sé que es justo al revés: hay platos suaves y muchísimas verduras, algo perfecto para quien no come pescado, como mi hermano.",
                    "En Raíz cocinan con productos del mercado del barrio, nada que ver con los platos congelados de algunas cadenas. Sin duda volveré. El restaurante abre todos los días menos los martes hasta la una de la madrugada.",
                ]},
                {"t": "table", "lab": "roman", "items": [
                    ("What Dalia used to think about Peruvian food (1 detail)", "That it was always spicy / that she would not be able to eat anything"),
                    ("Why the food suits her brother", "There are mild dishes and lots of vegetables (he does not eat fish)"),
                    ("What time the restaurant closes", "At one in the morning"),
                ]},
            ],
        },
        {
            "n": 7, "title": "A visit to Cartagena",
            "lead": "Read this tourist brochure about Cartagena de Indias, in Colombia.",
            "blocks": [
                {"t": "text", "es": [
                    "Debes empezar por la ciudad amurallada*, donde podrás probar las frutas que venden en carretilla. Para entender la historia del puerto, lo mejor es visitar el castillo que está en lo alto. Puedes llegar en taxi o en bicicleta, pero lo más práctico es ir andando.",
                    "Cartagena no se apaga nunca. Hay música en cada esquina, mercados y teatro en la calle. Un sitio precioso es el barrio de Getsemaní. Allí todos disfrutan si se sientan a ver pintar los murales.",
                    "Si vienes en noviembre, verás las fiestas de la independencia, un desfile enorme lleno de tambores.",
                    "Tu opinión nos importa: al volver de tu viaje, te pedimos que contestes nuestra encuesta.",
                ]},
                {"t": "note", "text": "* ciudad amurallada – walled city"},
                {"t": "part", "text": "Complete the sentences below.", "sub": "Put a cross in the correct box for each question."},
                {"t": "mcq", "items": [
                    ("In the walled city you can …", ["learn about the port.", "try fruit sold from a cart.", "see a parade."], 1),
                    ("The best way to get to the castle is …", ["by taxi.", "by bike.", "on foot."], 2),
                    ("In Getsemaní people can …", ["watch murals being painted.", "rent a boat.", "visit a museum."], 0),
                ]},
                {"t": "part", "text": "Answer the following questions in English. You do not need to write in full sentences."},
                {"t": "short", "lab": "roman", "lines": 1, "items": [
                    ("What are the November celebrations like? (1 detail)", "A huge parade / full of drums"),
                    ("What are you asked to do after your visit?", "Answer / complete their survey"),
                ]},
            ],
        },
        {
            "n": 8, "title": "My favourite writer",
            "lead": "Read Celia’s school report about her favourite writer, Mariana Ortiz.",
            "blocks": [
                {"t": "text", "es": [
                    "Soy Celia y mi escritora favorita es Mariana Ortiz. Creo que escribe de una forma distinta a los demás. Lo que más me gusta es su manera de describir el campo: en dos líneas ya estás allí.",
                    "Mariana nació en Montevideo, es bajita y siempre lleva unas gafas redondas que se le caen. Empezó a escribir de niña y a los dieciséis mandó un cuento a un concurso importante, pero lo rechazaron.",
                    "A pesar de eso, siguió. En 2021 sus novelas se tradujeron a once idiomas y hoy se estudian en los institutos de su país.",
                    "La respeto porque nunca escribe lo que se espera de ella. En su último libro, «La casa del sur», habla del derecho de la gente del campo a quedarse en su tierra.",
                ]},
                {"t": "inst", "text": "Answer the following questions in English. You do not need to write in full sentences."},
                {"t": "short", "lines": 1, "items": [
                    ("How does Celia describe Mariana’s writing? (1 detail)", "It is different from everyone else’s / in two lines you are already there (her descriptions of the countryside)"),
                    ("How does Celia describe Mariana’s appearance? (1 detail)", "She is short / she wears round glasses that slip down"),
                    ("What happened when Mariana entered a competition at sixteen?", "Her story was rejected / turned down"),
                    ("How do we know that Mariana is well known? (1 detail)", "Her novels were translated into eleven languages / they are studied in schools in her country"),
                    ("What is Mariana’s latest book about?", "The right of country people to stay on their land"),
                ]},
            ],
        },
    ],
}

SECTION_B = {
    "name": "Section B", "sub": "Translation", "total": 10,
    "questions": [
        {
            "n": 9, "title": "My best friend",
            "lead": "Translate the following paragraph into English.",
            "blocks": [
                {"t": "para", "m": 10, "lines": 13, "es": [
                    "Soy Lucas y vivo en un pueblo pequeño. Allí conocí a mi mejor amiga, Sonia, en un campamento de verano. "
                    "Todos los domingos salgo a correr por el bosque mientras Sonia se queda en casa tocando el piano. "
                    "Siempre nos reímos mucho cuando estamos juntos y nos contamos todo. Salvo cuando hablamos de fútbol, nunca discutimos.",
                ], "answer": "I am Lucas and I live in a small village. I met my best friend, Sonia, there at a summer camp. "
                             "Every Sunday I go running in the wood while Sonia stays at home playing the piano. "
                             "We always laugh a lot when we are together and we tell each other everything. "
                             "Except when we talk about football, we never argue."},
            ],
        },
    ],
}

PAPER = shell("edexcel_higher", "A", [SECTION_A, SECTION_B])
