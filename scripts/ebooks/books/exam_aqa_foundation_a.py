"""AQA GCSE Spanish 8692 · Paper 3 Reading · Foundation tier · modelo A.

Formato y puntaje: sample assessment material set 2 de AQA (45 minutos, 50 puntos,
Sección A de comprensión 40 puntos y Sección B de traducción al inglés 10 puntos).
Los textos y las preguntas son originales de Poncho.
"""

from books._exam_paper import shell

SECTION_A = {
    "name": "Section A", "sub": "Reading comprehension", "total": 40,
    "questions": [
        {
            "n": 1, "title": "Part-time jobs",
            "lead": "Read what these teenagers say about their weekend jobs.",
            "blocks": [
                {"t": "speakers", "items": [
                    ("Nuria", "Los sábados trabajo en una panadería."),
                    ("Dani", "Ayudo a mi tío en su granja."),
                    ("Sofía", "Cuido a los niños de mis vecinos."),
                ]},
                {"t": "inst", "text": "Where does each teenager work? Write the correct letter in each box."},
                {"t": "options", "items": ["At a bakery", "At a farm", "At a hotel", "At a shop", "In a family home"], "cols": 2},
                {"t": "letters", "items": [("Nuria", "A"), ("Dani", "B"), ("Sofía", "E")]},
            ],
        },
        {
            "n": 2, "title": "Healthy habits",
            "lead": "Read this information about staying healthy.",
            "blocks": [
                {"t": "text", "es": [
                    "Desayunar bien te da energía para toda la mañana, pero el problema principal es que muchos jóvenes salen de casa sin comer nada.",
                    "Los adolescentes deben entender que dormir ocho horas es tan importante como hacer deporte.",
                    "Los padres pueden ayudar más que los profesores, porque deciden qué comida hay en casa.",
                ]},
                {"t": "inst", "text": "Answer the following questions in English."},
                {"t": "short", "lines": 1, "items": [
                    ("What does a good breakfast give you?", "Energy (for the whole morning)"),
                    ("What is the main problem mentioned?", "Many young people leave home without eating anything"),
                    ("What must teenagers understand?", "That sleeping eight hours is as important as doing sport"),
                    ("Why can parents help more than teachers?", "Because they decide what food there is at home"),
                ]},
            ],
        },
        {
            "n": 3, "title": "School life",
            "lead": "You see an online forum. Some Spanish students are writing about their school.",
            "blocks": [
                {"t": "speakers", "items": [
                    ("Ana", "Mi asignatura preferida es el dibujo porque soy creativa. Las clases empiezan muy temprano y siempre llego cansada."),
                    ("Borja", "Odio los exámenes de química, pero el laboratorio es nuevo y moderno. Mi profesora explica todo con mucha paciencia."),
                    ("Celia", "Lo mejor de mi instituto es el club de teatro de los jueves. Las aulas son pequeñas y hace mucho calor en verano."),
                ]},
                {"t": "inst", "text": "Write A for Ana, B for Borja or C for Celia. Write the correct letter in each box."},
                {"t": "letters", "items": [
                    ("Who complains about the temperature?", "C"),
                    ("Who praises a teacher?", "B"),
                    ("Who arrives at school tired?", "A"),
                    ("Who mentions an after-school activity?", "C"),
                ]},
            ],
        },
        {
            "n": 4, "title": "Nerea Soler",
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
            "n": 5, "title": "Living in Valencia",
            "lead": "Marcos writes to you about Valencia, a city on the east coast of Spain.",
            "blocks": [
                {"t": "text", "es": [
                    "Valencia es una ciudad grande y muy animada.",
                    "Hay mercados preciosos, aunque los precios suben en verano.",
                    "Mi lugar favorito es el parque que pasa por el centro: es larguísimo y está lleno de árboles. No hay que pagar para entrar.",
                    "El acuario es el más grande de Europa, pero las entradas cuestan mucho dinero.",
                ]},
                {"t": "inst", "text": "What does he say? Write A if only statement A is correct, B if only statement B is correct, A + B if both statements are correct."},
                {"t": "ab", "items": [
                    ("Marcos thinks that Valencia is…", "lively.", "small.", "A"),
                    ("The markets in Valencia are…", "always cheap.", "beautiful.", "B"),
                    ("The park…", "is very long.", "is free to enter.", "A + B"),
                    ("The aquarium is…", "the biggest in Europe.", "cheap to visit.", "A"),
                ]},
            ],
        },
        {
            "n": 6, "title": "Newspaper headlines",
            "lead": "You read some headlines in a Spanish newspaper.",
            "blocks": [
                {"t": "options", "items": [
                    "Los alumnos del instituto plantan cien árboles en el parque.",
                    "La nueva piscina municipal abrirá en septiembre.",
                    "Récord de visitantes en el museo de la ciudad.",
                    "El autobús al hospital será gratis para los mayores.",
                    "Una familia de la región gana el concurso de cocina.",
                ]},
                {"t": "inst", "text": "Which headline matches each description? Write the correct letter in each box."},
                {"t": "letters", "items": [
                    ("News about free transport.", "D"),
                    ("An environmental project.", "A"),
                    ("News about a cookery competition.", "E"),
                ]},
            ],
        },
        {
            "n": 7, "title": "Holidays",
            "lead": "You see this brochure about Asturias, a region in the north of Spain.",
            "blocks": [
                {"t": "text", "es": [
                    "Hay que caminar por los Picos de Europa*. Los senderos son tranquilos y los pueblos de piedra son encantadores.",
                    "Aunque el agua del mar está fría casi todo el año, las playas son perfectas para el surf. El viento puede ser un problema.",
                    "No se puede perder el festival de Oviedo* el 8 de septiembre: hay conciertos gratuitos en tres plazas desde las seis de la tarde.",
                    "La comida es excelente. En Asturias se come muchísimo queso y el pescado es fresco, pero la carne es cara.",
                ]},
                {"t": "note", "text": "* Picos de Europa, Oviedo – a mountain range and a city in Asturias."},
                {"t": "inst", "text": "Complete these sentences. Write the letter for the correct option in each box."},
                {"t": "mcq", "items": [
                    ("In the Picos de Europa…", ["the paths are quiet.", "the villages are modern.", "there are no walks."], 0),
                    ("On the beaches of Asturias…", ["the sea is warm.", "surfing is possible.", "surfing is forbidden."], 1),
                    ("At the Oviedo festival the concerts…", ["cost very little.", "are in one square.", "are free."], 2),
                    ("In Asturias…", ["meat is expensive.", "people eat little cheese.", "the fish is frozen."], 0),
                ]},
            ],
        },
        {
            "n": 8, "title": "The Fiesta de la Vendimia",
            "lead": "In an online forum, Lucía and Tomás post about a grape harvest festival in Argentina.",
            "blocks": [
                {"t": "speakers", "items": [
                    ("Lucía", "La fiesta empezó ayer. Anoche fui al concierto en la plaza y canté durante tres horas. Mañana voy a descansar."),
                    ("Tomás", "Estoy aquí en la calle mirando el desfile de carrozas. Esta tarde pienso descansar un rato en casa de mi tía."),
                ]},
                {"t": "inst", "text": "What activities do Lucía and Tomás do, and when? Write the correct number for the activity and the correct letter for when they do it."},
                {"t": "legend", "cols": 2, "items": [
                    "1 Going to a concert.", "2 Watching the parade.",
                    "3 Trying typical food.", "4 Dancing in the square.",
                ]},
                {"t": "legend", "cols": 3, "items": ["P Past", "N Now", "F Future"]},
                {"t": "letters", "items": [
                    ("Lucía’s activity", "1"), ("When", "P"),
                    ("Tomás’s activity", "2"), ("When", "N"),
                ], "ms": [1, 1, 1, 1]},
            ],
        },
        {
            "n": 9, "title": "Mexico City",
            "lead": "You read a website about four places to visit in Mexico City. People are posting reviews.",
            "blocks": [
                {"t": "speakers", "items": [
                    ("The cathedral", "Es un edificio impresionante y entrar es gratis."),
                    ("The floating gardens", "El paseo en barca fue divertido, pero había demasiada gente y no pudimos ver nada."),
                    ("The pyramids", "Subir fue cansado y el sol era fuerte. Las vistas desde arriba me encantaron."),
                    ("The craft market", "Llegamos a las nueve y la mayoría de los puestos estaban cerrados. Qué pena."),
                    ("Later that evening", "Al final del día escuchamos a un grupo tocar la jarana* y toda la plaza bailaba."),
                ]},
                {"t": "inst", "text": "What opinions do people give about each visit? Write P for a positive opinion, N for a negative opinion, P + N for a positive and a negative opinion."},
                {"t": "letters", "items": [
                    ("The cathedral.", "P"),
                    ("The floating gardens.", "P + N"),
                    ("The pyramids.", "P + N"),
                    ("The craft market.", "N"),
                ]},
                {"t": "inst", "text": "Read the last sentence again. What is a jarana?"},
                {"t": "mcq", "items": [("", ["A musical instrument.", "A dance.", "A drink."], 0)]},
            ],
        },
        {
            "n": 10, "title": "Free time",
            "lead": "Your Spanish friends write to you about what they like to do.",
            "blocks": [
                {"t": "speakers", "items": [
                    ("Elena", "Los domingos monto a caballo en el campo con mi prima. Por la tarde leo novelas en mi habitación, sobre todo si llueve."),
                    ("Mateo", "Entre semana juego al ajedrez en línea con mis amigos. Los sábados mi padre me lleva a la piscina."),
                ]},
                {"t": "inst", "text": "What two activities does each person mention? Write the correct letters in the boxes."},
                {"t": "options", "items": [
                    "Going swimming.", "Horse riding.", "Playing chess.", "Playing the guitar.", "Reading books.", "Watching films.",
                ], "cols": 2},
                {"t": "letters", "m": 2, "items": [("Elena", "B, E"), ("Mateo", "A, C")]},
            ],
        },
    ],
}

SECTION_B = {
    "name": "Section B", "sub": "Translation into English", "total": 10,
    "questions": [
        {
            "n": 11, "title": "Translation",
            "lead": "Translate these sentences into English.",
            "blocks": [
                {"t": "translate", "m": 2, "lines": 2, "items": [
                    ("Mi colegio es bastante nuevo.", "My school is quite new."),
                    ("Me gusta pasear por el parque los domingos.", "I like to walk / walking in the park on Sundays."),
                    ("Voy a beber más agua.", "I am going to drink more water."),
                    ("Siempre ayudo a limpiar la cocina.", "I always help to clean the kitchen."),
                    ("La semana pasada mi hermana compró una bicicleta.", "Last week my sister bought a bicycle."),
                ]},
            ],
        },
    ],
}

PAPER = shell("aqa_foundation", "A", [SECTION_A, SECTION_B])
