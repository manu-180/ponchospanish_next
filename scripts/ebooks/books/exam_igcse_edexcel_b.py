"""Pearson Edexcel International GCSE (9–1) Spanish 4SP1 · Paper 2 · modelo B.

Mismo formato y puntaje que el modelo A (1 hora 45 minutos, 80 puntos), con textos,
temas y tareas distintos. Todo original de Poncho.
"""

from books._exam_paper import shell

SECTION_A = {
    "name": "Section A", "sub": "Lectura · Responde a TODAS las preguntas", "total": 40,
    "questions": [
        {
            "n": 1, "title": "Los modelos a imitar",
            "lead": "Pon una equis en la casilla apropiada.",
            "blocks": [
                {"t": "text", "t_title": "Teo Lamas, panadero", "es": [
                    "En 2015, Teo Lamas cerró la panadería de su familia porque no llegaba a fin de mes. Tres años más tarde la volvió a abrir, esta vez con un horno de leña. Hoy, con treinta y ocho años, vende en seis mercados de la comarca.",
                    "No siempre se entiende con los bancos, pero con sus clientes sí. Los demás panaderos de la zona lo llaman cuando algo les sale mal. Para la alcaldesa del pueblo, Teo es algo más: «Que haya vuelto a encender ese horno nos ha cambiado el sábado a todos. Es un modelo a imitar. Demuestra que cerrar no siempre es el final».",
                ]},
                {"t": "example", "es": True, "text": "Este artículo trata de un pequeño negocio."},
                {"t": "mcq", "items": [
                    ("En 2015 Teo …", ["abrió una panadería.", "cerró la panadería familiar.", "compró un horno.", "se fue del pueblo."], 1),
                    ("Tres años después, Teo …", ["cambió de oficio.", "se jubiló.", "reabrió la panadería.", "se mudó a la ciudad."], 2),
                    ("Hoy Teo vende en …", ["una sola tienda.", "seis mercados.", "tres panaderías.", "internet."], 1),
                    ("Teo no se entiende bien con …", ["sus clientes.", "los bancos.", "la alcaldesa.", "los otros panaderos."], 1),
                    ("Los otros panaderos de la zona …", ["no lo conocen.", "le piden ayuda.", "le hacen la competencia.", "trabajan con él."], 1),
                    ("Según la alcaldesa, lo que ha hecho Teo …", ["no sirvió de nada.", "fue un error.", "ha cambiado el sábado del pueblo.", "costó demasiado dinero."], 2),
                ]},
            ],
        },
        {
            "n": 2, "title": "El aula del futuro",
            "lead": "Contesta las preguntas en español basándote en el texto. Pon la letra adecuada en la casilla.",
            "blocks": [
                {"t": "text", "es": [
                    "¿Te cansas de estar sentado en clase? Tranquilo, porque pronto en España habrá aulas con mesas que suben y bajan para trabajar de pie.",
                    "La mesa Altura usa un pedal en lugar de un botón. Ahora, una mesa escolar pesa unos diez kilos, pero la Altura pesa dieciocho por culpa del mecanismo.",
                    "De momento sólo hay cincuenta aulas con estas mesas; se montan a mano y cuestan el triple que una mesa normal. No son mesas corrientes porque recuerdan la altura de cada alumno.",
                    "Otra ventaja es que, si trabajas en grupo, se juntan sin hacer ruido.",
                ]},
                {"t": "options", "cols": 5, "items": [
                    "pesada", "ligera", "pedal", "botón", "pocas",
                    "grupo", "nadie", "muchas", "altura", "parecida",
                    "diferente", "ruido", "todo el mundo",
                ]},
                {"t": "example", "es": True, "text": "Algunos alumnos quieren una mesa más ligera. → B"},
                {"t": "letters", "items": [
                    ("La mesa Altura lleva un … en lugar de un botón.", "C"),
                    ("Comparada con una mesa escolar normal, la Altura es más …", "A"),
                    ("Hoy en día hay … aulas con estas mesas.", "E"),
                    ("La mesa Altura es … a las mesas corrientes.", "K"),
                    ("La mesa recuerda la … de cada alumno.", "I"),
                    ("Al trabajar en …, las mesas se juntan sin hacer ruido.", "F"),
                ]},
            ],
        },
        {
            "n": 3, "title": "El tiempo libre",
            "lead": "Pon una equis en la casilla correcta para cada afirmación (a)–(h).",
            "blocks": [
                {"t": "speakers", "items": [
                    ("Rocío", "De pequeña pasaba las tardes en la biblioteca del barrio. Los fines de semana iba a clase de guitarra, aunque nunca llegué a tocar bien. En verano mis padres me llevaban al río y aprendí a nadar allí."),
                    ("Simón", "Yo me crié en un club de atletismo: entrenaba cuatro días por semana. Los domingos veíamos películas en casa porque mi madre odiaba el cine. Nunca toqué un instrumento."),
                    ("Vera", "Yo leía muchísimo, sobre todo cómics. También iba a un taller de teatro los jueves y todavía me acuerdo de los nervios del estreno. Del deporte, mejor no hablar: se me daba fatal."),
                ]},
                {"t": "grid", "head": "¿Quién lo dice?", "cols": ["Rocío", "Simón", "Vera"], "items": [
                    ("Pasaba mucho tiempo leyendo.", 2),
                    ("Hacía deporte varias veces por semana.", 1),
                    ("Tocaba un instrumento.", 0),
                    ("Aprendió a nadar fuera de una piscina.", 0),
                    ("Veía películas en casa los domingos.", 1),
                    ("Participaba en una actividad de teatro.", 2),
                    ("Dice que no era bueno en el deporte.", 2),
                    ("Iba a una biblioteca por las tardes.", 0),
                ]},
            ],
        },
        {
            "n": 4, "title": "Las vacaciones",
            "lead": "Escribe apuntes sobre esta opinión. Completa la tabla con palabras en español o con números.",
            "blocks": [
                {"t": "text", "t_title": "No lo recomiendo del todo", "es": [
                    "Iván escribe: Estuvimos cinco noches en este albergue a mediados de abril con un grupo del instituto. La habitación era grande, si bien la primera noche faltaban mantas.",
                    "El desayuno estaba bien, aunque no había fruta. En la cena ponían siempre dos opciones. Las cocineras eran amabilísimas, al revés que el encargado, que contestaba de mala manera.",
                    "La gente de la recepción nos ayudó mucho, sobre todo Olga, que nos consiguió mapas de las rutas.",
                    "El mayor problema era la sala común, donde dos grupos ensayaban una obra a gritos. Era imposible estudiar. Tampoco se podía descansar porque la calefacción hacía un ruido horrible.",
                    "La última queja: las excursiones se explicaban sólo por la mañana temprano, así que los que se levantaban tarde no se enteraban de nada.",
                ]},
                {"t": "example", "es": True, "text": "Alojamiento: albergue"},
                {"t": "table", "ms": [1, 2, 1, 2, 1, 1, 1, 1], "items": [
                    ("Duración de la estancia", "cinco noches"),
                    ("No había (dos cosas)", "mantas (la primera noche); fruta (en el desayuno)"),
                    ("Comida – lo bueno", "siempre había dos opciones en la cena / el desayuno estaba bien"),
                    ("Personas simpáticas (dos)", "las cocineras; Olga, de recepción"),
                    ("Número de grupos que molestaban", "dos"),
                    ("Sala común – lo peor", "ensayaban una obra a gritos / era imposible estudiar"),
                    ("¿Qué hacía ruido por la noche?", "la calefacción"),
                    ("Excursiones – opinión de Iván", "se explicaban sólo temprano y los que se levantaban tarde no se enteraban"),
                ]},
            ],
        },
        {
            "n": 5, "title": "La vida en la costa",
            "lead": "Lee el fragmento del texto sobre un pueblo de pescadores y sus habitantes.",
            "blocks": [
                {"t": "text", "t_title": "La espera", "es": [
                    "Cuando llegó al puerto todavía no había amanecido. Las grúas, altas y quietas, se recortaban contra un cielo de color ceniza.",
                    "El tren la había dejado a dos calles del muelle. Las persianas de la lonja seguían bajadas y una farola iluminaba los charcos helados del suelo.",
                    "Tres hombres con gorros de lana y una mujer con un chaquetón azul esperaban junto a las cajas. La mujer se acercó y le quitó la maleta de la mano.",
                    "—¿Es usted la doctora Arce?",
                    "—Sí.",
                    "—Yo, Pilar Ozores, patrona de barco, para servirle.",
                    "Empezaron a caminar hacia las casas bajas. El viento olía a sal. Pilar Ozores andaba muy rápido, a su lado.",
                    "—Tengo que decirle una cosa, doctora.",
                    "—Usted dirá.",
                    "—Ya sabe que en el pueblo no hay consulta para usted, la médica nueva.",
                    "—Pero a mí me dijeron…",
                    "—¡Sí, le dirían! Mire: el ayuntamiento cerró el local el año pasado. Con la mitad de la flota parada, no hay dinero para arreglar el tejado. Lo siento de verdad. Cuando el mar está malo semanas enteras y nadie sale a faenar, aquí no entra un euro.",
                ]},
                {"t": "inst", "text": "Contesta las preguntas en español basándote en el texto. No necesitas escribir frases completas."},
                {"t": "short", "lines": 2, "ms": [1, 2, 1, 2, 2, 2], "items": [
                    ("¿Por qué sabemos que la lonja está cerrada?", "Las persianas seguían bajadas"),
                    ("¿Cómo sabemos que hace frío? Da dos ideas.", "Hay charcos helados en el suelo; los hombres llevan gorros de lana (la mujer lleva un chaquetón)"),
                    ("¿Qué le quitó de la mano Pilar a la doctora?", "La maleta"),
                    ("¿Quiénes son la doctora Arce y Pilar Ozores? Da dos ideas.", "Ella es la médica nueva; Pilar es patrona de barco"),
                    ("¿Qué no se le puede dar a la doctora Arce? Da dos ideas.", "Una consulta; un local arreglado (el ayuntamiento lo cerró)"),
                    ("¿Qué haría falta para que el pueblo viviera mejor el año que viene? Da dos ideas.", "Que la flota vuelva a faenar; que haya dinero para arreglar el tejado (que el mar no esté malo tantas semanas)"),
                ]},
            ],
        },
    ],
}

