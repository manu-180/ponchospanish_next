"""Pearson Edexcel International GCSE (9–1) Spanish 4SP1 · Paper 2 · modelo A.

Formato y puntaje: el papel 4SP1/02 de junio de 2025 (1 hora 45 minutos, 80 puntos;
Sección A de lectura 40 puntos y Sección B de escritura 40 puntos, con unos 52 minutos
para cada sección). Las preguntas de la Sección A se contestan en español.
Los textos y las preguntas son originales de Poncho.
"""

from books._exam_paper import shell

SECTION_A = {
    "name": "Section A", "sub": "Lectura · Responde a TODAS las preguntas", "total": 40,
    "questions": [
        {
            "n": 1, "title": "Los modelos a imitar",
            "lead": "Pon una equis en la casilla apropiada.",
            "blocks": [
                {"t": "text", "t_title": "Rosa Ferrán, bombera", "es": [
                    "En 2019, Rosa Ferrán fue la primera mujer en dirigir un parque de bomberos en su provincia. Dos años después lo dejó para formar a los que empezaban. Hoy, con cincuenta y cuatro años, ha vuelto al trabajo de calle.",
                    "No siempre se entiende con los políticos, pero con sus compañeros sí. El resto de los equipos de la región la consideran un ejemplo. Para el jefe regional, Rosa es algo más: «Que Rosa esté otra vez en un camión es una noticia buenísima para el servicio. Es un modelo a imitar. Demuestra que la experiencia no se tira a la basura».",
                ]},
                {"t": "example", "es": True, "text": "Este artículo trata de una profesional conocida."},
                {"t": "mcq", "items": [
                    ("En 2019 Rosa …", ["se jubiló.", "dirigió un parque de bomberos.", "empezó a estudiar.", "se mudó de provincia."], 1),
                    ("Dos años después, Rosa …", ["volvió a la calle.", "se fue del país.", "se dedicó a formar a otros.", "cambió de oficio."], 2),
                    ("Rosa tiene ahora …", ["cincuenta y cuatro años.", "cuarenta y cinco años.", "diecinueve años.", "dos años de experiencia."], 0),
                    ("Rosa no se lleva bien con …", ["sus compañeros.", "los políticos.", "el jefe regional.", "los otros equipos."], 1),
                    ("Los demás equipos de la región creen que Rosa …", ["debería jubilarse.", "es un ejemplo.", "habla demasiado.", "no tiene experiencia."], 1),
                    ("Según el jefe regional, el regreso de Rosa es …", ["un problema.", "una sorpresa.", "una noticia muy buena.", "algo temporal."], 2),
                ]},
            ],
        },
        {
            "n": 2, "title": "La mochila del futuro",
            "lead": "Contesta las preguntas en español basándote en el texto. Pon la letra adecuada en la casilla.",
            "blocks": [
                {"t": "text", "es": [
                    "¿Te pesa la mochila? Tranquilo, porque pronto en Chile será posible comprar una mochila con ruedas que se sube sola por las escaleras.",
                    "La Sube usa un motor pequeño en vez de una segunda asa. Ahora, las mochilas con ruedas pesan unos dos kilos, pero la Sube pesa cuatro por culpa del motor.",
                    "Por el momento sólo hay doscientas; están hechas a mano y cuestan ochocientos dólares. No son mochilas normales porque llevan una batería que se carga de noche.",
                    "Otra ventaja es que, si subes al autobús, no tienes que levantarla: sube el escalón sola.",
                ]},
                {"t": "options", "cols": 5, "items": [
                    "pesada", "ligera", "motor", "asa", "pocas",
                    "autobús", "nadie", "muchas", "batería", "parecida",
                    "diferente", "colegio", "todo el mundo",
                ]},
                {"t": "example", "es": True, "text": "Algunas personas quieren una mochila más ligera. → B"},
                {"t": "letters", "items": [
                    ("La Sube lleva un … en lugar de una segunda asa.", "C"),
                    ("Comparada con otras mochilas con ruedas, la Sube es más …", "A"),
                    ("Hoy en día hay … unidades de esta mochila.", "E"),
                    ("La Sube es … a las mochilas normales.", "K"),
                    ("De noche hay que cargar la …", "I"),
                    ("Para subir al … no hace falta levantarla.", "F"),
                ]},
            ],
        },
        {
            "n": 3, "title": "La comida",
            "lead": "Pon una equis en la casilla correcta para cada afirmación (a)–(h).",
            "blocks": [
                {"t": "speakers", "items": [
                    ("Elsa", "De niña desayunaba muy poco: un vaso de leche y nada más. Al mediodía comíamos lentejas o arroz, y de postre, siempre una manzana. Para merendar, un yogur. De cena, sopa."),
                    ("Nahuel", "Yo desayunaba mate con galletas, y los domingos mi madre hacía tortas fritas. De merienda, a veces pan con dulce de leche. De cena, milanesas con puré. Pescado casi nunca, porque no me gustaba."),
                    ("Mireia", "Tomaba fruta por la mañana, nunca leche. En casa se comían muchas verduras: ensaladas, calabacín, espinacas. Para cenar, tortilla. Mi merienda preferida eran las galletas con mantequilla."),
                ]},
                {"t": "grid", "head": "¿Quién lo dice?", "cols": ["Elsa", "Nahuel", "Mireia"], "items": [
                    ("Desayunaba muy poco por la mañana.", 0),
                    ("No tomaba leche en el desayuno.", 2),
                    ("Los domingos se desayunaba algo especial.", 1),
                    ("Comía fruta de postre.", 0),
                    ("Solía comer muchas verduras.", 2),
                    ("Merendaba pan con algo por encima.", 1),
                    ("No le gustaba el pescado.", 1),
                    ("Sus galletas favoritas llevaban mantequilla.", 2),
                ]},
            ],
        },
        {
            "n": 4, "title": "Las vacaciones",
            "lead": "Escribe apuntes sobre esta opinión. Completa la tabla con palabras en español o con números.",
            "blocks": [
                {"t": "text", "t_title": "Se podría mejorar", "es": [
                    "Nerea escribe: Pasamos diez días en este camping a principios de agosto con nuestras dos hijas. La parcela era amplia y limpia, aunque el primer día no había enchufe.",
                    "La comida del restaurante nos gustó, si bien no servían postres. En la cena había mucha variedad. Los camareros eran rapidísimos, al contrario que el recepcionista, que tardaba una eternidad.",
                    "Los monitores de actividades eran encantadores, sobre todo Vera, que organizó un taller de cerámica para las niñas.",
                    "El mayor problema era la zona de duchas, donde tres familias dejaban la ropa tirada por el suelo. Era imposible pasar. Tampoco se podía dormir por culpa de la música que ponían hasta las tres.",
                    "La última queja: los carteles sólo estaban en francés, así que los franceses se enteraban de todo y nosotros de nada.",
                ]},
                {"t": "example", "es": True, "text": "Alojamiento: camping"},
                {"t": "table", "ms": [1, 2, 1, 2, 1, 1, 1, 1], "items": [
                    ("Duración de la estancia", "diez días"),
                    ("No había (dos cosas)", "enchufe (el primer día); postres"),
                    ("Comida – lo bueno", "mucha variedad en la cena / les gustó"),
                    ("Personas simpáticas (dos)", "los camareros (rápidos); los monitores, sobre todo Vera"),
                    ("Número de familias que molestaban", "tres"),
                    ("Duchas – lo peor", "la ropa tirada por el suelo / era imposible pasar"),
                    ("¿Hasta qué hora había música?", "hasta las tres (de la madrugada)"),
                    ("Carteles – opinión de Nerea", "estaban sólo en francés y no se enteraban de nada"),
                ]},
            ],
        },
        {
            "n": 5, "title": "La vida en la montaña",
            "lead": "Lee el fragmento del texto sobre un pueblo de montaña y sus habitantes.",
            "blocks": [
                {"t": "text", "t_title": "El regreso", "es": [
                    "Cuando bajó del coche ya era de noche. Los tejados, bajos y oscuros, se recortaban contra un cielo sin estrellas.",
                    "El coche de línea la dejó delante de la escuela. Las contraventanas estaban cerradas y la bombilla de la entrada iluminaba la escarcha de los escalones.",
                    "Dos mujeres con abrigos largos y un hombre con las manos metidas en los bolsillos esperaban bajo el porche. El hombre se acercó y le cogió la bolsa.",
                    "—¿Es usted la señorita Puig?",
                    "—Sí.",
                    "—Yo, Ramón Clavero, el alcalde, para servirle.",
                    "Echaron a andar hacia las primeras casas. La nieve crujía bajo los zapatos. Ramón Clavero caminaba deprisa, a su lado.",
                    "—Tengo que decirle una cosa, señorita.",
                    "—Usted dirá.",
                    "—Ya sabe que en este pueblo no hay piso para usted, la maestra nueva.",
                    "—Pero a mí me dijeron…",
                    "—¡Sí, le dirían! Mire: nadie quiere alquilar una habitación. Con las casas medio vacías, calentar una más cuesta lo que no tenemos. Lo siento muchísimo. Cuando el invierno es largo y los ganaderos no bajan a vender, aquí se vive muy justo.",
                ]},
                {"t": "inst", "text": "Contesta las preguntas en español basándote en el texto. No necesitas escribir frases completas."},
                {"t": "short", "lines": 2, "ms": [1, 2, 1, 2, 2, 2], "items": [
                    ("¿Por qué sabemos que la escuela está cerrada?", "Las contraventanas estaban cerradas"),
                    ("¿Cómo sabemos que hace frío? Da dos ideas.", "Hay escarcha en los escalones; la nieve cruje bajo los zapatos (las mujeres llevan abrigos largos)"),
                    ("¿Qué le quitó de las manos el hombre a la señorita Puig?", "La bolsa"),
                    ("¿Quiénes son la señorita Puig y Ramón Clavero? Da dos ideas.", "Ella es la maestra nueva; él es el alcalde"),
                    ("¿Qué no se le puede dar a la señorita Puig? Da dos ideas.", "Un piso; una habitación alquilada (alojamiento)"),
                    ("¿Qué haría falta para que el pueblo viviera mejor el año que viene? Da dos ideas.", "Que el invierno no sea tan largo; que los ganaderos puedan bajar a vender (que las casas no estén vacías)"),
                ]},
            ],
        },
    ],
}

