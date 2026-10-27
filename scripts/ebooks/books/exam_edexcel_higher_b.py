"""Pearson Edexcel GCSE (9–1) Spanish 1SP1 · Paper 3 · Higher tier · modelo B.

Mismo formato y puntaje que el modelo A (1 hora, 50 puntos), con textos, temas y
preguntas distintos. Todo original de Poncho.
"""

from books._exam_paper import shell

SECTION_A = {
    "name": "Section A", "sub": "Reading comprehension", "total": 40,
    "questions": [
        {
            "n": 1, "title": "Helping a neighbour",
            "lead": "Read Leo’s description of how he helped Sara.",
            "blocks": [
                {"t": "text", "es": [
                    "Conozco a Sara desde el colegio. Vive enfrente de mi casa, donde vivo con mi madre y mi abuelo.",
                    "Sara tiene un perro marrón que normalmente duerme en el sofá o en el pasillo. Pero el martes no. Me llamó porque no lo encontraba.",
                    "Buscamos en el jardín, en la escalera y detrás del garaje. Al final apareció en el baño.",
                ]},
                {"t": "inst", "text": "Complete the gap in each sentence using a word from the box below. There are more words than gaps."},
                {"t": "gapbank", "bank": ["classmate", "cousin", "bathroom", "garage", "garden", "sofa", "stairs"], "items": [
                    ("Sara is Leo’s ___ .", "classmate"),
                    ("Normally, Sara’s dog sleeps on the ___ .", "sofa"),
                    ("They found the dog in the ___ .", "bathroom"),
                ]},
            ],
        },
        {
            "n": 2, "title": "Sport at school",
            "lead": "Read Nadia’s article about sport in her school.",
            "blocks": [
                {"t": "text", "es": [
                    "En mi instituto hay más alumnos que hacen deporte que hace dos años. Esto es porque ahora hay equipos mixtos, las pistas están abiertas al mediodía y no hay que pagar nada.",
                    "Durante el recreo los alumnos pueden jugar al fútbol, usar las mesas de ping-pong o simplemente sentarse al sol. Los profesores nos recomiendan movernos un poco cada hora, aunque sea caminando por el pasillo.",
                    "Todo el mundo cree que el deporte en el instituto es provechoso* y debería tener más horas.",
                ]},
                {"t": "note", "text": "* provechoso – ?"},
                {"t": "part", "text": "Complete the sentences below.", "sub": "Put a cross in the correct box for each question."},
                {"t": "mcq", "items": [
                    ("The number of students doing sport has …", ["increased.", "stayed the same.", "fallen."], 0),
                    ("In Nadia’s school the courts …", ["cost money.", "open at midday.", "are closed at break."], 1),
                    ("At break time, students can …", ["play table tennis.", "do homework.", "leave the school."], 0),
                    ("Teachers say students should …", ["move a little every hour.", "join a team.", "run every morning."], 0),
                ]},
                {"t": "inst", "text": "Put a cross in the correct box."},
                {"t": "mcq", "lab": "alpha", "items": [
                    ("Which of these is the best translation for the word provechoso?", ["worthwhile", "provisional", "dangerous"], 0),
                ]},
            ],
        },
        {
            "n": 3, "title": "A film and its star",
            "lead": "Read this review of a film and an actor.",
            "blocks": [
                {"t": "text", "es": [
                    "Esta película cuenta una historia real sobre la música colombiana. Hay una chica que deja su pueblo tranquilo y se va a la capital, donde aprende a tocar el arpa y lo encuentra dificilísimo. ¡Le encanta la música! Después de verla, querrás escuchar discos de ese país.",
                ]},
                {"t": "part", "text": "Complete the gap in each sentence using a word from the box below. There are more words than gaps."},
                {"t": "gapbank", "lab": "roman", "bank": ["true", "quiet", "difficult", "sing", "listen", "study", "travel"], "items": [
                    ("The story is ___ .", "true"),
                    ("The girl finds the harp ___ .", "difficult"),
                    ("The film makes people want to ___ to music from Colombia.", "listen"),
                ]},
                {"t": "part", "text": "The review continues and talks about the actor."},
                {"t": "text", "es": [
                    "Esta joven actriz colombiana empezó en el teatro a los diez años. Tiene muchísimos seguidores en las redes, aunque publica muy poco. También aparece en una serie de televisión. Su personalidad es tranquila y seria, perfecta para el papel. ¡Si la ves actuar, te emocionarás!",
                ]},
                {"t": "part", "text": "Complete the sentences below.", "sub": "Put a cross in the correct box for each question."},
                {"t": "mcq", "items": [
                    ("Now, the actor is …", ["ten years old.", "a young woman.", "an older woman."], 1),
                    ("She …", ["posts very little.", "only works in the theatre.", "has few followers."], 0),
                ]},
                {"t": "part", "text": "Answer the following questions in English. You do not need to write in full sentences."},
                {"t": "short", "lab": "roman", "lines": 1, "items": [
                    ("What is the actor’s personality like? (1 detail)", "Calm / serious"),
                    ("What does the actor make people feel?", "Moved / emotional"),
                ]},
            ],
        },
        {
            "n": 4, "title": "A camping trip",
            "lead": "Read this entry on a holiday forum.",
            "blocks": [
                {"t": "text", "es": [
                    "¿Playa o ciudad? Para nosotros era una decisión difícil porque nos encantan los museos. Al final nos fuimos a la costa porque los niños necesitaban correr.",
                    "Los tres primeros días no se movieron del agua: nadaban por la mañana y por la tarde.",
                    "Lamentablemente, después llegó un viento que levantaba la arena* y no se podía ni abrir los ojos. Tuvimos que pasar dos días dentro del apartamento jugando a las cartas.",
                ]},
                {"t": "part", "text": "Answer the following questions in English. You do not need to write in full sentences."},
                {"t": "short", "lab": "roman", "lines": 1, "items": [
                    ("What was the reason for going to the coast?", "The children needed to run (around)"),
                    ("How do we know the children enjoyed the first days? (1 detail)", "They did not move out of the water / they swam morning and afternoon"),
                ]},
                {"t": "inst", "text": "Put a cross in the correct box."},
                {"t": "mcq", "lab": "alpha", "items": [
                    ("Which of these is the best translation for the word arena?", ["rain", "sand", "wave"], 1),
                ]},
            ],
        },
        {
            "n": 5, "title": "In the future",
            "lead": "Read Irene’s and Marc’s blogs about their future plans.",
            "blocks": [
                {"t": "part", "text": "What does Irene say about her future plans?"},
                {"t": "text", "es": [
                    "Mi sueño es dedicarme a la restauración de obras de arte. Mis padres me animan, aunque temen que haya pocas plazas. Para conseguirlo hace falta una carrera y después un máster.",
                    "Si no lo lograra, me daría rabia, pero podría trabajar en un archivo histórico y también me parecería apasionante.",
                ]},
                {"t": "inst", "text": "Put a cross next to each one of the three correct statements."},
                {"t": "pick", "stem": "Irene …", "items": [
                    ("already restores works of art.", 0),
                    ("wants to restore works of art.", 1),
                    ("has parents who encourage her.", 1),
                    ("has been accepted on the master’s course.", 0),
                    ("has to study abroad.", 0),
                    ("could also work in a historical archive.", 1),
                ]},
                {"t": "part", "text": "What does Marc tell us?", "sub": "Complete the tables in English. You do not need to write in full sentences."},
                {"t": "text", "es": [
                    "Soy bastante callado, así que odio la idea de pasar el día atendiendo al público. Siempre quise ser técnico* de sonido. Con este trabajo estaré detrás del escenario y viajaré con los grupos. Estoy en el último año y ya he grabado dos conciertos. Espero poder montar un pequeño estudio en casa de mis padres.",
                ]},
                {"t": "note", "text": "* técnico – technician"},
                {"t": "table", "lab": "roman", "items": [
                    ("What he hates the idea of", "Spending the day serving the public"),
                    ("Why he wants to be a sound technician (1 detail)", "He will be behind the stage / he will travel with the bands"),
                    ("His current situation (1 detail)", "He is in his final year / he has already recorded two concerts"),
                    ("His future plan (1 detail)", "To set up a small studio at his parents’ house"),
                ]},
            ],
        },
        {
            "n": 6, "title": "A café review",
            "lead": "Read Bruno’s review of a café.",
            "blocks": [
                {"t": "text", "es": [
                    "El sábado pasado fui por primera vez a Vereda, una cafetería argentina nada barata. Mi compañera de piso me recomendó las medialunas, y acertó de pleno.",
                    "El local es amplio y por la mañana hay sitio de sobra, aunque a partir de las cinco no cabe un alfiler. Abrió hace dos años y la dueña me dijo que todo el pan se hace allí mismo.",
                ]},
                {"t": "part", "text": "What does Bruno say about the café?", "sub": "Put a cross next to each one of the two correct statements."},
                {"t": "pick", "stem": "The café Vereda …", "items": [
                    ("is not cheap.", 1),
                    ("is small and cramped.", 0),
                    ("bakes its own bread.", 1),
                    ("opened ten years ago.", 0),
                ]},
                {"t": "part", "text": "The review continues.", "sub": "Complete the following tables in English. You do not need to write in full sentences."},
                {"t": "text", "es": [
                    "Antes de ir, yo pensaba que una cafetería así sería incómoda para trabajar. Resulta que es al revés: hay enchufes en todas las mesas y nadie te mira mal si te quedas dos horas, algo ideal para quien estudia, como yo.",
                    "En Vereda usan café de productores pequeños, muy distinto del que sirven las grandes cadenas. Volveré seguro. Abre todos los días menos los domingos hasta las nueve de la noche.",
                ]},
                {"t": "table", "lab": "roman", "items": [
                    ("What Bruno used to think about cafés like this one (1 detail)", "That it would be uncomfortable to work in"),
                    ("Why the café suits students", "There are plugs at every table / nobody minds if you stay two hours"),
                    ("What time the café closes", "At nine (in the evening)"),
                ]},
            ],
        },
        {
            "n": 7, "title": "A visit to Granada",
            "lead": "Read this tourist brochure about Granada.",
            "blocks": [
                {"t": "text", "es": [
                    "Debes empezar por el Albaicín*, un barrio de calles estrechas donde se come de tapas sin pagar de más. Para entender la historia de la ciudad, lo mejor es recorrer el palacio que está en la colina de enfrente. Puedes subir en microbús o en taxi, pero lo más agradable es ir caminando.",
                    "Granada no se aburre nunca. Hay conciertos en los patios, mercadillos y ferias de artesanía. Un lugar precioso es el mirador de San Nicolás. Allí todos disfrutan si llegan antes de que se ponga el sol.",
                    "Si vienes en junio, podrás ver el festival de música y danza, con espectáculos al aire libre.",
                    "Tu opinión es importante. Después del viaje, te pedimos que nos escribas una reseña.",
                ]},
                {"t": "note", "text": "* Albaicín – an old quarter of Granada"},
                {"t": "part", "text": "Complete the sentences below.", "sub": "Put a cross in the correct box for each question."},
                {"t": "mcq", "items": [
                    ("In the Albaicín you can …", ["learn the city’s history.", "eat tapas without paying too much.", "see a dance show."], 1),
                    ("The nicest way to get to the palace is …", ["by minibus.", "by taxi.", "on foot."], 2),
                    ("At the mirador de San Nicolás people should …", ["arrive before sunset.", "book a table.", "bring a picnic."], 0),
                ]},
                {"t": "part", "text": "Answer the following questions in English. You do not need to write in full sentences."},
                {"t": "short", "lab": "roman", "lines": 1, "items": [
                    ("What can you see in June? (1 detail)", "A music and dance festival / open-air shows"),
                    ("What are you asked to do after your trip?", "Write them a review"),
                ]},
            ],
        },
        {
            "n": 8, "title": "My favourite athlete",
            "lead": "Read Iker’s school report about his favourite athlete, Paula Vidal.",
            "blocks": [
                {"t": "text", "es": [
                    "Soy Iker y mi deportista favorita es Paula Vidal. Creo que corre de una manera muy distinta a las demás. Lo que más me gusta es cómo administra las fuerzas: parece lenta y de repente no la alcanza nadie.",
                    "Paula nació en Zaragoza, es muy alta y siempre lleva una cinta azul en el pelo. Empezó a correr en el colegio y a los diecisiete quiso entrar en la selección, pero no la eligieron.",
                    "A pesar de eso, no lo dejó. En 2024 batió tres récords nacionales en una misma temporada y ahora la conoce todo el mundo.",
                    "La respeto porque dedica los lunes a entrenar a niñas de su barrio. Dice que de pequeña nadie le explicó cómo se entrena y no quiere que les pase lo mismo.",
                ]},
                {"t": "inst", "text": "Answer the following questions in English. You do not need to write in full sentences."},
                {"t": "short", "lines": 1, "items": [
                    ("How does Iker describe the way Paula runs? (1 detail)", "Very differently from the others / she looks slow and suddenly nobody can catch her"),
                    ("How does Iker describe Paula’s appearance? (1 detail)", "She is very tall / she always wears a blue ribbon in her hair"),
                    ("What happened when Paula tried to join the national team at seventeen?", "She was not chosen / selected"),
                    ("How do we know that Paula is well known? (1 detail)", "She broke three national records in one season / everybody knows her now"),
                    ("What does Paula do on Mondays, and why?", "She coaches girls from her neighbourhood, because nobody explained to her how to train when she was little"),
                ]},
            ],
        },
    ],
}

SECTION_B = {
    "name": "Section B", "sub": "Translation", "total": 10,
    "questions": [
        {
            "n": 9, "title": "My neighbourhood",
            "lead": "Translate the following paragraph into English.",
            "blocks": [
                {"t": "para", "m": 10, "lines": 13, "es": [
                    "Me llamo Alba y vivo en un barrio tranquilo. Allí conocí a mi vecina, Rosa, en una fiesta de la calle. "
                    "Todos los sábados voy al mercado mientras Rosa se queda en casa cuidando su huerto. "
                    "Siempre nos ayudamos cuando tenemos problemas y compartimos la comida. "
                    "Salvo cuando se trata de la música, nunca estamos en desacuerdo.",
                ], "answer": "My name is Alba and I live in a quiet neighbourhood. I met my neighbour, Rosa, there at a street party. "
                             "Every Saturday I go to the market while Rosa stays at home looking after her vegetable garden. "
                             "We always help each other when we have problems and we share our food. "
                             "Except when it comes to music, we never disagree."},
            ],
        },
    ],
}

PAPER = shell("edexcel_higher", "B", [SECTION_A, SECTION_B])