SECTION_B = {
    "name": "Section B", "sub": "Escritura · Responde a TODAS las preguntas", "total": 40,
    "questions": [
        {
            "n": 6, "title": "Mi rutina",
            "lead": "Escribe entre 60 y 75 palabras en español sobre «Mi rutina». Debes utilizar todas las palabras mencionadas abajo.",
            "blocks": [
                {"t": "write", "m": 10, "lines": 11,
                 "bank": ["temprano", "autobús", "deberes", "ayer"],
                 "prompt": "Usa las cuatro palabras del recuadro.",
                 "answer": "Modelo (70 palabras): Entre semana me levanto muy temprano, a las siete menos cuarto. "
                           "Desayuno con mi hermana y después cojo el autobús hasta el instituto, que está a "
                           "veinte minutos. Por la tarde hago los deberes en la cocina mientras escucho música. "
                           "Ayer terminé pronto y pude salir a andar con mi perro. Los fines de semana la rutina "
                           "cambia: duermo hasta tarde y no abro ni un libro."},
            ],
        },
        {
            "n": 7, "title": "Elige una tarea",
            "lead": "Elige una de estas tareas y escribe entre 130 y 150 palabras en español. Indica con una equis la pregunta seleccionada.",
            "blocks": [
                {"t": "tasks", "m": 20, "lines": 24, "items": [
                    {"prompt": "Escribe un artículo sobre la tecnología en tu vida. Debes mencionar:", "bullets": [
                        "una vez que la tecnología te ayudó",
                        "las normas sobre los móviles en tu colegio",
                        "tu opinión sobre las redes sociales",
                        "cómo usarás la tecnología en el futuro.",
                    ]},
                    {"prompt": "Escribe una entrada en tu blog sobre el trabajo. Debes mencionar:", "bullets": [
                        "por qué te interesa una profesión en concreto",
                        "la última vez que ayudaste en casa o en un negocio",
                        "si prefieres trabajar solo o en equipo",
                        "qué estudiarás el año que viene.",
                    ]},
                    {"prompt": "Escribe un correo electrónico a un(a) amigo(-a) sobre una fiesta. Debes mencionar:", "bullets": [
                        "una descripción de una fiesta a la que fuiste",
                        "si es importante celebrar las tradiciones",
                        "un problema que hubo durante la fiesta",
                        "qué harás para celebrar tu próximo cumpleaños.",
                    ]},
                ], "answer":
                    "Modelo de la Opción 2 (146 palabras): Desde hace un par de años me interesa la enfermería, "
                    "sobre todo porque me gusta estar con gente y resolver problemas en el momento.\n"
                    "El verano pasado eché una mano en la farmacia de mi tía durante tres semanas. Ordenaba cajas "
                    "y atendía el teléfono, y aprendí muchísimo escuchando cómo hablaba ella con los clientes "
                    "mayores.\n"
                    "Prefiero trabajar en equipo, aunque reconozco que a veces es más lento. Cuando estoy sola me "
                    "concentro mejor, pero con otras personas se me ocurren más ideas y el día se hace corto.\n"
                    "El año que viene estudiaré biología y química, que son las asignaturas que piden para entrar, "
                    "y haré un curso de primeros auxilios los sábados.\n"
                    "(Las otras dos opciones se corrigen con los mismos criterios: cubrir los cuatro puntos, "
                    "usar tres tiempos verbales y dar opiniones justificadas.)"},
            ],
        },
        {
            "n": 8, "title": "El deporte escolar",
            "lead": "Corrige las palabras (a)–(j). Deben estar de acuerdo con la frase. ¡Ojo! No siempre es necesario cambiar la palabra.",
            "blocks": [
                {"t": "text", "t_title": "La liga de los recreos", "es": [
                    "En el colegio San Benito, en Costa Rica, creen que moverse es tan importante como estudiar y cada curso los alumnos (a) [organizar] una liga de los recreos (b) [abierto] a todos. El mes pasado, cinco equipos (c) [jugar] la final y usaron el patio nuevo para (d) [montar] una cancha que nosotros (e) [poder] seguir usando.",
                    "La liga del colegio San Benito es (f) [sencillo] pero divertida y (g) [estar] entre las actividades (h) [preferido] del curso. La entrega de medallas se celebrará el viernes y los cinco capitanes (i) [recibir] un diploma si el jurado (j) [haber] contado bien los puntos.",
                ]},
                {"t": "correct", "items": [
                    ("organizar", "organizan"),
                    ("abierto", "abierta"),
                    ("jugar", "jugaron"),
                    ("montar", "montar"),
                    ("poder", "podemos"),
                    ("sencillo", "sencilla"),
                    ("estar", "está"),
                    ("preferido", "preferidas"),
                    ("recibir", "recibirán"),
                    ("haber", "ha"),
                ]},
            ],
        },
    ],
}

PAPER = shell("igcse_edexcel", "B", [SECTION_A, SECTION_B])
