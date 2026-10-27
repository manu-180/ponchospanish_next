"""AQA GCSE Spanish 8692 · Paper 3 Reading · Higher tier · modelo B.

Mismo formato y puntaje que el modelo A (1 hora, 50 puntos), con textos, temas y
preguntas distintos. Todo original de Poncho.
"""

from books._exam_paper import shell

SECTION_A = {
    "name": "Section A", "sub": "Reading comprehension", "total": 40,
    "questions": [
        {
            "n": 1, "title": "Newspaper headlines",
            "lead": "You read some headlines in a Spanish newspaper.",
            "blocks": [
                {"t": "options", "items": [
                    "La biblioteca prestará bicicletas eléctricas a los socios desde octubre.",
                    "Los comercios del centro cierran una hora antes por falta de clientes.",
                    "El club de natación consigue tres medallas en el campeonato regional.",
                    "Un grupo de vecinos planta un huerto en un solar abandonado.",
                    "El museo ofrecerá visitas guiadas en lengua de signos.",
                ]},
                {"t": "inst", "text": "Which headline matches each description? Write the correct letter in each box."},
                {"t": "letters", "items": [
                    ("News about sporting results.", "C"),
                    ("A measure to make a service more accessible.", "E"),
                    ("A community gardening project.", "D"),
                ]},
            ],
        },
        {
            "n": 2, "title": "Money and work",
            "lead": "You see an online forum. Some Spanish students are writing about money.",
            "blocks": [
                {"t": "speakers", "items": [
                    ("Adrián", "Mis padres me dan una paga los viernes, pero se me va entera el mismo fin de semana. Este año he abierto una cuenta para ahorrar algo."),
                    ("Berta", "Reparto periódicos antes de ir al instituto. Es cansado y en invierno es horrible, aunque el dinero es mío y eso me gusta."),
                    ("Celso", "Yo no cobro nada: ayudo en la tienda de mis padres los sábados. A cambio me pagaron el curso de socorrista del verano pasado."),
                ]},
                {"t": "inst", "text": "Write A for Adrián, B for Berta or C for Celso. Write the correct letter in each box."},
                {"t": "letters", "items": [
                    ("Who works before school?", "B"),
                    ("Who has started saving?", "A"),
                    ("Who received training instead of money?", "C"),
                    ("Who finds their job unpleasant at a certain time of year?", "B"),
                    ("Who spends everything straight away?", "A"),
                ]},
            ],
        },
        {
            "n": 3, "title": "Holidays",
            "lead": "You see this brochure about Mallorca, one of the Balearic Islands.",
            "blocks": [
                {"t": "text", "es": [
                    "Conviene recorrer la Serra de Tramuntana*. El tren de madera que la cruza es lento, y justamente por eso vale la pena.",
                    "Aunque las calas del este se llenan en agosto, muchas sólo se alcanzan a pie y eso espanta a la mayoría. Llevá agua: no hay ningún bar.",
                    "El 16 de julio, en los pueblos de la costa, las barcas salen decoradas al atardecer y la fiesta sigue hasta la madrugada.",
                    "La cocina es sencilla. La sobrasada se vende en cualquier mercado a buen precio, mientras que el pescado fresco se ha puesto por las nubes.",
                ]},
                {"t": "note", "text": "* Serra de Tramuntana – a mountain range in the north of Mallorca."},
                {"t": "inst", "text": "Complete these sentences. Write the letter for the correct option in each box."},
                {"t": "mcq", "items": [
                    ("The wooden train is worth taking because…", ["it is fast.", "it is slow.", "it is free."], 1),
                    ("Many of the eastern coves…", ["can only be reached on foot.", "have several bars.", "are closed in August."], 0),
                    ("On 16 July the boats…", ["race each other.", "leave in the morning.", "are decorated."], 2),
                    ("In Mallorca…", ["fresh fish has become very expensive.", "sobrasada is hard to find.", "the food is complicated."], 0),
                ]},
            ],
        },
        {
            "n": 4, "title": "Living in a city centre",
            "lead": "You read this article about city life.",
            "blocks": [
                {"t": "text", "es": [
                    "Vivir en el centro no sólo te ahorra el coche: te devuelve las dos horas diarias que otros pasan en la carretera.",
                    "Si te molesta el ruido, lo que no debes hacer bajo ningún concepto es alquilar encima de un bar: los fines de semana no vas a pegar ojo.",
                    "Los pisos céntricos suelen ser pequeños, así que al cabo de unos meses mucha gente descubre que no tiene dónde guardar nada.",
                    "Para que el barrio funcione hace falta que haya tiendas pequeñas abiertas entre semana.",
                    "Sobre los coches, los urbanistas dan dos consejos: reducir la velocidad a treinta por hora y quitar aparcamiento en superficie.",
                    "Y si echás de menos el verde, buscá un piso cerca de una alameda*.",
                ]},
                {"t": "inst", "text": "Answer the following questions in English."},
                {"t": "short", "lines": 1, "ms": [1, 1, 1, 1, 2], "items": [
                    ("What does living in the centre give you back, apart from the cost of a car?", "The two hours a day other people spend on the road"),
                    ("What should you never do if noise bothers you?", "Rent (a flat) above a bar"),
                    ("What do many people discover after a few months in a city-centre flat?", "That they have nowhere to store anything (the flats are small)"),
                    ("What does a neighbourhood need in order to work?", "Small shops open during the week"),
                    ("What two pieces of advice do town planners give about cars?", "Reduce the speed to 30 km/h; remove on-street parking"),
                ]},
                {"t": "inst", "text": "Read the last sentence again. What is an alameda?"},
                {"t": "mcq", "items": [("", ["A kind of shop.", "A tree-lined walk.", "A block of flats."], 1)]},
            ],
        },
        {
            "n": 5, "title": "Álvaro Peña",
            "lead": "You read this extract from a magazine article about Álvaro Peña, a Spanish basketball player.",
            "blocks": [
                {"t": "text", "es": [
                    "Álvaro Peña es un jugador muy famoso. Creció en una ciudad pequeña de Andalucía y empezó a jugar a los ocho años. Jugó dos temporadas en Italia, donde aprendió un estilo más rápido.",
                    "Álvaro habla con la prensa después de cada partido, pero nunca contesta preguntas sobre su vida privada. Muchos aficionados lo admiran porque entrena con los niños del barrio los sábados.",
                    "En su última entrevista llevaba una gorra* del equipo de su pueblo.",
                ]},
                {"t": "note", "text": "* gorra – cap"},
                {"t": "inst", "text": "Using the information from the text, complete the sentences in English. Write one word in each space."},
                {"t": "example", "text": "Álvaro is a famous player."},
                {"t": "gapbank", "items": [
                    ("Álvaro grew up in a small city in ___ .", "Andalusia"),
                    ("He started playing when he was ___ .", "eight"),
                    ("In Italy he learnt a ___ style.", "faster"),
                    ("On Saturdays Álvaro trains with the ___ of his neighbourhood.", "children"),
                ]},
                {"t": "inst", "text": "Read the last sentence again. What is a gorra?"},
                {"t": "mcq", "items": [("", ["Something you drink.", "Something you wear.", "Something you watch."], 1)]},
            ],
        },
        {
            "n": 6, "title": "Languages at school",
            "lead": "You read an article about language learning in Spanish schools.",
            "blocks": [
                {"t": "options", "items": [
                    "Las familias pagan academias privadas porque creen que en clase no se habla lo suficiente.",
                    "Cada vez más institutos ofrecen chino y árabe junto al francés y al alemán.",
                    "Los alumnos que pasan un trimestre en el extranjero vuelven con mucha más confianza.",
                    "Hay centros que no encuentran profesorado para cubrir las plazas de idiomas.",
                    "Los exámenes siguen premiando la gramática más que la conversación.",
                ]},
                {"t": "inst", "text": "Which statement matches each idea? Write the correct letter in each box."},
                {"t": "letters", "items": [
                    ("A shortage of teaching staff.", "D"),
                    ("A wider choice of languages.", "B"),
                    ("The benefit of time spent abroad.", "C"),
                    ("A criticism of how students are assessed.", "E"),
                ]},
            ],
        },
        {
            "n": 7, "title": "A job for the future",
            "lead": "Two Spanish teenagers say what they would like to do and why.",
            "blocks": [
                {"t": "speakers", "items": [
                    ("Lorena", "A mí me gustaría ser veterinaria de animales grandes. Me crié entre vacas y caballos y no me imagino un despacho."),
                    ("Dani", "Yo quiero dedicarme al diseño de videojuegos. Llevo desde los once años haciendo niveles para mis amigos y nunca me aburre."),
                ]},
                {"t": "inst", "text": "Answer the following questions in English."},
                {"t": "short", "lines": 1, "items": [
                    ("Lorena: job", "A vet (for large animals)"),
                    ("Lorena: reason", "She grew up among cows and horses / she cannot imagine working in an office"),
                    ("Dani: job", "Video game designer"),
                    ("Dani: reason", "He has been making levels for his friends since he was eleven and never gets bored"),
                ]},
            ],
        },
        {
            "n": 8, "title": "Teo’s week",
            "lead": "Teo writes to you about his week.",
            "blocks": [
                {"t": "text", "es": [
                    "El lunes me tocó presentar un trabajo delante de toda la clase. Pasé el fin de semana ensayando y aun así me temblaba la voz.",
                    "El miércoles vino al instituto una ingeniera a contarnos cómo se diseña un puente. Nunca había pensado en esa carrera y ahora no se me va de la cabeza.",
                    "El viernes tenía entradas para el concierto, pero mi hermana se puso enferma y me quedé con ella.",
                    "Lo mejor fue el sábado: mi padre me dejó conducir el tractor por primera vez.",
                ]},
                {"t": "inst", "text": "Complete these sentences. Write the letter for the correct option in each box."},
                {"t": "mcq", "items": [
                    ("On Monday Teo…", ["forgot his work at home.", "spoke in front of the class.", "missed the lesson."], 1),
                    ("The engineer’s visit…", ["bored him.", "confirmed what he already wanted.", "gave him a new idea."], 2),
                    ("On Friday Teo…", ["went to the concert.", "stayed with his sister.", "sold his ticket."], 1),
                    ("Teo says the best moment was…", ["the concert.", "driving the tractor.", "the presentation."], 1),
                ]},
            ],
        },
        {
            "n": 9, "title": "Free time",
            "lead": "Your Spanish friends write to you about what they like to do.",
            "blocks": [
                {"t": "speakers", "items": [
                    ("Inés", "Cada domingo juego al ajedrez en el club con gente de todas las edades. Entre semana, si tengo un rato, hago punto viendo una serie."),
                    ("Hugo", "Me he apuntado a un taller de cerámica los martes. Y los fines de semana salgo a pescar con mi abuelo, aunque casi nunca sacamos nada."),
                ]},
                {"t": "inst", "text": "What two activities does each person mention? Write the correct letters in the boxes."},
                {"t": "options", "items": [
                    "Fishing.", "Knitting.", "Playing chess.", "Pottery.", "Running.", "Watching football.",
                ], "cols": 2},
                {"t": "letters", "m": 2, "items": [("Inés", "B, C"), ("Hugo", "A, D")]},
            ],
        },
    ],
}

SECTION_B = {
    "name": "Section B", "sub": "Translation into English", "total": 10,
    "questions": [
        {
            "n": 10, "title": "Translation",
            "lead": "Translate these sentences into English.",
            "blocks": [
                {"t": "translate", "m": 2, "lines": 2, "items": [
                    ("De pequeña pasaba los veranos en la playa.", "When I was little I used to spend the summers at the beach."),
                    ("Mi primo acaba de mudarse a otro país.", "My cousin has just moved to another country."),
                    ("Ayer vimos una película antigua y nos encantó.", "Yesterday we watched an old film and we loved it."),
                    ("Si pudiera, viajaría por toda Sudamérica.", "If I could, I would travel all over South America."),
                    ("Me molesta que nadie recicle en mi edificio.", "It annoys me that nobody recycles in my building."),
                ]},
            ],
        },
    ],
}

PAPER = shell("aqa_higher", "B", [SECTION_A, SECTION_B])
