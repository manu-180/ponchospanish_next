"""AQA GCSE Spanish 8692 · Paper 3 Reading · Foundation tier · modelo B.

Mismo formato y puntaje que el modelo A (45 minutos, 50 puntos), con textos, temas y
preguntas distintos. Todo original de Poncho.
"""

from books._exam_paper import shell

SECTION_A = {
    "name": "Section A", "sub": "Reading comprehension", "total": 40,
    "questions": [
        {
            "n": 1, "title": "After school",
            "lead": "Read what these teenagers say about what they want to study.",
            "blocks": [
                {"t": "speakers", "items": [
                    ("Pablo", "Quiero estudiar informática en la universidad."),
                    ("Irene", "Me encantaría ser enfermera."),
                    ("Gael", "Voy a estudiar arquitectura."),
                ]},
                {"t": "inst", "text": "What does each teenager want to study? Write the correct letter in each box."},
                {"t": "options", "items": ["Architecture", "Computing", "History", "Nursing", "Tourism"], "cols": 2},
                {"t": "letters", "items": [("Pablo", "B"), ("Irene", "D"), ("Gael", "A")]},
            ],
        },
        {
            "n": 2, "title": "Recycling at home",
            "lead": "Read this information about recycling.",
            "blocks": [
                {"t": "text", "es": [
                    "Separar la basura en casa es fácil y ahorra mucha energía, pero el problema principal es que casi nadie lava los envases antes de tirarlos.",
                    "Las familias deben entender que el papel sucio no se puede reciclar.",
                    "Los supermercados tienen más responsabilidad que los clientes, porque ellos eligen el plástico de los productos.",
                ]},
                {"t": "inst", "text": "Answer the following questions in English."},
                {"t": "short", "lines": 1, "items": [
                    ("What does separating your rubbish at home save?", "A lot of energy"),
                    ("What is the main problem mentioned?", "Almost nobody washes the containers before throwing them away"),
                    ("What must families understand?", "That dirty paper cannot be recycled"),
                    ("Why are supermarkets more responsible than customers?", "Because they choose the plastic the products come in"),
                ]},
            ],
        },
        {
            "n": 3, "title": "Food at home",
            "lead": "You see an online forum. Some Spanish teenagers are writing about food.",
            "blocks": [
                {"t": "speakers", "items": [
                    ("Alba", "Desayuno fruta todos los días porque hago atletismo. Mi padre cocina fatal, así que los domingos cocino yo."),
                    ("Bruno", "No me gusta la verdura, aunque sé que es sana. En mi casa cenamos muy tarde, a las diez."),
                    ("Clara", "Soy vegetariana desde los doce años. Mi abuela me enseñó a hacer una tortilla buenísima."),
                ]},
                {"t": "inst", "text": "Write A for Alba, B for Bruno or C for Clara. Write the correct letter in each box."},
                {"t": "letters", "items": [
                    ("Who does not eat meat?", "C"),
                    ("Who mentions the time of a meal?", "B"),
                    ("Who does sport?", "A"),
                    ("Who learnt to cook from a relative?", "C"),
                ]},
            ],
        },
        {
            "n": 4, "title": "Álvaro Peña",
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
            "n": 5, "title": "Living in Ronda",
            "lead": "Pilar writes to you about Ronda, a town in the south of Spain.",
            "blocks": [
                {"t": "text", "es": [
                    "Ronda es un pueblo tranquilo y muy antiguo.",
                    "Los restaurantes son buenísimos, aunque hay pocos.",
                    "Mi sitio preferido es el puente viejo: está sobre un barranco enorme y las vistas quitan el aliento. Se puede visitar a cualquier hora.",
                    "El museo del vino abre todos los días y es carísimo.",
                ]},
                {"t": "inst", "text": "What does she say? Write A if only statement A is correct, B if only statement B is correct, A + B if both statements are correct."},
                {"t": "ab", "items": [
                    ("Pilar thinks that Ronda is…", "quiet.", "modern.", "A"),
                    ("The restaurants in Ronda are…", "numerous.", "excellent.", "B"),
                    ("The old bridge…", "has breathtaking views.", "can be visited at any time.", "A + B"),
                    ("The wine museum is…", "open every day.", "cheap.", "A"),
                ]},
            ],
        },
        {
            "n": 6, "title": "Newspaper headlines",
            "lead": "You read some headlines in a Spanish newspaper.",
            "blocks": [
                {"t": "options", "items": [
                    "El instituto organiza una carrera para ayudar al hospital.",
                    "Abre la biblioteca más grande de la provincia.",
                    "Los vecinos piden más carriles bici en el centro.",
                    "El equipo femenino gana la liga por primera vez.",
                    "Vuelve el mercado de libros usados a la plaza mayor.",
                ]},
                {"t": "inst", "text": "Which headline matches each description? Write the correct letter in each box."},
                {"t": "letters", "items": [
                    ("A sporting success.", "D"),
                    ("A request about cycling.", "C"),
                    ("A charity event.", "A"),
                ]},
            ],
        },
        {
            "n": 7, "title": "Holidays",
            "lead": "You see this brochure about Tenerife, one of the Canary Islands.",
            "blocks": [
                {"t": "text", "es": [
                    "Hay que subir al Teide*. El teleférico funciona todo el año y desde arriba se ven las otras islas.",
                    "Aunque las playas del sur están llenas en agosto, las del norte son más tranquilas. El agua está fresca.",
                    "No te pierdas el carnaval de febrero: los desfiles duran cuatro días y empiezan a las ocho de la noche.",
                    "La comida es sencilla y rica. Las papas con mojo son famosas y el pescado es barato, pero la fruta cuesta bastante.",
                ]},
                {"t": "note", "text": "* el Teide – a volcano on Tenerife."},
                {"t": "inst", "text": "Complete these sentences. Write the letter for the correct option in each box."},
                {"t": "mcq", "items": [
                    ("The cable car to the Teide…", ["only runs in summer.", "works all year.", "is closed in winter."], 1),
                    ("In August the beaches in the south…", ["are crowded.", "are quiet.", "are closed."], 0),
                    ("The carnival parades…", ["last four days.", "start in the morning.", "happen in August."], 0),
                    ("In Tenerife…", ["fish is expensive.", "fruit costs quite a lot.", "nobody eats potatoes."], 1),
                ]},
            ],
        },
        {
            "n": 8, "title": "The school trip",
            "lead": "In an online forum, Noa and Iván post about a school trip to Salamanca.",
            "blocks": [
                {"t": "speakers", "items": [
                    ("Noa", "Ahora mismo estoy en la plaza sacando fotos del edificio de la universidad. Esta noche me voy a acostar pronto."),
                    ("Iván", "Ayer visitamos la catedral con una guía muy simpática. Hoy no hago nada porque me duele la cabeza."),
                ]},
                {"t": "inst", "text": "What activities do Noa and Iván do, and when? Write the correct number for the activity and the correct letter for when they do it."},
                {"t": "legend", "cols": 2, "items": [
                    "1 Visiting the cathedral.", "2 Taking photographs.",
                    "3 Having dinner together.", "4 Buying souvenirs.",
                ]},
                {"t": "legend", "cols": 3, "items": ["P Past", "N Now", "F Future"]},
                {"t": "letters", "items": [
                    ("Noa’s activity", "2"), ("When", "N"),
                    ("Iván’s activity", "1"), ("When", "P"),
                ]},
            ],
        },
        {
            "n": 9, "title": "A weekend in Seville",
            "lead": "You read a website about four places in Seville. People are posting reviews.",
            "blocks": [
                {"t": "speakers", "items": [
                    ("The royal gardens", "Los jardines son preciosos y la entrada no cuesta nada los lunes."),
                    ("The river boat", "El paseo fue relajante, pero el guía hablaba tan bajo que no entendimos casi nada."),
                    ("The tower", "Subir los escalones me dejó agotada. Desde arriba se ve toda la ciudad y eso lo compensa todo."),
                    ("The food market", "Fuimos a las cuatro y todos los puestos estaban cerrados. Una pérdida de tiempo."),
                    ("Later that evening", "En la plaza un grupo tocaba el cajón* y la gente aplaudía."),
                ]},
                {"t": "inst", "text": "What opinions do people give about each visit? Write P for a positive opinion, N for a negative opinion, P + N for a positive and a negative opinion."},
                {"t": "letters", "items": [
                    ("The royal gardens.", "P"),
                    ("The river boat.", "P + N"),
                    ("The tower.", "P + N"),
                    ("The food market.", "N"),
                ]},
                {"t": "inst", "text": "Read the last sentence again. What is a cajón?"},
                {"t": "mcq", "items": [("", ["A kind of food.", "A musical instrument.", "A type of boat."], 1)]},
            ],
        },
        {
            "n": 10, "title": "Free time",
            "lead": "Your Spanish friends write to you about what they like to do.",
            "blocks": [
                {"t": "speakers", "items": [
                    ("Rubén", "Los sábados por la mañana juego al balonmano en el polideportivo. Luego quedo con mis amigos en el cine si hay una película nueva."),
                    ("Marta", "Entre semana toco la batería en el garaje de mi tío. Los domingos salgo a correr por la playa con mi madre."),
                ]},
                {"t": "inst", "text": "What two activities does each person mention? Write the correct letters in the boxes."},
                {"t": "options", "items": [
                    "Going running.", "Going to the cinema.", "Playing handball.", "Playing the drums.", "Playing video games.", "Swimming.",
                ], "cols": 2},
                {"t": "letters", "m": 2, "items": [("Rubén", "B, C"), ("Marta", "A, D")]},
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
                    ("Mi barrio es muy ruidoso.", "My neighbourhood is very noisy."),
                    ("Me gusta jugar al tenis con mi hermano.", "I like to play / playing tennis with my brother."),
                    ("Voy a estudiar más este año.", "I am going to study more this year."),
                    ("Nunca llego tarde a clase.", "I am never late for class."),
                    ("El verano pasado visitamos a nuestros abuelos.", "Last summer we visited our grandparents."),
                ]},
            ],
        },
    ],
}

PAPER = shell("aqa_foundation", "B", [SECTION_A, SECTION_B])
