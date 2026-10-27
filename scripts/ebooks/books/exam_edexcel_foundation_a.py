"""Pearson Edexcel GCSE (9–1) Spanish 1SP1 · Paper 3 · Foundation tier · modelo A.

Formato y puntaje: sample assessment materials issue 3 (agosto 2025) de Pearson
(45 minutos, 50 puntos; Sección A de comprensión 40 puntos y Sección B de traducción
10 puntos, con unos 10 minutos recomendados para la traducción).
Los textos y las preguntas son originales de Poncho.
"""

from books._exam_paper import shell

SECTION_A = {
    "name": "Section A", "sub": "Reading comprehension", "total": 40,
    "questions": [
        {
            "n": 1, "title": "Free time",
            "lead": "Read these comments from an internet forum.",
            "blocks": [
                {"t": "speakers", "items": [
                    ("Marina", "Toco la guitarra todos los días. Los miércoles voy a clases de baile."),
                    ("Teo", "Me encanta patinar los fines de semana. No me gusta el atletismo porque me aburre."),
                    ("Lia", "Mi deporte favorito es el piragüismo. Este año, en mi instituto, juego al bádminton."),
                ]},
                {"t": "inst", "text": "Who says what? Choose the correct answers. Put a cross in the correct column for each question."},
                {"t": "grid", "head": "Who …", "cols": ["Marina", "Teo", "Lia"], "items": [
                    ("… goes skating?", 1),
                    ("… has dance lessons?", 0),
                    ("… loves canoeing?", 2),
                    ("… plays an instrument?", 0),
                    ("… finds athletics boring?", 1),
                    ("… plays badminton at school?", 2),
                ]},
            ],
        },
        {
            "n": 2, "title": "A birthday",
            "lead": "Read Omar’s text message.",
            "blocks": [
                {"t": "text", "es": [
                    "¡Hola!",
                    "Mañana es el cumpleaños de mi abuela y hoy voy al mercado a comprar flores. A mi madre le gustaría hacer una tarta, pero no tenemos horno. Mi hermano va a traer música. Yo prefiero regalarle un libro.",
                ]},
                {"t": "inst", "text": "Put a cross in each one of the three correct boxes."},
                {"t": "pick", "stem": "Omar …", "items": [
                    ("is going to the market today.", 1),
                    ("will buy flowers tomorrow.", 0),
                    ("says his mother cannot bake a cake.", 1),
                    ("says his brother will bring a cake.", 0),
                    ("wants to give his grandmother a book.", 1),
                    ("is celebrating his own birthday.", 0),
                ]},
            ],
        },
        {
            "n": 3, "title": "A young chef",
            "lead": "Read this extract from a food magazine.",
            "blocks": [
                {"t": "text", "es": [
                    "La cocinera chilena Rita* tiene un restaurante nuevo. Esta chef conocida prepara platos de varias regiones. Escribe sus recetas en español y en inglés, pero no le gusta salir en televisión. Rita es una persona muy generosa porque da la comida que sobra a un comedor social.",
                ]},
                {"t": "note", "text": "* Rita – the name of a chef"},
                {"t": "part", "text": "Complete the sentences below.", "sub": "Put a cross in the correct box for each question."},
                {"t": "mcq", "items": [
                    ("Rita’s restaurant is …", ["Chilean.", "new.", "small."], 1),
                    ("Rita …", ["writes in two languages.", "cooks one regional dish.", "appears on television."], 0),
                ]},
                {"t": "inst", "text": "Put a cross in the correct box."},
                {"t": "mcq", "lab": "alpha", "items": [
                    ("Which of these is the best translation for the word generosa?", ["generous", "nervous", "serious"], 0),
                ]},
            ],
        },
        {
            "n": 4, "title": "My school",
            "lead": "Read Rocío and Álex’s comments in a blog. Complete the following tables in English. You do not need to write in full sentences.",
            "blocks": [
                {"t": "part", "text": "Rocío"},
                {"t": "text", "es": [
                    "Rocío: En mi instituto hay mil alumnos. El edificio es viejo pero muy bonito. Los profesores son exigentes. Las clases terminan a las tres. Vuelvo a casa en autobús y siempre llego con hambre.",
                ]},
                {"t": "table", "lab": "roman", "items": [
                    ("One detail about the building", "It is old / it is very pretty"),
                    ("When school ends", "At three (o’clock)"),
                ]},
                {"t": "part", "text": "Álex"},
                {"t": "text", "es": [
                    "Álex: Me gusta mi colegio porque hay un huerto. Mis asignaturas preferidas son la biología y la música porque son prácticas. Después quiero hacer un ciclo de jardinería. Me gustaría trabajar en un parque natural en Costa Rica.",
                ]},
                {"t": "table", "lab": "roman", "items": [
                    ("One subject Álex likes", "Biology / music"),
                    ("One job Álex would like to do", "Work in a natural park (in Costa Rica) / gardening"),
                ]},
            ],
        },
        {
            "n": 5, "title": "Transport in Bogotá",
            "lead": "Read this comment from a local newspaper.",
            "blocks": [
                {"t": "text", "es": [
                    "El transporte público en Bogotá* ha cambiado mucho. Hay carriles sólo para autobuses y por eso se llega antes. Los domingos cierran las avenidas principales y la gente va en bicicleta.",
                    "Las paradas tienen pantallas que dicen cuántos minutos faltan. El billete sencillo cuesta poco y los estudiantes pagan la mitad. Sin embargo, a las siete de la tarde va tan lleno que no se puede ni respirar.",
                ]},
                {"t": "note", "text": "* Bogotá – the capital city of Colombia (a Spanish-speaking country in South America)"},
                {"t": "inst", "text": "Put a cross in each one of the three correct boxes."},
                {"t": "pick", "stem": "In Bogotá …", "items": [
                    ("there are lanes only for buses.", 1),
                    ("the main avenues close on Saturdays.", 0),
                    ("the stops show how long you must wait.", 1),
                    ("students travel for free.", 0),
                    ("single tickets are expensive.", 0),
                    ("buses are very crowded in the evening.", 1),
                ]},
            ],
        },
        {
            "n": 6, "title": "Helping a neighbour",
            "lead": "Read Leo’s description of how he helped Sara.",
            "blocks": [
                {"t": "text", "es": [
                    "Conozco a Sara desde el colegio. Vive enfrente de mi casa, donde vivo con mi madre y mi abuelo.",
                    "Sara tiene un perro marrón que normalmente duerme en el sofá o en el pasillo. Pero el martes no. Me llamó porque no lo encontraba.",
                    "Buscamos en el jardín, en la escalera y detrás del garaje. Al final apareció en el baño. Me gusta ayudar y ser útil.",
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
            "n": 7, "title": "Sport at school",
            "lead": "Read Nadia’s article about sport in her school.",
            "blocks": [
                {"t": "text", "es": [
                    "En mi instituto hay más alumnos que hacen deporte que hace dos años. Esto es porque ahora hay equipos mixtos, las pistas están abiertas al mediodía y no hay que pagar nada.",
                    "Durante el recreo los alumnos pueden jugar al fútbol, usar las mesas de ping-pong o simplemente sentarse al sol. Los profesores nos recomiendan movernos un poco cada hora, aunque sea caminando por el pasillo.",
                    "Todo el mundo cree que el deporte en el instituto es imprescindible* y debería tener más horas.",
                ]},
                {"t": "note", "text": "* imprescindible – essential"},
                {"t": "part", "text": "Complete the sentences below.", "sub": "Put a cross in the correct box for each question."},
                {"t": "mcq", "items": [
                    ("The number of students doing sport has …", ["increased.", "stayed the same.", "fallen."], 0),
                    ("In Nadia’s school the courts …", ["cost money.", "open at midday.", "are closed at break."], 1),
                    ("At break time, students can …", ["play table tennis.", "do homework.", "leave the school."], 0),
                    ("Teachers say students should …", ["move a little every hour.", "join a team.", "run every morning."], 0),
                ]},
                {"t": "inst", "text": "Put a cross in the correct box."},
                {"t": "mcq", "lab": "alpha", "items": [
                    ("Which of these is the best translation for the word recreo?", ["homework", "break time", "changing room"], 1),
                ]},
            ],
        },
        {
            "n": 8, "title": "A film and its star",
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
            "n": 9, "title": "The environment",
            "lead": "Read these social media comments about the environment. Complete the tables in English. You do not need to write in full sentences.",
            "blocks": [
                {"t": "speakers", "items": [
                    ("Iris", "En mi casa apagamos las luces al salir de cada habitación. Lo hacemos para gastar menos electricidad y pagar menos."),
                    ("Javi", "Mis amigos y yo recogemos plásticos de la playa un sábado al mes. El mar está lleno de basura y los peces se la comen."),
                    ("Nuria", "Voy al instituto andando todos los días para no usar el coche. Creo que el aire de mi ciudad está muy sucio, así que también he dejado de comprar ropa nueva."),
                ]},
                {"t": "part", "text": "Iris"},
                {"t": "table", "lab": "roman", "items": [
                    ("One eco-friendly action they take", "They switch off the lights when leaving a room"),
                    ("One reason", "To use less electricity / to pay less"),
                ]},
                {"t": "part", "text": "Javi"},
                {"t": "table", "lab": "roman", "items": [
                    ("One eco-friendly action they take", "They collect plastic from the beach (once a month)"),
                    ("One reason", "The sea is full of rubbish / the fish eat it"),
                ]},
                {"t": "part", "text": "Nuria"},
                {"t": "table", "lab": "roman", "items": [
                    ("One eco-friendly action they take", "She walks to school / she has stopped buying new clothes"),
                    ("One reason", "To avoid using the car / the air in her city is very dirty"),
                ]},
            ],
        },
    ],
}

SECTION_B = {
    "name": "Section B", "sub": "Translation", "total": 10,
    "questions": [
        {
            "n": 10, "title": "A day in Madrid",
            "lead": "Translate the following sentences into English.",
            "blocks": [
                {"t": "translate", "m": 2, "lines": 2, "items": [
                    ("Me gusta pasear con mi perro.", "I like to walk / walking with my dog."),
                    ("Vamos a muchos museos interesantes.", "We go to many interesting museums."),
                    ("Siempre compro dos billetes baratos.", "I always buy two cheap tickets."),
                    ("Ayer, mi madre y yo comimos en un restaurante del centro.", "Yesterday, my mother and I ate in a restaurant in the centre."),
                    ("Esta tarde queremos alquilar patines para ir al parque.", "This afternoon we want to hire skates to go to the park."),
                ]},
            ],
        },
    ],
}

PAPER = shell("edexcel_foundation", "A", [SECTION_A, SECTION_B])
