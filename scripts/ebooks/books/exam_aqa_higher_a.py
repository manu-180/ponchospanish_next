"""AQA GCSE Spanish 8692 · Paper 3 Reading · Higher tier · modelo A.

Formato y puntaje: sample assessment material set 2 de AQA (1 hora, 50 puntos,
Sección A de comprensión 40 puntos y Sección B de traducción al inglés 10 puntos).
Los textos y las preguntas son originales de Poncho.
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
                    "Los institutos de la región prohíben los envases de un solo uso en las cafeterías.",
                    "El ayuntamiento abrirá una residencia para mayores antes de marzo.",
                    "Récord de público en la final de balonmano femenino.",
                    "Los agricultores venderán sus productos los domingos en la plaza.",
                    "Una antigua fábrica se convertirá en un centro cultural para jóvenes.",
                ]},
                {"t": "inst", "text": "Which headline matches each description? Write the correct letter in each box."},
                {"t": "letters", "items": [
                    ("News about a local market.", "D"),
                    ("News about a sports competition.", "C"),
                    ("An environmental decision.", "A"),
                ]},
            ],
        },
        {
            "n": 2, "title": "Technology",
            "lead": "You see an online forum. Some Spanish students are writing about the technology they use.",
            "blocks": [
                {"t": "speakers", "items": [
                    ("Ariadna", "Antes pasaba horas con la consola, pero ya casi no la enciendo porque este año tengo exámenes. La Red está llena de datos útiles, aunque conviene comprobar de dónde salen."),
                    ("Bruno", "Llevo años programando y todavía me divierte. Desde que el gimnasio cerró, sigo clases de yoga en línea en el salón de casa."),
                    ("Cecilia", "Casi todos mis deberes los hago en la tableta. Hay páginas con exámenes antiguos que me vienen genial. Para hablar con mi familia uso el móvil, que llevo siempre encima."),
                ]},
                {"t": "inst", "text": "Write A for Ariadna, B for Bruno or C for Cecilia. Write the correct letter in each box."},
                {"t": "letters", "items": [
                    ("Who exercises at home?", "B"),
                    ("Who warns that information online should be checked?", "A"),
                    ("Who always carries a device with them?", "C"),
                    ("Who has been doing the same activity for years?", "B"),
                    ("Who uses the internet to prepare for exams?", "C"),
                ]},
            ],
        },
        {
            "n": 3, "title": "Holidays",
            "lead": "You see this brochure about Extremadura, a region in the west of Spain.",
            "blocks": [
                {"t": "text", "es": [
                    "Merece la pena recorrer Monfragüe*. Hay rutas señalizadas y, con unos prismáticos, se ven águilas casi todo el día.",
                    "Aunque en julio el calor puede ser agobiante, las piscinas naturales de los ríos están frías incluso en pleno verano. Hay que llegar temprano porque se llenan.",
                    "El 23 de abril, en Cáceres*, hay mercado medieval desde las diez y conciertos gratuitos hasta la medianoche.",
                    "La comida es contundente. El jamón de la zona es conocido en todo el mundo y no es nada barato; las migas, en cambio, cuestan muy poco.",
                ]},
                {"t": "note", "text": "* Monfragüe, Cáceres – a national park and a city in Extremadura."},
                {"t": "inst", "text": "Complete these sentences. Write the letter for the correct option in each box."},
                {"t": "mcq", "items": [
                    ("In Monfragüe you need binoculars to…", ["follow the paths.", "see the eagles.", "find the entrance."], 1),
                    ("The natural pools…", ["are warm in summer.", "are empty in July.", "fill up quickly."], 2),
                    ("On 23 April in Cáceres the concerts…", ["cost nothing.", "start at midnight.", "are in the market."], 0),
                    ("In Extremadura…", ["the ham is cheap.", "the migas are cheap.", "the food is light."], 1),
                ]},
            ],
        },
        {
            "n": 4, "title": "Sleep and study",
            "lead": "You read this article about how to study well.",
            "blocks": [
                {"t": "text", "es": [
                    "Dormir lo suficiente no sólo te quita el cansancio: ayuda a fijar en la memoria todo lo que estudiaste durante el día.",
                    "Si ya te cuesta concentrarte, lo peor que puedes hacer es estudiar con música con letra: el cerebro intenta seguir las palabras y pierde el hilo.",
                    "Beber poca agua provoca dolores de cabeza al cabo de un par de horas, y entonces ya no hay repaso que valga.",
                    "Para que el sueño sea de calidad conviene acostarse siempre a la misma hora.",
                    "En cuanto a los aparatos electrónicos, hay dos consejos: déjalos fuera del dormitorio y apágalos una hora antes de dormir.",
                    "Si nada de esto funciona, prueba a estudiar caminando: el senderismo* corto antes de repasar despeja la cabeza.",
                ]},
                {"t": "inst", "text": "Answer the following questions in English."},
                {"t": "short", "lines": 1, "ms": [1, 1, 1, 1, 2], "items": [
                    ("What does sleeping enough help you do, apart from feeling less tired?", "It helps fix in your memory what you studied during the day"),
                    ("What should you avoid if you already find it hard to concentrate?", "Studying with music that has lyrics / words"),
                    ("What happens if you do not drink enough water?", "You get headaches after a couple of hours"),
                    ("What should you do to improve the quality of your sleep?", "Always go to bed at the same time"),
                    ("What two pieces of advice are given about electronic devices?", "Leave them out of the bedroom; switch them off an hour before sleeping"),
                ]},
                {"t": "inst", "text": "Read the last sentence again. What is senderismo?"},
                {"t": "mcq", "items": [("", ["A kind of music.", "A kind of food.", "An outdoor activity."], 2)]},
            ],
        },
        {
            "n": 5, "title": "Nerea Soler",
            "lead": "You read this extract from a magazine article about Nerea Soler, a Spanish singer.",
            "blocks": [
                {"t": "text", "es": [
                    "Nerea Soler es una cantante muy conocida. Nació en un pueblo de Galicia y hoy vive en Madrid. Pasó tres años en México, donde descubrió instrumentos nuevos.",
                    "Nerea tiene millones de seguidores, pero este año ha decidido publicar menos fotos de su familia. Algunos periodistas la critican porque casi nunca da entrevistas.",
                    "En su último concierto llevaba un collar* enorme que le regaló su abuela.",
                ]},
                {"t": "note", "text": "* collar – necklace"},
                {"t": "inst", "text": "Using the information from the text, complete the sentences in English. Write one word in each space."},
                {"t": "example", "text": "Nerea is a well-known singer."},
                {"t": "gapbank", "items": [
                    ("Nerea was born in a village in ___ .", "Galicia"),
                    ("In Mexico Nerea ___ new instruments.", "discovered"),
                    ("This year, Nerea has published ___ photos of her family.", "fewer"),
                    ("Journalists criticise Nerea because she hardly ever gives ___ .", "interviews"),
                ]},
                {"t": "inst", "text": "Read the last sentence again. What is a collar?"},
                {"t": "mcq", "items": [("", ["Something you eat.", "Something you wear.", "Something you read."], 1)]},
            ],
        },
        {
            "n": 6, "title": "Leaving home",
            "lead": "You read an article about young people in Spain and the age at which they leave home.",
            "blocks": [
                {"t": "options", "items": [
                    "Los alquileres de las ciudades grandes suben más rápido que los sueldos de los recién titulados.",
                    "Cada vez más estudiantes eligen la facultad que tienen a veinte minutos de casa.",
                    "Vivir con los padres hasta los treinta ya no se considera un fracaso.",
                    "Tres de cada cuatro jóvenes dicen que ven a sus abuelos al menos una vez por semana.",
                    "Las empresas ofrecen contratos de tres meses que no permiten planificar nada.",
                ]},
                {"t": "inst", "text": "Which statement matches each idea? Write the correct letter in each box."},
                {"t": "letters", "items": [
                    ("Closer contact with grandparents.", "D"),
                    ("Difficulties for young people finding stable work.", "E"),
                    ("A change in what society expects.", "C"),
                    ("Studying at the nearest university.", "B"),
                ]},
            ],
        },
        {
            "n": 7, "title": "Where would you live?",
            "lead": "Two Spanish teenagers say where they would like to live and why.",
            "blocks": [
                {"t": "speakers", "items": [
                    ("Jimena", "Si pudiera elegir, me iría a vivir a una isla pequeña. No soporto el ruido de la ciudad y allí se duerme con la ventana abierta."),
                    ("Óscar", "Yo me mudaría a Buenos Aires sin pensarlo. Hay teatros, librerías y conciertos cada noche, y aquí en mi pueblo no pasa nada."),
                ]},
                {"t": "inst", "text": "Answer the following questions in English."},
                {"t": "short", "lines": 1, "items": [
                    ("Jimena: place", "A small island"),
                    ("Jimena: reason", "She cannot stand the noise of the city / you can sleep with the window open"),
                    ("Óscar: place", "Buenos Aires"),
                    ("Óscar: reason", "There are theatres, bookshops and concerts every night / nothing happens in his village"),
                ]},
            ],
        },
        {
            "n": 8, "title": "María’s weekend",
            "lead": "María writes to you about her weekend.",
            "blocks": [
                {"t": "text", "es": [
                    "El fin de semana pasado tuve que quedarme en casa: mi madre estaba de viaje y alguien tenía que cuidar a mi hermano pequeño.",
                    "El sábado me levanté a las once, algo rarísimo en mí, porque la noche anterior terminé un trabajo de historia a las dos de la mañana.",
                    "El domingo era la excursión del instituto a la sierra y, aunque llevaba meses esperándola, al final la anularon por la tormenta.",
                    "No me quejo: hacía semanas que no leía un libro entero y por fin lo conseguí.",
                ]},
                {"t": "inst", "text": "Complete these sentences. Write the letter for the correct option in each box."},
                {"t": "mcq", "items": [
                    ("Last weekend, María…", ["went away with her mother.", "stayed at home.", "looked after a neighbour."], 1),
                    ("On Saturday María got up…", ["earlier than usual.", "at her usual time.", "later than usual."], 2),
                    ("The school trip…", ["was cancelled.", "was moved to Saturday.", "went ahead in the rain."], 0),
                    ("María says that…", ["she had a terrible weekend.", "she finally finished a book.", "she never reads."], 1),
                ]},
            ],
        },
        {
            "n": 9, "title": "Free time",
            "lead": "Your Spanish friends write to you about what they like to do.",
            "blocks": [
                {"t": "speakers", "items": [
                    ("Rosa", "Desde que me regalaron la cámara no paro de hacer fotos de pájaros. Los jueves, además, canto en un coro con mi vecina."),
                    ("Gonzalo", "Los fines de semana subo a la montaña con mi grupo de senderismo. Si llueve me quedo en casa pintando acuarelas."),
                ]},
                {"t": "inst", "text": "What two activities does each person mention? Write the correct letters in the boxes."},
                {"t": "options", "items": [
                    "Hiking in the mountains.", "Painting.", "Playing an instrument.", "Singing in a choir.",
                    "Taking photographs.", "Watching birds on television.",
                ], "cols": 2},
                {"t": "letters", "m": 2, "items": [("Rosa", "D, E"), ("Gonzalo", "A, B")]},
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
                    ("Cuando era pequeño vivía en el campo.", "When I was little / young I used to live in the countryside."),
                    ("Mi hermana acaba de encontrar trabajo en una tienda.", "My sister has just found a job in a shop."),
                    ("Anoche fuimos al cumpleaños de mi prima y lo pasamos genial.", "Last night we went to my cousin’s birthday and we had a great time."),
                    ("Si tuviera más tiempo, aprendería a tocar el piano.", "If I had more time, I would learn to play the piano."),
                    ("Me preocupa que los jóvenes lean cada vez menos.", "It worries me that young people read less and less."),
                ]},
            ],
        },
    ],
}

PAPER = shell("aqa_higher", "A", [SECTION_A, SECTION_B])