SECTION_B = {
    "name": "Section B", "sub": "Escritura · Responde a TODAS las preguntas", "total": 40,
    "questions": [
        {
            "n": 6, "title": "Mi barrio",
            "lead": "Escribe entre 60 y 75 palabras en español sobre «Mi barrio». Debes utilizar todas las palabras mencionadas abajo.",
            "blocks": [
                {"t": "write", "m": 10, "lines": 11,
                 "bank": ["tienda", "ayer", "parque", "tranquilo"],
                 "prompt": "Usa las cuatro palabras del recuadro.",
                 "answer": "Modelo (68 palabras): Vivo en un barrio bastante tranquilo, cerca del centro. Hay una tienda "
                           "pequeña en la esquina donde compramos el pan todas las mañanas. Lo que más me gusta es "
                           "el parque, porque allí quedo con mis amigos y jugamos al baloncesto. Ayer fui con mi "
                           "hermana y estuvimos toda la tarde. Lo único malo es que no hay cine. Me gustaría que "
                           "abrieran uno pronto."},
            ],
        },
        {
            "n": 7, "title": "Elige una tarea",
            "lead": "Elige una de estas tareas y escribe entre 130 y 150 palabras en español. Indica con una equis la pregunta seleccionada.",
            "blocks": [
                {"t": "tasks", "m": 20, "lines": 24, "items": [
                    {"prompt": "Escribe un artículo sobre el deporte en tu colegio. Debes mencionar:", "bullets": [
                        "una vez que ganaste o perdiste un partido",
                        "las instalaciones deportivas de tu colegio",
                        "tu opinión sobre las clases de educación física",
                        "qué deporte practicarás en el futuro.",
                    ]},
                    {"prompt": "Escribe una entrada en tu blog sobre la comida. Debes mencionar:", "bullets": [
                        "por qué te gusta tu plato favorito",
                        "la última vez que cocinaste algo",
                        "si prefieres comer en casa o en un restaurante",
                        "qué comerás de forma distinta el año que viene.",
                    ]},
                    {"prompt": "Escribe un correo electrónico a un(a) amigo(-a) sobre las vacaciones. Debes mencionar:", "bullets": [
                        "una descripción del lugar al que fuiste",
                        "si es importante viajar con la familia",
                        "un problema que tuviste durante el viaje",
                        "adónde irás las próximas vacaciones.",
                    ]},
                ], "answer":
                    "Modelo de la Opción 1 (142 palabras): En mi colegio el deporte es muy importante y yo juego al "
                    "balonmano desde los doce años. El mes pasado perdimos la final por un gol y, aunque me puse "
                    "triste, aprendimos muchísimo de ese partido.\n"
                    "Las instalaciones no están mal: tenemos dos pistas al aire libre y un gimnasio pequeño que se "
                    "llena enseguida. Lo que falta es un vestuario decente, porque sólo hay cuatro duchas para todo "
                    "el equipo.\n"
                    "En mi opinión, las clases de educación física deberían ser más variadas. Siempre hacemos lo "
                    "mismo y mucha gente se aburre; si pudiéramos elegir entre escalada, baile o atletismo, "
                    "participaría todo el mundo.\n"
                    "El año que viene seguiré con el balonmano y además empezaré a nadar los sábados, porque mi "
                    "entrenador dice que ayuda con la espalda.\n"
                    "(Las otras dos opciones se corrigen con los mismos criterios: cubrir los cuatro puntos, "
                    "usar tres tiempos verbales y dar opiniones justificadas.)"},
            ],
        },
        {
            "n": 8, "title": "El medioambiente",
            "lead": "Corrige las palabras (a)–(j). Deben estar de acuerdo con la frase. ¡Ojo! No siempre es necesario cambiar la palabra.",
            "blocks": [
                {"t": "text", "t_title": "El concurso de inventos verdes", "es": [
                    "En el colegio Las Acacias, en Uruguay, creen que cuidar el planeta es cosa de todos y cada año los alumnos (a) [presentar] proyectos (b) [sostenible]. El mes pasado, tres chicas (c) [competir] en el Concurso de Inventos Verdes y usaron botellas usadas para (d) [construir] un sistema de riego que nosotros (e) [poder] copiar en casa.",
                    "El invento del colegio Las Acacias es (f) [sencillo] pero eficaz y (g) [estar] entre los quince (h) [mejor]. La entrega de premios será el mes que viene y las tres jóvenes uruguayas (i) [viajar] a Montevideo para ver si su proyecto (j) [haber] ganado algo.",
                ]},
                {"t": "correct", "items": [
                    ("presentar", "presentan"),
                    ("sostenible", "sostenibles"),
                    ("competir", "compitieron"),
                    ("construir", "construir"),
                    ("poder", "podemos"),
                    ("sencillo", "sencillo"),
                    ("estar", "está"),
                    ("mejor", "mejores"),
                    ("viajar", "viajarán"),
                    ("haber", "ha"),
                ]},
            ],
        },
    ],
}

PAPER = shell("igcse_edexcel", "A", [SECTION_A, SECTION_B])
